const pool = require('../config/db');

class Stock {
  static async findAll(filters = {}) {
    const { page = 1, limit = 10, category_id, low_stock, search } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT s.*, p.name, p.sku, p.unit, p.min_stock, p.price,
             c.name as category_name
      FROM stocks s
      INNER JOIN products p ON s.product_id = p.id
      INNER JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `;
    const params = [];

    if (category_id) {
      query += ' AND p.category_id = ?';
      params.push(category_id);
    }

    if (low_stock === 'true' || low_stock === true) {
      query += ' AND s.quantity <= p.min_stock';
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.sku LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY s.updated_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async findByProductId(productId) {
    const query = `
      SELECT s.*, p.name, p.sku, p.unit, p.min_stock, p.price
      FROM stocks s
      INNER JOIN products p ON s.product_id = p.id
      WHERE s.product_id = ?
    `;
    const [rows] = await pool.query(query, [productId]);
    return rows[0];
  }

  static async findLowStock() {
    const query = `
      SELECT s.*, p.name, p.sku, p.unit, p.min_stock, p.price, c.name as category_name
      FROM stocks s
      INNER JOIN products p ON s.product_id = p.id
      INNER JOIN categories c ON p.category_id = c.id
      WHERE s.quantity <= p.min_stock AND p.is_active = true
      ORDER BY s.quantity ASC
    `;
    const [rows] = await pool.query(query);
    return rows;
  }

  static async create(stockData) {
    const query = 'INSERT INTO stocks (product_id, quantity, last_import_date) VALUES (?, ?, NOW())';
    const [result] = await pool.query(query, [stockData.product_id, stockData.quantity]);
    return { id: result.insertId, ...stockData };
  }

  static async update(productId, quantity) {
    const query = 'UPDATE stocks SET quantity = ? WHERE product_id = ?';
    await pool.query(query, [quantity, productId]);
    return true;
  }

  static async increment(productId, quantity, connection = null) {
    const conn = connection || pool;
    const query = `
      INSERT INTO stocks (product_id, quantity, last_import_date)
      VALUES (?, ?, NOW())
      ON DUPLICATE KEY UPDATE
        quantity = quantity + VALUES(quantity),
        last_import_date = NOW()
    `;
    const [result] = await conn.query(query, [productId, quantity]);
    return result;
  }

  static async decrement(productId, quantity, connection = null) {
    const conn = connection || pool;

    // Check stock availability first
    const [stocks] = await conn.query('SELECT quantity FROM stocks WHERE product_id = ?', [productId]);

    if (!stocks.length) {
      throw new Error(`Product ID ${productId} has no stock record`);
    }

    if (stocks[0].quantity < quantity) {
      throw new Error(`Insufficient stock for product ID ${productId}. Available: ${stocks[0].quantity}, Required: ${quantity}`);
    }

    const query = `
      UPDATE stocks
      SET quantity = quantity - ?,
          last_export_date = NOW()
      WHERE product_id = ?
    `;
    const [result] = await conn.query(query, [quantity, productId]);
    return result;
  }

  static async updateLastImportDate(productId, connection = null) {
    const conn = connection || pool;
    const query = 'UPDATE stocks SET last_import_date = NOW() WHERE product_id = ?';
    await conn.query(query, [productId]);
  }

  static async updateLastExportDate(productId, connection = null) {
    const conn = connection || pool;
    const query = 'UPDATE stocks SET last_export_date = NOW() WHERE product_id = ?';
    await conn.query(query, [productId]);
  }

  static async count(filters = {}) {
    const { category_id, low_stock, search } = filters;
    let query = `
      SELECT COUNT(*) as total
      FROM stocks s
      INNER JOIN products p ON s.product_id = p.id
      WHERE p.is_active = true
    `;
    const params = [];

    if (category_id) {
      query += ' AND p.category_id = ?';
      params.push(category_id);
    }

    if (low_stock === 'true' || low_stock === true) {
      query += ' AND s.quantity <= p.min_stock';
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.sku LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
  }

  static async getTotalStockValue() {
    const query = `
      SELECT SUM(s.quantity * p.price) as total_value
      FROM stocks s
      INNER JOIN products p ON s.product_id = p.id
      WHERE p.is_active = true
    `;
    const [rows] = await pool.query(query);
    return rows[0].total_value || 0;
  }

  static async setQuantity(productId, quantity, connection = null) {
    const conn = connection || pool;
    const query = `
      INSERT INTO stocks (product_id, quantity)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)
    `;
    const [result] = await conn.query(query, [productId, quantity]);
    return result;
  }
}

module.exports = Stock;
