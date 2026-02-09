const User = require('../models/User');
const { hashPassword } = require('../utils/bcrypt');

class UserService {
  async getUsers(filters) {
    const users = await User.findAll(filters);
    const total = await User.count(filters);
    return { users, total };
  }

  async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async createUser(userData) {
    // Check if username exists
    const existingUsername = await User.findByUsername(userData.username);
    if (existingUsername) {
      throw new Error('Username already exists');
    }

    // Check if email exists
    const existingEmail = await User.findByEmail(userData.email);
    if (existingEmail) {
      throw new Error('Email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    const user = await User.create({
      ...userData,
      password: hashedPassword
    });

    // Remove password from response
    delete user.password;
    return user;
  }

  async updateUser(id, userData) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if email is being changed and if it's already taken
    if (userData.email && userData.email !== user.email) {
      const existingEmail = await User.findByEmail(userData.email);
      if (existingEmail) {
        throw new Error('Email already exists');
      }
    }

    const updatedUser = await User.update(id, userData);
    return updatedUser;
  }

  async deleteUser(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    await User.delete(id);
    return true;
  }

  async toggleUserStatus(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    await User.toggleStatus(id);
    return await User.findById(id);
  }
}

module.exports = new UserService();
