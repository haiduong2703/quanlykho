const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/responseHelper');

const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return errorResponse(res, 'Access token required', 401);
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return errorResponse(res, 'Access token required', 401);
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return errorResponse(res, 'Invalid or expired token', 401);
    }

    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, 'Authentication failed', 401);
  }
};

module.exports = auth;
