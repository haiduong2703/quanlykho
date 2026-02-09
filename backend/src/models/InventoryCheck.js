const pool = require('../config/db');
const moment = require('moment');

class InventoryCheck {
  static async findAll(filters = {}) {
    const { page = 1, limit = 10, search, status, from_date, to_date } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT ic.*, u.username, u.full_name as user_full_name
      FROM inventory_checks ic
      LEFT JOIN users u ON ic.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ' AND ic.check_code LIKE ?';
      params.push(`%${search}%`);
    }

    if (status) {
      query += ' AND ic.status = ?';
      params.push(status);
    }

    if (from_date) {
      query += ' AND ic.check_date >= ?';
      params.push(from_date);
    }

    if (to_date) {
      query += ' AND ic.check_date <= ?';
      params.push(to_date);
    }

    query += ' ORDER BY ic.check_date DESC, ic.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async findById(id) {
    const query = `
      SELECT ic.*, u.username, u.full_name as user_full_name
      FROM inventory_checks ic
      LEFT JOIN users u ON ic.user_id = u.id
      WHERE ic.id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async findByIdWithDetails(id) {
    const check = await this.findById(id);
    if (!check) return null;

    const detailsQuery = `
      SELECT icd.*, p.name as product_name, p.sku, p.unit, c.name as category_name
      FROM inventory_check_details icd
      INNER JOIN products p ON icd.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE icd.inventory_check_id = ?
      ORDER BY p.name ASC
    `;
    const [details] = await pool.query(detailsQuery, [id]);
    check.details = details;
    return check;
  }

  static async findByCheckCode(checkCode) {
    const query = 'SELECT * FROM inventory_checks WHERE check_code = ?';
    const [rows] = await pool.query(query, [checkCode]);
    return rows[0];
  }

  static async create(checkData, connection = null) {
    const conn = connection || pool;
    const query = `
      INSERT INTO inventory_checks (check_code, user_id, check_date, status, total_products, total_difference, note)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await conn.query(query, [
      checkData.check_code,
      checkData.user_id,
      checkData.check_date || new Date(),
      checkData.status || 'DRAFT',
      checkData.total_products || 0,
      checkData.total_difference || 0,
      checkData.note
    ]);
    return { id: result.insertId, ...checkData };
  }

  static async update(id, checkData, connection = null) {
    const conn = connection || pool;
    const fields = [];
    const params = [];

    if (checkData.status !== undefined) {
      fields.push('status = ?');
      params.push(checkData.status);
    }
    if (checkData.total_products !== undefined) {
      fields.push('total_products = ?');
      params.push(checkData.total_products);
    }
    if (checkData.total_difference !== undefined) {
      fields.push('total_difference = ?');
      params.push(checkData.total_difference);
    }
    if (checkData.note !== undefined) {
      fields.push('note = ?');
      params.push(checkData.note);
    }

    if (fields.length === 0) return true;

    params.push(id);
    const query = `UPDATE inventory_checks SET ${fields.join(', ')} WHERE id = ?`;
    await conn.query(query, params);
    return true;
  }

  static async delete(id, connection = null) {
    const conn = connection || pool;
    const query = 'DELETE FROM inventory_checks WHERE id = ?';
    const [result] = await conn.query(query, [id]);
    return result.affectedRows > 0;
  }

  static async count(filters = {}) {
    const { search, status, from_date, to_date } = filters;
    let query = 'SELECT COUNT(*) as total FROM inventory_checks WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND check_code LIKE ?';
      params.push(`%${search}%`);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (from_date) {
      query += ' AND check_date >= ?';
      params.push(from_date);
    }

    if (to_date) {
      query += ' AND check_date <= ?';
      params.push(to_date);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
  }

  static async generateCheckCode() {
    const today = moment().format('YYYYMMDD');
    const prefix = `CHK${today}`;

    const query = 'SELECT check_code FROM inventory_checks WHERE check_code LIKE ? ORDER BY check_code DESC LIMIT 1';
    const [rows] = await pool.query(query, [`${prefix}%`]);

    if (rows.length === 0) {
      return `${prefix}001`;
    }

    const lastCode = rows[0].check_code;
    const lastNumber = parseInt(lastCode.substring(prefix.length));
    const nextNumber = (lastNumber + 1).toString().padStart(3, '0');

    return `${prefix}${nextNumber}`;
  }
}

module.exports = InventoryCheck;
