const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const AuditLog = require('../models/AuditLog');

class AuthController {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);

      // Log successful login
      await AuditLog.create({
        user_id: result.user.id,
        user_name: result.user.full_name,
        action: 'LOGIN',
        entity_type: 'USER',
        entity_id: result.user.id,
        entity_name: result.user.username,
        ip_address: req.ip || req.connection?.remoteAddress
      });

      return successResponse(res, result, 'Login successful', 200);
    } catch (error) {
      console.error('Login error:', error.message);
      // Check if it's an authentication error or a server error
      const isAuthError = error.message.includes('Invalid') || error.message.includes('inactive');
      return errorResponse(res, error.message, isAuthError ? 401 : 500);
    }
  }

  async getProfile(req, res) {
    try {
      const user = await authService.getProfile(req.user.id);
      return successResponse(res, user, 'Profile retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 404);
    }
  }

  async updateProfile(req, res) {
    try {
      const profileData = req.body;
      const user = await authService.updateProfile(req.user.id, profileData);
      return successResponse(res, user, 'Profile updated successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async changePassword(req, res) {
    try {
      const { old_password, new_password } = req.body;
      await authService.changePassword(req.user.id, old_password, new_password);
      return successResponse(res, null, 'Password changed successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }
}

module.exports = new AuthController();
