const pool = require('../config/db');
const Stock = require('../models/Stock');
const ImportReceipt = require('../models/ImportReceipt');
const ExportReceipt = require('../models/ExportReceipt');
const { exportToCSV } = require('../utils/csvExport');
const moment = require('moment');

class ReportService {
  async getInventoryReport(filters = {}) {
    const stocks = await Stock.findAll({ ...filters, limit: 1000 });
    return stocks;
  }

  async getImportExportReport(filters = {}) {
    const { from_date, to_date } = filters;

    const imports = await ImportReceipt.findAll({ from_date, to_date, limit: 1000 });
    const exports = await ExportReceipt.findAll({ from_date, to_date, limit: 1000 });

    const totalImportAmount = await ImportReceipt.getTotalAmount({ from_date, to_date });
    const totalExportAmount = await ExportReceipt.getTotalAmount({ from_date, to_date });

    return {
      imports,
      exports,
      summary: {
        total_import_amount: totalImportAmount,
        total_export_amount: totalExportAmount,
        total_imports: imports.length,
        total_exports: exports.length
      }
    };
  }

  async getSupplierStats(filters = {}) {
    const { from_date, to_date } = filters;
    const params = [];
    const joinConditions = ['(s.id = ir.supplier_id OR (ir.supplier_id IS NULL AND ir.supplier_name = s.name))'];

    if (from_date) {
      joinConditions.push('ir.import_date >= ?');
      params.push(from_date);
    }
    if (to_date) {
      joinConditions.push('ir.import_date <= ?');
      params.push(to_date + ' 23:59:59');
    }

    const query = `
      SELECT
        s.id, s.code, s.name, s.phone, s.email,
        COUNT(DISTINCT ir.id) as total_receipts,
        COALESCE(SUM(ir.total_amount), 0) as total_amount,
        MAX(ir.import_date) as last_import_date
      FROM suppliers s
      LEFT JOIN import_receipts ir ON ${joinConditions.join(' AND ')}
      GROUP BY s.id, s.code, s.name, s.phone, s.email
      ORDER BY total_amount DESC
    `;

    const [rows] = await pool.query(query, params);
    return rows;
  }

  async getCustomerStats(filters = {}) {
    const { from_date, to_date } = filters;
    const params = [];
    const joinConditions = ['(c.id = er.customer_id OR (er.customer_id IS NULL AND er.customer_name = c.name))'];

    if (from_date) {
      joinConditions.push('er.export_date >= ?');
      params.push(from_date);
    }
    if (to_date) {
      joinConditions.push('er.export_date <= ?');
      params.push(to_date + ' 23:59:59');
    }

    const query = `
      SELECT
        c.id, c.code, c.name, c.phone, c.email,
        COUNT(DISTINCT er.id) as total_receipts,
        COALESCE(SUM(er.total_amount), 0) as total_amount,
        MAX(er.export_date) as last_export_date
      FROM customers c
      LEFT JOIN export_receipts er ON ${joinConditions.join(' AND ')}
      GROUP BY c.id, c.code, c.name, c.phone, c.email
      ORDER BY total_amount DESC
    `;

    const [rows] = await pool.query(query, params);
    return rows;
  }

  async exportInventoryToCSV() {
    const stocks = await Stock.findAll({ limit: 10000 });

    const headers = [
      { id: 'sku', title: 'SKU' },
      { id: 'name', title: 'Product Name' },
      { id: 'category_name', title: 'Category' },
      { id: 'unit', title: 'Unit' },
      { id: 'quantity', title: 'Quantity' },
      { id: 'min_stock', title: 'Min Stock' },
      { id: 'price', title: 'Price' }
    ];

    const filename = `inventory_report_${moment().format('YYYYMMDD_HHmmss')}.csv`;
    const filepath = await exportToCSV(stocks, headers, filename);

    return { filepath, filename };
  }
}

module.exports = new ReportService();
