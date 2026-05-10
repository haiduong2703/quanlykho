const ProductAttribute = require('../models/ProductAttribute');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const productAttributeController = {
  async getByProduct(req, res, next) {
    try {
      const items = await ProductAttribute.findByProduct(req.params.productId);
      return successResponse(res, items, 'Attributes retrieved successfully');
    } catch (err) { next(err); }
  },

  async create(req, res, next) {
    try {
      const { product_id, attr_name, attr_value } = req.body;
      if (!product_id || !attr_name || !attr_value) {
        return errorResponse(res, 'product_id, attr_name, attr_value là bắt buộc', 400);
      }
      const created = await ProductAttribute.create({ product_id, attr_name, attr_value });
      return successResponse(res, created, 'Attribute created successfully', 201);
    } catch (err) { next(err); }
  },

  async bulkReplace(req, res, next) {
    try {
      const { productId } = req.params;
      const items = req.body.items || [];
      await ProductAttribute.deleteByProduct(productId);
      const saved = await ProductAttribute.bulkCreate(productId, items);
      return successResponse(res, saved, 'Attributes replaced successfully');
    } catch (err) { next(err); }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const a = await ProductAttribute.findById(id);
      if (!a) return errorResponse(res, 'Attribute not found', 404);
      const updated = await ProductAttribute.update(id, req.body);
      return successResponse(res, updated, 'Attribute updated successfully');
    } catch (err) { next(err); }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const a = await ProductAttribute.findById(id);
      if (!a) return errorResponse(res, 'Attribute not found', 404);
      await ProductAttribute.delete(id);
      return successResponse(res, null, 'Attribute deleted successfully');
    } catch (err) { next(err); }
  }
};

module.exports = productAttributeController;
