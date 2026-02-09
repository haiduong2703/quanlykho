const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middlewares/auth');

router.use(auth);

router.get('/stats', dashboardController.getStats);
router.get('/low-stock-alerts', dashboardController.getLowStockAlerts);
router.get('/recent-activities', dashboardController.getRecentActivities);
router.get('/monthly-stats', dashboardController.getMonthlyStats);
router.get('/category-stats', dashboardController.getCategoryStats);
router.get('/top-export-products', dashboardController.getTopExportProducts);

module.exports = router;
