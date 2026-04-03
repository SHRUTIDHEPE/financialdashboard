const { body, param, query, validationResult } = require('express-validator');

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate,
];

const validateUserLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

const validateUserUpdate = [
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email'),
  body('role')
    .optional()
    .isIn(['viewer', 'analyst', 'admin']).withMessage('Role must be viewer, analyst, or admin'),
  body('status')
    .optional()
    .isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
  validate,
];

// Financial record validation rules
const validateRecordCreate = [
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('type')
    .notEmpty().withMessage('Transaction type is required')
    .isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isLength({ max: 50 }).withMessage('Category cannot exceed 50 characters'),
  body('date')
    .optional()
    .isISO8601().withMessage('Date must be a valid ISO date'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  validate,
];

const validateRecordUpdate = [
  param('id').isMongoId().withMessage('Invalid record ID'),
  body('amount')
    .optional()
    .isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('type')
    .optional()
    .isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Category cannot exceed 50 characters'),
  body('date')
    .optional()
    .isISO8601().withMessage('Date must be a valid ISO date'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  validate,
];

const validateRecordId = [
  param('id').isMongoId().withMessage('Invalid record ID'),
  validate,
];

const validateUserId = [
  param('id').isMongoId().withMessage('Invalid user ID'),
  validate,
];

// Query validation for filtering
const validateRecordFilters = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  query('category').optional().trim(),
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date'),
  query('search').optional().trim(),
  validate,
];

const validateDateRange = [
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date'),
  validate,
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validateRecordCreate,
  validateRecordUpdate,
  validateRecordId,
  validateUserId,
  validateRecordFilters,
  validateDateRange,
};