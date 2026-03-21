const pool = require('../config/db');
const ExportReceipt = require('../models/ExportReceipt');
const ExportReceiptItem = require('../models/ExportReceiptItem');
const Stock = require('../models/Stock');
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');

class ExportService {
  async createExportReceipt(userId, receiptData) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Validate items
      if (!receiptData.items || receiptData.items.length === 0) {
        throw new Error('Export items cannot be empty');
      }

      // Validate products exist and check stock availability
      let totalAmount = 0;
      for (const item of receiptData.items) {
        const product = await Product.findById(item.product_id);
        if (!product) {
          throw new Error(`Product ID ${item.product_id} not found`);
        }
        if (item.quantity <= 0) {
          throw new Error('Quantity must be greater than 0');
        }
        if (item.unit_price < 0) {
          throw new Error('Unit price cannot be negative');
        }

        // Check stock availability
        const stock = await Stock.findByProductId(item.product_id);
        if (!stock) {
          throw new Error(`Product "${product.name}" has no stock record`);
        }
        if (stock.quantity < item.quantity) {
          throw new Error(
            `Insufficient stock for product "${product.name}". ` +
            `Available: ${stock.quantity}, Required: ${item.quantity}`
          );
        }

        const subtotal = item.quantity * item.unit_price;
        totalAmount += subtotal;
      }

      // Generate receipt code
      const receiptCode = await ExportReceipt.generateReceiptCode();

      // Create export receipt - default status is PENDING
      const receipt = await ExportReceipt.create({
        receipt_code: receiptCode,
        user_id: userId,
        customer_id: receiptData.customer_id || null,
        customer_name: receiptData.customer_name,
        customer_phone: receiptData.customer_phone,
        total_amount: totalAmount,
        note: receiptData.note,
        status: 'PENDING',
        export_date: receiptData.export_date || new Date()
      }, connection);

      // Create items (stock NOT updated yet - wait for approval)
      for (const item of receiptData.items) {
        const subtotal = item.quantity * item.unit_price;

        await ExportReceiptItem.create({
          export_receipt_id: receipt.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: subtotal,
          note: item.note
        }, connection);
      }

      await connection.commit();

      // Get full receipt with items
      const fullReceipt = await ExportReceipt.findByIdWithItems(receipt.id);
      return fullReceipt;

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
      if (!existing) {
        throw new Error('Export receipt not found');
      }

      if (existing.status !== 'PENDING') {
        throw new Error('Only PENDING receipts can be edited');
      }

      if (receiptData.items && receiptData.items.length > 0) {
        let totalAmount = 0;
        for (const item of receiptData.items) {
          const product = await Product.findById(item.product_id);
          if (!product) {
            throw new Error(`Product ID ${item.product_id} not found`);
          }
          if (item.quantity <= 0) {
            throw new Error('Quantity must be greater than 0');
          }
          if (item.unit_price < 0) {
            throw new Error('Unit price cannot be negative');
          }

          // Check stock availability
          const stock = await Stock.findByProductId(item.product_id);
          if (!stock || stock.quantity < item.quantity) {
            throw new Error(
              `Insufficient stock for product "${product.name}". ` +
              `Available: ${stock ? stock.quantity : 0}, Required: ${item.quantity}`
            );
          }

          totalAmount += item.quantity * item.unit_price;
        }

        // Delete old items and create new ones
        await ExportReceiptItem.deleteByReceiptId(id, connection);

        for (const item of receiptData.items) {
          const subtotal = item.quantity * item.unit_price;
          await ExportReceiptItem.create({
            export_receipt_id: id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            subtotal: subtotal,
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

  async approveExportReceipt(id, approvedBy) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const receipt = await ExportReceipt.findByIdWithItems(id);
      if (!receipt) {
        throw new Error('Export receipt not found');
      }

      if (receipt.status !== 'PENDING') {
        throw new Error('Only PENDING receipts can be approved');
      }

      // Re-validate stock availability before approving
      for (const item of receipt.items) {
        const [stockRows] = await connection.query('SELECT quantity FROM stocks WHERE product_id = ?', [item.product_id]);
        const available = stockRows.length > 0 ? stockRows[0].quantity : 0;
        if (available < item.quantity) {
          const product = await Product.findById(item.product_id);
          throw new Error(
            `Insufficient stock for product "${product.name}". ` +
            `Available: ${available}, Required: ${item.quantity}`
          );
        }
      }

      // Update status
      await connection.query(
        'UPDATE export_receipts SET status = ?, approved_by = ?, approved_at = NOW() WHERE id = ?',
        ['APPROVED', approvedBy, id]
      );

      // Apply stock changes
      for (const item of receipt.items) {
        const [stockRows] = await connection.query('SELECT quantity FROM stocks WHERE product_id = ?', [item.product_id]);
        const beforeQty = stockRows[0].quantity;

        await Stock.decrement(item.product_id, item.quantity, connection);

        await StockMovement.create({
          product_id: item.product_id,
          type: 'EXPORT',
          quantity: item.quantity,
          before_quantity: beforeQty,
          after_quantity: beforeQty - item.quantity,
          reference_type: 'EXPORT_RECEIPT',
          reference_id: receipt.id,
          reference_code: receipt.receipt_code,
          created_by: approvedBy
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

  async rejectExportReceipt(id, rejectedBy, reason) {
    const receipt = await ExportReceipt.findById(id);
    if (!receipt) {
      throw new Error('Export receipt not found');
    }

    if (receipt.status !== 'PENDING') {
      throw new Error('Only PENDING receipts can be rejected');
    }

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
    if (!receipt) {
      throw new Error('Export receipt not found');
    }
    return receipt;
  }

  async deleteExportReceipt(id) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const receipt = await ExportReceipt.findByIdWithItems(id);
      if (!receipt) {
        throw new Error('Export receipt not found');
      }

      // If APPROVED, reverse stock changes
      if (receipt.status === 'APPROVED') {
        for (const item of receipt.items) {
          const [stockRows] = await connection.query('SELECT quantity FROM stocks WHERE product_id = ?', [item.product_id]);
          const beforeQty = stockRows.length > 0 ? stockRows[0].quantity : 0;

          await Stock.increment(item.product_id, item.quantity, connection);

          await StockMovement.create({
            product_id: item.product_id,
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

      // Delete items and receipt
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
