const pool = require('../config/db');

class StockByLocation {
  static async findAll(filters = {}) {
    const {
      page = 1, limit = 20, product_id, warehouse_id, location_id, batch_id, only_positive
    } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT sbl.*,
             p.sku AS product_sku, p.name AS product_name, p.unit AS product_unit,
             w.code AS warehouse_code, w.name AS warehouse_name,
             l.code AS location_code,
             b.batch_code, b.expiry_date
      FROM stock_by_location sbl
      JOIN products p ON sbl.product_id = p.id
      JOIN warehouses w ON sbl.warehouse_id = w.id
      LEFT JOIN warehouse_locations l ON sbl.location_id = l.id
      LEFT JOIN batches b ON sbl.batch_id = b.id
      WHERE 1=1
    `;
    const params = [];

    if (product_id) { query += ' AND sbl.product_id = ?'; params.push(product_id); }
    if (warehouse_id) { query += ' AND sbl.warehouse_id = ?'; params.push(warehouse_id); }
    if (location_id) { query += ' AND sbl.location_id = ?'; params.push(location_id); }
    if (batch_id) { query += ' AND sbl.batch_id = ?'; params.push(batch_id); }
    if (only_positive) { query += ' AND sbl.quantity > 0'; }

    query += ' ORDER BY w.name, l.code, p.name LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);
    return rows;
  }

  // Tổng tồn 1 SKU (có thể lọc theo warehouse)
  static async totalByProduct(productId, warehouseId = null) {
    let query = 'SELECT COALESCE(SUM(quantity), 0) AS total FROM stock_by_location WHERE product_id = ?';
    const params = [productId];
    if (warehouseId) { query += ' AND warehouse_id = ?'; params.push(warehouseId); }
    const [rows] = await pool.query(query, params);
    return Number(rows[0].total);
  }

  // Upsert 1 dòng tồn (product + warehouse + location + batch). Vì MySQL không coi nhiều NULL
  // là trùng trong UNIQUE, chúng ta implement upsert bằng SELECT rồi UPDATE/INSERT.
  static async upsert({ product_id, warehouse_id, location_id = null, batch_id = null, delta }, conn = null) {
    const runner = conn || pool;
    const [rows] = await runner.query(
      `SELECT id, quantity FROM stock_by_location
       WHERE product_id = ? AND warehouse_id = ?
         AND ${location_id === null ? 'location_id IS NULL' : 'location_id = ?'}
         AND ${batch_id === null ? 'batch_id IS NULL' : 'batch_id = ?'}
       LIMIT 1`,
      [
        product_id, warehouse_id,
        ...(location_id === null ? [] : [location_id]),
        ...(batch_id === null ? [] : [batch_id])
      ]
    );
    if (rows.length > 0) {
      const newQty = Number(rows[0].quantity) + Number(delta);
      await runner.query('UPDATE stock_by_location SET quantity = ? WHERE id = ?', [newQty, rows[0].id]);
      return { id: rows[0].id, quantity: newQty, updated: true };
    } else {
      const [result] = await runner.query(
        'INSERT INTO stock_by_location (product_id, warehouse_id, location_id, batch_id, quantity) VALUES (?, ?, ?, ?, ?)',
        [product_id, warehouse_id, location_id, batch_id, Number(delta)]
      );
      return { id: result.insertId, quantity: Number(delta), created: true };
    }
  }

  static async count(filters = {}) {
    const { product_id, warehouse_id, location_id, batch_id, only_positive } = filters;
    let query = 'SELECT COUNT(*) AS total FROM stock_by_location WHERE 1=1';
    const params = [];
    if (product_id) { query += ' AND product_id = ?'; params.push(product_id); }
    if (warehouse_id) { query += ' AND warehouse_id = ?'; params.push(warehouse_id); }
    if (location_id) { query += ' AND location_id = ?'; params.push(location_id); }
    if (batch_id) { query += ' AND batch_id = ?'; params.push(batch_id); }
    if (only_positive) { query += ' AND quantity > 0'; }
    const [rows] = await pool.query(query, params);
    return rows[0].total;
  }

  // Tóm tắt tồn theo kho cho 1 sản phẩm
  static async summaryByProduct(productId) {
    const [rows] = await pool.query(
      `SELECT w.id AS warehouse_id, w.code AS warehouse_code, w.name AS warehouse_name,
              SUM(sbl.quantity) AS quantity
       FROM stock_by_location sbl
       JOIN warehouses w ON sbl.warehouse_id = w.id
       WHERE sbl.product_id = ?
       GROUP BY w.id, w.code, w.name
       ORDER BY w.is_default DESC, w.name`,
      [productId]
    );
    return rows;
  }
}

module.exports = StockByLocation;
