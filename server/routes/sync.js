const express = require('express');
const router = express.Router();
const { syncGithub, syncLinkedIn } = require('../controllers/syncController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Sync Routes — All routes are protected (require JWT)
 *
 * GET /api/sync/github   → Fetch GitHub data by URL/username query
 * POST /api/sync/github  → Fetch GitHub data by URL in body
 * 
 * GET /api/sync/linkedin → Fetch/scrape LinkedIn data by URL query
 * POST /api/sync/linkedin → Sync LinkedIn data with structured profile data in body
 */

router.get('/github', protect, syncGithub);
router.post('/github', protect, syncGithub);

router.get('/linkedin', protect, syncLinkedIn);
router.post('/linkedin', protect, syncLinkedIn);

module.exports = router;
