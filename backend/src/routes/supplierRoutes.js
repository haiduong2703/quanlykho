const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const auth = require('../middlewares/auth');

// All routes require authentication
router.use(auth);

// GET /api/suppliers - Get all suppliers
router.get('/', supplierController.getSuppliers);

// GET /api/suppliers/active - Get all active suppliers (for dropdown)
router.get('/active', supplierController.getAllActive);

// GET /api/suppliers/:id - Get supplier by ID
router.get('/:id', supplierController.getSupplierById);

// POST /api/suppliers - Create supplier
router.post('/', supplierController.createSupplier);

// PUT /api/suppliers/:id - Update supplier
router.put('/:id', supplierController.updateSupplier);

// PATCH /api/suppliers/:id/toggle-status - Toggle status
router.patch('/:id/toggle-status', supplierController.toggleStatus);

// DELETE /api/suppliers/:id - Delete supplier
router.delete('/:id', supplierController.deleteSupplier);

module.exports = router;
