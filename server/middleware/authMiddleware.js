const { verifyToken } = require('@clerk/clerk-sdk-node');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const CLERK_ISSUER = process.env.CLERK_ISSUER;
// No fallback default. A hardcoded default signing secret would be visible
// to anyone reading this source file, making every locally-issued JWT
// forgeable. If JWT_SECRET isn't configured, the local-JWT path below
// simply never verifies anything — it fails closed, not open.
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * protect — Express middleware that verifies either a local JWT (from
 * /api/auth/register|login) or a Clerk session JWT. On success, attaches
 * the local user object to req.user. Always fails closed: a missing or
 * invalid token is always rejected with 401, in every environment —
 * there is no "no token → let them in anyway" fallback.
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
      return res.status(401).json({
        success: false,
        message: 'Not authorized — no token provided',
      });
    }

    let user = null;

    // 1. Try local JWT token verification (only meaningful if JWT_SECRET is configured)
    if (JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded && decoded.id) {
          user = await User.findById(decoded.id);
        }
      } catch (localJwtError) {
        // Not a valid local JWT, will attempt Clerk verification below
      }
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

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized — token is invalid or expired',
      });
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

