const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { generateToken } = require('../utils/jwt');

class AuthService {
  async login(username, password) {
    // Find user by username
    const user = await User.findByUsername(username);

    if (!user) {
      throw new Error('Invalid username or password');
    }

    if (!user.is_active) {
      throw new Error('Account is inactive. Please contact administrator.');
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    // Remove password from response
    delete user.password;

    return {
      token,
      user
    };
  }

  async getProfile(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateProfile(userId, profileData) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Check if email is being changed and if it's already taken
    if (profileData.email && profileData.email !== user.email) {
      const existingUser = await User.findByEmail(profileData.email);
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    const updatedUser = await User.update(userId, {
      email: profileData.email,
      full_name: profileData.full_name
    });

    return updatedUser;
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findByIdWithPassword(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    const isPasswordValid = await comparePassword(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await User.updatePassword(userId, hashedPassword);

    return true;
  }
}

module.exports = new AuthService();
