const stockService = require('../services/stockService');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHelper');

class StockController {
  async getStocks(req, res) {
    try {
      const { stocks, total } = await stockService.getStocks(req.query);
      return paginatedResponse(res, stocks, { ...req.query, total });
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getStockByProductId(req, res) {
    try {
      const stock = await stockService.getStockByProductId(req.params.id);
      return successResponse(res, stock);
    } catch (error) {
      return errorResponse(res, error.message, 404);
    }
  }

  async getLowStockAlerts(req, res) {
    try {
      const stocks = await stockService.getLowStockAlerts();
      return successResponse(res, stocks);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
}

module.exports = new StockController();
