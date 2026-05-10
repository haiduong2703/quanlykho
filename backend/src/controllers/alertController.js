const pool = require('../config/db');
const Batch = require('../models/Batch');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const alertController = {
  // Cảnh báo tồn tối thiểu
  async lowStock(req, res) {
    try {
      const [rows] = await pool.query(
        `SELECT p.id AS product_id, p.sku, p.name, p.unit, p.min_stock, p.max_stock,
                COALESCE(s.quantity, 0) AS quantity
         FROM products p
         LEFT JOIN stocks s ON s.product_id = p.id
         WHERE p.is_active = TRUE
           AND p.min_stock > 0
           AND COALESCE(s.quantity, 0) <= p.min_stock
         ORDER BY (COALESCE(s.quantity, 0) - p.min_stock) ASC`
      );
      return successResponse(res, rows, 'Low stock products');
    } catch (error) { return errorResponse(res, error.message, 500); }
  },

  // Cảnh báo vượt tồn tối đa
  async overStock(req, res) {
    try {
      const [rows] = await pool.query(
        `SELECT p.id AS product_id, p.sku, p.name, p.unit, p.min_stock, p.max_stock,
                COALESCE(s.quantity, 0) AS quantity
         FROM products p
         LEFT JOIN stocks s ON s.product_id = p.id
         WHERE p.is_active = TRUE
           AND p.max_stock > 0
           AND COALESCE(s.quantity, 0) >= p.max_stock
         ORDER BY (COALESCE(s.quantity, 0) - p.max_stock) DESC`
      );
      return successResponse(res, rows, 'Over stock products');
    } catch (error) { return errorResponse(res, error.message, 500); }
  },

  // Lô sắp hết hạn
  async expiringBatches(req, res) {
    try {
      const days = parseInt(req.query.days) || 30;
      const items = await Batch.findExpiringSoon(days);
      return successResponse(res, items, `Batches expiring in ${days} days`);
    } catch (error) { return errorResponse(res, error.message, 500); }
  },

  // Lô đã hết hạn (cần xuất hủy)
  async expiredBatches(req, res) {
    try {
      const [rows] = await pool.query(
        `SELECT b.*, p.sku AS product_sku, p.name AS product_name
         FROM batches b
         JOIN products p ON b.product_id = p.id
         WHERE b.status = 'ACTIVE'
           AND b.remaining_quantity > 0
           AND b.expiry_date IS NOT NULL
           AND b.expiry_date < CURDATE()
         ORDER BY b.expiry_date ASC`
      );
      return successResponse(res, rows, 'Expired batches');
    } catch (error) { return errorResponse(res, error.message, 500); }
  },

  // Tổng hợp cảnh báo cho dashboard
  async summary(req, res) {
    try {
      const [[low]] = await pool.query(
        `SELECT COUNT(*) AS cnt FROM products p
         LEFT JOIN stocks s ON s.product_id = p.id
         WHERE p.is_active = TRUE AND p.min_stock > 0 AND COALESCE(s.quantity,0) <= p.min_stock`
      );
      const [[over]] = await pool.query(
        `SELECT COUNT(*) AS cnt FROM products p
         LEFT JOIN stocks s ON s.product_id = p.id
         WHERE p.is_active = TRUE AND p.max_stock > 0 AND COALESCE(s.quantity,0) >= p.max_stock`
      );
      const [[expiring]] = await pool.query(
        `SELECT COUNT(*) AS cnt FROM batches
         WHERE status = 'ACTIVE' AND remaining_quantity > 0
           AND expiry_date IS NOT NULL
           AND expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)`
      );
      const [[expired]] = await pool.query(
        `SELECT COUNT(*) AS cnt FROM batches
         WHERE status = 'ACTIVE' AND remaining_quantity > 0
           AND expiry_date IS NOT NULL AND expiry_date < CURDATE()`
      );
      return successResponse(res, {
        low_stock: low.cnt,
        over_stock: over.cnt,
        expiring_soon_30d: expiring.cnt,
        expired: expired.cnt
      }, 'Alert summary');
    } catch (error) { return errorResponse(res, error.message, 500); }
  }
};

module.exports = alertController;
