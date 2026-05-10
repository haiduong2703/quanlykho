const ProductUnit = require('../models/ProductUnit');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const productUnitController = {
  async getByProduct(req, res, next) {
    try {
      const items = await ProductUnit.findByProduct(req.params.productId);
      return successResponse(res, items, 'Units retrieved successfully');
    } catch (err) { next(err); }
  },

  async findByBarcode(req, res, next) {
    try {
      const { barcode } = req.query;
      if (!barcode) return errorResponse(res, 'barcode là bắt buộc', 400);
      const unit = await ProductUnit.findByBarcode(barcode);
      if (!unit) return errorResponse(res, 'Không tìm thấy đơn vị theo barcode', 404);
      return successResponse(res, unit, 'Unit resolved from barcode');
    } catch (err) { next(err); }
  },

  async create(req, res, next) {
    try {
      const { product_id, unit_name } = req.body;
      if (!product_id || !unit_name) return errorResponse(res, 'product_id và unit_name là bắt buộc', 400);
      const created = await ProductUnit.create(req.body);
      return successResponse(res, created, 'Unit created successfully', 201);
    } catch (err) {
      if (err && err.code === 'ER_DUP_ENTRY') return errorResponse(res, 'Đơn vị đã tồn tại cho sản phẩm này', 400);
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const u = await ProductUnit.findById(id);
      if (!u) return errorResponse(res, 'Unit not found', 404);
      const updated = await ProductUnit.update(id, req.body);
      return successResponse(res, updated, 'Unit updated successfully');
    } catch (err) { next(err); }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const u = await ProductUnit.findById(id);
      if (!u) return errorResponse(res, 'Unit not found', 404);
      await ProductUnit.delete(id);
      return successResponse(res, null, 'Unit deleted successfully');
    } catch (err) {
      if (err && /đơn vị cơ sở/.test(err.message)) return errorResponse(res, err.message, 400);
      next(err);
    }
  },

  async convert(req, res, next) {
    try {
      const { product_id, from_unit, to_unit, quantity } = req.body;
      if (!product_id || !from_unit || !to_unit || quantity === undefined) {
        return errorResponse(res, 'product_id, from_unit, to_unit, quantity là bắt buộc', 400);
      }
      const result = await ProductUnit.convert(product_id, from_unit, to_unit, Number(quantity));
      return successResponse(res, { converted_quantity: result }, 'Converted successfully');
    } catch (err) {
      if (err && /không tồn tại/.test(err.message)) return errorResponse(res, err.message, 400);
      next(err);
    }
  }
};

module.exports = productUnitController;
