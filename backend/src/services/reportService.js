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
