const pool = require('../config/db');
const Product = require('../models/Product');
const Stock = require('../models/Stock');
const ImportReceipt = require('../models/ImportReceipt');
const ExportReceipt = require('../models/ExportReceipt');

class DashboardService {
  async getStats() {
    // Total products
    const totalProducts = await Product.count({ is_active: true });

    // Total import receipts
    const totalImportReceipts = await ImportReceipt.count({});

    // Total export receipts
    const totalExportReceipts = await ExportReceipt.count({});

    // Low stock products count
    const lowStockProducts = await Stock.findLowStock();

    // Total stock value
    const totalStockValue = await Stock.getTotalStockValue();

    return {
      total_products: totalProducts,
      total_import_receipts: totalImportReceipts,
      total_export_receipts: totalExportReceipts,
      low_stock_count: lowStockProducts.length,
      total_stock_value: totalStockValue
    };
  }

  async getLowStockAlerts() {
    return await Stock.findLowStock();
  }

  async getRecentActivities() {
    const query = `
      (SELECT 'import' as type, receipt_code, total_amount, import_date as date, supplier_name as party_name
       FROM import_receipts
       ORDER BY import_date DESC LIMIT 5)
      UNION ALL
      (SELECT 'export' as type, receipt_code, total_amount, export_date as date, customer_name as party_name
       FROM export_receipts
       ORDER BY export_date DESC LIMIT 5)
      ORDER BY date DESC LIMIT 10
    `;
    const [activities] = await pool.query(query);
    return activities;
  }

  // Thống kê nhập xuất theo tháng (6 tháng gần nhất)
  async getMonthlyStats() {
    const query = `
      SELECT
        months.month,
        months.year,
        COALESCE(imports.total, 0) as import_total,
        COALESCE(imports.count, 0) as import_count,
        COALESCE(exports.total, 0) as export_total,
        COALESCE(exports.count, 0) as export_count
      FROM (
        SELECT MONTH(DATE_SUB(CURDATE(), INTERVAL n MONTH)) as month,
               YEAR(DATE_SUB(CURDATE(), INTERVAL n MONTH)) as year
        FROM (SELECT 0 as n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) numbers
      ) months
      LEFT JOIN (
        SELECT MONTH(import_date) as month, YEAR(import_date) as year,
               SUM(total_amount) as total, COUNT(*) as count
        FROM import_receipts
        WHERE import_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY YEAR(import_date), MONTH(import_date)
      ) imports ON months.month = imports.month AND months.year = imports.year
      LEFT JOIN (
        SELECT MONTH(export_date) as month, YEAR(export_date) as year,
               SUM(total_amount) as total, COUNT(*) as count
        FROM export_receipts
        WHERE export_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY YEAR(export_date), MONTH(export_date)
      ) exports ON months.month = exports.month AND months.year = exports.year
      ORDER BY months.year, months.month
    `;
    const [stats] = await pool.query(query);
    return stats;
  }

  // Thống kê sản phẩm theo danh mục
  async getCategoryStats() {
    const query = `
      SELECT
        c.name as category_name,
        COUNT(p.id) as product_count,
        COALESCE(SUM(s.quantity), 0) as total_quantity,
        COALESCE(SUM(s.quantity * p.price), 0) as total_value
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
      LEFT JOIN stocks s ON p.id = s.product_id
      WHERE c.is_active = 1
      GROUP BY c.id, c.name
      ORDER BY total_value DESC
      LIMIT 10
    `;
    const [stats] = await pool.query(query);
    return stats;
  }

  // Top sản phẩm xuất nhiều nhất
  async getTopExportProducts() {
    const query = `
      SELECT
        p.id,
        p.sku,
        p.name,
        SUM(ed.quantity) as total_exported,
        SUM(ed.subtotal) as total_revenue
      FROM export_receipt_details ed
      JOIN products p ON ed.product_id = p.id
      JOIN export_receipts er ON ed.export_receipt_id = er.id
      WHERE er.export_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY p.id, p.sku, p.name
      ORDER BY total_exported DESC
      LIMIT 5
    `;
    const [products] = await pool.query(query);
    return products;
  }
}

module.exports = new DashboardService();
