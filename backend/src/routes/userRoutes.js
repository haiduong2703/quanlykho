const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const validate = require('../middlewares/validate');
const { USER_ROLES } = require('../config/constants');
const { createUserValidator, updateUserValidator } = require('../validators/userValidator');

// All user routes require ADMIN role
router.use(auth, roleCheck(USER_ROLES.ADMIN));

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', createUserValidator, validate, userController.createUser);
router.put('/:id', updateUserValidator, validate, userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.patch('/:id/toggle-status', userController.toggleUserStatus);

module.exports = router;
