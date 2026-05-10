const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');
const auth = require('../middlewares/auth');

router.use(auth);

router.get('/', warehouseController.getWarehouses);
router.get('/active', warehouseController.getAllActive);
router.get('/:id', warehouseController.getById);
router.post('/', warehouseController.create);
router.put('/:id', warehouseController.update);
router.patch('/:id/toggle-status', warehouseController.toggleStatus);
router.delete('/:id', warehouseController.delete);

module.exports = router;
