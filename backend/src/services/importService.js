const pool = require('../config/db');
const ImportReceipt = require('../models/ImportReceipt');
const ImportReceiptItem = require('../models/ImportReceiptItem');
const Stock = require('../models/Stock');
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const Batch = require('../models/Batch');
const StockByLocation = require('../models/StockByLocation');
const Warehouse = require('../models/Warehouse');

// Map receipt_type → stock_movements.type
const MOVEMENT_TYPE = {
  PURCHASE: 'IMPORT',
  CUSTOMER_RETURN: 'RETURN_IN',
  TRANSFER_IN: 'TRANSFER_IN'
};

async function resolveWarehouseId(candidate, connection = null) {
  if (candidate) return candidate;
  const def = await Warehouse.findDefault();
  if (!def) throw new Error('Chưa cấu hình kho mặc định. Hãy tạo ít nhất 1 kho với is_default = TRUE.');
  return def.id;
}

class ImportService {
  async createImportReceipt(userId, receiptData) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      if (!receiptData.items || receiptData.items.length === 0) {
        throw new Error('Import items cannot be empty');
      }

      const receiptType = receiptData.receipt_type || 'PURCHASE';
      if (!['PURCHASE', 'CUSTOMER_RETURN', 'TRANSFER_IN'].includes(receiptType)) {
        throw new Error('Invalid receipt_type');
      }

      const warehouseId = await resolveWarehouseId(receiptData.warehouse_id);

      let totalAmount = 0;
      for (const item of receiptData.items) {
        const product = await Product.findById(item.product_id);
        if (!product) throw new Error(`Product ID ${item.product_id} not found`);
        if (item.quantity <= 0) throw new Error('Quantity must be greater than 0');
        if (item.unit_price < 0) throw new Error('Unit price cannot be negative');
        totalAmount += item.quantity * item.unit_price;
      }

      // qc_status: client có thể yêu cầu QC (PENDING) hoặc bỏ qua (NOT_REQUIRED)
      const qcStatus = receiptData.qc_required ? 'PENDING' : (receiptData.qc_status || 'NOT_REQUIRED');

      const receiptCode = await ImportReceipt.generateReceiptCode();
      const receipt = await ImportReceipt.create({
        receipt_code: receiptCode,
        receipt_type: receiptType,
        user_id: userId,
        supplier_id: receiptData.supplier_id || null,
        supplier_name: receiptData.supplier_name,
        supplier_phone: receiptData.supplier_phone,
        warehouse_id: warehouseId,
        total_amount: totalAmount,
        note: receiptData.note,
        status: 'PENDING',
        qc_status: qcStatus,
        source_export_receipt_id: receiptData.source_export_receipt_id || null,
        source_transfer_receipt_id: receiptData.source_transfer_receipt_id || null,
        import_date: receiptData.import_date || new Date()
      }, connection);

      for (const item of receiptData.items) {
        await ImportReceiptItem.create({
          import_receipt_id: receipt.id,
          product_id: item.product_id,
          batch_id: item.batch_id || null,
          location_id: item.location_id || null,
          batch_code: item.batch_code || null,
          manufacture_date: item.manufacture_date || null,
          expiry_date: item.expiry_date || null,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.quantity * item.unit_price,
          note: item.note
        }, connection);
      }

      await connection.commit();
      return await ImportReceipt.findByIdWithItems(receipt.id);

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateImportReceipt(id, userId, receiptData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const existing = await ImportReceipt.findByIdWithItems(id);
      if (!existing) throw new Error('Import receipt not found');
      if (existing.status !== 'PENDING') throw new Error('Only PENDING receipts can be edited');

      if (receiptData.items && receiptData.items.length > 0) {
        let totalAmount = 0;
        for (const item of receiptData.items) {
          const product = await Product.findById(item.product_id);
          if (!product) throw new Error(`Product ID ${item.product_id} not found`);
          if (item.quantity <= 0) throw new Error('Quantity must be greater than 0');
          if (item.unit_price < 0) throw new Error('Unit price cannot be negative');
          totalAmount += item.quantity * item.unit_price;
        }

        await ImportReceiptItem.deleteByReceiptId(id, connection);
        for (const item of receiptData.items) {
          await ImportReceiptItem.create({
            import_receipt_id: id,
            product_id: item.product_id,
            batch_id: item.batch_id || null,
            location_id: item.location_id || null,
            batch_code: item.batch_code || null,
            manufacture_date: item.manufacture_date || null,
            expiry_date: item.expiry_date || null,
            quantity: item.quantity,
            unit_price: item.unit_price,
            subtotal: item.quantity * item.unit_price,
            note: item.note
          }, connection);
        }
        await ImportReceipt.update(id, {
          supplier_id: receiptData.supplier_id,
          supplier_name: receiptData.supplier_name,
          supplier_phone: receiptData.supplier_phone,
          note: receiptData.note,
          total_amount: totalAmount
        }, connection);
      } else {
        await ImportReceipt.update(id, {
          supplier_id: receiptData.supplier_id,
          supplier_name: receiptData.supplier_name,
          supplier_phone: receiptData.supplier_phone,
          note: receiptData.note
        }, connection);
      }

      await connection.commit();
      return await ImportReceipt.findByIdWithItems(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async setQCStatus(id, qcStatus, qcNote, qcBy) {
    if (!['NOT_REQUIRED', 'PENDING', 'PASSED', 'REJECTED'].includes(qcStatus)) {
      throw new Error('Invalid qc_status');
    }
    const receipt = await ImportReceipt.findById(id);
    if (!receipt) throw new Error('Import receipt not found');
    if (receipt.status !== 'PENDING') {
      throw new Error('Chỉ cập nhật QC khi phiếu ở trạng thái PENDING');
    }
    await pool.query(
      'UPDATE import_receipts SET qc_status = ?, qc_note = ?, qc_by = ?, qc_at = NOW() WHERE id = ?',
      [qcStatus, qcNote || null, qcBy || null, id]
    );
    return await ImportReceipt.findByIdWithItems(id);
  }

  async approveImportReceipt(id, approvedBy) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const receipt = await ImportReceipt.findByIdWithItems(id);
      if (!receipt) throw new Error('Import receipt not found');
      if (receipt.status !== 'PENDING') throw new Error('Only PENDING receipts can be approved');

      // Nếu bắt buộc QC mà chưa PASSED → không cho duyệt
      if (receipt.qc_status === 'PENDING') {
        throw new Error('Phiếu đang chờ QC (kiểm tra chất lượng). Hãy cập nhật QC trước khi duyệt.');
      }
      if (receipt.qc_status === 'REJECTED') {
        throw new Error('Phiếu đã bị QC từ chối. Không thể duyệt nhập.');
      }

      const warehouseId = receipt.warehouse_id || await resolveWarehouseId(null);
      const movementType = MOVEMENT_TYPE[receipt.receipt_type] || 'IMPORT';

      await connection.query(
        'UPDATE import_receipts SET status = ?, approved_by = ?, approved_at = NOW() WHERE id = ?',
        ['APPROVED', approvedBy, id]
      );

      for (const item of receipt.items) {
        let batchId = item.batch_id || null;

        // Auto-sinh batch_code nếu user không nhập — bảo đảm mọi lần nhập đều tạo lô
        // Format: <RECEIPT_CODE>-<ITEM_ID>  (vd: IMP20260424001-15)
        const effectiveBatchCode = item.batch_code || `${receipt.receipt_code}-${item.id}`;

        if (!batchId) {
          const existing = await Batch.findByProductBatch(item.product_id, effectiveBatchCode);
          if (existing) {
            batchId = existing.id;
            await Batch.adjustRemaining(existing.id, item.quantity, connection);
            await connection.query(
              'UPDATE batches SET initial_quantity = initial_quantity + ? WHERE id = ?',
              [item.quantity, existing.id]
            );
          } else {
            batchId = await Batch.create({
              batch_code: effectiveBatchCode,
              product_id: item.product_id,
              supplier_id: receipt.supplier_id || null,
              warehouse_id: warehouseId,
              manufacture_date: item.manufacture_date || null,
              expiry_date: item.expiry_date || null,
              import_receipt_id: receipt.id,
              initial_quantity: item.quantity,
              remaining_quantity: item.quantity,
              unit_price: item.unit_price,
              status: 'ACTIVE'
            }, connection);
          }
          await ImportReceiptItem.setBatch(item.id, batchId, connection);
        } else {
          // batch_id đã có → chỉ cộng remaining
          await Batch.adjustRemaining(batchId, item.quantity, connection);
        }

        // Tồn tổng (cache)
        const [stockRows] = await connection.query('SELECT quantity FROM stocks WHERE product_id = ?', [item.product_id]);
        const beforeQty = stockRows.length > 0 ? stockRows[0].quantity : 0;
        await Stock.increment(item.product_id, item.quantity, connection);

        // Tồn chi tiết theo kho/vị trí/lô
        await StockByLocation.upsert({
          product_id: item.product_id,
          warehouse_id: warehouseId,
          location_id: item.location_id || null,
          batch_id: batchId,
          delta: item.quantity
        }, connection);

        await StockMovement.create({
          product_id: item.product_id,
          warehouse_id: warehouseId,
          batch_id: batchId,
          location_id: item.location_id || null,
          type: movementType,
          quantity: item.quantity,
          before_quantity: beforeQty,
          after_quantity: beforeQty + item.quantity,
          reference_type: 'IMPORT_RECEIPT',
          reference_id: receipt.id,
          reference_code: receipt.receipt_code,
          created_by: approvedBy
        }, connection);
      }

      await connection.commit();
      return await ImportReceipt.findByIdWithItems(id);

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async rejectImportReceipt(id, rejectedBy, reason) {
    const receipt = await ImportReceipt.findById(id);
    if (!receipt) throw new Error('Import receipt not found');
    if (receipt.status !== 'PENDING') throw new Error('Only PENDING receipts can be rejected');

    await pool.query(
      'UPDATE import_receipts SET status = ?, approved_by = ?, approved_at = NOW(), rejected_reason = ? WHERE id = ?',
      ['REJECTED', rejectedBy, reason || null, id]
    );
    return await ImportReceipt.findByIdWithItems(id);
  }

  async getImportReceipts(filters) {
    const receipts = await ImportReceipt.findAll(filters);
    const total = await ImportReceipt.count(filters);
    return { receipts, total };
  }

  async getImportReceiptById(id) {
    const receipt = await ImportReceipt.findByIdWithItems(id);
    if (!receipt) throw new Error('Import receipt not found');
    return receipt;
  }

  async deleteImportReceipt(id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const receipt = await ImportReceipt.findByIdWithItems(id);
      if (!receipt) throw new Error('Import receipt not found');

      if (receipt.status === 'APPROVED') {
        const warehouseId = receipt.warehouse_id;
        for (const item of receipt.items) {
          const [stockRows] = await connection.query('SELECT quantity FROM stocks WHERE product_id = ?', [item.product_id]);
          const beforeQty = stockRows.length > 0 ? stockRows[0].quantity : 0;
          await Stock.decrement(item.product_id, item.quantity, connection);
          if (warehouseId) {
            await StockByLocation.upsert({
              product_id: item.product_id,
              warehouse_id: warehouseId,
              location_id: item.location_id || null,
              batch_id: item.batch_id || null,
              delta: -item.quantity
            }, connection);
          }
          if (item.batch_id) await Batch.adjustRemaining(item.batch_id, -item.quantity, connection);

          await StockMovement.create({
            product_id: item.product_id,
            warehouse_id: warehouseId,
            batch_id: item.batch_id || null,
            location_id: item.location_id || null,
            type: 'ADJUST',
            quantity: -item.quantity,
            before_quantity: beforeQty,
            after_quantity: beforeQty - item.quantity,
            reference_type: 'IMPORT_RECEIPT',
            reference_id: receipt.id,
            reference_code: receipt.receipt_code,
            note: 'Xóa phiếu nhập - hoàn trả tồn kho',
            created_by: null
          }, connection);
        }
      }

      await ImportReceiptItem.deleteByReceiptId(id, connection);
      await ImportReceipt.delete(id, connection);

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

module.exports = new ImportService();
