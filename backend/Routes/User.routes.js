const express = require('express');
const {
    register,
    verifyEmail,
    login,
    logout,
    forgotPassword,
    resetPassword
} = require('../Controllers/User.Controller');
const {
    registerValidation,
    loginValidation,
    resetPasswordValidation
} = require('../Validations/auth.validation');
const validate = require('../Middlewares/validator.middleware');
const { isAuthenticated, authorizeRoles } = require('../Middlewares/auth.middleware');

const router = express.Router();

// Routes
router.post('/register', registerValidation, validate, register);
router.post('/verify-email', verifyEmail);
router.post('/login', loginValidation, validate, login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPasswordValidation, validate, resetPassword);

// Example protected routes
router.get('/profile', isAuthenticated, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

router.get('/admin-dashboard', isAuthenticated, authorizeRoles('admin'), (req, res) => {
    res.status(200).json({ success: true, message: 'Welcome Admin' });
});

module.exports = router;