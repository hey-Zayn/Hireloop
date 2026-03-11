const jwt = require('jsonwebtoken');
const User = require('../Models/User.Model');
const ApiError = require('../libs/ApiError');
const catchAsync = require('../libs/catchAsync');

const isAuthenticated = catchAsync(async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        throw new ApiError(401, 'Unauthorized - No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
        throw new ApiError(401, 'Unauthorized - Invalid token');
    }

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
        throw new ApiError(401, 'User not found');
    }

    req.user = user;
    next();
});

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
