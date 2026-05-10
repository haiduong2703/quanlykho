const express = require('express');
const router = express.Router();
const productAttributeController = require('../controllers/productAttributeController');
const auth = require('../middlewares/auth');

router.use(auth);

router.get('/product/:productId', productAttributeController.getByProduct);
router.put('/product/:productId/bulk', productAttributeController.bulkReplace);
router.post('/', productAttributeController.create);
router.put('/:id', productAttributeController.update);
router.delete('/:id', productAttributeController.delete);

module.exports = router;
