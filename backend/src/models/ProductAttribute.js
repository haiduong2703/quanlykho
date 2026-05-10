const pool = require('../config/db');

class ProductAttribute {
  static async findByProduct(productId) {
    const [rows] = await pool.query(
      'SELECT * FROM product_attributes WHERE product_id = ? ORDER BY attr_name, attr_value',
      [productId]
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM product_attributes WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const [result] = await pool.query(
      'INSERT INTO product_attributes (product_id, attr_name, attr_value) VALUES (?, ?, ?)',
      [data.product_id, data.attr_name, data.attr_value]
    );
    return this.findById(result.insertId);
  }

  static async bulkCreate(productId, items) {
    if (!items || items.length === 0) return [];
    const values = items.map(() => '(?, ?, ?)').join(', ');
    const params = [];
    for (const it of items) params.push(productId, it.attr_name, it.attr_value);
    await pool.query(
      `INSERT INTO product_attributes (product_id, attr_name, attr_value) VALUES ${values}`,
      params
    );
    return this.findByProduct(productId);
  }

  static async update(id, data) {
    const fields = [];
    const params = [];
    if (data.attr_name !== undefined) { fields.push('attr_name = ?'); params.push(data.attr_name); }
    if (data.attr_value !== undefined) { fields.push('attr_value = ?'); params.push(data.attr_value); }
    if (fields.length === 0) return this.findById(id);
    params.push(id);
    await pool.query(`UPDATE product_attributes SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM product_attributes WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async deleteByProduct(productId) {
    await pool.query('DELETE FROM product_attributes WHERE product_id = ?', [productId]);
  }
}

module.exports = ProductAttribute;
