const reportService = require('../services/reportService');
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
