const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const stockRoutes = require('./stockRoutes');
const importRoutes = require('./importRoutes');
const exportRoutes = require('./exportRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const reportRoutes = require('./reportRoutes');
const supplierRoutes = require('./supplierRoutes');
const customerRoutes = require('./customerRoutes');
const auditLogRoutes = require('./auditLogRoutes');
const inventoryCheckRoutes = require('./inventoryCheckRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/stocks', stockRoutes);
router.use('/imports', importRoutes);
router.use('/exports', exportRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/customers', customerRoutes);
router.use('/audit-logs', auditLogRoutes);
router.use('/inventory-checks', inventoryCheckRoutes);

module.exports = router;
