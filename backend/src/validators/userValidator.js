const { body, param } = require('express-validator');

const createUserValidator = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('full_name')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
  body('role')
    .optional()
    .isIn(['ADMIN', 'STAFF']).withMessage('Role must be either ADMIN or STAFF')
];

const updateUserValidator = [
  param('id').isInt().withMessage('Invalid user ID'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Must be a valid email'),
  body('full_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
  body('role')
    .optional()
    .isIn(['ADMIN', 'STAFF']).withMessage('Role must be either ADMIN or STAFF')
];

module.exports = {
  createUserValidator,
  updateUserValidator
};
