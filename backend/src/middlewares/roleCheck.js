const { errorResponse } = require('../utils/responseHelper');
const { USER_ROLES } = require('../config/constants');

const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 'Access denied. Insufficient permissions.', 403);
    }

    next();
  };
};

module.exports = roleCheck;
