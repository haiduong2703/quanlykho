const inventoryCheckService = require('../services/inventoryCheckService');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHelper');
const AuditLog = require('../models/AuditLog');

class InventoryCheckController {
  async getInventoryChecks(req, res) {
    try {
      const { checks, total } = await inventoryCheckService.getInventoryChecks(req.query);
      return paginatedResponse(res, checks, { ...req.query, total });
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getInventoryCheckById(req, res) {
    try {
      const check = await inventoryCheckService.getInventoryCheckById(req.params.id);
      return successResponse(res, check);
    } catch (error) {
      return errorResponse(res, error.message, 404);
    }
  }

  async createInventoryCheck(req, res) {
    try {
      const check = await inventoryCheckService.createInventoryCheck(req.user.id, req.body);

      // Log creation
      await AuditLog.log(req, 'CREATE', 'INVENTORY_CHECK', check.id, check.check_code, {
        total_products: check.total_products,
        total_difference: check.total_difference
      });

      return successResponse(res, check, 'Inventory check created successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async completeInventoryCheck(req, res) {
    try {
      const check = await inventoryCheckService.completeInventoryCheck(req.params.id);

      // Log completion
      await AuditLog.log(req, 'COMPLETE', 'INVENTORY_CHECK', check.id, check.check_code, {
        total_products: check.total_products,
        total_difference: check.total_difference
      });

      return successResponse(res, check, 'Inventory check completed and stock adjusted');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async cancelInventoryCheck(req, res) {
    try {
      const check = await inventoryCheckService.cancelInventoryCheck(req.params.id);

      // Log cancellation
      await AuditLog.log(req, 'CANCEL', 'INVENTORY_CHECK', check.id, check.check_code);

      return successResponse(res, check, 'Inventory check cancelled');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async deleteInventoryCheck(req, res) {
    try {
      const check = await inventoryCheckService.getInventoryCheckById(req.params.id);
      await inventoryCheckService.deleteInventoryCheck(req.params.id);

      // Log deletion
      await AuditLog.log(req, 'DELETE', 'INVENTORY_CHECK', req.params.id, check.check_code);

      return successResponse(res, null, 'Inventory check deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async getProductsForCheck(req, res) {
    try {
      const products = await inventoryCheckService.getProductsForCheck(req.query);
      return successResponse(res, products);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
}

module.exports = new InventoryCheckController();
