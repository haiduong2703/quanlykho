const AuditLog = require('../models/AuditLog');
const { success, error } = require('../utils/responseHelper');

const auditLogController = {
  // Get audit logs with filtering
  async getLogs(req, res, next) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        action: req.query.action,
        entity_type: req.query.entity_type,
        user_id: req.query.user_id,
        from_date: req.query.from_date,
        to_date: req.query.to_date
      };

      const logs = await AuditLog.findAll(filters);
      const total = await AuditLog.count(filters);

      // Parse details JSON
      const parsedLogs = logs.map(log => ({
        ...log,
        details: log.details ? JSON.parse(log.details) : null
      }));

      return success(res, parsedLogs, 'Audit logs retrieved successfully', {
        page: filters.page,
        limit: filters.limit,
        total
      });
    } catch (err) {
      next(err);
    }
  },

  // Get action types for filter dropdown
  async getActionTypes(req, res, next) {
    try {
      const actions = [
        'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT',
        'IMPORT', 'EXPORT', 'TOGGLE_STATUS'
      ];
      return success(res, actions, 'Action types retrieved');
    } catch (err) {
      next(err);
    }
  },

  // Get entity types for filter dropdown
  async getEntityTypes(req, res, next) {
    try {
      const entities = [
        'USER', 'PRODUCT', 'CATEGORY', 'SUPPLIER', 'CUSTOMER',
        'IMPORT_RECEIPT', 'EXPORT_RECEIPT', 'STOCK'
      ];
      return success(res, entities, 'Entity types retrieved');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = auditLogController;
