const User = require('../Models/User.Model');
const { generateTokenAndSetCookie } = require('../libs/token');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../libs/email');
const crypto = require('crypto');
const catchAsync = require('../libs/catchAsync');
const ApiError = require('../libs/ApiError');

// Register User
const register = catchAsync(async (req, res) => {
    const { fullName, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new ApiError(400, 'User already exists');
    }

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
        fullName,
        email,
        password,
        role,
        verifyToken: verificationToken
    });

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
        success: true,
        message: 'User registered successfully. Please check your email for verification code.'
    });
});

// Verify Email
const verifyEmail = catchAsync(async (req, res) => {
    const { email, code } = req.body;

    const user = await User.findOne({ email, verifyToken: code });

    if (!user) {
        throw new ApiError(400, 'Invalid verification code');
    }

    user.isVerified = true;
    user.verifyToken = "";
    user.isActive = true;
    await user.save();

    res.status(200).json({ success: true, message: 'Email verified successfully' });
});

// Login User
const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
        throw new ApiError(401, 'Invalid email or password');
    }

    if (!user.isVerified) {
        throw new ApiError(401, 'Please verify your email first');
    }

    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
        success: true,
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            companyId: user.companyId
        }
    });
});

// Logout User
const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// Forgot Password
const forgotPassword = catchAsync(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({ success: true, message: 'Password reset email sent' });
});

// Reset Password
const resetPassword = catchAsync(async (req, res) => {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpiry: { $gt: Date.now() }
    });

    if (!user) {
        throw new ApiError(400, 'Invalid or expired reset token');
    }

    user.password = newPassword;
    user.passwordResetToken = "";
    user.passwordResetExpiry = null;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful' });
});

module.exports = {
    register,
    verifyEmail,
    login,
    logout,
    forgotPassword,
    resetPassword
};
