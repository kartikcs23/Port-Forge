const express = require('express');
const router = express.Router();
const { protect: requireAuth } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');
const {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllPortfolios,
  togglePortfolioPublish,
  bulkUpdateUsers,
  bulkDeletePortfolios,
  getSystemLogs,
  clearCache
} = require('../controllers/adminController');

// All admin routes require authentication and admin role
// Note: Applying async middleware individually to each route

// Check admin status endpoint (returns 200 OK for all authenticated users)
router.get('/check', requireAuth, (req, res) => {
  res.status(200).json({
    success: true,
    isAdmin: req.user?.role === 'admin'
  });
});

// Dashboard stats
router.get('/stats', requireAuth, requireAdmin, getAdminStats);

// User management
router.get('/users', requireAuth, requireAdmin, getAllUsers);
router.patch('/users/:userId/role', requireAuth, requireAdmin, updateUserRole);
router.delete('/users/:userId', requireAuth, requireAdmin, deleteUser);
router.patch('/users/bulk', requireAuth, requireAdmin, bulkUpdateUsers);

// Portfolio management
router.get('/portfolios', requireAuth, requireAdmin, getAllPortfolios);
router.patch('/portfolios/:portfolioId/publish', requireAuth, requireAdmin, togglePortfolioPublish);
router.delete('/portfolios/bulk', requireAuth, requireAdmin, bulkDeletePortfolios);

// System maintenance
router.get('/system/logs', requireAuth, requireAdmin, getSystemLogs);
router.post('/system/clear-cache', requireAuth, requireAdmin, clearCache);

module.exports = router;