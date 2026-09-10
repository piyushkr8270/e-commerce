const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generate signed JWT token
 * Contains { id, isAdmin } with expiration based on JWT_EXPIRES_IN
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

/**
 * @desc    Admin-Only Secure Login
 * @route   POST /api/auth/admin-login
 * @access  Public
 * 
 * Verifies 3 levels of authentication:
 * 1. User existence in MongoDB
 * 2. Admin privilege check (isAdmin: true -> 403 if false)
 * 3. Bcrypt password verification (401 generic error on failure)
 */
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // LEVEL 1: Check if user exists in MongoDB
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      // Return generic error message to prevent username enumeration attacks
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or unauthorized access'
      });
    }

    // LEVEL 2: Check if user has isAdmin privilege
    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Admin privileges required'
      });
    }

    // LEVEL 3: Verify password using bcrypt
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      // Return same generic error message to prevent password enumeration
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or unauthorized access'
      });
    }

    // Authentication successful - Generate JWT Token
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Admin authenticated successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login Admin Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication'
    });
  }
};

/**
 * @desc    Forgot Password - Request Reset Token
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always respond with a generic success message to prevent email enumeration
    const genericResponse = {
      success: true,
      message: 'If an account with that email exists, a password reset token has been dispatched.'
    };

    if (!user) {
      return res.status(200).json(genericResponse);
    }

    // Generate reset token and store hashed version in DB with 15-minute expiry
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // In development mode, return the token for testing convenience
    if (process.env.NODE_ENV !== 'production') {
      return res.status(200).json({
        ...genericResponse,
        devResetToken: resetToken,
        note: 'Development helper: use this reset token to reset your password'
      });
    }

    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error('Forgot Password Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process password reset request'
    });
  }
};

/**
 * @desc    Reset Password with Token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Reset token is required'
      });
    }

    // Hash incoming token using SHA-256 to compare with stored hash
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user by valid unexpired token
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token'
      });
    }

    // Set new password (pre-save hook will hash it with bcrypt)
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password successfully reset. You can now log in with your new password.'
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
};

/**
 * @desc    Verify current admin session via JWT
 * @route   GET /api/auth/admin/verify
 * @access  Private (Admin Only)
 */
const verifyAdminSession = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Admin session is valid and active',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      role: req.user.role
    }
  });
};

/**
 * @desc    Seed initial demo users (Admin and Regular User)
 * @route   POST /api/auth/seed-users
 * @access  Public (Development / Setup)
 */
const seedUsers = async (req, res) => {
  try {
    // Check or create default admin
    let admin = await User.findOne({ email: 'admin@auramarket.com' });
    if (!admin) {
      admin = new User({
        name: 'System Admin',
        email: 'admin@auramarket.com',
        password: 'Admin@12345_Secure',
        isAdmin: true,
        role: 'admin'
      });
      await admin.save();
    } else {
      admin.isAdmin = true;
      admin.role = 'admin';
      admin.password = 'Admin@12345_Secure';
      await admin.save();
    }

    // Check or create default non-admin user
    let user = await User.findOne({ email: 'user@auramarket.com' });
    if (!user) {
      user = new User({
        name: 'Standard Customer',
        email: 'user@auramarket.com',
        password: 'User@12345_Secure',
        isAdmin: false,
        role: 'user'
      });
      await user.save();
    } else {
      user.isAdmin = false;
      user.role = 'user';
      user.password = 'User@12345_Secure';
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Demo users initialized successfully',
      credentials: [
        {
          type: 'Admin Account (Expected: 200 OK)',
          email: 'admin@auramarket.com',
          password: 'Admin@12345_Secure',
          isAdmin: true
        },
        {
          type: 'Non-Admin Account (Expected: 403 Forbidden)',
          email: 'user@auramarket.com',
          password: 'User@12345_Secure',
          isAdmin: false
        }
      ]
    });
  } catch (error) {
    console.error('Seed Users Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to seed demo users',
      error: error.message
    });
  }
};

module.exports = {
  loginAdmin,
  forgotPassword,
  resetPassword,
  verifyAdminSession,
  seedUsers
};
