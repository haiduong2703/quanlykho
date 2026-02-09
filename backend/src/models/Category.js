const pool = require('../config/db');

class Category {
  static async findAll(filters = {}) {
    const { page = 1, limit = 10, search } = filters;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM categories WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async findAllWithoutPagination() {
    const query = 'SELECT * FROM categories ORDER BY name ASC';
    const [rows] = await pool.query(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM categories WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async findByName(name) {
    const query = 'SELECT * FROM categories WHERE name = ?';
    const [rows] = await pool.query(query, [name]);
    return rows[0];
  }

  static async create(categoryData) {
    const query = 'INSERT INTO categories (name, description) VALUES (?, ?)';
    const [result] = await pool.query(query, [categoryData.name, categoryData.description]);
    return { id: result.insertId, ...categoryData };
  }

  static async update(id, categoryData) {
    const fields = [];
    const params = [];

    if (categoryData.name !== undefined) {
      fields.push('name = ?');
      params.push(categoryData.name);
    }
    if (categoryData.description !== undefined) {
      fields.push('description = ?');
      params.push(categoryData.description);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    params.push(id);
    const query = `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`;
    await pool.query(query, params);
    return this.findById(id);
  }

  static async delete(id) {
    const query = 'DELETE FROM categories WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
  }

  static async count(filters = {}) {
    const { search } = filters;
    let query = 'SELECT COUNT(*) as total FROM categories WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
  }

  static async hasProducts(id) {
    const query = 'SELECT COUNT(*) as count FROM products WHERE category_id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0].count > 0;
  }
}

module.exports = Category;
