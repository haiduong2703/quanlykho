const pool = require('../config/db');
const moment = require('moment');

class TransferReceipt {
  static async findAll(filters = {}) {
    const { page = 1, limit = 20, search, status, from_warehouse_id, to_warehouse_id, from_date, to_date } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT tr.*,
             wf.code AS from_code, wf.name AS from_name,
             wt.code AS to_code, wt.name AS to_name,
             u.full_name AS user_full_name,
             ua.full_name AS approved_by_name,
             ur.full_name AS received_by_name
      FROM transfer_receipts tr
      JOIN warehouses wf ON tr.from_warehouse_id = wf.id
      JOIN warehouses wt ON tr.to_warehouse_id = wt.id
      LEFT JOIN users u ON tr.user_id = u.id
      LEFT JOIN users ua ON tr.approved_by = ua.id
      LEFT JOIN users ur ON tr.received_by = ur.id
      WHERE 1=1
    `;
    const params = [];
    if (search) { query += ' AND tr.receipt_code LIKE ?'; params.push(`%${search}%`); }
    if (status) { query += ' AND tr.status = ?'; params.push(status); }
    if (from_warehouse_id) { query += ' AND tr.from_warehouse_id = ?'; params.push(from_warehouse_id); }
    if (to_warehouse_id) { query += ' AND tr.to_warehouse_id = ?'; params.push(to_warehouse_id); }
    if (from_date) { query += ' AND tr.transfer_date >= ?'; params.push(from_date); }
    if (to_date) { query += ' AND tr.transfer_date <= ?'; params.push(to_date + ' 23:59:59'); }

    query += ' ORDER BY tr.transfer_date DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT tr.*, wf.code AS from_code, wf.name AS from_name,
              wt.code AS to_code, wt.name AS to_name
       FROM transfer_receipts tr
       JOIN warehouses wf ON tr.from_warehouse_id = wf.id
       JOIN warehouses wt ON tr.to_warehouse_id = wt.id
       WHERE tr.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByIdWithItems(id) {
    const receipt = await this.findById(id);
    if (!receipt) return null;
    const [items] = await pool.query(
      `SELECT tri.*, p.sku, p.name AS product_name, p.unit,
              b.batch_code, b.expiry_date,
              lf.code AS from_location_code, lt.code AS to_location_code
       FROM transfer_receipt_items tri
       JOIN products p ON tri.product_id = p.id
       LEFT JOIN batches b ON tri.batch_id = b.id
       LEFT JOIN warehouse_locations lf ON tri.from_location_id = lf.id
       LEFT JOIN warehouse_locations lt ON tri.to_location_id = lt.id
       WHERE tri.transfer_receipt_id = ?
       ORDER BY tri.id`,
      [id]
    );
    receipt.items = items;
    return receipt;
  }

  static async create(data, connection = null) {
    const conn = connection || pool;
    const [result] = await conn.query(
      `INSERT INTO transfer_receipts
         (receipt_code, from_warehouse_id, to_warehouse_id, user_id, total_quantity, note, status, transfer_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.receipt_code,
        data.from_warehouse_id,
        data.to_warehouse_id,
        data.user_id,
        data.total_quantity || 0,
        data.note || null,
        data.status || 'PENDING',
        data.transfer_date || new Date()
      ]
    );
    return result.insertId;
  }

  static async updateStatus(id, { status, approved_by, approved_at, received_by, received_at, rejected_reason }, connection = null) {
    const conn = connection || pool;
    const fields = [];
    const params = [];
    if (status !== undefined) { fields.push('status = ?'); params.push(status); }
    if (approved_by !== undefined) { fields.push('approved_by = ?'); params.push(approved_by); }
    if (approved_at !== undefined) { fields.push('approved_at = ?'); params.push(approved_at); }
    if (received_by !== undefined) { fields.push('received_by = ?'); params.push(received_by); }
    if (received_at !== undefined) { fields.push('received_at = ?'); params.push(received_at); }
    if (rejected_reason !== undefined) { fields.push('rejected_reason = ?'); params.push(rejected_reason); }
    if (fields.length === 0) return;
    params.push(id);
    await conn.query(`UPDATE transfer_receipts SET ${fields.join(', ')} WHERE id = ?`, params);
  }

  static async delete(id, connection = null) {
    const conn = connection || pool;
    const [result] = await conn.query('DELETE FROM transfer_receipts WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async createItem(data, connection = null) {
    const conn = connection || pool;
    const [result] = await conn.query(
      `INSERT INTO transfer_receipt_items
         (transfer_receipt_id, product_id, batch_id, from_location_id, to_location_id, quantity, note)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.transfer_receipt_id,
        data.product_id,
        data.batch_id || null,
        data.from_location_id || null,
        data.to_location_id || null,
        data.quantity,
        data.note || null
      ]
    );
    return result.insertId;
  }

  static async count(filters = {}) {
    const { search, status, from_warehouse_id, to_warehouse_id } = filters;
    let query = 'SELECT COUNT(*) AS total FROM transfer_receipts WHERE 1=1';
    const params = [];
    if (search) { query += ' AND receipt_code LIKE ?'; params.push(`%${search}%`); }
    if (status) { query += ' AND status = ?'; params.push(status); }
    if (from_warehouse_id) { query += ' AND from_warehouse_id = ?'; params.push(from_warehouse_id); }
    if (to_warehouse_id) { query += ' AND to_warehouse_id = ?'; params.push(to_warehouse_id); }
    const [rows] = await pool.query(query, params);
    return rows[0].total;
  }

  static async generateReceiptCode() {
    const today = moment().format('YYYYMMDD');
    const prefix = `TRF${today}`;
    const [rows] = await pool.query(
      'SELECT receipt_code FROM transfer_receipts WHERE receipt_code LIKE ? ORDER BY receipt_code DESC LIMIT 1',
      [`${prefix}%`]
    );
    if (rows.length === 0) return `${prefix}001`;
    const n = parseInt(rows[0].receipt_code.substring(prefix.length), 10) + 1;
    return `${prefix}${n.toString().padStart(3, '0')}`;
  }
}

module.exports = TransferReceipt;
