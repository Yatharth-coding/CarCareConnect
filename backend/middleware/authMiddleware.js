const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // 1. Check HttpOnly cookie first (most secure)
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    // 2. Fallback to Authorization Bearer header (for API clients, Postman, etc.)
    else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized, please login' });
    }

    try {
        // Verify token - strictly uses environment variable
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from the token
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({ success: false, error: 'User no longer exists' });
        }

        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, error: 'Token expired, please login again' });
        }
        return res.status(401).json({ success: false, error: 'Not authorized, invalid token' });
    }
};

// Role authorization middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to access this route'
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
