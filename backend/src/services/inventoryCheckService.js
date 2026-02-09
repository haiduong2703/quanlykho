const pool = require('../config/db');
const InventoryCheck = require('../models/InventoryCheck');
const InventoryCheckDetail = require('../models/InventoryCheckDetail');
const Stock = require('../models/Stock');
const Product = require('../models/Product');

class InventoryCheckService {
  // Get all inventory checks with pagination
  async getInventoryChecks(filters) {
    const checks = await InventoryCheck.findAll(filters);
    const total = await InventoryCheck.count(filters);
    return { checks, total };
  }

  // Get inventory check by id with details
  async getInventoryCheckById(id) {
    const check = await InventoryCheck.findByIdWithDetails(id);
    if (!check) {
      throw new Error('Inventory check not found');
    }
    return check;
  }

  // Create new inventory check
  async createInventoryCheck(userId, checkData) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Validate items
      if (!checkData.items || checkData.items.length === 0) {
        throw new Error('Inventory check items cannot be empty');
      }

      // Validate products exist
      for (const item of checkData.items) {
        const product = await Product.findById(item.product_id);
        if (!product) {
          throw new Error(`Product ID ${item.product_id} not found`);
        }
        if (item.actual_quantity < 0) {
          throw new Error('Actual quantity cannot be negative');
        }
      }

      // Generate check code
      const checkCode = await InventoryCheck.generateCheckCode();

      // Calculate totals
      let totalDifference = 0;
      for (const item of checkData.items) {
        totalDifference += Math.abs(item.actual_quantity - item.system_quantity);
      }

      // Create inventory check
      const check = await InventoryCheck.create({
        check_code: checkCode,
        user_id: userId,
        check_date: checkData.check_date || new Date(),
        status: 'DRAFT',
        total_products: checkData.items.length,
        total_difference: totalDifference,
        note: checkData.note
      }, connection);

      // Create details
      const details = checkData.items.map(item => ({
        inventory_check_id: check.id,
        product_id: item.product_id,
        system_quantity: item.system_quantity,
        actual_quantity: item.actual_quantity,
        note: item.note
      }));

      await InventoryCheckDetail.createBulk(details, connection);

      await connection.commit();

      // Get full check with details
      const fullCheck = await InventoryCheck.findByIdWithDetails(check.id);
      return fullCheck;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Complete inventory check and adjust stock
  async completeInventoryCheck(id) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const check = await InventoryCheck.findByIdWithDetails(id);
      if (!check) {
        throw new Error('Inventory check not found');
      }

      if (check.status !== 'DRAFT') {
        throw new Error('Only DRAFT checks can be completed');
      }

      // Adjust stock quantities based on actual count
      for (const detail of check.details) {
        const difference = detail.actual_quantity - detail.system_quantity;

        if (difference !== 0) {
          // Update stock to actual quantity
          await Stock.setQuantity(detail.product_id, detail.actual_quantity, connection);
        }
      }

      // Update check status
      await InventoryCheck.update(id, { status: 'COMPLETED' }, connection);

      await connection.commit();

      return await InventoryCheck.findByIdWithDetails(id);

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Cancel inventory check
  async cancelInventoryCheck(id) {
    const check = await InventoryCheck.findById(id);
    if (!check) {
      throw new Error('Inventory check not found');
    }

    if (check.status !== 'DRAFT') {
      throw new Error('Only DRAFT checks can be cancelled');
    }

    await InventoryCheck.update(id, { status: 'CANCELLED' });
    return await InventoryCheck.findByIdWithDetails(id);
  }

  // Delete inventory check (only DRAFT or CANCELLED)
  async deleteInventoryCheck(id) {
    const check = await InventoryCheck.findById(id);
    if (!check) {
      throw new Error('Inventory check not found');
    }

    if (check.status === 'COMPLETED') {
      throw new Error('Cannot delete completed inventory check');
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await InventoryCheckDetail.deleteByCheckId(id, connection);
      await InventoryCheck.delete(id, connection);

      await connection.commit();
      return true;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get products with current stock for inventory check
  async getProductsForCheck(filters = {}) {
    const { category_id, search } = filters;

    let query = `
      SELECT p.id, p.sku, p.name, p.unit, c.name as category_name,
             COALESCE(s.quantity, 0) as system_quantity
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN stocks s ON p.id = s.product_id
      WHERE p.is_active = 1
    `;
    const params = [];

    if (category_id) {
      query += ' AND p.category_id = ?';
      params.push(category_id);
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.sku LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY p.name ASC';

    const [rows] = await pool.query(query, params);
    return rows;
  }
}

module.exports = new InventoryCheckService();
