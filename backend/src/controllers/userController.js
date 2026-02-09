const userService = require('../services/userService');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHelper');

class UserController {
  async getUsers(req, res) {
    try {
      const filters = { ...req.query };
      const { users, total } = await userService.getUsers(filters);
      return paginatedResponse(res, users, { ...filters, total }, 'Users retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      return successResponse(res, user, 'User retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message, 404);
    }
  }

  async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body);
      return successResponse(res, user, 'User created successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async updateUser(req, res) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      return successResponse(res, user, 'User updated successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async deleteUser(req, res) {
    try {
      await userService.deleteUser(req.params.id);
      return successResponse(res, null, 'User deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async toggleUserStatus(req, res) {
    try {
      const user = await userService.toggleUserStatus(req.params.id);
      return successResponse(res, user, 'User status updated successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }
}

module.exports = new UserController();
