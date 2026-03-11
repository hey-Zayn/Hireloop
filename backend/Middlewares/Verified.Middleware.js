const isVerified = (req, res, next) => {
    if (!req.user.isVerified) {
        return res.status(403).json({
            success: false,
            message: "Account verification required. Please verify your email to perform this action."
        });
    }
    next();
};

module.exports = isVerified;
