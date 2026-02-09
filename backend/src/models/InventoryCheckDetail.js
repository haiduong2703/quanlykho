const pool = require('../config/db');

class InventoryCheckDetail {
  static async findByCheckId(checkId) {
    const query = `
      SELECT icd.*, p.name as product_name, p.sku, p.unit, c.name as category_name
      FROM inventory_check_details icd
      INNER JOIN products p ON icd.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE icd.inventory_check_id = ?
      ORDER BY p.name ASC
    `;
    const [rows] = await pool.query(query, [checkId]);
    return rows;
  }

  static async create(detailData, connection = null) {
    const conn = connection || pool;
    const query = `
      INSERT INTO inventory_check_details (inventory_check_id, product_id, system_quantity, actual_quantity, difference, note)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const difference = detailData.actual_quantity - detailData.system_quantity;
    const [result] = await conn.query(query, [
      detailData.inventory_check_id,
      detailData.product_id,
      detailData.system_quantity,
      detailData.actual_quantity,
      difference,
      detailData.note
    ]);
    return { id: result.insertId, ...detailData, difference };
  }

  static async createBulk(details, connection = null) {
    const conn = connection || pool;
    if (!details || details.length === 0) return [];

    const values = details.map(d => {
      const difference = d.actual_quantity - d.system_quantity;
      return [
        d.inventory_check_id,
        d.product_id,
        d.system_quantity,
        d.actual_quantity,
        difference,
        d.note || null
      ];
    });

    const query = `
      INSERT INTO inventory_check_details (inventory_check_id, product_id, system_quantity, actual_quantity, difference, note)
      VALUES ?
    `;
    const [result] = await conn.query(query, [values]);
    return result;
  }

  static async update(id, detailData, connection = null) {
    const conn = connection || pool;
    const fields = [];
    const params = [];

    if (detailData.actual_quantity !== undefined) {
      fields.push('actual_quantity = ?');
      params.push(detailData.actual_quantity);

      if (detailData.system_quantity !== undefined) {
        fields.push('difference = ?');
        params.push(detailData.actual_quantity - detailData.system_quantity);
      }
    }

    if (detailData.note !== undefined) {
      fields.push('note = ?');
      params.push(detailData.note);
    }

    if (fields.length === 0) return true;

    params.push(id);
    const query = `UPDATE inventory_check_details SET ${fields.join(', ')} WHERE id = ?`;
    await conn.query(query, params);
    return true;
  }

  static async deleteByCheckId(checkId, connection = null) {
    const conn = connection || pool;
    const query = 'DELETE FROM inventory_check_details WHERE inventory_check_id = ?';
    const [result] = await conn.query(query, [checkId]);
    return result.affectedRows;
  }

  static async delete(id, connection = null) {
    const conn = connection || pool;
    const query = 'DELETE FROM inventory_check_details WHERE id = ?';
    const [result] = await conn.query(query, [id]);
    return result.affectedRows > 0;
  }

  static async getSummary(checkId) {
    const query = `
      SELECT
        COUNT(*) as total_products,
        SUM(ABS(difference)) as total_difference,
        SUM(CASE WHEN difference > 0 THEN difference ELSE 0 END) as total_surplus,
        SUM(CASE WHEN difference < 0 THEN ABS(difference) ELSE 0 END) as total_shortage
      FROM inventory_check_details
      WHERE inventory_check_id = ?
    `;
    const [rows] = await pool.query(query, [checkId]);
    return rows[0];
  }
}

module.exports = InventoryCheckDetail;
