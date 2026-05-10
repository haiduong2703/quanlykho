const pool = require('../config/db');
const TransferReceipt = require('../models/TransferReceipt');
const Product = require('../models/Product');
const Stock = require('../models/Stock');
const StockByLocation = require('../models/StockByLocation');
const StockMovement = require('../models/StockMovement');
const Batch = require('../models/Batch');

class TransferService {
  async create(userId, data) {
    if (!data.from_warehouse_id || !data.to_warehouse_id) {
      throw new Error('from_warehouse_id và to_warehouse_id là bắt buộc');
    }
    if (data.from_warehouse_id === data.to_warehouse_id) {
      throw new Error('Kho nguồn và kho đích phải khác nhau');
    }
    if (!data.items || data.items.length === 0) throw new Error('Phiếu chuyển phải có ít nhất 1 sản phẩm');

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      let totalQuantity = 0;
      for (const item of data.items) {
        const product = await Product.findById(item.product_id);
        if (!product) throw new Error(`Product ID ${item.product_id} not found`);
        if (item.quantity <= 0) throw new Error('Quantity must be > 0');
        const availableInSource = await StockByLocation.totalByProduct(item.product_id, data.from_warehouse_id);
        if (availableInSource < item.quantity) {
          throw new Error(`Tồn kho nguồn không đủ cho "${product.name}". Khả dụng: ${availableInSource}, yêu cầu: ${item.quantity}`);
        }
        totalQuantity += Number(item.quantity);
      }

      const receiptCode = await TransferReceipt.generateReceiptCode();
      const receiptId = await TransferReceipt.create({
        receipt_code: receiptCode,
        from_warehouse_id: data.from_warehouse_id,
        to_warehouse_id: data.to_warehouse_id,
        user_id: userId,
        total_quantity: totalQuantity,
        note: data.note,
        status: 'PENDING',
        transfer_date: data.transfer_date || new Date()
      }, connection);

      for (const item of data.items) {
        await TransferReceipt.createItem({
          transfer_receipt_id: receiptId,
          product_id: item.product_id,
          batch_id: item.batch_id || null,
          from_location_id: item.from_location_id || null,
          to_location_id: item.to_location_id || null,
          quantity: item.quantity,
          note: item.note
        }, connection);
      }

      await connection.commit();
      return await TransferReceipt.findByIdWithItems(receiptId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Duyệt phiếu → xuất khỏi kho nguồn (status IN_TRANSIT)
  async approve(id, approvedBy) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const receipt = await TransferReceipt.findByIdWithItems(id);
      if (!receipt) throw new Error('Transfer receipt not found');
      if (receipt.status !== 'PENDING') throw new Error('Chỉ duyệt được phiếu ở PENDING');

      for (const item of receipt.items) {
        // FIFO auto-pick nếu chưa có batch_id cụ thể
        if (item.batch_id) {
          await Batch.adjustRemaining(item.batch_id, -item.quantity, connection);
          await StockByLocation.upsert({
            product_id: item.product_id,
            warehouse_id: receipt.from_warehouse_id,
            location_id: item.from_location_id || null,
            batch_id: item.batch_id,
            delta: -item.quantity
          }, connection);
        } else {
          // Auto-pick FIFO
          const batches = await Batch.findAvailableFIFO(item.product_id, receipt.from_warehouse_id);
          let remaining = Number(item.quantity);
          for (const b of batches) {
            if (remaining <= 0) break;
            const take = Math.min(Number(b.remaining_quantity), remaining);
            if (take > 0) {
              await Batch.adjustRemaining(b.id, -take, connection);
              await StockByLocation.upsert({
                product_id: item.product_id,
                warehouse_id: receipt.from_warehouse_id,
                location_id: item.from_location_id || null,
                batch_id: b.id,
                delta: -take
              }, connection);
              remaining -= take;
            }
          }
          if (remaining > 0) {
            // fallback: từ dòng stock_by_location không batch (dữ liệu cũ)
            await StockByLocation.upsert({
              product_id: item.product_id,
              warehouse_id: receipt.from_warehouse_id,
              location_id: item.from_location_id || null,
              batch_id: null,
              delta: -remaining
            }, connection);
          }
        }

        // Tồn tổng
        const [stockRows] = await connection.query('SELECT quantity FROM stocks WHERE product_id = ?', [item.product_id]);
        const beforeQty = stockRows.length > 0 ? stockRows[0].quantity : 0;
        // Tồn tổng vẫn giữ nguyên (chuyển kho không đổi tổng), chỉ log movement.
        await StockMovement.create({
          product_id: item.product_id,
          warehouse_id: receipt.from_warehouse_id,
          batch_id: item.batch_id || null,
          location_id: item.from_location_id || null,
          type: 'TRANSFER_OUT',
          quantity: item.quantity,
          before_quantity: beforeQty,
          after_quantity: beforeQty,
          reference_type: 'TRANSFER_RECEIPT',
          reference_id: receipt.id,
          reference_code: receipt.receipt_code,
          created_by: approvedBy
        }, connection);
      }

      await TransferReceipt.updateStatus(id, { status: 'IN_TRANSIT', approved_by: approvedBy, approved_at: new Date() }, connection);

      await connection.commit();
      return await TransferReceipt.findByIdWithItems(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Nhận ở kho đích → cộng tồn, status COMPLETED
  async receive(id, receivedBy) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const receipt = await TransferReceipt.findByIdWithItems(id);
      if (!receipt) throw new Error('Transfer receipt not found');
      if (receipt.status !== 'IN_TRANSIT') throw new Error('Chỉ xác nhận nhận hàng khi phiếu IN_TRANSIT');

      for (const item of receipt.items) {
        await StockByLocation.upsert({
          product_id: item.product_id,
          warehouse_id: receipt.to_warehouse_id,
          location_id: item.to_location_id || null,
          batch_id: item.batch_id || null,
          delta: item.quantity
        }, connection);

        if (item.batch_id) {
          // cộng remaining của batch nếu batch đã có (không thay đổi warehouse của batch — batch vẫn gắn kho nguồn gốc;
          // nếu cần, có thể chuyển warehouse_id của batch sang kho đích nhưng ta giữ đơn giản)
          await Batch.adjustRemaining(item.batch_id, item.quantity, connection);
        }

        const [stockRows] = await connection.query('SELECT quantity FROM stocks WHERE product_id = ?', [item.product_id]);
        const beforeQty = stockRows.length > 0 ? stockRows[0].quantity : 0;
        await StockMovement.create({
          product_id: item.product_id,
          warehouse_id: receipt.to_warehouse_id,
          batch_id: item.batch_id || null,
          location_id: item.to_location_id || null,
          type: 'TRANSFER_IN',
          quantity: item.quantity,
          before_quantity: beforeQty,
          after_quantity: beforeQty,
          reference_type: 'TRANSFER_RECEIPT',
          reference_id: receipt.id,
          reference_code: receipt.receipt_code,
          created_by: receivedBy
        }, connection);
      }

      await TransferReceipt.updateStatus(id, { status: 'COMPLETED', received_by: receivedBy, received_at: new Date() }, connection);

      await connection.commit();
      return await TransferReceipt.findByIdWithItems(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async reject(id, by, reason) {
    const receipt = await TransferReceipt.findById(id);
    if (!receipt) throw new Error('Transfer receipt not found');
    if (!['PENDING'].includes(receipt.status)) throw new Error('Chỉ từ chối phiếu PENDING');
    await TransferReceipt.updateStatus(id, { status: 'REJECTED', approved_by: by, approved_at: new Date(), rejected_reason: reason || null });
    return await TransferReceipt.findByIdWithItems(id);
  }

  async cancel(id) {
    const receipt = await TransferReceipt.findById(id);
    if (!receipt) throw new Error('Transfer receipt not found');
    if (receipt.status !== 'PENDING') throw new Error('Chỉ huỷ được phiếu PENDING');
    await TransferReceipt.updateStatus(id, { status: 'CANCELLED' });
    return await TransferReceipt.findByIdWithItems(id);
  }

  async list(filters) {
    const [items, total] = await Promise.all([TransferReceipt.findAll(filters), TransferReceipt.count(filters)]);
    return { items, total };
  }

  async getById(id) {
    const r = await TransferReceipt.findByIdWithItems(id);
    if (!r) throw new Error('Transfer receipt not found');
    return r;
  }
}

module.exports = new TransferService();
