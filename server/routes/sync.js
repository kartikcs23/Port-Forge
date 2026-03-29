const express = require('express');
const router = express.Router();
const { syncGithub, syncLinkedin } = require('../controllers/syncController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Sync Routes — All routes are protected (require JWT)
 *
 * GET /api/sync/github   → Fetch GitHub data, save to Project + Profile
 * GET /api/sync/linkedin → Fetch LinkedIn data, save to Profile
 */

router.get('/github', protect, syncGithub);
router.get('/linkedin', protect, syncLinkedin);

module.exports = router;
