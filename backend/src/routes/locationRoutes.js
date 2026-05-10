const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const auth = require('../middlewares/auth');

router.use(auth);

router.get('/', locationController.getList);
router.get('/warehouse/:warehouseId', locationController.getByWarehouse);
router.get('/:id', locationController.getById);
router.post('/', locationController.create);
router.put('/:id', locationController.update);
router.delete('/:id', locationController.delete);

module.exports = router;
