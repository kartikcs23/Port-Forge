const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateProfile,
  getProjects,
  togglePinProject,
  reorderPinnedProjects,
  updateProject,
  toggleProjectVisibility,
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Profile Routes — All routes are protected (require JWT)
 *
 * GET    /api/profile/me                     → Get own profile
 * PUT    /api/profile/update                 → Manually edit profile
 * GET    /api/profile/projects                → Get all synced projects
 * PATCH  /api/profile/projects/:id/pin        → Toggle pinned status
 * PATCH  /api/profile/projects/pinned/reorder → Reorder pinned projects
 */

router.get('/me', protect, getMyProfile);
router.put('/update', protect, updateProfile);
router.get('/projects', protect, getProjects);
router.patch('/projects/:id/pin', protect, togglePinProject);
router.patch('/projects/pinned/reorder', protect, reorderPinnedProjects);
router.put('/projects/:id', protect, updateProject);
router.patch('/projects/:id/visibility', protect, toggleProjectVisibility);

module.exports = router;
