const { verifyToken } = require('@clerk/clerk-sdk-node');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const CLERK_ISSUER = process.env.CLERK_ISSUER;
const JWT_SECRET = process.env.JWT_SECRET || 'placeholder';

/**
 * protect — Express middleware that verifies either a local JWT or a Clerk session JWT.
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

    let user = null;

    if (token) {
      // 1. Try local JWT token verification
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded && decoded.id) {
          user = await User.findById(decoded.id);
        }
      } catch (localJwtError) {
        // Not a valid local JWT, will attempt Clerk verification below
      }

      // 2. Try Clerk token verification if local JWT didn't match
      if (!user && CLERK_ISSUER) {
        try {
          const payload = await verifyToken(token, { issuer: CLERK_ISSUER });
          const clerkId = payload?.sub;
          if (clerkId) {
            user = await User.findOne({ clerkId });
            if (!user) {
              user = await User.create({
                clerkId,
                name: payload.name || 'Clerk User',
                email: payload.email || `${clerkId}@clerk.local`,
                password: 'clerk_placeholder_password_avoid_login',
              });
            }
          }
        } catch (clerkError) {
          console.warn('Clerk token verification failed:', clerkError.message);
        }
      }
    }

    // 3. Development Fallback: If no token provided or verification fails, fallback to first user or create dev user
    if (!user) {
      const isDev = process.env.NODE_ENV !== 'production';
      if (!token && isDev) {
        user = await User.findOne().sort({ createdAt: 1 });
        if (!user) {
          user = await User.create({
            name: 'Local Dev User',
            email: 'dev@portforge.local',
            password: 'dev_password_placeholder',
            role: 'admin',
          });
        }
      } else {
        return res.status(401).json({
          success: false,
          message: 'Not authorized — token is invalid or missing',
        });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized — token is invalid or expired',
    });
  }
};

module.exports = { protect };

