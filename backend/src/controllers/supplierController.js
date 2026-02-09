const Supplier = require('../models/Supplier');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHelper');

const supplierController = {
  // Get all suppliers
  async getSuppliers(req, res, next) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        search: req.query.search,
        is_active: req.query.is_active !== undefined ? req.query.is_active === 'true' : undefined
      };

      const suppliers = await Supplier.findAll(filters);
      const total = await Supplier.count(filters);

      return paginatedResponse(res, suppliers, {
        page: filters.page,
        limit: filters.limit,
        total
      });
    } catch (err) {
      next(err);
    }
  },

  // Get all active suppliers (for dropdown)
  async getAllActive(req, res, next) {
    try {
      const suppliers = await Supplier.findAllActive();
      return successResponse(res, suppliers, 'Active suppliers retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  // Get supplier by ID
  async getSupplierById(req, res, next) {
    try {
      const supplier = await Supplier.findById(req.params.id);
      if (!supplier) {
        return errorResponse(res, 'Supplier not found', 404);
      }
      return successResponse(res, supplier, 'Supplier retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  // Create supplier
  async createSupplier(req, res, next) {
    try {
      const { code, name, contact_person, phone, email, address, tax_code, note } = req.body;

      // Auto-generate code if not provided
      const supplierCode = code || await Supplier.generateCode();

      // Check if code exists
      const existing = await Supplier.findByCode(supplierCode);
      if (existing) {
        return errorResponse(res, 'Supplier code already exists', 400);
      }

      const supplier = await Supplier.create({
        code: supplierCode,
        name,
        contact_person,
        phone,
        email,
        address,
        tax_code,
        note
      });

      return successResponse(res, supplier, 'Supplier created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  // Update supplier
  async updateSupplier(req, res, next) {
    try {
      const { id } = req.params;
      const supplier = await Supplier.findById(id);

      if (!supplier) {
        return errorResponse(res, 'Supplier not found', 404);
      }

      // Check code uniqueness if changing
      if (req.body.code && req.body.code !== supplier.code) {
        const existing = await Supplier.findByCode(req.body.code);
        if (existing) {
          return errorResponse(res, 'Supplier code already exists', 400);
        }
      }

      const updated = await Supplier.update(id, req.body);
      return successResponse(res, updated, 'Supplier updated successfully');
    } catch (err) {
      next(err);
    }
  },

  // Delete supplier
  async deleteSupplier(req, res, next) {
    try {
      const { id } = req.params;
      const supplier = await Supplier.findById(id);

      if (!supplier) {
        return errorResponse(res, 'Supplier not found', 404);
      }

      await Supplier.delete(id);
      return successResponse(res, null, 'Supplier deleted successfully');
    } catch (err) {
      next(err);
    }
  },

  // Toggle supplier status
  async toggleStatus(req, res, next) {
    try {
      const { id } = req.params;
      const supplier = await Supplier.findById(id);

      if (!supplier) {
        return errorResponse(res, 'Supplier not found', 404);
      }

      const updated = await Supplier.toggleStatus(id);
      return successResponse(res, updated, `Supplier ${updated.is_active ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = supplierController;
