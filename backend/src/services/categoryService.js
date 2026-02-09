const Category = require('../models/Category');

class CategoryService {
  async getCategories(filters) {
    const categories = await Category.findAll(filters);
    const total = await Category.count(filters);
    return { categories, total };
  }

  async getAllCategories() {
    return await Category.findAllWithoutPagination();
  }

  async getCategoryById(id) {
    const category = await Category.findById(id);
    if (!category) throw new Error('Category not found');
    return category;
  }

  async createCategory(categoryData) {
    const existing = await Category.findByName(categoryData.name);
    if (existing) throw new Error('Category name already exists');
    return await Category.create(categoryData);
  }

  async updateCategory(id, categoryData) {
    const category = await Category.findById(id);
    if (!category) throw new Error('Category not found');

    if (categoryData.name && categoryData.name !== category.name) {
      const existing = await Category.findByName(categoryData.name);
      if (existing) throw new Error('Category name already exists');
    }

    return await Category.update(id, categoryData);
  }

  async deleteCategory(id) {
    const category = await Category.findById(id);
    if (!category) throw new Error('Category not found');

    const hasProducts = await Category.hasProducts(id);
    if (hasProducts) throw new Error('Cannot delete category with existing products');

    await Category.delete(id);
    return true;
  }
}

module.exports = new CategoryService();
