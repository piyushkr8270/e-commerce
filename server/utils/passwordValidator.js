const { body, validationResult } = require('express-validator');

/**
 * Strict Password Policy Criteria:
 * - At least 8 characters long
 * - Contains at least one UPPERCASE letter (A-Z)
 * - Contains at least one lowercase letter (a-z)
 * - Contains at least one numeric digit (0-9)
 * - Contains at least one special character/symbol (@, #, $, !, %, *, ?, &, _)
 */
const PASSWORD_RULES = {
  minLength: {
    test: (pwd) => typeof pwd === 'string' && pwd.length >= 8,
    message: 'At least 8 characters long'
  },
  hasUppercase: {
    test: (pwd) => /[A-Z]/.test(pwd),
    message: 'Contains at least one UPPERCASE letter (A-Z)'
  },
  hasLowercase: {
    test: (pwd) => /[a-z]/.test(pwd),
    message: 'Contains at least one lowercase letter (a-z)'
  },
  hasNumber: {
    test: (pwd) => /[0-9]/.test(pwd),
    message: 'Contains at least one numeric digit (0-9)'
  },
  hasSpecialChar: {
    test: (pwd) => /[@#$!%*?&_~^`+\-=\[\]{}()<>,./:;"'\\]/.test(pwd),
    message: 'Contains at least one special character/symbol (@, #, $, !, %, *, ?, &, _)'
  }
};

/**
 * Validates a password string against all strict policy rules
 * @param {string} password 
 * @returns {{ isValid: boolean, errors: string[], checks: Record<string, boolean> }}
 */
const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      errors: ['Password is required and must be a string'],
      checks: {
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false
      }
    };
  }

  const checks = {
    minLength: PASSWORD_RULES.minLength.test(password),
    hasUppercase: PASSWORD_RULES.hasUppercase.test(password),
    hasLowercase: PASSWORD_RULES.hasLowercase.test(password),
    hasNumber: PASSWORD_RULES.hasNumber.test(password),
    hasSpecialChar: PASSWORD_RULES.hasSpecialChar.test(password)
  };

  const errors = [];
  if (!checks.minLength) errors.push(PASSWORD_RULES.minLength.message);
  if (!checks.hasUppercase) errors.push(PASSWORD_RULES.hasUppercase.message);
  if (!checks.hasLowercase) errors.push(PASSWORD_RULES.hasLowercase.message);
  if (!checks.hasNumber) errors.push(PASSWORD_RULES.hasNumber.message);
  if (!checks.hasSpecialChar) errors.push(PASSWORD_RULES.hasSpecialChar.message);

  return {
    isValid: errors.length === 0,
    errors,
    checks
  };
};

/**
 * Middleware to check express-validator validation results
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * express-validator chain to enforce strong password policy on a specific field
 */
const passwordValidationChain = (fieldName = 'password') => {
  return body(fieldName)
    .notEmpty()
    .withMessage('Password is required')
    .custom((val) => {
      const { isValid, errors } = validatePassword(val);
      if (!isValid) {
        throw new Error(`Password policy violation: ${errors.join('; ')}`);
      }
      return true;
    });
};

/**
 * Validation rules for Admin Login
 */
const validateAdminLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  passwordValidationChain('password'),
  handleValidationErrors
];

/**
 * Validation rules for User / Admin Registration
 */
const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  passwordValidationChain('password'),
  handleValidationErrors
];

/**
 * Validation rules for Forgot Password
 */
const validateForgotPassword = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  handleValidationErrors
];

/**
 * Validation rules for Reset Password
 */
const validateResetPassword = [
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Reset token is required'),
  passwordValidationChain('password'),
  handleValidationErrors
];

module.exports = {
  PASSWORD_RULES,
  validatePassword,
  handleValidationErrors,
  passwordValidationChain,
  validateAdminLogin,
  validateRegister,
  validateForgotPassword,
  validateResetPassword
};
