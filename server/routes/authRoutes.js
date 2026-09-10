const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  forgotPassword,
  resetPassword,
  verifyAdminSession,
  seedUsers
} = require('../controllers/authController');
const { protectAdmin } = require('../middleware/authMiddleware');
const {
  validateAdminLogin,
  validateForgotPassword,
  validateResetPassword
} = require('../utils/passwordValidator');

// Public Auth Routes
router.post('/admin-login', validateAdminLogin, loginAdmin);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateResetPassword, resetPassword);
router.post('/seed-users', seedUsers);

// Protected Admin-Only Routes
router.get('/admin/verify', protectAdmin, verifyAdminSession);

module.exports = router;
