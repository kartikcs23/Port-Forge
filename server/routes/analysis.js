const express = require('express');
const multer = require('multer');
const router = express.Router();
const analysisController = require('../controllers/analysisController');

/**
 * Multer setup for memory storage (buffer passed to pdf-parse directly)
 * Limit: 5 MB | File: application/pdf
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF resume files are supported.'), false);
    }
  },
});

/**
 * POST /api/analyze
 * Public candidate analysis endpoint (supports optional PDF file upload under 'resume' field)
 */
router.post('/', (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: `File upload error: ${err.message}`,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error',
      });
    }
    next();
  });
}, analysisController.analyze);

module.exports = router;
