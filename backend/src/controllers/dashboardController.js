const dashboardService = require('../services/dashboardService');
const { successResponse, errorResponse } = require('../utils/responseHelper');

class DashboardController {
  async getStats(req, res) {
    try {
      const stats = await dashboardService.getStats();
      return successResponse(res, stats);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getLowStockAlerts(req, res) {
    try {
      const alerts = await dashboardService.getLowStockAlerts();
      return successResponse(res, alerts);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getRecentActivities(req, res) {
    try {
      const activities = await dashboardService.getRecentActivities();
      return successResponse(res, activities);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getMonthlyStats(req, res) {
    try {
      const stats = await dashboardService.getMonthlyStats();
      return successResponse(res, stats);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getCategoryStats(req, res) {
    try {
      const stats = await dashboardService.getCategoryStats();
      return successResponse(res, stats);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getTopExportProducts(req, res) {
    try {
      const products = await dashboardService.getTopExportProducts();
      return successResponse(res, products);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
}

module.exports = new DashboardController();
