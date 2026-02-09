const pool = require('../config/db');
const ExportReceipt = require('../models/ExportReceipt');
const ExportReceiptItem = require('../models/ExportReceiptItem');
const Stock = require('../models/Stock');
const Product = require('../models/Product');

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

      // Create export receipt
      const receipt = await ExportReceipt.create({
        receipt_code: receiptCode,
        user_id: userId,
        customer_name: receiptData.customer_name,
        customer_phone: receiptData.customer_phone,
        total_amount: totalAmount,
        note: receiptData.note,
        export_date: receiptData.export_date || new Date()
      }, connection);

      // Create items and update stocks
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

        // Decrease stock
        await Stock.decrement(item.product_id, item.quantity, connection);
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

      // Get receipt items
      const items = await ExportReceiptItem.findByReceiptId(id);

      if (items.length === 0) {
        throw new Error('Export receipt items not found');
      }

      // Restore stock quantities (increase stocks back)
      for (const item of items) {
        await Stock.increment(item.product_id, item.quantity, connection);
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
