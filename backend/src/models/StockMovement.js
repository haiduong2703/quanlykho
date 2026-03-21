const pool = require('../config/db');

class StockMovement {
  static async create(data, connection = null) {
    const conn = connection || pool;
    const query = `
      INSERT INTO stock_movements (product_id, type, quantity, before_quantity, after_quantity, reference_type, reference_id, reference_code, note, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await conn.query(query, [
      data.product_id,
      data.type,
      data.quantity,
      data.before_quantity || 0,
      data.after_quantity || 0,
      data.reference_type || null,
      data.reference_id || null,
      data.reference_code || null,
      data.note || null,
      data.created_by || null
    ]);
    return { id: result.insertId, ...data };
  }

  static async findByProductId(productId, filters = {}) {
    const { page = 1, limit = 20, type, from_date, to_date } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT sm.*, p.name as product_name, p.sku, u.full_name as created_by_name
      FROM stock_movements sm
      INNER JOIN products p ON sm.product_id = p.id
      LEFT JOIN users u ON sm.created_by = u.id
      WHERE sm.product_id = ?
    `;
    const params = [productId];

    if (type) {
      query += ' AND sm.type = ?';
      params.push(type);
    }

    if (from_date) {
      query += ' AND sm.created_at >= ?';
      params.push(from_date);
    }

    if (to_date) {
      query += ' AND sm.created_at <= ?';
      params.push(to_date + ' 23:59:59');
    }

    query += ' ORDER BY sm.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async countByProductId(productId, filters = {}) {
    const { type, from_date, to_date } = filters;

    let query = 'SELECT COUNT(*) as total FROM stock_movements WHERE product_id = ?';
    const params = [productId];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    if (from_date) {
      query += ' AND created_at >= ?';
      params.push(from_date);
    }

    if (to_date) {
      query += ' AND created_at <= ?';
      params.push(to_date + ' 23:59:59');
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
  }
}

module.exports = StockMovement;
