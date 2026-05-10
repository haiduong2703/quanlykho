const pool = require('../config/db');

class ProductUnit {
  static async findByProduct(productId) {
    const [rows] = await pool.query(
      'SELECT * FROM product_units WHERE product_id = ? ORDER BY is_base DESC, conversion_rate ASC',
      [productId]
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM product_units WHERE id = ?', [id]);
    return rows[0];
  }

  static async findBaseUnit(productId) {
    const [rows] = await pool.query(
      'SELECT * FROM product_units WHERE product_id = ? AND is_base = TRUE LIMIT 1',
      [productId]
    );
    return rows[0];
  }

  static async findByBarcode(barcode) {
    const [rows] = await pool.query(
      `SELECT pu.*, p.sku AS product_sku, p.name AS product_name
       FROM product_units pu
       JOIN products p ON pu.product_id = p.id
       WHERE pu.barcode = ?`,
      [barcode]
    );
    return rows[0];
  }

  static async create(data) {
    const query = `
      INSERT INTO product_units (product_id, unit_name, conversion_rate, is_base, barcode, note)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      data.product_id,
      data.unit_name,
      data.conversion_rate || 1,
      data.is_base ? 1 : 0,
      data.barcode || null,
      data.note || null
    ]);
    if (data.is_base) await this._ensureSingleBase(data.product_id, result.insertId);
    return this.findById(result.insertId);
  }

  static async update(id, data) {
    const fields = [];
    const params = [];
    const allowed = ['unit_name', 'conversion_rate', 'is_base', 'barcode', 'note'];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(key === 'is_base' ? (data[key] ? 1 : 0) : data[key]);
      }
    }
    if (fields.length === 0) return this.findById(id);
    params.push(id);
    await pool.query(`UPDATE product_units SET ${fields.join(', ')} WHERE id = ?`, params);
    if (data.is_base === true) {
      const unit = await this.findById(id);
      await this._ensureSingleBase(unit.product_id, id);
    }
    return this.findById(id);
  }

  static async delete(id) {
    const unit = await this.findById(id);
    if (!unit) return false;
    if (unit.is_base) {
      // không cho xoá unit cơ sở nếu còn unit khác → phải set unit khác làm base trước
      const [rows] = await pool.query(
        'SELECT COUNT(*) AS cnt FROM product_units WHERE product_id = ? AND id <> ?',
        [unit.product_id, id]
      );
      if (rows[0].cnt > 0) throw new Error('Không thể xoá đơn vị cơ sở khi còn đơn vị khác. Hãy đặt đơn vị khác làm cơ sở trước.');
    }
    const [result] = await pool.query('DELETE FROM product_units WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // Quy đổi giữa 2 đơn vị của cùng 1 product
  static async convert(productId, fromUnitName, toUnitName, quantity) {
    const [rows] = await pool.query(
      'SELECT unit_name, conversion_rate FROM product_units WHERE product_id = ?',
      [productId]
    );
    const from = rows.find((r) => r.unit_name === fromUnitName);
    const to = rows.find((r) => r.unit_name === toUnitName);
    if (!from || !to) throw new Error('Đơn vị không tồn tại cho sản phẩm này');
    // quantity(from) * conversion_rate(from) = số lượng base;  / conversion_rate(to) = số lượng to
    return (quantity * Number(from.conversion_rate)) / Number(to.conversion_rate);
  }

  static async _ensureSingleBase(productId, keepId) {
    await pool.query(
      'UPDATE product_units SET is_base = FALSE WHERE product_id = ? AND id <> ?',
      [productId, keepId]
    );
  }
}

module.exports = ProductUnit;
