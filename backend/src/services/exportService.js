const pool = require('../config/db');
const ExportReceipt = require('../models/ExportReceipt');
const ExportReceiptItem = require('../models/ExportReceiptItem');
const Stock = require('../models/Stock');
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const Batch = require('../models/Batch');
const StockByLocation = require('../models/StockByLocation');
const Warehouse = require('../models/Warehouse');

const MOVEMENT_TYPE = {
  SALE: 'EXPORT',
  DISPOSAL: 'DISPOSAL',
  TRANSFER_OUT: 'TRANSFER_OUT'
};

async function resolveWarehouseId(candidate) {
  if (candidate) return candidate;
  const def = await Warehouse.findDefault();
  if (!def) throw new Error('Chưa cấu hình kho mặc định.');
  return def.id;
}

// Sinh danh sách pick suggestion từ batches theo FIFO/LIFO cho 1 item
async function suggestPicks(connection, { productId, warehouseId, quantity, pickStrategy }) {
  const fn = pickStrategy === 'LIFO' ? 'findAvailableLIFO' : 'findAvailableFIFO';
  const batches = await Batch[fn](productId, warehouseId);
  const picks = [];
  let remaining = Number(quantity);
  for (const b of batches) {
    if (remaining <= 0) break;
    const take = Math.min(Number(b.remaining_quantity), remaining);
    if (take > 0) {
      picks.push({ batch_id: b.id, batch_code: b.batch_code, expiry_date: b.expiry_date, quantity: take });
      remaining -= take;
    }
  }
  return { picks, shortage: remaining };
}

class ExportService {
  async createExportReceipt(userId, receiptData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      if (!receiptData.items || receiptData.items.length === 0) {
        throw new Error('Export items cannot be empty');
      }

      const receiptType = receiptData.receipt_type || 'SALE';
      if (!['SALE', 'DISPOSAL', 'TRANSFER_OUT'].includes(receiptType)) {
        throw new Error('Invalid receipt_type');
      }
      const pickStrategy = receiptData.pick_strategy || 'FIFO';
      if (!['FIFO', 'LIFO', 'MANUAL'].includes(pickStrategy)) {
        throw new Error('Invalid pick_strategy');
      }

      const warehouseId = await resolveWarehouseId(receiptData.warehouse_id);

      let totalAmount = 0;
      for (const item of receiptData.items) {
        const product = await Product.findById(item.product_id);
        if (!product) throw new Error(`Product ID ${item.product_id} not found`);
        if (item.quantity <= 0) throw new Error('Quantity must be greater than 0');
        const unitPrice = Number(item.unit_price || 0);
        if (unitPrice < 0) throw new Error('Unit price cannot be negative');

        // Kiểm tra tồn trong kho chỉ định (tổng qua stock_by_location)
        const availableInWh = await StockByLocation.totalByProduct(item.product_id, warehouseId);
        if (availableInWh < item.quantity) {
          throw new Error(
            `Tồn kho không đủ cho "${product.name}" trong kho. ` +
            `Khả dụng: ${availableInWh}, yêu cầu: ${item.quantity}`
          );
        }
        totalAmount += item.quantity * unitPrice;
      }

      const receiptCode = await ExportReceipt.generateReceiptCode();
      const receipt = await ExportReceipt.create({
        receipt_code: receiptCode,
        receipt_type: receiptType,
        user_id: userId,
        customer_id: receiptData.customer_id || null,
        customer_name: receiptData.customer_name,
        customer_phone: receiptData.customer_phone,
        warehouse_id: warehouseId,
        disposal_reason: receiptData.disposal_reason || null,
        pick_strategy: pickStrategy,
        total_amount: totalAmount,
        note: receiptData.note,
        status: 'PENDING',
        export_date: receiptData.export_date || new Date()
      }, connection);

      for (const item of receiptData.items) {
        await ExportReceiptItem.create({
          export_receipt_id: receipt.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price || 0,
          subtotal: item.quantity * (item.unit_price || 0),
          note: item.note
        }, connection);
      }

      await connection.commit();
      return await ExportReceipt.findByIdWithItems(receipt.id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateExportReceipt(id, userId, receiptData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const existing = await ExportReceipt.findByIdWithItems(id);
      if (!existing) throw new Error('Export receipt not found');
      if (existing.status !== 'PENDING') throw new Error('Only PENDING receipts can be edited');

      if (receiptData.items && receiptData.items.length > 0) {
        let totalAmount = 0;
        const warehouseId = existing.warehouse_id;
        for (const item of receiptData.items) {
          const product = await Product.findById(item.product_id);
          if (!product) throw new Error(`Product ID ${item.product_id} not found`);
          if (item.quantity <= 0) throw new Error('Quantity must be greater than 0');
          const unitPrice = Number(item.unit_price || 0);
          if (unitPrice < 0) throw new Error('Unit price cannot be negative');
          const availableInWh = await StockByLocation.totalByProduct(item.product_id, warehouseId);
          if (availableInWh < item.quantity) {
            throw new Error(`Tồn kho không đủ cho "${product.name}". Khả dụng: ${availableInWh}, yêu cầu: ${item.quantity}`);
          }
          totalAmount += item.quantity * unitPrice;
        }
        await ExportReceiptItem.deleteByReceiptId(id, connection);
        for (const item of receiptData.items) {
          await ExportReceiptItem.create({
            export_receipt_id: id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price || 0,
            subtotal: item.quantity * (item.unit_price || 0),
            note: item.note
          }, connection);
        }
        await ExportReceipt.update(id, {
          customer_id: receiptData.customer_id,
          customer_name: receiptData.customer_name,
          customer_phone: receiptData.customer_phone,
          note: receiptData.note,
          total_amount: totalAmount
        }, connection);
      } else {
        await ExportReceipt.update(id, {
          customer_id: receiptData.customer_id,
          customer_name: receiptData.customer_name,
          customer_phone: receiptData.customer_phone,
          note: receiptData.note
        }, connection);
      }

      await connection.commit();
      return await ExportReceipt.findByIdWithItems(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Preview picking list (không commit). Trả về danh sách batch gợi ý cho mỗi item.
  async previewPickingList(id) {
    const receipt = await ExportReceipt.findByIdWithItems(id);
    if (!receipt) throw new Error('Export receipt not found');
    const warehouseId = receipt.warehouse_id;
    const pickStrategy = receipt.pick_strategy || 'FIFO';
    const result = [];
    for (const item of receipt.items) {
      const { picks, shortage } = await suggestPicks(pool, {
        productId: item.product_id,
        warehouseId,
        quantity: item.quantity,
        pickStrategy
      });
      result.push({
        item_id: item.id,
        product_id: item.product_id,
        product_name: item.product_name,
        sku: item.sku,
        requested_quantity: item.quantity,
        picks,
        shortage
      });
    }
    return {
      receipt_code: receipt.receipt_code,
      warehouse_id: warehouseId,
      pick_strategy: pickStrategy,
      items: result
    };
  }

  async approveExportReceipt(id, approvedBy) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const receipt = await ExportReceipt.findByIdWithItems(id);
      if (!receipt) throw new Error('Export receipt not found');
      if (receipt.status !== 'PENDING') throw new Error('Only PENDING receipts can be approved');

      const warehouseId = receipt.warehouse_id;
      const pickStrategy = receipt.pick_strategy || 'FIFO';
      const movementType = MOVEMENT_TYPE[receipt.receipt_type] || 'EXPORT';

      // Re-validate
      for (const item of receipt.items) {
        const avail = await StockByLocation.totalByProduct(item.product_id, warehouseId);
        if (avail < item.quantity) {
          const product = await Product.findById(item.product_id);
          throw new Error(`Tồn kho không đủ cho "${product.name}". Khả dụng: ${avail}, yêu cầu: ${item.quantity}`);
        }
      }

      await connection.query(
        'UPDATE export_receipts SET status = ?, approved_by = ?, approved_at = NOW(), picking_status = ? WHERE id = ?',
        ['APPROVED', approvedBy, 'PICKED', id]
      );

      for (const item of receipt.items) {
        // Tồn trước (tổng)
        const [stockRows] = await connection.query('SELECT quantity FROM stocks WHERE product_id = ?', [item.product_id]);
        const beforeQty = stockRows.length > 0 ? stockRows[0].quantity : 0;

        // Auto-pick FIFO/LIFO — dùng connection để đọc batch real-time trong transaction
        const pickStrategyFn = pickStrategy === 'LIFO' ? 'findAvailableLIFO' : 'findAvailableFIFO';
        const availableBatches = await Batch[pickStrategyFn](item.product_id, warehouseId);

        let remaining = Number(item.quantity);
        const appliedPicks = [];

        // Nếu có batch còn hàng → pick theo batch
        for (const b of availableBatches) {
          if (remaining <= 0) break;
          const take = Math.min(Number(b.remaining_quantity), remaining);
          if (take <= 0) continue;

          await Batch.adjustRemaining(b.id, -take, connection);
          await StockByLocation.upsert({
            product_id: item.product_id,
            warehouse_id: warehouseId,
            location_id: null,
            batch_id: b.id,
            delta: -take
          }, connection);
          await ExportReceiptItem.addPick({
            export_receipt_item_id: item.id,
            batch_id: b.id,
            location_id: null,
            quantity: take,
            picked_by: approvedBy
          }, connection);
          appliedPicks.push({ batch_id: b.id, quantity: take });
          remaining -= take;
        }

        // Nếu vẫn còn remaining (có tồn ở dòng stock_by_location không gắn batch — dữ liệu cũ)
        if (remaining > 0) {
          await StockByLocation.upsert({
            product_id: item.product_id,
            warehouse_id: warehouseId,
            location_id: null,
            batch_id: null,
            delta: -remaining
          }, connection);
          await ExportReceiptItem.addPick({
            export_receipt_item_id: item.id,
            batch_id: null,
            location_id: null,
            quantity: remaining,
            picked_by: approvedBy
          }, connection);
          appliedPicks.push({ batch_id: null, quantity: remaining });
          remaining = 0;
        }

        await ExportReceiptItem.addPickedQuantity(item.id, item.quantity, connection);
        // Cập nhật tồn cache (stocks) — không throw nếu cache lệch; stock_by_location là nguồn chính
        await connection.query(
          'INSERT IGNORE INTO stocks (product_id, quantity) VALUES (?, 0)',
          [item.product_id]
        );
        await connection.query(
          'UPDATE stocks SET quantity = GREATEST(0, quantity - ?), last_export_date = NOW() WHERE product_id = ?',
          [item.quantity, item.product_id]
        );

        // Tạo 1 stock_movement tổng cho toàn bộ item (hoặc nhiều cái theo batch?
        // Chọn 1 movement/pick để log chi tiết)
        for (const p of appliedPicks) {
          await StockMovement.create({
            product_id: item.product_id,
            warehouse_id: warehouseId,
            batch_id: p.batch_id,
            location_id: null,
            type: movementType,
            quantity: p.quantity,
            before_quantity: beforeQty,
            after_quantity: beforeQty - item.quantity,
            reference_type: 'EXPORT_RECEIPT',
            reference_id: receipt.id,
            reference_code: receipt.receipt_code,
            note: receipt.receipt_type === 'DISPOSAL' ? (receipt.disposal_reason || 'Xuất hủy') : null,
            created_by: approvedBy
          }, connection);
        }
      }

      await connection.commit();
      return await ExportReceipt.findByIdWithItems(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async rejectExportReceipt(id, rejectedBy, reason) {
    const receipt = await ExportReceipt.findById(id);
    if (!receipt) throw new Error('Export receipt not found');
    if (receipt.status !== 'PENDING') throw new Error('Only PENDING receipts can be rejected');
    await pool.query(
      'UPDATE export_receipts SET status = ?, approved_by = ?, approved_at = NOW(), rejected_reason = ? WHERE id = ?',
      ['REJECTED', rejectedBy, reason || null, id]
    );
    return await ExportReceipt.findByIdWithItems(id);
  }

  async getExportReceipts(filters) {
    const receipts = await ExportReceipt.findAll(filters);
    const total = await ExportReceipt.count(filters);
    return { receipts, total };
  }

  async getExportReceiptById(id) {
    const receipt = await ExportReceipt.findByIdWithItems(id);
    if (!receipt) throw new Error('Export receipt not found');
    // Kèm luôn danh sách picks đã thực hiện
    receipt.picks = await ExportReceiptItem.findPicksByReceiptId(id);
    return receipt;
  }

  async markDelivered(id) {
    const receipt = await ExportReceipt.findById(id);
    if (!receipt) throw new Error('Export receipt not found');
    if (receipt.status !== 'APPROVED') throw new Error('Chỉ phiếu đã duyệt mới có thể đánh dấu đã giao');
    await pool.query('UPDATE export_receipts SET picking_status = ? WHERE id = ?', ['DELIVERED', id]);
    return await ExportReceipt.findByIdWithItems(id);
  }

  async deleteExportReceipt(id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const receipt = await ExportReceipt.findByIdWithItems(id);
      if (!receipt) throw new Error('Export receipt not found');

      if (receipt.status === 'APPROVED') {
        const warehouseId = receipt.warehouse_id;
        const picks = await ExportReceiptItem.findPicksByReceiptId(id);

        // Hoàn trả theo từng pick
        for (const p of picks) {
          if (p.batch_id) await Batch.adjustRemaining(p.batch_id, p.quantity, connection);
          await StockByLocation.upsert({
            product_id: p.product_id,
            warehouse_id: warehouseId,
            location_id: p.location_id || null,
            batch_id: p.batch_id || null,
            delta: p.quantity
          }, connection);
        }
        for (const item of receipt.items) {
          const [stockRows] = await connection.query('SELECT quantity FROM stocks WHERE product_id = ?', [item.product_id]);
          const beforeQty = stockRows.length > 0 ? stockRows[0].quantity : 0;
          await Stock.increment(item.product_id, item.quantity, connection);
          await StockMovement.create({
            product_id: item.product_id,
            warehouse_id: warehouseId,
            type: 'ADJUST',
            quantity: item.quantity,
            before_quantity: beforeQty,
            after_quantity: beforeQty + item.quantity,
            reference_type: 'EXPORT_RECEIPT',
            reference_id: receipt.id,
            reference_code: receipt.receipt_code,
            note: 'Xóa phiếu xuất - hoàn trả tồn kho',
            created_by: null
          }, connection);
        }
      }

      await ExportReceiptItem.deleteByReceiptId(id, connection);
      await ExportReceipt.delete(id, connection);

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = new ExportService();
