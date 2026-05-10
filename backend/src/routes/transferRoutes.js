const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

router.use(auth);

router.get('/', transferController.list);
router.get('/:id', transferController.getById);
router.post('/', transferController.create);
router.patch('/:id/approve', roleCheck('ADMIN'), transferController.approve);
router.patch('/:id/receive', transferController.receive);
router.patch('/:id/reject', roleCheck('ADMIN'), transferController.reject);
router.patch('/:id/cancel', transferController.cancel);

module.exports = router;
