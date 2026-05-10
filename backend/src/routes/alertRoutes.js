const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const auth = require('../middlewares/auth');

router.use(auth);

router.get('/summary', alertController.summary);
router.get('/low-stock', alertController.lowStock);
router.get('/over-stock', alertController.overStock);
router.get('/expiring-batches', alertController.expiringBatches);
router.get('/expired-batches', alertController.expiredBatches);

module.exports = router;
