const Batch = require('../models/Batch');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHelper');

const batchController = {
  async getList(req, res, next) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        search: req.query.search,
        product_id: req.query.product_id,
        warehouse_id: req.query.warehouse_id,
        status: req.query.status,
        only_available: req.query.only_available === 'true',
        expiry_before: req.query.expiry_before,
        expiry_after: req.query.expiry_after
      };
      const [items, total] = await Promise.all([
        Batch.findAll(filters),
        Batch.count(filters)
      ]);
      return paginatedResponse(res, items, { page: filters.page, limit: filters.limit, total });
    } catch (err) { next(err); }
  },

  async getById(req, res, next) {
    try {
      const b = await Batch.findById(req.params.id);
      if (!b) return errorResponse(res, 'Batch not found', 404);
      return successResponse(res, b, 'Batch retrieved successfully');
    } catch (err) { next(err); }
  },

  async getAvailableByProduct(req, res, next) {
    try {
      const { productId } = req.params;
      const mode = (req.query.mode || 'FIFO').toUpperCase();
      const warehouseId = req.query.warehouse_id || null;
      const items = mode === 'LIFO'
        ? await Batch.findAvailableLIFO(productId, warehouseId)
        : await Batch.findAvailableFIFO(productId, warehouseId);
      return successResponse(res, items, `${mode} batches retrieved`);
    } catch (err) { next(err); }
  },

  async getExpiringSoon(req, res, next) {
    try {
      const days = parseInt(req.query.days) || 30;
      const items = await Batch.findExpiringSoon(days);
      return successResponse(res, items, 'Expiring batches retrieved');
    } catch (err) { next(err); }
  },

  async create(req, res, next) {
    try {
      const data = req.body;
      if (!data.batch_code || !data.product_id) {
        return errorResponse(res, 'batch_code và product_id là bắt buộc', 400);
      }
      const existing = await Batch.findByProductBatch(data.product_id, data.batch_code);
      if (existing) return errorResponse(res, 'Mã lô đã tồn tại cho sản phẩm này', 400);
      const id = await Batch.create(data);
      const created = await Batch.findById(id);
      return successResponse(res, created, 'Batch created successfully', 201);
    } catch (err) { next(err); }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const b = await Batch.findById(id);
      if (!b) return errorResponse(res, 'Batch not found', 404);
      const updated = await Batch.update(id, req.body);
      return successResponse(res, updated, 'Batch updated successfully');
    } catch (err) { next(err); }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const b = await Batch.findById(id);
      if (!b) return errorResponse(res, 'Batch not found', 404);
      await Batch.delete(id);
      return successResponse(res, null, 'Batch deleted successfully');
    } catch (err) {
      if (err && err.code === 'ER_ROW_IS_REFERENCED_2') {
        return errorResponse(res, 'Không thể xoá: lô đang có tồn hoặc đã được tham chiếu', 400);
      }
      next(err);
    }
  }
};

module.exports = batchController;
