const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

router.use(auth);

router.get('/', exportController.getExportReceipts);
router.get('/:id', exportController.getExportReceiptById);
router.post('/', exportController.createExportReceipt);
router.put('/:id', exportController.updateExportReceipt);
router.patch('/:id/approve', roleCheck('ADMIN'), exportController.approveExportReceipt);
router.patch('/:id/reject', roleCheck('ADMIN'), exportController.rejectExportReceipt);
router.delete('/:id', exportController.deleteExportReceipt);

module.exports = router;
