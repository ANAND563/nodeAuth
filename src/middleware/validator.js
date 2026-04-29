const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation failed",
            errors: errors.array().map(e => ({
                field: e.path,
                message: e.msg
            }))
        });
    }
    next();
};

const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters')
        .isAlphanumeric().withMessage('Username must contain only letters and numbers'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number'),

    body('mobile')
        .notEmpty().withMessage('Mobile number is required')
        .isMobilePhone('en-IN').withMessage('Please provide a valid Indian mobile number'),

    body('city')
        .trim()
        .notEmpty().withMessage('City is required'),

    body('country')
        .trim()
        .notEmpty().withMessage('Country is required'),

    validate
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address'),

    body('password')
        .notEmpty().withMessage('Password is required'),

    validate
];

// Send OTP ke liye validation
const sendOtpValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address'),

    validate
];

// Verify OTP ke liye validation
const verifyOtpValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address'),

    body('otp')
        .notEmpty().withMessage('OTP is required')
        .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
        .isNumeric().withMessage('OTP must contain only numbers'),

    validate
];

const productValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Product name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Product name must be between 2 and 100 characters'),

    body('price')
        .notEmpty().withMessage('Price is required')
        .isNumeric().withMessage('Price must be a number')
        .custom(value => value >= 0).withMessage('Price cannot be negative'),

    body('stock')
        .optional()
        .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

    body('category')
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage('Category name too long'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Description too long'),

    body('status')
        .optional()
        .isIn(['Active', 'Inactive']).withMessage('Status must be Active or Inactive'),

    validate
];

module.exports = {
    registerValidation,
    loginValidation,
    sendOtpValidation,
    verifyOtpValidation,
    productValidation
};

