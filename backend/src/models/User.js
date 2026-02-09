const pool = require('../config/db');

class User {
  static async findAll(filters = {}) {
    const { page = 1, limit = 10, search, role, is_active } = filters;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, username, email, full_name, role, is_active, created_at, updated_at FROM users WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (username LIKE ? OR email LIKE ? OR full_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (role) {
      query += ' AND role = ?';
      params.push(role);
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

  static async findById(id) {
    const query = 'SELECT id, username, email, full_name, role, is_active, created_at, updated_at FROM users WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async findByIdWithPassword(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ?';
    const [rows] = await pool.query(query, [username]);
    return rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.query(query, [email]);
    return rows[0];
  }

  static async create(userData) {
    const query = 'INSERT INTO users (username, email, password, full_name, role, is_active) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await pool.query(query, [
      userData.username,
      userData.email,
      userData.password,
      userData.full_name,
      userData.role || 'STAFF',
      userData.is_active !== undefined ? userData.is_active : true
    ]);
    return { id: result.insertId, ...userData };
  }

  static async update(id, userData) {
    const fields = [];
    const params = [];

    if (userData.email !== undefined) {
      fields.push('email = ?');
      params.push(userData.email);
    }
    if (userData.full_name !== undefined) {
      fields.push('full_name = ?');
      params.push(userData.full_name);
    }
    if (userData.role !== undefined) {
      fields.push('role = ?');
      params.push(userData.role);
    }
    if (userData.is_active !== undefined) {
      fields.push('is_active = ?');
      params.push(userData.is_active);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    params.push(id);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await pool.query(query, params);
    return this.findById(id);
  }

  static async updatePassword(id, hashedPassword) {
    const query = 'UPDATE users SET password = ? WHERE id = ?';
    await pool.query(query, [hashedPassword, id]);
    return true;
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
  }

  static async toggleStatus(id) {
    const query = 'UPDATE users SET is_active = NOT is_active WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
  }

  static async count(filters = {}) {
    const { search, role, is_active } = filters;
    let query = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (username LIKE ? OR email LIKE ? OR full_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    if (is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(is_active);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
  }
}

module.exports = User;
