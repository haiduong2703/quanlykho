const express = require('express');
const router = express.Router();
const stockLocationController = require('../controllers/stockLocationController');
const auth = require('../middlewares/auth');

router.use(auth);

router.get('/', stockLocationController.getList);
router.get('/product/:productId/summary', stockLocationController.getSummaryByProduct);

module.exports = router;
