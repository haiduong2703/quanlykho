const productService = require('../services/productService');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHelper');
const { deleteImage } = require('../config/upload');

class ProductController {
  async getProducts(req, res) {
    try {
      const { products, total } = await productService.getProducts(req.query);
      return paginatedResponse(res, products, { ...req.query, total });
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getAllProducts(req, res) {
    try {
      const products = await productService.getAllProducts();
      return successResponse(res, products);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getProductById(req, res) {
    try {
      const product = await productService.getProductById(req.params.id);
      return successResponse(res, product);
    } catch (error) {
      return errorResponse(res, error.message, 404);
    }
  }

  async searchProducts(req, res) {
    try {
      const { keyword, ...filters } = req.query;
      const products = await productService.searchProducts(keyword, filters);
      return successResponse(res, products);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async createProduct(req, res) {
    try {
      const productData = { ...req.body };

      // If file uploaded, add image path
      if (req.file) {
        productData.image = req.file.filename;
      }

      const product = await productService.createProduct(productData);
      return successResponse(res, product, 'Product created successfully', 201);
    } catch (error) {
      // Delete uploaded file if product creation fails
      if (req.file) {
        deleteImage(req.file.filename);
      }
      return errorResponse(res, error.message, 400);
    }
  }

  async updateProduct(req, res) {
    try {
      const productData = { ...req.body };

      // If new file uploaded, add image path
      if (req.file) {
        // Get old product to delete old image
        const oldProduct = await productService.getProductById(req.params.id);
        if (oldProduct && oldProduct.image) {
          deleteImage(oldProduct.image);
        }
        productData.image = req.file.filename;
      }

      const product = await productService.updateProduct(req.params.id, productData);
      return successResponse(res, product, 'Product updated successfully');
    } catch (error) {
      // Delete uploaded file if update fails
      if (req.file) {
        deleteImage(req.file.filename);
      }
      return errorResponse(res, error.message, 400);
    }
  }

  async deleteProduct(req, res) {
    try {
      // Get product to delete image
      const product = await productService.getProductById(req.params.id);
      if (product && product.image) {
        deleteImage(product.image);
      }

      await productService.deleteProduct(req.params.id);
      return successResponse(res, null, 'Product deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async toggleProductStatus(req, res) {
    try {
      const product = await productService.toggleProductStatus(req.params.id);
      return successResponse(res, product, 'Product status updated successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }
}

module.exports = new ProductController();
