const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middlewares/auth');

router.use(auth);

router.get('/inventory', reportController.getInventoryReport);
router.get('/import-export', reportController.getImportExportReport);
router.get('/export-csv', reportController.exportInventoryCSV);

module.exports = router;
