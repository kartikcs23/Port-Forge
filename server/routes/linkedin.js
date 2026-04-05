const express = require('express');
const router = express.Router();
const { analyzeLinkedIn } = require('../controllers/linkedinController');
const { protect } = require('../middleware/authMiddleware');

/**
 * GET /api/linkedin/analyze
 * Analyze user's LinkedIn profile (Protected)
 */
router.get('/analyze', protect, analyzeLinkedIn);

module.exports = router;
