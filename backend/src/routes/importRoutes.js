const express = require('express');
const router = express.Router();
const importController = require('../controllers/importController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

router.use(auth);

router.get('/', importController.getImportReceipts);
router.get('/:id', importController.getImportReceiptById);
router.post('/', importController.createImportReceipt);
router.put('/:id', importController.updateImportReceipt);
router.patch('/:id/approve', roleCheck('ADMIN'), importController.approveImportReceipt);
router.patch('/:id/reject', roleCheck('ADMIN'), importController.rejectImportReceipt);
router.delete('/:id', importController.deleteImportReceipt);

module.exports = router;
