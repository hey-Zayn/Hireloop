const { body } = require('express-validator');

const registerValidation = [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['candidate', 'hr', 'admin']).withMessage('Invalid role'),
];

const loginValidation = [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
];

const resetPasswordValidation = [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
];

const verifyEmailValidation = [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('code')
        .isNumeric().withMessage('Verification code must be numeric')
        .isLength({ min: 6, max: 6 }).withMessage('Verification code must be exactly 6 digits'),
];

const forgotPasswordValidation = [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
];

module.exports = {
    registerValidation,
    loginValidation,
    resetPasswordValidation,
    verifyEmailValidation,
    forgotPasswordValidation
};
