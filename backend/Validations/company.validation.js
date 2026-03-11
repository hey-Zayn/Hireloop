const { body } = require('express-validator');

const companyValidation = [
    body('name').trim().notEmpty().withMessage('Company name is required'),
    body('industry').trim().notEmpty().withMessage('Industry is required'),
    body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
    body('website').optional().isURL().withMessage('Valid website URL is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('size').isIn(['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10001+']).withMessage('Invalid company size'),
    body('socialLinks').optional().isArray().withMessage('Social links must be an array'),
    body('socialLinks.*').optional().isURL().withMessage('Each social link must be a valid URL'),
];

const updateCompanyValidation = [
    body('name').optional().trim().notEmpty().withMessage('Company name cannot be empty'),
    body('industry').optional().trim().notEmpty().withMessage('Industry cannot be empty'),
    body('website').optional().isURL().withMessage('Valid website URL is required'),
    body('size').optional().isIn(['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10001+']).withMessage('Invalid company size'),
];

module.exports = {
    companyValidation,
    updateCompanyValidation
};
