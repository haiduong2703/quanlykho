const pool = require('../config/db');

class Batch {
  static async findAll(filters = {}) {
    const {
      page = 1, limit = 20, search, product_id, warehouse_id,
      status, expiry_before, expiry_after, only_available
    } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT b.*, p.sku AS product_sku, p.name AS product_name,
             s.name AS supplier_name, w.name AS warehouse_name
      FROM batches b
      JOIN products p ON b.product_id = p.id
      LEFT JOIN suppliers s ON b.supplier_id = s.id
      LEFT JOIN warehouses w ON b.warehouse_id = w.id
      WHERE 1=1
    `;
    const params = [];

    if (product_id) { query += ' AND b.product_id = ?'; params.push(product_id); }
    if (warehouse_id) { query += ' AND b.warehouse_id = ?'; params.push(warehouse_id); }
    if (status) { query += ' AND b.status = ?'; params.push(status); }
    if (only_available) { query += ' AND b.remaining_quantity > 0 AND b.status = ?'; params.push('ACTIVE'); }
    if (expiry_before) { query += ' AND b.expiry_date <= ?'; params.push(expiry_before); }
    if (expiry_after) { query += ' AND b.expiry_date >= ?'; params.push(expiry_after); }
    if (search) {
      query += ' AND (b.batch_code LIKE ? OR p.sku LIKE ? OR p.name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY b.expiry_date IS NULL, b.expiry_date ASC, b.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT b.*, p.sku AS product_sku, p.name AS product_name,
              s.name AS supplier_name, w.name AS warehouse_name
       FROM batches b
       JOIN products p ON b.product_id = p.id
       LEFT JOIN suppliers s ON b.supplier_id = s.id
       LEFT JOIN warehouses w ON b.warehouse_id = w.id
       WHERE b.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByProductBatch(productId, batchCode) {
    const [rows] = await pool.query(
      'SELECT * FROM batches WHERE product_id = ? AND batch_code = ?',
      [productId, batchCode]
    );
    return rows[0];
  }

  // Lấy các batch còn hàng của 1 product theo thứ tự FIFO (nhập trước xuất trước)
  static async findAvailableFIFO(productId, warehouseId = null) {
    let query = `
      SELECT * FROM batches
      WHERE product_id = ? AND remaining_quantity > 0 AND status = 'ACTIVE'
    `;
    const params = [productId];
    if (warehouseId) { query += ' AND warehouse_id = ?'; params.push(warehouseId); }
    // FIFO: ưu tiên hạn gần hết trước, sau đó tới lô nhập sớm
    query += ' ORDER BY expiry_date IS NULL, expiry_date ASC, created_at ASC';
    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async findAvailableLIFO(productId, warehouseId = null) {
    let query = `
      SELECT * FROM batches
      WHERE product_id = ? AND remaining_quantity > 0 AND status = 'ACTIVE'
    `;
    const params = [productId];
    if (warehouseId) { query += ' AND warehouse_id = ?'; params.push(warehouseId); }
    query += ' ORDER BY created_at DESC';
    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async create(data, conn = null) {
    const runner = conn || pool;
    const query = `
      INSERT INTO batches
        (batch_code, product_id, supplier_id, warehouse_id, manufacture_date, expiry_date,
         import_receipt_id, initial_quantity, remaining_quantity, unit_price, status, note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await runner.query(query, [
      data.batch_code,
      data.product_id,
      data.supplier_id || null,
      data.warehouse_id || null,
      data.manufacture_date || null,
      data.expiry_date || null,
      data.import_receipt_id || null,
      data.initial_quantity || 0,
      data.remaining_quantity !== undefined ? data.remaining_quantity : (data.initial_quantity || 0),
      data.unit_price || 0,
      data.status || 'ACTIVE',
      data.note || null
    ]);
    return result.insertId;
  }

  static async update(id, data) {
    const fields = [];
    const params = [];
    const allowed = [
      'batch_code', 'supplier_id', 'warehouse_id', 'manufacture_date', 'expiry_date',
      'initial_quantity', 'remaining_quantity', 'unit_price', 'status', 'note'
    ];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(data[key]);
      }
    }
    if (fields.length === 0) return this.findById(id);
    params.push(id);
    await pool.query(`UPDATE batches SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.findById(id);
  }

  static async adjustRemaining(id, delta, conn = null) {
    const runner = conn || pool;
    await runner.query(
      'UPDATE batches SET remaining_quantity = remaining_quantity + ? WHERE id = ?',
      [delta, id]
    );
    // Auto-status DEPLETED khi hết hàng
    await runner.query(
      `UPDATE batches SET status = 'DEPLETED'
       WHERE id = ? AND remaining_quantity <= 0 AND status = 'ACTIVE'`,
      [id]
    );
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM batches WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async count(filters = {}) {
    const { search, product_id, warehouse_id, status, only_available } = filters;
    let query = `
      SELECT COUNT(*) AS total FROM batches b
      JOIN products p ON b.product_id = p.id
      WHERE 1=1
    `;
    const params = [];
    if (product_id) { query += ' AND b.product_id = ?'; params.push(product_id); }
    if (warehouse_id) { query += ' AND b.warehouse_id = ?'; params.push(warehouse_id); }
    if (status) { query += ' AND b.status = ?'; params.push(status); }
    if (only_available) { query += ' AND b.remaining_quantity > 0 AND b.status = ?'; params.push('ACTIVE'); }
    if (search) {
      query += ' AND (b.batch_code LIKE ? OR p.sku LIKE ? OR p.name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    const [rows] = await pool.query(query, params);
    return rows[0].total;
  }

  // Lô sắp hết hạn trong N ngày
  static async findExpiringSoon(days = 30) {
    const [rows] = await pool.query(
      `SELECT b.*, p.sku AS product_sku, p.name AS product_name
       FROM batches b
       JOIN products p ON b.product_id = p.id
       WHERE b.status = 'ACTIVE'
         AND b.remaining_quantity > 0
         AND b.expiry_date IS NOT NULL
         AND b.expiry_date <= DATE_ADD(CURDATE(), INTERVAL ? DAY)
       ORDER BY b.expiry_date ASC`,
      [days]
    );
    return rows;
  }
}

module.exports = Batch;
