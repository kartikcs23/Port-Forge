const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Import routes
const authRoutes = require('./routes/auth');
const syncRoutes = require('./routes/sync');
const portfolioRoutes = require('./routes/portfolio');
const profileRoutes = require('./routes/profile');
const adminRoutes = require('./routes/admin');
const resumeRoutes = require('./routes/resume');
const insightsRoutes = require('./routes/insights');

// Initialize Express app
const app = express();

// ========================
// Global Middleware
// ========================

// Security headers
app.use(helmet());

// CORS — allow requests from the React client
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// HTTP request logger (dev mode)
app.use(morgan('dev'));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// ========================
// Rate Limiting
// ========================

// Limit auth endpoints to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    data: null,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ========================
// Mount Routes
// ========================

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/insights', insightsRoutes);

// ========================
// Health Check
// ========================

/**
 * GET / — Simple health check endpoint.
 * Returns server status and current timestamp.
 */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    data: null,
    message: 'PortForge API is running 🚀',
  });
});

// ========================
// 404 Handler
// ========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ========================
// Global Error Handler
// ========================

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    success: false,
    data: null,
    message: 'Internal server error',
  });
});

// ========================
// Start Server
// ========================

const PORT = process.env.PORT || 5000;

/**
 * startServer — Connects to MongoDB and starts the Express server.
 * Exits gracefully if the database connection fails.
 */
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 PortForge server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();
