const User = require('../Models/User.Model');
const { generateTokenAndSetCookie } = require('../libs/token');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../libs/email');
const crypto = require('crypto');

// Register User
const register = async (req, res, next) => {
    try {
        const { fullName, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
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
    } catch (error) {
        next(error);
    }
};

// Verify Email
const verifyEmail = async (req, res, next) => {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({ email, verifyToken: code });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid verification code' });
        }

        user.isVerified = true;
        user.verifyToken = "";
        user.isActive = true;
        await user.save();

        res.status(200).json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        next(error);
    }
};

// Login User
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ success: false, message: 'Please verify your email first' });
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
    } catch (error) {
        next(error);
    }
};

// Logout User
const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// Forgot Password
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.passwordResetToken = resetToken;
        user.passwordResetExpiry = Date.now() + 3600000; // 1 hour
        await user.save();

        await sendPasswordResetEmail(user.email, resetToken);

        res.status(200).json({ success: true, message: 'Password reset email sent' });
    } catch (error) {
        next(error);
    }
};

// Reset Password
const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
        }

        user.password = newPassword;
        user.passwordResetToken = "";
        user.passwordResetExpiry = null;
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    verifyEmail,
    login,
    logout,
    forgotPassword,
    resetPassword
};