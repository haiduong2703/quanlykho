const pool = require('../config/db');

class ExportReceiptItem {
  static async findByReceiptId(receiptId) {
    const query = `
      SELECT eri.*, p.name as product_name, p.sku, p.unit
      FROM export_receipt_items eri
      INNER JOIN products p ON eri.product_id = p.id
      WHERE eri.export_receipt_id = ?
      ORDER BY eri.id ASC
    `;
    const [rows] = await pool.query(query, [receiptId]);
    return rows;
  }

  static async create(itemData, connection = null) {
    const conn = connection || pool;
    const query = `
      INSERT INTO export_receipt_items (export_receipt_id, product_id, quantity, unit_price, subtotal, note)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await conn.query(query, [
      itemData.export_receipt_id,
      itemData.product_id,
      itemData.quantity,
      itemData.unit_price,
      itemData.subtotal,
      itemData.note
    ]);
    return { id: result.insertId, ...itemData };
  }

  static async createBulk(items, connection = null) {
    const conn = connection || pool;
    const values = items.map(item => [
      item.export_receipt_id,
      item.product_id,
      item.quantity,
      item.unit_price,
      item.subtotal,
      item.note
    ]);

    const query = `
      INSERT INTO export_receipt_items (export_receipt_id, product_id, quantity, unit_price, subtotal, note)
      VALUES ?
    `;
    const [result] = await conn.query(query, [values]);
    return result;
  }

  static async update(id, itemData, connection = null) {
    const conn = connection || pool;
    const fields = [];
    const params = [];

    if (itemData.quantity !== undefined) {
      fields.push('quantity = ?');
      params.push(itemData.quantity);
    }
    if (itemData.unit_price !== undefined) {
      fields.push('unit_price = ?');
      params.push(itemData.unit_price);
    }
    if (itemData.subtotal !== undefined) {
      fields.push('subtotal = ?');
      params.push(itemData.subtotal);
    }
    if (itemData.note !== undefined) {
      fields.push('note = ?');
      params.push(itemData.note);
    }

    if (fields.length === 0) return true;

    params.push(id);
    const query = `UPDATE export_receipt_items SET ${fields.join(', ')} WHERE id = ?`;
    await conn.query(query, params);
    return true;
  }

  static async delete(id, connection = null) {
    const conn = connection || pool;
    const query = 'DELETE FROM export_receipt_items WHERE id = ?';
    const [result] = await conn.query(query, [id]);
    return result.affectedRows > 0;
  }

  static async deleteByReceiptId(receiptId, connection = null) {
    const conn = connection || pool;
    const query = 'DELETE FROM export_receipt_items WHERE export_receipt_id = ?';
    const [result] = await conn.query(query, [receiptId]);
    return result.affectedRows > 0;
  }
}

module.exports = ExportReceiptItem;
