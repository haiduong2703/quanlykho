const pool = require('../config/db');
const ImportReceipt = require('../models/ImportReceipt');
const ImportReceiptItem = require('../models/ImportReceiptItem');
const Stock = require('../models/Stock');
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');

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

      // Create import receipt - default status is PENDING
      const receipt = await ImportReceipt.create({
        receipt_code: receiptCode,
        user_id: userId,
        supplier_id: receiptData.supplier_id || null,
        supplier_name: receiptData.supplier_name,
        supplier_phone: receiptData.supplier_phone,
        total_amount: totalAmount,
        note: receiptData.note,
        status: 'PENDING',
        import_date: receiptData.import_date || new Date()
      }, connection);

      // Create items (stock NOT updated yet - wait for approval)
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

  async updateImportReceipt(id, userId, receiptData) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Get existing receipt
      const existing = await ImportReceipt.findByIdWithItems(id);
      if (!existing) {
        throw new Error('Import receipt not found');
      }

      // Only allow editing PENDING receipts
      if (existing.status !== 'PENDING') {
        throw new Error('Only PENDING receipts can be edited');
      }

      // Validate items if provided
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
          totalAmount += item.quantity * item.unit_price;
        }

        // Delete old items and create new ones
        await ImportReceiptItem.deleteByReceiptId(id, connection);

        for (const item of receiptData.items) {
          const subtotal = item.quantity * item.unit_price;
          await ImportReceiptItem.create({
            import_receipt_id: id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            subtotal: subtotal,
            note: item.note
          }, connection);
        }

        // Update total amount
        await ImportReceipt.update(id, {
          supplier_id: receiptData.supplier_id,
          supplier_name: receiptData.supplier_name,
          supplier_phone: receiptData.supplier_phone,
          note: receiptData.note,
          total_amount: totalAmount
        }, connection);
      } else {
        // Update only receipt info
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

  async approveImportReceipt(id, approvedBy) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const receipt = await ImportReceipt.findByIdWithItems(id);
      if (!receipt) {
        throw new Error('Import receipt not found');
      }

      if (receipt.status !== 'PENDING') {
        throw new Error('Only PENDING receipts can be approved');
      }

      // Update status
      await connection.query(
        'UPDATE import_receipts SET status = ?, approved_by = ?, approved_at = NOW() WHERE id = ?',
        ['APPROVED', approvedBy, id]
      );

      // Apply stock changes
      for (const item of receipt.items) {
        // Get current stock before change
        const [stockRows] = await connection.query('SELECT quantity FROM stocks WHERE product_id = ?', [item.product_id]);
        const beforeQty = stockRows.length > 0 ? stockRows[0].quantity : 0;

        await Stock.increment(item.product_id, item.quantity, connection);

        const afterQty = beforeQty + item.quantity;

        // Record stock movement
        await StockMovement.create({
          product_id: item.product_id,
          type: 'IMPORT',
          quantity: item.quantity,
          before_quantity: beforeQty,
          after_quantity: afterQty,
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
    if (!receipt) {
      throw new Error('Import receipt not found');
    }

    if (receipt.status !== 'PENDING') {
      throw new Error('Only PENDING receipts can be rejected');
    }

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
    if (!receipt) {
      throw new Error('Import receipt not found');
    }
    return receipt;
  }

  async deleteImportReceipt(id) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const receipt = await ImportReceipt.findByIdWithItems(id);
      if (!receipt) {
        throw new Error('Import receipt not found');
      }

      // If APPROVED, reverse stock changes
      if (receipt.status === 'APPROVED') {
        for (const item of receipt.items) {
          const [stockRows] = await connection.query('SELECT quantity FROM stocks WHERE product_id = ?', [item.product_id]);
          const beforeQty = stockRows.length > 0 ? stockRows[0].quantity : 0;

          await Stock.decrement(item.product_id, item.quantity, connection);

          await StockMovement.create({
            product_id: item.product_id,
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
