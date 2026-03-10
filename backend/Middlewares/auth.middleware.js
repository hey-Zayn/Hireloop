const jwt = require('jsonwebtoken');
const User = require('../Models/User.Model');

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized - No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Unauthorized - Invalid token' });
        }

        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role: ${req.user.role} is not allowed to access this resource`
            });
        }
        next();
    };
};

module.exports = { isAuthenticated, authorizeRoles };
