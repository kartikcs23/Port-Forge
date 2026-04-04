const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { analyzeProfile } = require('../controllers/insightsController');

const router = express.Router();

/**
 * GET /api/insights/analyze
 * Runs ML analysis on user's GitHub + LinkedIn data
 * Protected route
 */
router.get('/analyze', protect, analyzeProfile);

module.exports = router;
