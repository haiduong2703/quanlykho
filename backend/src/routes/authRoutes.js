const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { loginValidator, changePasswordValidator } = require('../validators/authValidator');

// Public routes
router.post('/login', loginValidator, validate, authController.login);

// Protected routes
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);
router.put('/change-password', auth, changePasswordValidator, validate, authController.changePassword);

module.exports = router;
