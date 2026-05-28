const express = require('express');
const router = express.Router();
const {
  generatePortfolio,
  getMyPortfolio,
  togglePublish,
  updatePortfolio,
  getPublicPortfolio,
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Portfolio Routes
 *
 * POST   /api/portfolio/generate  → [protected] Create portfolio, assign slug
 * GET    /api/portfolio/mine      → [protected] Get own portfolio
 * PATCH  /api/portfolio/publish   → [protected] Toggle published status
 * PUT    /api/portfolio/update    → [protected] Update portfolio fields (theme, etc.)
 * GET    /api/portfolio/:slug     → [PUBLIC] Fetch full portfolio + increment views
 */

router.post('/generate', protect, generatePortfolio);
router.get('/mine', protect, getMyPortfolio);
router.patch('/publish', protect, togglePublish);
router.put('/update', protect, updatePortfolio); // Must be before /:slug
router.get('/:slug', getPublicPortfolio); // Public route — no auth required

module.exports = router;
