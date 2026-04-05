const User = require('../models/User');

/**
 * Admin Middleware — Ensures only admin users can access protected routes
 */
const requireAdmin = async (req, res, next) => {
  try {
    // Get user from Clerk token (assuming req.user is set by auth middleware)
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Fetch user from database to check role
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    // User is admin, proceed
    req.adminUser = user;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = { requireAdmin };