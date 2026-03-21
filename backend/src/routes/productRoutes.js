const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middlewares/auth');
const { upload } = require('../config/upload');
const { uploadExcel } = require('../config/uploadExcel');

router.use(auth);

router.get('/', productController.getProducts);
router.get('/all', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/sample-excel', productController.downloadSampleExcel);
router.get('/:id', productController.getProductById);
router.post('/', upload.single('image'), productController.createProduct);
router.post('/import-excel', uploadExcel.single('file'), productController.bulkImport);
router.put('/:id', upload.single('image'), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.patch('/:id/toggle-status', productController.toggleProductStatus);

module.exports = router;
