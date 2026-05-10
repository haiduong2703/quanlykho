const pool = require('../config/db');

class WarehouseLocation {
  static async findAll(filters = {}) {
    const { page = 1, limit = 20, search, warehouse_id, zone, is_active } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT l.*, w.code AS warehouse_code, w.name AS warehouse_name
      FROM warehouse_locations l
      JOIN warehouses w ON l.warehouse_id = w.id
      WHERE 1=1
    `;
    const params = [];

    if (warehouse_id) {
      query += ' AND l.warehouse_id = ?';
      params.push(warehouse_id);
    }
    if (zone) {
      query += ' AND l.zone = ?';
      params.push(zone);
    }
    if (search) {
      query += ' AND (l.code LIKE ? OR l.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (is_active !== undefined) {
      query += ' AND l.is_active = ?';
      params.push(is_active);
    }

    query += ' ORDER BY l.warehouse_id, l.zone, l.aisle, l.rack, l.shelf, l.bin LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT l.*, w.code AS warehouse_code, w.name AS warehouse_name
       FROM warehouse_locations l
       JOIN warehouses w ON l.warehouse_id = w.id
       WHERE l.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByCode(warehouseId, code) {
    const [rows] = await pool.query(
      'SELECT * FROM warehouse_locations WHERE warehouse_id = ? AND code = ?',
      [warehouseId, code]
    );
    return rows[0];
  }

  static async findByWarehouse(warehouseId) {
    const [rows] = await pool.query(
      'SELECT * FROM warehouse_locations WHERE warehouse_id = ? AND is_active = TRUE ORDER BY zone, aisle, rack, shelf, bin',
      [warehouseId]
    );
    return rows;
  }

  static async create(data) {
    const query = `
      INSERT INTO warehouse_locations
        (warehouse_id, code, zone, aisle, rack, shelf, bin, description, capacity, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      data.warehouse_id,
      data.code,
      data.zone,
      data.aisle || null,
      data.rack || null,
      data.shelf || null,
      data.bin || null,
      data.description || null,
      data.capacity || null,
      data.is_active !== undefined ? (data.is_active ? 1 : 0) : 1
    ]);
    return this.findById(result.insertId);
  }

  static async update(id, data) {
    const fields = [];
    const params = [];
    const allowed = ['code', 'zone', 'aisle', 'rack', 'shelf', 'bin', 'description', 'capacity', 'is_active'];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(key === 'is_active' ? (data[key] ? 1 : 0) : data[key]);
      }
    }
    if (fields.length === 0) return this.findById(id);
    params.push(id);
    await pool.query(`UPDATE warehouse_locations SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM warehouse_locations WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async count(filters = {}) {
    const { search, warehouse_id, zone, is_active } = filters;
    let query = 'SELECT COUNT(*) AS total FROM warehouse_locations WHERE 1=1';
    const params = [];
    if (warehouse_id) { query += ' AND warehouse_id = ?'; params.push(warehouse_id); }
    if (zone) { query += ' AND zone = ?'; params.push(zone); }
    if (search) {
      query += ' AND (code LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (is_active !== undefined) { query += ' AND is_active = ?'; params.push(is_active); }
    const [rows] = await pool.query(query, params);
    return rows[0].total;
  }

  // Tạo code gợi ý từ zone-aisle-rack-shelf-bin
  static buildCode({ zone, aisle, rack, shelf, bin }) {
    return [zone, aisle, rack, shelf, bin].filter((x) => x !== undefined && x !== null && x !== '').join('-');
  }
}

module.exports = WarehouseLocation;
