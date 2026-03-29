const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect — Express middleware that verifies a JWT from the
 * Authorization header ("Bearer <token>").
 * On success, attaches the decoded user object to req.user.
 * Returns 401 if the token is missing, invalid, or the user no longer exists.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from "Bearer <token>" header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Not authorized — no token provided',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude password)
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Not authorized — user no longer exists',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Not authorized — token is invalid or expired',
    });
  }
};

module.exports = { protect };
