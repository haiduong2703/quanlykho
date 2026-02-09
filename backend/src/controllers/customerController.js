const Customer = require('../models/Customer');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHelper');

const customerController = {
  // Get all customers
  async getCustomers(req, res, next) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        search: req.query.search,
        is_active: req.query.is_active !== undefined ? req.query.is_active === 'true' : undefined
      };

      const customers = await Customer.findAll(filters);
      const total = await Customer.count(filters);

      return paginatedResponse(res, customers, {
        page: filters.page,
        limit: filters.limit,
        total
      });
    } catch (err) {
      next(err);
    }
  },

  // Get all active customers (for dropdown)
  async getAllActive(req, res, next) {
    try {
      const customers = await Customer.findAllActive();
      return successResponse(res, customers, 'Active customers retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  // Get customer by ID
  async getCustomerById(req, res, next) {
    try {
      const customer = await Customer.findById(req.params.id);
      if (!customer) {
        return errorResponse(res, 'Customer not found', 404);
      }
      return successResponse(res, customer, 'Customer retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  // Create customer
  async createCustomer(req, res, next) {
    try {
      const { code, name, contact_person, phone, email, address, tax_code, note } = req.body;

      // Auto-generate code if not provided
      const customerCode = code || await Customer.generateCode();

      // Check if code exists
      const existing = await Customer.findByCode(customerCode);
      if (existing) {
        return errorResponse(res, 'Customer code already exists', 400);
      }

      const customer = await Customer.create({
        code: customerCode,
        name,
        contact_person,
        phone,
        email,
        address,
        tax_code,
        note
      });

      return successResponse(res, customer, 'Customer created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  // Update customer
  async updateCustomer(req, res, next) {
    try {
      const { id } = req.params;
      const customer = await Customer.findById(id);

      if (!customer) {
        return errorResponse(res, 'Customer not found', 404);
      }

      // Check code uniqueness if changing
      if (req.body.code && req.body.code !== customer.code) {
        const existing = await Customer.findByCode(req.body.code);
        if (existing) {
          return errorResponse(res, 'Customer code already exists', 400);
        }
      }

      const updated = await Customer.update(id, req.body);
      return successResponse(res, updated, 'Customer updated successfully');
    } catch (err) {
      next(err);
    }
  },

  // Delete customer
  async deleteCustomer(req, res, next) {
    try {
      const { id } = req.params;
      const customer = await Customer.findById(id);

      if (!customer) {
        return errorResponse(res, 'Customer not found', 404);
      }

      await Customer.delete(id);
      return successResponse(res, null, 'Customer deleted successfully');
    } catch (err) {
      next(err);
    }
  },

  // Toggle customer status
  async toggleStatus(req, res, next) {
    try {
      const { id } = req.params;
      const customer = await Customer.findById(id);

      if (!customer) {
        return errorResponse(res, 'Customer not found', 404);
      }

      const updated = await Customer.toggleStatus(id);
      return successResponse(res, updated, `Customer ${updated.is_active ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = customerController;
