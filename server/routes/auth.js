const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Auth Routes
 *
 * POST   /api/auth/register  → Create user, return JWT
 * POST   /api/auth/login     → Verify password, return JWT
 * GET    /api/auth/me        → [protected] Return current user
 *
 * OAuth routes (GitHub + LinkedIn) will be added in Phase 2.
 */

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
