const express = require('express');
const router = express.Router();
const productUnitController = require('../controllers/productUnitController');
const auth = require('../middlewares/auth');

router.use(auth);

router.get('/by-barcode', productUnitController.findByBarcode);
router.get('/product/:productId', productUnitController.getByProduct);
router.post('/', productUnitController.create);
router.post('/convert', productUnitController.convert);
router.put('/:id', productUnitController.update);
router.delete('/:id', productUnitController.delete);

module.exports = router;
