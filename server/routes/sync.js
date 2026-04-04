const express = require('express');
const router = express.Router();
const { syncGithub } = require('../controllers/syncController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Sync Routes — All routes are protected (require JWT)
 *
 * GET /api/sync/github   → Fetch GitHub data, save to Project + Profile
 */

router.get('/github', protect, syncGithub);

module.exports = router;
