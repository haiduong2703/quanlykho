const pool = require('../config/db');
const ImportReceipt = require('../models/ImportReceipt');
const ImportReceiptItem = require('../models/ImportReceiptItem');
const Stock = require('../models/Stock');
const Product = require('../models/Product');

class ImportService {
  async createImportReceipt(userId, receiptData) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Validate items
      if (!receiptData.items || receiptData.items.length === 0) {
        throw new Error('Import items cannot be empty');
      }

      // Validate products exist and calculate total
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

        const subtotal = item.quantity * item.unit_price;
        totalAmount += subtotal;
      }

      // Generate receipt code
      const receiptCode = await ImportReceipt.generateReceiptCode();

      // Create import receipt
      const receipt = await ImportReceipt.create({
        receipt_code: receiptCode,
        user_id: userId,
        supplier_name: receiptData.supplier_name,
        supplier_phone: receiptData.supplier_phone,
        total_amount: totalAmount,
        note: receiptData.note,
        import_date: receiptData.import_date || new Date()
      }, connection);

      // Create items and update stocks
      for (const item of receiptData.items) {
        const subtotal = item.quantity * item.unit_price;

        await ImportReceiptItem.create({
          import_receipt_id: receipt.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: subtotal,
          note: item.note
        }, connection);

        // Increase stock
        await Stock.increment(item.product_id, item.quantity, connection);
      }

      await connection.commit();

      // Get full receipt with items
      const fullReceipt = await ImportReceipt.findByIdWithItems(receipt.id);
      return fullReceipt;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getImportReceipts(filters) {
    const receipts = await ImportReceipt.findAll(filters);
    const total = await ImportReceipt.count(filters);

    return { receipts, total };
  }

  async getImportReceiptById(id) {
    const receipt = await ImportReceipt.findByIdWithItems(id);
    if (!receipt) {
      throw new Error('Import receipt not found');
    }
    return receipt;
  }

  async deleteImportReceipt(id) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Get receipt items
      const items = await ImportReceiptItem.findByReceiptId(id);

      if (items.length === 0) {
        throw new Error('Import receipt items not found');
      }

      // Restore stock quantities (decrease stocks)
      for (const item of items) {
        await Stock.decrement(item.product_id, item.quantity, connection);
      }

      // Delete items and receipt
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
