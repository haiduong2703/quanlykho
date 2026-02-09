const express = require('express');
const router = express.Router();
const inventoryCheckController = require('../controllers/inventoryCheckController');
const auth = require('../middlewares/auth');

router.use(auth);

// GET /api/inventory-checks - Get all inventory checks
router.get('/', inventoryCheckController.getInventoryChecks);

// GET /api/inventory-checks/products - Get products for check with current stock
router.get('/products', inventoryCheckController.getProductsForCheck);

// GET /api/inventory-checks/:id - Get inventory check by id
router.get('/:id', inventoryCheckController.getInventoryCheckById);

// POST /api/inventory-checks - Create new inventory check
router.post('/', inventoryCheckController.createInventoryCheck);

// PATCH /api/inventory-checks/:id/complete - Complete inventory check and adjust stock
router.patch('/:id/complete', inventoryCheckController.completeInventoryCheck);

// PATCH /api/inventory-checks/:id/cancel - Cancel inventory check
router.patch('/:id/cancel', inventoryCheckController.cancelInventoryCheck);

// DELETE /api/inventory-checks/:id - Delete inventory check
router.delete('/:id', inventoryCheckController.deleteInventoryCheck);

module.exports = router;
