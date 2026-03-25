const Product = require('../models/Product');
const Stock = require('../models/Stock');
const Category = require('../models/Category');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const APP_URL = process.env.APP_URL || 'http://localhost:5000';

// Helper function to format product with full image URL
const formatProductImage = (product) => {
  if (!product) return product;
  if (product.image) {
    // External URL (crawled) — use directly; local filename — construct path
    if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
      product.image_url = product.image;
    } else {
      product.image_url = `${APP_URL}/uploads/products/${product.image}`;
    }
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

  async bulkImportFromExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet);

    // Clean up temp file
    try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }

    if (rows.length === 0) {
      throw new Error('File Excel is empty');
    }

    // Get all categories for lookup
    const categories = await Category.findAllWithoutPagination();
    const categoryMap = {};
    categories.forEach(c => {
      categoryMap[c.name.toLowerCase().trim()] = c.id;
    });

    const results = { success: 0, errors: [], skipped: 0 };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // Row 1 is header

      try {
        const sku = String(row['SKU'] || row['sku'] || '').trim();
        const name = String(row['Ten san pham'] || row['Tên sản phẩm'] || row['name'] || '').trim();
        const categoryName = String(row['Danh muc'] || row['Danh mục'] || row['category'] || '').trim();
        const unit = String(row['Don vi'] || row['Đơn vị'] || row['unit'] || '').trim();
        const price = parseFloat(row['Gia'] || row['Giá'] || row['price'] || 0);
        const minStock = parseInt(row['Ton toi thieu'] || row['Tồn tối thiểu'] || row['min_stock'] || 0);
        const description = String(row['Mo ta'] || row['Mô tả'] || row['description'] || '').trim();

        // Validate required fields
        if (!sku) { results.errors.push(`Row ${rowNum}: Missing SKU`); continue; }
        if (!name) { results.errors.push(`Row ${rowNum}: Missing product name`); continue; }
        if (!unit) { results.errors.push(`Row ${rowNum}: Missing unit`); continue; }
        if (!categoryName) { results.errors.push(`Row ${rowNum}: Missing category`); continue; }

        // Find category
        const categoryId = categoryMap[categoryName.toLowerCase()];
        if (!categoryId) {
          results.errors.push(`Row ${rowNum}: Category "${categoryName}" not found`);
          continue;
        }

        // Check if SKU exists
        const existing = await Product.findBySku(sku);
        if (existing) {
          results.errors.push(`Row ${rowNum}: SKU "${sku}" already exists`);
          results.skipped++;
          continue;
        }

        // Create product
        const product = await Product.create({
          sku,
          name,
          description: description || null,
          category_id: categoryId,
          unit,
          price: price || 0,
          min_stock: minStock || 0,
          is_active: true
        });

        // Initialize stock
        await Stock.create({ product_id: product.id, quantity: 0 });
        results.success++;

      } catch (error) {
        results.errors.push(`Row ${rowNum}: ${error.message}`);
      }
    }

    results.total = rows.length;
    return results;
  }

  generateSampleExcel() {
    const wb = XLSX.utils.book_new();
    const sampleData = [
      {
        'SKU': 'SP001',
        'Tên sản phẩm': 'Sản phẩm mẫu 1',
        'Danh mục': 'Tên danh mục',
        'Đơn vị': 'Cái',
        'Giá': 100000,
        'Tồn tối thiểu': 10,
        'Mô tả': 'Mô tả sản phẩm'
      },
      {
        'SKU': 'SP002',
        'Tên sản phẩm': 'Sản phẩm mẫu 2',
        'Danh mục': 'Tên danh mục',
        'Đơn vị': 'Hộp',
        'Giá': 250000,
        'Tồn tối thiểu': 5,
        'Mô tả': 'Mô tả sản phẩm 2'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);

    // Set column widths
    ws['!cols'] = [
      { wch: 12 }, // SKU
      { wch: 30 }, // Tên sản phẩm
      { wch: 20 }, // Danh mục
      { wch: 10 }, // Đơn vị
      { wch: 15 }, // Giá
      { wch: 15 }, // Tồn tối thiểu
      { wch: 30 }  // Mô tả
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Products');

    const tempDir = path.join(__dirname, '../../uploads/temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const filePath = path.join(tempDir, 'mau_import_san_pham.xlsx');
    XLSX.writeFile(wb, filePath);
    return filePath;
  }
}

module.exports = new ProductService();
