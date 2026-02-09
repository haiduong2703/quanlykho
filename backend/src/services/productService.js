const Product = require('../models/Product');
const Stock = require('../models/Stock');

const APP_URL = process.env.APP_URL || 'http://localhost:5000';

// Helper function to format product with full image URL
const formatProductImage = (product) => {
  if (!product) return product;
  if (product.image) {
    product.image_url = `${APP_URL}/uploads/products/${product.image}`;
  } else {
    product.image_url = null;
  }
  return product;
};

const formatProductsImage = (products) => {
  return products.map(formatProductImage);
};

class ProductService {
  async getProducts(filters) {
    const products = await Product.findAll(filters);
    const total = await Product.count(filters);
    return { products: formatProductsImage(products), total };
  }

  async getAllProducts() {
    // Get all active products without pagination
    const products = await Product.findAll({ limit: 10000, is_active: true });
    return formatProductsImage(products);
  }

  async getProductById(id) {
    const product = await Product.findByIdWithCategory(id);
    if (!product) throw new Error('Product not found');

    // Get stock info
    const stock = await Stock.findByProductId(id);
    product.stock = stock || { quantity: 0 };

    return formatProductImage(product);
  }

  async searchProducts(keyword, filters) {
    const products = await Product.search(keyword, filters);
    return formatProductsImage(products);
  }

  async createProduct(productData) {
    const existing = await Product.findBySku(productData.sku);
    if (existing) throw new Error('SKU already exists');

    const product = await Product.create(productData);

    // Initialize stock at 0
    await Stock.create({ product_id: product.id, quantity: 0 });

    return formatProductImage(product);
  }

  async updateProduct(id, productData) {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');

    if (productData.sku && productData.sku !== product.sku) {
      const existing = await Product.findBySku(productData.sku);
      if (existing) throw new Error('SKU already exists');
    }

    const updatedProduct = await Product.update(id, productData);
    return formatProductImage(updatedProduct);
  }

  async deleteProduct(id) {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');

    await Product.delete(id);
    return true;
  }

  async toggleProductStatus(id) {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');

    await Product.toggleStatus(id);
    const updatedProduct = await Product.findById(id);
    return formatProductImage(updatedProduct);
  }
}

module.exports = new ProductService();
