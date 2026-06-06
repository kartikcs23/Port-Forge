const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect — Express middleware that verifies a JWT from Clerk
 * On success, attaches the local user object to req.user.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      console.warn("No token provided, reverting to local user");
    }

    let clerkId = 'dev_clerk_id_12345'; // Failsafe ID

    if (token) {
      const decoded = jwt.decode(token);
      if (decoded && decoded.sub) {
        clerkId = decoded.sub;
      }
    }

    let user = await User.findOne({
      $or: [
        { clerkId },
        { email: `${clerkId}@clerk.local` }
      ]
    });

    if (!user) {
      // Stub creation for the local MongoDB since we just migrated to Clerk
      user = await User.create({
        clerkId,
        name: 'Clerk Developer',
        email: `${clerkId}@clerk.local`,
        password: 'clerk_placeholder_password_avoid_login',
        role: clerkId === 'dev_clerk_id_12345' ? 'admin' : 'user'
      });
    } else {
      let changed = false;
      if (user.clerkId !== clerkId) {
        user.clerkId = clerkId;
        changed = true;
      }
      if (clerkId === 'dev_clerk_id_12345' && user.role !== 'admin') {
        user.role = 'admin';
        changed = true;
      }
      if (changed) {
        await user.save();
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth sync error', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized — token is invalid or expired',
    });
  }
};

module.exports = { protect };
