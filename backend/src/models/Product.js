const pool = require('../config/db');

class Product {
  static async findAll(filters = {}) {
    const { page = 1, limit = 10, search, category_id, is_active } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ' AND (p.name LIKE ? OR p.sku LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category_id) {
      query += ' AND p.category_id = ?';
      params.push(category_id);
    }

    if (is_active !== undefined) {
      query += ' AND p.is_active = ?';
      params.push(is_active);
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM products WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async findByIdWithCategory(id) {
    const query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async findBySku(sku) {
    const query = 'SELECT * FROM products WHERE sku = ?';
    const [rows] = await pool.query(query, [sku]);
    return rows[0];
  }

  static async search(keyword, filters = {}) {
    const { page = 1, limit = 10, category_id } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE (p.name LIKE ? OR p.sku LIKE ? OR p.description LIKE ?)
    `;
    const params = [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`];

    if (category_id) {
      query += ' AND p.category_id = ?';
      params.push(category_id);
    }

    query += ' ORDER BY p.name ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async create(productData) {
    const query = `
      INSERT INTO products (category_id, sku, name, description, image, unit, price, min_stock, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      productData.category_id,
      productData.sku,
      productData.name,
      productData.description,
      productData.image || null,
      productData.unit,
      productData.price,
      productData.min_stock,
      productData.is_active !== undefined ? productData.is_active : true
    ]);
    return { id: result.insertId, ...productData };
  }

  static async update(id, productData) {
    const fields = [];
    const params = [];

    if (productData.category_id !== undefined) {
      fields.push('category_id = ?');
      params.push(productData.category_id);
    }
    if (productData.name !== undefined) {
      fields.push('name = ?');
      params.push(productData.name);
    }
    if (productData.description !== undefined) {
      fields.push('description = ?');
      params.push(productData.description);
    }
    if (productData.image !== undefined) {
      fields.push('image = ?');
      params.push(productData.image);
    }
    if (productData.unit !== undefined) {
      fields.push('unit = ?');
      params.push(productData.unit);
    }
    if (productData.price !== undefined) {
      fields.push('price = ?');
      params.push(productData.price);
    }
    if (productData.min_stock !== undefined) {
      fields.push('min_stock = ?');
      params.push(productData.min_stock);
    }
    if (productData.is_active !== undefined) {
      fields.push('is_active = ?');
      params.push(productData.is_active);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    params.push(id);
    const query = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
    await pool.query(query, params);
    return this.findById(id);
  }

  static async delete(id) {
    const query = 'DELETE FROM products WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
  }

  static async toggleStatus(id) {
    const query = 'UPDATE products SET is_active = NOT is_active WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
  }

  static async count(filters = {}) {
    const { search, category_id, is_active } = filters;
    let query = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR sku LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category_id) {
      query += ' AND category_id = ?';
      params.push(category_id);
    }

    if (is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(is_active);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
  }

  static async findByCategory(categoryId) {
    const query = 'SELECT * FROM products WHERE category_id = ? AND is_active = true ORDER BY name ASC';
    const [rows] = await pool.query(query, [categoryId]);
    return rows;
  }
}

module.exports = Product;
