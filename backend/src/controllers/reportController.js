const reportService = require('../services/reportService');
const pool = require('../config/db');
const StockMovement = require('../models/StockMovement');
const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/responseHelper');

class ReportController {
  async getInventoryReport(req, res) {
    try {
      const report = await reportService.getInventoryReport(req.query);
      return successResponse(res, report);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getImportExportReport(req, res) {
    try {
      const report = await reportService.getImportExportReport(req.query);
      return successResponse(res, report);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getSupplierStats(req, res) {
    try {
      const stats = await reportService.getSupplierStats(req.query);
      return successResponse(res, stats);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getCustomerStats(req, res) {
    try {
      const stats = await reportService.getCustomerStats(req.query);
      return successResponse(res, stats);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  // Thẻ kho: lịch sử biến động 1 SKU
  async getStockCard(req, res) {
    try {
      const { productId } = req.params;
      const product = await Product.findByIdWithCategory(productId);
      if (!product) return errorResponse(res, 'Product not found', 404);

      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 50,
        type: req.query.type,
        from_date: req.query.from_date,
        to_date: req.query.to_date
      };
      const [movements, total, stockRow] = await Promise.all([
        StockMovement.findByProductId(productId, filters),
        StockMovement.countByProductId(productId, filters),
        pool.query('SELECT quantity FROM stocks WHERE product_id = ?', [productId])
      ]);

      return successResponse(res, {
        product,
        current_stock: stockRow[0][0]?.quantity || 0,
        movements,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total,
          totalPages: Math.ceil(total / filters.limit)
        }
      });
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  // Phân tích ABC: sắp xếp sản phẩm theo doanh thu xuất, gán nhóm A/B/C theo Pareto (70/20/10)
  async getABCAnalysis(req, res) {
    try {
      const { from_date, to_date, metric } = req.query;
      const useQty = metric === 'quantity';
      const whereParts = ["er.status = 'APPROVED'"];
      const params = [];
      if (from_date) { whereParts.push('er.export_date >= ?'); params.push(from_date); }
      if (to_date) { whereParts.push('er.export_date <= ?'); params.push(to_date + ' 23:59:59'); }

      const [rows] = await pool.query(
        `SELECT p.id AS product_id, p.sku, p.name, p.unit, c.name AS category_name,
                SUM(eri.quantity) AS total_quantity,
                SUM(eri.subtotal) AS total_revenue,
                COUNT(DISTINCT er.id) AS export_count
         FROM export_receipt_items eri
         JOIN export_receipts er ON eri.export_receipt_id = er.id
         JOIN products p ON eri.product_id = p.id
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE ${whereParts.join(' AND ')}
         GROUP BY p.id, p.sku, p.name, p.unit, c.name
         ORDER BY ${useQty ? 'total_quantity' : 'total_revenue'} DESC`,
        params
      );

      const grandTotal = rows.reduce((sum, r) => sum + Number(useQty ? r.total_quantity : r.total_revenue), 0);
      let cumulative = 0;
      const classified = rows.map((r) => {
        const value = Number(useQty ? r.total_quantity : r.total_revenue);
        cumulative += value;
        const cumulativePct = grandTotal > 0 ? (cumulative / grandTotal) * 100 : 0;
        let abc_class;
        if (cumulativePct <= 70) abc_class = 'A';
        else if (cumulativePct <= 90) abc_class = 'B';
        else abc_class = 'C';
        return {
          ...r,
          total_quantity: Number(r.total_quantity),
          total_revenue: Number(r.total_revenue),
          export_count: Number(r.export_count),
          percentage: grandTotal > 0 ? (value / grandTotal) * 100 : 0,
          cumulative_percentage: cumulativePct,
          abc_class
        };
      });

      const summary = {
        A: classified.filter((r) => r.abc_class === 'A').length,
        B: classified.filter((r) => r.abc_class === 'B').length,
        C: classified.filter((r) => r.abc_class === 'C').length,
        total_products: classified.length,
        grand_total: grandTotal,
        metric: useQty ? 'quantity' : 'revenue'
      };

      return successResponse(res, { summary, items: classified });
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async exportInventoryCSV(req, res) {
    try {
      const { filepath, filename } = await reportService.exportInventoryToCSV();
      res.download(filepath, filename);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
}

module.exports = new ReportController();
