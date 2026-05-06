const express = require('express');
const multer = require('multer');
const router = express.Router();
const { uploadResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Multer — memory storage (buffer passed directly to pdf-parse, no disk write).
 * Limit: 5 MB  |  Accepted: application/pdf only
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are accepted.'), false);
    }
  },
});

/**
 * Resume Routes
 *
 * POST /api/resume/upload  → [protected, multipart] Parse PDF & upsert Profile
 */
router.post(
  '/upload',
  protect,
  upload.single('resume'),
  uploadResume
);

module.exports = router;
