const Portfolio = require('../models/Portfolio');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const User = require('../models/User');
const { findSimilarDevelopers } = require('../linkedin-ml/src/similarity');
const { fetchGitHubContributions } = require('../services/githubService');

/**
 * generateSlug — Creates a URL-friendly slug from the user's name.
 * Appends a random suffix to ensure uniqueness.
 * @param {string} name — user's display name
 * @returns {string} unique slug
 */
const generateSlug = (name) => {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
};

/**
 * generatePortfolio — Creates a new portfolio for the authenticated user,
 * or returns the existing one if already created.
 *
 * Route: POST /api/portfolio/generate (protected)
 */
const generatePortfolio = async (req, res) => {
  try {
    // Check if user already has a portfolio
    let portfolio = await Portfolio.findOne({ userId: req.user._id });

    if (portfolio) {
      return res.status(200).json({
        success: true,
        data: { portfolio },
        message: 'Portfolio already exists',
      });
    }

    // Generate a unique slug
    let slug = generateSlug(req.user.name);

    // Ensure slug is unique (retry if collision)
    let slugExists = await Portfolio.findOne({ slug });
    while (slugExists) {
      slug = generateSlug(req.user.name);
      slugExists = await Portfolio.findOne({ slug });
    }

    // Create the portfolio
    portfolio = await Portfolio.create({
      userId: req.user._id,
      slug,
      theme: req.body.theme || 'default',
      published: false,
    });

    res.status(201).json({
      success: true,
      data: { portfolio },
      message: 'Portfolio generated successfully',
    });
  } catch (error) {
    console.error('Generate portfolio error:', error.message);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to generate portfolio',
    });
  }
};

/**
 * getMyPortfolio — Returns the authenticated user's portfolio.
 *
 * Route: GET /api/portfolio/mine (protected)
 */
const getMyPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user._id });

    if (!portfolio) {
      return res.status(200).json({
        success: false,
        data: null,
        message: 'No portfolio found. Generate one first.',
      });
    }

    res.status(200).json({
      success: true,
      data: { portfolio },
      message: 'Portfolio retrieved',
    });
  } catch (error) {
    console.error('Get portfolio error:', error.message);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to retrieve portfolio',
    });
  }
};

/**
 * togglePublish — Toggles the published status of the user's portfolio.
 *
 * Route: PATCH /api/portfolio/publish (protected)
 */
const togglePublish = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user._id });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'No portfolio found. Generate one first.',
      });
    }

    portfolio.published = !portfolio.published;
    await portfolio.save();

    res.status(200).json({
      success: true,
      data: { portfolio },
      message: `Portfolio ${portfolio.published ? 'published' : 'unpublished'}`,
    });
  } catch (error) {
    console.error('Toggle publish error:', error.message);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to toggle publish status',
    });
  }
};

/**
 * getPublicPortfolio — Fetches a full portfolio by slug (public route).
 * Increments the view counter on each request.
 *
 * Route: GET /api/portfolio/:slug (PUBLIC)
 */
const getPublicPortfolio = async (req, res) => {
  try {
    const { slug } = req.params;

    // Search by slug first (case-insensitive)
    let portfolio = await Portfolio.findOne({ slug: { $regex: new RegExp(`^${slug}$`, 'i') } });

    if (!portfolio) {
      // Fallback: search in Profile for a matching name (case-insensitive)
      const profile = await Profile.findOne({ name: { $regex: new RegExp(`^${slug}$`, 'i') } });
      if (profile) {
        portfolio = await Portfolio.findOne({ userId: profile.userId });
      }
    }

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Portfolio not found',
      });
    }

    // Portfolio is always accessible by slug - no published check needed
    // Increment view count
    portfolio.views += 1;
    await portfolio.save();

    // Fetch user, profile, and projects
    const [user, profile, projects] = await Promise.all([
      User.findById(portfolio.userId),
      Profile.findOne({ userId: portfolio.userId }),
      Project.find({ userId: portfolio.userId, hidden: { $ne: true } }).sort({ pinned: -1, score: -1 }).limit(8),
    ]);

    res.status(200).json({
      success: true,
      data: {
        rootUser: user
          ? {
              name: user.name,
              avatar: user.avatar,
              plan: user.plan,
            }
          : null,
        portfolio: {
          slug: portfolio.slug,
          theme: portfolio.theme,
          views: portfolio.views,
        },
        profile: profile || null,
        repos: projects || [],
      },
      message: 'Portfolio data retrieved',
    });
  } catch (error) {
    console.error('Get public portfolio error:', error.message);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to retrieve portfolio',
    });
  }
};

const updatePortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ userId: req.user._id });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'No portfolio found. Generate one first.',
      });
    }

    if (req.body.theme !== undefined) {
      portfolio.theme = req.body.theme;
    }

    if (req.body.slug !== undefined) {
      portfolio.slug = req.body.slug;
    }

    await portfolio.save();

    res.status(200).json({
      success: true,
      data: { portfolio },
      message: 'Portfolio updated successfully',
    });
  } catch (error) {
    console.error('Update portfolio error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update portfolio',
    });
  }
};

module.exports = {
  generatePortfolio,
  getMyPortfolio,
  togglePublish,
  updatePortfolio,
  getPublicPortfolio,
  updatePortfolio,
};
