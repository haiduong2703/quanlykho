const pool = require('../config/db');

class Warehouse {
  static async findAll(filters = {}) {
    const { page = 1, limit = 10, search, is_active } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT w.*, u.full_name AS manager_name
      FROM warehouses w
      LEFT JOIN users u ON w.manager_user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ' AND (w.code LIKE ? OR w.name LIKE ? OR w.address LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (is_active !== undefined) {
      query += ' AND w.is_active = ?';
      params.push(is_active);
    }

    query += ' ORDER BY w.is_default DESC, w.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async findAllActive() {
    const [rows] = await pool.query(
      'SELECT * FROM warehouses WHERE is_active = TRUE ORDER BY is_default DESC, name ASC'
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT w.*, u.full_name AS manager_name
       FROM warehouses w
       LEFT JOIN users u ON w.manager_user_id = u.id
       WHERE w.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByCode(code) {
    const [rows] = await pool.query('SELECT * FROM warehouses WHERE code = ?', [code]);
    return rows[0];
  }

  static async findDefault() {
    const [rows] = await pool.query('SELECT * FROM warehouses WHERE is_default = TRUE LIMIT 1');
    return rows[0];
  }

  static async create(data) {
    const query = `
      INSERT INTO warehouses (code, name, address, phone, manager_user_id, is_default, is_active, note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      data.code,
      data.name,
      data.address || null,
      data.phone || null,
      data.manager_user_id || null,
      data.is_default ? 1 : 0,
      data.is_active !== undefined ? (data.is_active ? 1 : 0) : 1,
      data.note || null
    ]);
    if (data.is_default) await this._ensureSingleDefault(result.insertId);
    return this.findById(result.insertId);
  }

  static async update(id, data) {
    const fields = [];
    const params = [];

    const allowed = ['code', 'name', 'address', 'phone', 'manager_user_id', 'is_default', 'is_active', 'note'];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(key === 'is_default' || key === 'is_active' ? (data[key] ? 1 : 0) : data[key]);
      }
    }
    if (fields.length === 0) return this.findById(id);

    params.push(id);
    await pool.query(`UPDATE warehouses SET ${fields.join(', ')} WHERE id = ?`, params);
    if (data.is_default === true) await this._ensureSingleDefault(id);
    return this.findById(id);
  }

  static async delete(id) {
    // Không cho xoá kho mặc định; kho có tồn kho sẽ bị RESTRICT từ FK stock_by_location
    const wh = await this.findById(id);
    if (!wh) return false;
    if (wh.is_default) throw new Error('Không thể xoá kho mặc định');
    const [result] = await pool.query('DELETE FROM warehouses WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async toggleStatus(id) {
    await pool.query('UPDATE warehouses SET is_active = NOT is_active WHERE id = ?', [id]);
    return this.findById(id);
  }

  static async count(filters = {}) {
    const { search, is_active } = filters;
    let query = 'SELECT COUNT(*) AS total FROM warehouses WHERE 1=1';
    const params = [];
    if (search) {
      query += ' AND (code LIKE ? OR name LIKE ? OR address LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(is_active);
    }
    const [rows] = await pool.query(query, params);
    return rows[0].total;
  }

  static async generateCode() {
    const [rows] = await pool.query(
      "SELECT code FROM warehouses WHERE code LIKE 'WH%' ORDER BY id DESC LIMIT 1"
    );
    if (rows.length === 0) return 'WH01';
    const num = parseInt(rows[0].code.replace('WH', ''), 10) + 1;
    return `WH${num.toString().padStart(2, '0')}`;
  }

  static async _ensureSingleDefault(keepId) {
    await pool.query('UPDATE warehouses SET is_default = FALSE WHERE id <> ?', [keepId]);
  }
}

module.exports = Warehouse;
