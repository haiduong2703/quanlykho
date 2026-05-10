const WarehouseLocation = require('../models/WarehouseLocation');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHelper');

const locationController = {
  async getList(req, res, next) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        search: req.query.search,
        warehouse_id: req.query.warehouse_id,
        zone: req.query.zone,
        is_active: req.query.is_active !== undefined ? req.query.is_active === 'true' : undefined
      };
      const [items, total] = await Promise.all([
        WarehouseLocation.findAll(filters),
        WarehouseLocation.count(filters)
      ]);
      return paginatedResponse(res, items, { page: filters.page, limit: filters.limit, total });
    } catch (err) { next(err); }
  },

  async getByWarehouse(req, res, next) {
    try {
      const items = await WarehouseLocation.findByWarehouse(req.params.warehouseId);
      return successResponse(res, items, 'Locations retrieved successfully');
    } catch (err) { next(err); }
  },

  async getById(req, res, next) {
    try {
      const loc = await WarehouseLocation.findById(req.params.id);
      if (!loc) return errorResponse(res, 'Location not found', 404);
      return successResponse(res, loc, 'Location retrieved successfully');
    } catch (err) { next(err); }
  },

  async create(req, res, next) {
    try {
      const { warehouse_id, zone, aisle, rack, shelf, bin, description, capacity, is_active } = req.body;
      let { code } = req.body;
      if (!warehouse_id) return errorResponse(res, 'warehouse_id là bắt buộc', 400);
      if (!zone) return errorResponse(res, 'zone là bắt buộc', 400);
      if (!code) code = WarehouseLocation.buildCode({ zone, aisle, rack, shelf, bin });
      if (!code) return errorResponse(res, 'Không tạo được code location', 400);
      const existing = await WarehouseLocation.findByCode(warehouse_id, code);
      if (existing) return errorResponse(res, 'Mã vị trí đã tồn tại trong kho này', 400);
      const created = await WarehouseLocation.create({
        warehouse_id, code, zone, aisle, rack, shelf, bin, description, capacity, is_active
      });
      return successResponse(res, created, 'Location created successfully', 201);
    } catch (err) { next(err); }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const loc = await WarehouseLocation.findById(id);
      if (!loc) return errorResponse(res, 'Location not found', 404);
      if (req.body.code && req.body.code !== loc.code) {
        const existing = await WarehouseLocation.findByCode(loc.warehouse_id, req.body.code);
        if (existing) return errorResponse(res, 'Mã vị trí đã tồn tại trong kho này', 400);
      }
      const updated = await WarehouseLocation.update(id, req.body);
      return successResponse(res, updated, 'Location updated successfully');
    } catch (err) { next(err); }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const loc = await WarehouseLocation.findById(id);
      if (!loc) return errorResponse(res, 'Location not found', 404);
      await WarehouseLocation.delete(id);
      return successResponse(res, null, 'Location deleted successfully');
    } catch (err) {
      if (err && err.code === 'ER_ROW_IS_REFERENCED_2') {
        return errorResponse(res, 'Không thể xoá: vị trí đang được sử dụng', 400);
      }
      next(err);
    }
  }
};

module.exports = locationController;
