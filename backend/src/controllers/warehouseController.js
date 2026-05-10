const Warehouse = require('../models/Warehouse');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHelper');

const warehouseController = {
  async getWarehouses(req, res, next) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        search: req.query.search,
        is_active: req.query.is_active !== undefined ? req.query.is_active === 'true' : undefined
      };
      const [items, total] = await Promise.all([
        Warehouse.findAll(filters),
        Warehouse.count(filters)
      ]);
      return paginatedResponse(res, items, { page: filters.page, limit: filters.limit, total });
    } catch (err) { next(err); }
  },

  async getAllActive(req, res, next) {
    try {
      const items = await Warehouse.findAllActive();
      return successResponse(res, items, 'Active warehouses retrieved successfully');
    } catch (err) { next(err); }
  },

  async getById(req, res, next) {
    try {
      const wh = await Warehouse.findById(req.params.id);
      if (!wh) return errorResponse(res, 'Warehouse not found', 404);
      return successResponse(res, wh, 'Warehouse retrieved successfully');
    } catch (err) { next(err); }
  },

  async create(req, res, next) {
    try {
      const { code, name, address, phone, manager_user_id, is_default, is_active, note } = req.body;
      if (!name) return errorResponse(res, 'Tên kho là bắt buộc', 400);
      const whCode = code || await Warehouse.generateCode();
      const existing = await Warehouse.findByCode(whCode);
      if (existing) return errorResponse(res, 'Mã kho đã tồn tại', 400);
      const created = await Warehouse.create({
        code: whCode, name, address, phone, manager_user_id, is_default, is_active, note
      });
      return successResponse(res, created, 'Warehouse created successfully', 201);
    } catch (err) { next(err); }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const wh = await Warehouse.findById(id);
      if (!wh) return errorResponse(res, 'Warehouse not found', 404);
      if (req.body.code && req.body.code !== wh.code) {
        const existing = await Warehouse.findByCode(req.body.code);
        if (existing) return errorResponse(res, 'Mã kho đã tồn tại', 400);
      }
      const updated = await Warehouse.update(id, req.body);
      return successResponse(res, updated, 'Warehouse updated successfully');
    } catch (err) { next(err); }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const wh = await Warehouse.findById(id);
      if (!wh) return errorResponse(res, 'Warehouse not found', 404);
      await Warehouse.delete(id);
      return successResponse(res, null, 'Warehouse deleted successfully');
    } catch (err) {
      if (err && err.code === 'ER_ROW_IS_REFERENCED_2') {
        return errorResponse(res, 'Không thể xoá: kho còn tồn kho hoặc đã phát sinh giao dịch', 400);
      }
      if (err && /kho mặc định/.test(err.message)) {
        return errorResponse(res, err.message, 400);
      }
      next(err);
    }
  },

  async toggleStatus(req, res, next) {
    try {
      const { id } = req.params;
      const wh = await Warehouse.findById(id);
      if (!wh) return errorResponse(res, 'Warehouse not found', 404);
      const updated = await Warehouse.toggleStatus(id);
      return successResponse(res, updated, `Warehouse ${updated.is_active ? 'activated' : 'deactivated'} successfully`);
    } catch (err) { next(err); }
  }
};

module.exports = warehouseController;
