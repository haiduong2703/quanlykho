const pool = require('../config/db');
const moment = require('moment');

class ExportReceipt {
  static async findAll(filters = {}) {
    const { page = 1, limit = 10, search, from_date, to_date } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT er.*, u.username, u.full_name as user_full_name
      FROM export_receipts er
      LEFT JOIN users u ON er.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ' AND (er.receipt_code LIKE ? OR er.customer_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (from_date) {
      query += ' AND er.export_date >= ?';
      params.push(from_date);
    }

    if (to_date) {
      query += ' AND er.export_date <= ?';
      params.push(to_date);
    }

    query += ' ORDER BY er.export_date DESC, er.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async findById(id) {
    const query = `
      SELECT er.*, u.username, u.full_name as user_full_name
      FROM export_receipts er
      LEFT JOIN users u ON er.user_id = u.id
      WHERE er.id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async findByIdWithItems(id) {
    const receipt = await this.findById(id);
    if (!receipt) return null;

    const itemsQuery = `
      SELECT eri.*, p.name as product_name, p.sku, p.unit
      FROM export_receipt_items eri
      INNER JOIN products p ON eri.product_id = p.id
      WHERE eri.export_receipt_id = ?
      ORDER BY eri.id ASC
    `;
    const [items] = await pool.query(itemsQuery, [id]);
    receipt.items = items;
    return receipt;
  }

  static async findByReceiptCode(receiptCode) {
    const query = 'SELECT * FROM export_receipts WHERE receipt_code = ?';
    const [rows] = await pool.query(query, [receiptCode]);
    return rows[0];
  }

  static async create(receiptData, connection = null) {
    const conn = connection || pool;
    const query = `
      INSERT INTO export_receipts (receipt_code, user_id, customer_name, customer_phone, total_amount, note, export_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await conn.query(query, [
      receiptData.receipt_code,
      receiptData.user_id,
      receiptData.customer_name,
      receiptData.customer_phone,
      receiptData.total_amount,
      receiptData.note,
      receiptData.export_date || new Date()
    ]);
    return { id: result.insertId, ...receiptData };
  }

  static async update(id, receiptData, connection = null) {
    const conn = connection || pool;
    const fields = [];
    const params = [];

    if (receiptData.customer_name !== undefined) {
      fields.push('customer_name = ?');
      params.push(receiptData.customer_name);
    }
    if (receiptData.customer_phone !== undefined) {
      fields.push('customer_phone = ?');
      params.push(receiptData.customer_phone);
    }
    if (receiptData.note !== undefined) {
      fields.push('note = ?');
      params.push(receiptData.note);
    }

    if (fields.length === 0) return true;

    params.push(id);
    const query = `UPDATE export_receipts SET ${fields.join(', ')} WHERE id = ?`;
    await conn.query(query, params);
    return true;
  }

  static async delete(id, connection = null) {
    const conn = connection || pool;
    const query = 'DELETE FROM export_receipts WHERE id = ?';
    const [result] = await conn.query(query, [id]);
    return result.affectedRows > 0;
  }

  static async count(filters = {}) {
    const { search, from_date, to_date } = filters;
    let query = 'SELECT COUNT(*) as total FROM export_receipts WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (receipt_code LIKE ? OR customer_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (from_date) {
      query += ' AND export_date >= ?';
      params.push(from_date);
    }

    if (to_date) {
      query += ' AND export_date <= ?';
      params.push(to_date);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
  }

  static async getTotalAmount(filters = {}) {
    const { from_date, to_date } = filters;
    let query = 'SELECT SUM(total_amount) as total FROM export_receipts WHERE 1=1';
    const params = [];

    if (from_date) {
      query += ' AND export_date >= ?';
      params.push(from_date);
    }

    if (to_date) {
      query += ' AND export_date <= ?';
      params.push(to_date);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total || 0;
  }

  static async generateReceiptCode() {
    const today = moment().format('YYYYMMDD');
    const prefix = `EXP${today}`;

    const query = 'SELECT receipt_code FROM export_receipts WHERE receipt_code LIKE ? ORDER BY receipt_code DESC LIMIT 1';
    const [rows] = await pool.query(query, [`${prefix}%`]);

    if (rows.length === 0) {
      return `${prefix}001`;
    }

    const lastCode = rows[0].receipt_code;
    const lastNumber = parseInt(lastCode.substring(prefix.length));
    const nextNumber = (lastNumber + 1).toString().padStart(3, '0');

    return `${prefix}${nextNumber}`;
  }
}

module.exports = ExportReceipt;
