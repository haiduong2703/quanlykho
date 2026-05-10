const StockByLocation = require('../models/StockByLocation');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHelper');

const stockLocationController = {
  async getList(req, res, next) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        product_id: req.query.product_id,
        warehouse_id: req.query.warehouse_id,
        location_id: req.query.location_id,
        batch_id: req.query.batch_id,
        only_positive: req.query.only_positive !== 'false'
      };
      const [items, total] = await Promise.all([
        StockByLocation.findAll(filters),
        StockByLocation.count(filters)
      ]);
      return paginatedResponse(res, items, { page: filters.page, limit: filters.limit, total });
    } catch (err) { next(err); }
  },

  async getSummaryByProduct(req, res, next) {
    try {
      const { productId } = req.params;
      const rows = await StockByLocation.summaryByProduct(productId);
      const total = await StockByLocation.totalByProduct(productId);
      return successResponse(res, { summary: rows, total }, 'Stock summary retrieved');
    } catch (err) { next(err); }
  }
};

module.exports = stockLocationController;
