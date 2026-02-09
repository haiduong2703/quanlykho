const express = require('express');
const router = express.Router();
const importController = require('../controllers/importController');
const auth = require('../middlewares/auth');

router.use(auth);

router.get('/', importController.getImportReceipts);
router.get('/:id', importController.getImportReceiptById);
router.post('/', importController.createImportReceipt);
router.delete('/:id', importController.deleteImportReceipt);

module.exports = router;
