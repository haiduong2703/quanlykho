const transferService = require('../services/transferService');
const AuditLog = require('../models/AuditLog');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHelper');

const transferController = {
  async list(req, res) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        search: req.query.search,
        status: req.query.status,
        from_warehouse_id: req.query.from_warehouse_id,
        to_warehouse_id: req.query.to_warehouse_id,
        from_date: req.query.from_date,
        to_date: req.query.to_date
      };
      const { items, total } = await transferService.list(filters);
      return paginatedResponse(res, items, { page: filters.page, limit: filters.limit, total });
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  },

  async getById(req, res) {
    try {
      const r = await transferService.getById(req.params.id);
      return successResponse(res, r);
    } catch (error) {
      return errorResponse(res, error.message, 404);
    }
  },

  async create(req, res) {
    try {
      const r = await transferService.create(req.user.id, req.body);
      await AuditLog.log(req, 'CREATE', 'TRANSFER_RECEIPT', r.id, r.receipt_code, {
        from: r.from_warehouse_id, to: r.to_warehouse_id, items: req.body.items?.length
      });
      return successResponse(res, r, 'Transfer created', 201);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  },

  async approve(req, res) {
    try {
      const r = await transferService.approve(req.params.id, req.user.id);
      await AuditLog.log(req, 'APPROVE', 'TRANSFER_RECEIPT', r.id, r.receipt_code);
      return successResponse(res, r, 'Transfer approved');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  },

  async receive(req, res) {
    try {
      const r = await transferService.receive(req.params.id, req.user.id);
      await AuditLog.log(req, 'RECEIVE', 'TRANSFER_RECEIPT', r.id, r.receipt_code);
      return successResponse(res, r, 'Transfer received');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  },

  async reject(req, res) {
    try {
      const r = await transferService.reject(req.params.id, req.user.id, req.body.reason);
      await AuditLog.log(req, 'REJECT', 'TRANSFER_RECEIPT', r.id, r.receipt_code, { reason: req.body.reason });
      return successResponse(res, r, 'Transfer rejected');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  },

  async cancel(req, res) {
    try {
      const r = await transferService.cancel(req.params.id);
      await AuditLog.log(req, 'CANCEL', 'TRANSFER_RECEIPT', r.id, r.receipt_code);
      return successResponse(res, r, 'Transfer cancelled');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }
};

module.exports = transferController;
