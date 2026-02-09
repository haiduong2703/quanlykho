const importService = require('../services/importService');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHelper');
const AuditLog = require('../models/AuditLog');

class ImportController {
  async getImportReceipts(req, res) {
    try {
      const { receipts, total } = await importService.getImportReceipts(req.query);
      return paginatedResponse(res, receipts, { ...req.query, total });
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getImportReceiptById(req, res) {
    try {
      const receipt = await importService.getImportReceiptById(req.params.id);
      return successResponse(res, receipt);
    } catch (error) {
      return errorResponse(res, error.message, 404);
    }
  }

  async createImportReceipt(req, res) {
    try {
      const receipt = await importService.createImportReceipt(req.user.id, req.body);

      // Log import creation
      await AuditLog.log(req, 'IMPORT', 'IMPORT_RECEIPT', receipt.id, receipt.receipt_code, {
        supplier: req.body.supplier_name,
        total: receipt.total_amount,
        items_count: req.body.items?.length
      });

      return successResponse(res, receipt, 'Import receipt created successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async deleteImportReceipt(req, res) {
    try {
      const receipt = await importService.getImportReceiptById(req.params.id);
      await importService.deleteImportReceipt(req.params.id);

      // Log deletion
      await AuditLog.log(req, 'DELETE', 'IMPORT_RECEIPT', req.params.id, receipt.receipt_code);

      return successResponse(res, null, 'Import receipt deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }
}

module.exports = new ImportController();
