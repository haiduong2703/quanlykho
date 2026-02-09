const pool = require('../config/db');

class AuditLog {
  static async create(data) {
    const query = `
      INSERT INTO audit_logs (user_id, user_name, action, entity_type, entity_id, entity_name, details, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      data.user_id || null,
      data.user_name || null,
      data.action,
      data.entity_type,
      data.entity_id || null,
      data.entity_name || null,
      data.details ? JSON.stringify(data.details) : null,
      data.ip_address || null
    ]);
    return { id: result.insertId, ...data };
  }

  static async findAll(filters = {}) {
    const { page = 1, limit = 20, action, entity_type, user_id, from_date, to_date } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT al.*, u.username
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (action) {
      query += ' AND al.action = ?';
      params.push(action);
    }

    if (entity_type) {
      query += ' AND al.entity_type = ?';
      params.push(entity_type);
    }

    if (user_id) {
      query += ' AND al.user_id = ?';
      params.push(user_id);
    }

    if (from_date) {
      query += ' AND al.created_at >= ?';
      params.push(from_date);
    }

    if (to_date) {
      query += ' AND al.created_at <= ?';
      params.push(to_date + ' 23:59:59');
    }

    query += ' ORDER BY al.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async count(filters = {}) {
    const { action, entity_type, user_id, from_date, to_date } = filters;

    let query = 'SELECT COUNT(*) as total FROM audit_logs WHERE 1=1';
    const params = [];

    if (action) {
      query += ' AND action = ?';
      params.push(action);
    }

    if (entity_type) {
      query += ' AND entity_type = ?';
      params.push(entity_type);
    }

    if (user_id) {
      query += ' AND user_id = ?';
      params.push(user_id);
    }

    if (from_date) {
      query += ' AND created_at >= ?';
      params.push(from_date);
    }

    if (to_date) {
      query += ' AND created_at <= ?';
      params.push(to_date + ' 23:59:59');
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
  }

  // Helper to log common actions
  static async log(req, action, entityType, entityId, entityName, details = null) {
    return this.create({
      user_id: req.user?.id,
      user_name: req.user?.full_name || req.user?.username,
      action,
      entity_type: entityType,
      entity_id: entityId,
      entity_name: entityName,
      details,
      ip_address: req.ip || req.connection?.remoteAddress
    });
  }
}

module.exports = AuditLog;
