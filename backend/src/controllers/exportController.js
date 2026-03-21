const exportService = require('../services/exportService');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHelper');
const AuditLog = require('../models/AuditLog');

class ExportController {
  async getExportReceipts(req, res) {
    try {
      const { receipts, total } = await exportService.getExportReceipts(req.query);
      return paginatedResponse(res, receipts, { ...req.query, total });
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getExportReceiptById(req, res) {
    try {
      const receipt = await exportService.getExportReceiptById(req.params.id);
      return successResponse(res, receipt);
    } catch (error) {
      return errorResponse(res, error.message, 404);
    }
  }

  async createExportReceipt(req, res) {
    try {
      const receipt = await exportService.createExportReceipt(req.user.id, req.body);

      // Log export creation
      await AuditLog.log(req, 'EXPORT', 'EXPORT_RECEIPT', receipt.id, receipt.receipt_code, {
        customer: req.body.customer_name,
        total: receipt.total_amount,
        items_count: req.body.items?.length
      });

      return successResponse(res, receipt, 'Export receipt created successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async updateExportReceipt(req, res) {
    try {
      const receipt = await exportService.updateExportReceipt(req.params.id, req.user.id, req.body);

      await AuditLog.log(req, 'UPDATE', 'EXPORT_RECEIPT', receipt.id, receipt.receipt_code, {
        customer: req.body.customer_name,
        total: receipt.total_amount
      });

      return successResponse(res, receipt, 'Export receipt updated successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async approveExportReceipt(req, res) {
    try {
      const receipt = await exportService.approveExportReceipt(req.params.id, req.user.id);

      await AuditLog.log(req, 'APPROVE', 'EXPORT_RECEIPT', receipt.id, receipt.receipt_code, {
        approved_by: req.user.full_name
      });

      return successResponse(res, receipt, 'Export receipt approved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async rejectExportReceipt(req, res) {
    try {
      const receipt = await exportService.rejectExportReceipt(req.params.id, req.user.id, req.body.reason);

      await AuditLog.log(req, 'REJECT', 'EXPORT_RECEIPT', receipt.id, receipt.receipt_code, {
        reason: req.body.reason
      });

      return successResponse(res, receipt, 'Export receipt rejected');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async deleteExportReceipt(req, res) {
    try {
      const receipt = await exportService.getExportReceiptById(req.params.id);
      await exportService.deleteExportReceipt(req.params.id);

      // Log deletion
      await AuditLog.log(req, 'DELETE', 'EXPORT_RECEIPT', req.params.id, receipt.receipt_code);

      return successResponse(res, null, 'Export receipt deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }
}

module.exports = new ExportController();
