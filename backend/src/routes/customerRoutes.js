const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const auth = require('../middlewares/auth');

// All routes require authentication
router.use(auth);

// GET /api/customers - Get all customers
router.get('/', customerController.getCustomers);

// GET /api/customers/active - Get all active customers (for dropdown)
router.get('/active', customerController.getAllActive);

// GET /api/customers/:id - Get customer by ID
router.get('/:id', customerController.getCustomerById);

// POST /api/customers - Create customer
router.post('/', customerController.createCustomer);

// PUT /api/customers/:id - Update customer
router.put('/:id', customerController.updateCustomer);

// PATCH /api/customers/:id/toggle-status - Toggle status
router.patch('/:id/toggle-status', customerController.toggleStatus);

// DELETE /api/customers/:id - Delete customer
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
