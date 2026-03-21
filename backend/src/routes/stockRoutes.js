const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const auth = require('../middlewares/auth');

router.use(auth);

router.get('/', stockController.getStocks);
router.get('/alerts', stockController.getLowStockAlerts);
router.get('/product/:id', stockController.getStockByProductId);
router.get('/product/:id/history', stockController.getStockHistory);

module.exports = router;
