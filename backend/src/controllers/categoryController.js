const categoryService = require('../services/categoryService');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHelper');

class CategoryController {
  async getCategories(req, res) {
    try {
      const filters = { ...req.query };
      const { categories, total } = await categoryService.getCategories(filters);
      return paginatedResponse(res, categories, { ...filters, total });
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getAllCategories(req, res) {
    try {
      const categories = await categoryService.getAllCategories();
      return successResponse(res, categories);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getCategoryById(req, res) {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      return successResponse(res, category);
    } catch (error) {
      return errorResponse(res, error.message, 404);
    }
  }

  async createCategory(req, res) {
    try {
      const category = await categoryService.createCategory(req.body);
      return successResponse(res, category, 'Category created successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async updateCategory(req, res) {
    try {
      const category = await categoryService.updateCategory(req.params.id, req.body);
      return successResponse(res, category, 'Category updated successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async deleteCategory(req, res) {
    try {
      await categoryService.deleteCategory(req.params.id);
      return successResponse(res, null, 'Category deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }
}

module.exports = new CategoryController();
