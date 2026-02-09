const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const auth = require('../middlewares/auth');

router.use(auth);

router.get('/', exportController.getExportReceipts);
router.get('/:id', exportController.getExportReceiptById);
router.post('/', exportController.createExportReceipt);
router.delete('/:id', exportController.deleteExportReceipt);

module.exports = router;
