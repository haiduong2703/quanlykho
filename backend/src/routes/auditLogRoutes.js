const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

// All routes require authentication and admin role
router.use(auth);
router.use(roleCheck(['ADMIN']));

// GET /api/audit-logs - Get all logs
router.get('/', auditLogController.getLogs);

// GET /api/audit-logs/action-types - Get action types
router.get('/action-types', auditLogController.getActionTypes);

// GET /api/audit-logs/entity-types - Get entity types
router.get('/entity-types', auditLogController.getEntityTypes);

module.exports = router;
