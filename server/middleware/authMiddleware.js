const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect Admin Routes:
 * 1. Checks Authorization header for Bearer token
 * 2. Verifies JWT authenticity and expiration
 * 3. Fetches user from DB to ensure account validity
 * 4. Strictly checks if user has isAdmin: true privilege
 */
const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No token provided'
    });
  }

  try {
    // Verify token using secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Retrieve user from DB, omitting password field
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: User account no longer exists'
      });
    }

    // Check admin privilege both in decoded payload and in current DB state
    if (!decoded.isAdmin || !user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Admin privileges required'
      });
    }

    // Attach validated admin user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Admin Auth Middleware Error:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Token expired'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Not authorized: Invalid or malformed token'
    });
  }
};

/**
 * Standard Authenticated Route Protection
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: User account no longer exists'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Token expired'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Not authorized: Invalid or malformed token'
    });
  }
};

module.exports = {
  protectAdmin,
  protect
};
