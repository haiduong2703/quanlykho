const pool = require('../config/db');

class Supplier {
  static async findAll(filters = {}) {
    const { page = 1, limit = 10, search, is_active } = filters;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM suppliers WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (code LIKE ? OR name LIKE ? OR phone LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(is_active);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async findAllActive() {
    const [rows] = await pool.query('SELECT * FROM suppliers WHERE is_active = TRUE ORDER BY name');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM suppliers WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByCode(code) {
    const [rows] = await pool.query('SELECT * FROM suppliers WHERE code = ?', [code]);
    return rows[0];
  }

  static async create(data) {
    const query = `
      INSERT INTO suppliers (code, name, contact_person, phone, email, address, tax_code, note, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      data.code,
      data.name,
      data.contact_person || null,
      data.phone || null,
      data.email || null,
      data.address || null,
      data.tax_code || null,
      data.note || null,
      data.is_active !== undefined ? data.is_active : true
    ]);
    return { id: result.insertId, ...data };
  }

  static async update(id, data) {
    const fields = [];
    const params = [];

    if (data.code !== undefined) { fields.push('code = ?'); params.push(data.code); }
    if (data.name !== undefined) { fields.push('name = ?'); params.push(data.name); }
    if (data.contact_person !== undefined) { fields.push('contact_person = ?'); params.push(data.contact_person); }
    if (data.phone !== undefined) { fields.push('phone = ?'); params.push(data.phone); }
    if (data.email !== undefined) { fields.push('email = ?'); params.push(data.email); }
    if (data.address !== undefined) { fields.push('address = ?'); params.push(data.address); }
    if (data.tax_code !== undefined) { fields.push('tax_code = ?'); params.push(data.tax_code); }
    if (data.note !== undefined) { fields.push('note = ?'); params.push(data.note); }
    if (data.is_active !== undefined) { fields.push('is_active = ?'); params.push(data.is_active); }

    if (fields.length === 0) return this.findById(id);

    params.push(id);
    const query = `UPDATE suppliers SET ${fields.join(', ')} WHERE id = ?`;
    await pool.query(query, params);
    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM suppliers WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async toggleStatus(id) {
    await pool.query('UPDATE suppliers SET is_active = NOT is_active WHERE id = ?', [id]);
    return this.findById(id);
  }

  static async count(filters = {}) {
    const { search, is_active } = filters;
    let query = 'SELECT COUNT(*) as total FROM suppliers WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (code LIKE ? OR name LIKE ? OR phone LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
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
      "SELECT code FROM suppliers WHERE code LIKE 'NCC%' ORDER BY id DESC LIMIT 1"
    );
    if (rows.length === 0) return 'NCC001';
    const lastCode = rows[0].code;
    const num = parseInt(lastCode.replace('NCC', '')) + 1;
    return `NCC${num.toString().padStart(3, '0')}`;
  }
}

module.exports = Supplier;
