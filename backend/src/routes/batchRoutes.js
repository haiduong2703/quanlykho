const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');
const auth = require('../middlewares/auth');

router.use(auth);

router.get('/', batchController.getList);
router.get('/expiring-soon', batchController.getExpiringSoon);
router.get('/available/:productId', batchController.getAvailableByProduct);
router.get('/:id', batchController.getById);
router.post('/', batchController.create);
router.put('/:id', batchController.update);
router.delete('/:id', batchController.delete);

module.exports = router;
