const express = require('express');
const router = express.Router();
const { rankRepositories } = require('../controllers/rankingController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Ranking Routes
 *
 * GET  /api/ranking/analyze  → [protected] AI-rank a GitHub profile's repos
 * POST /api/ranking/analyze  → [protected] Same, with { link } in the body
 *
 * One AI request per profile per cache miss — repeated calls with no repo
 * changes since the last analysis return the cached result.
 */
router.get('/analyze', protect, rankRepositories);
router.post('/analyze', protect, rankRepositories);

module.exports = router;
