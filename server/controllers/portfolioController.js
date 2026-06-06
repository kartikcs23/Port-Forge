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

    const portfolio = await Portfolio.findOne({ slug });

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
      Project.find({ userId: portfolio.userId }).sort({ score: -1 }).limit(5),
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

/**
 * getSimilarDevelopers — Finds similar developers for a public portfolio.
 *
 * Route: GET /api/portfolio/:slug/similar (PUBLIC)
 */
const getSimilarDevelopers = async (req, res) => {
  try {
    const { slug } = req.params;
    const portfolio = await Portfolio.findOne({ slug });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Portfolio not found',
      });
    }

    const [baseUser, baseProfile, baseProjects] = await Promise.all([
      User.findById(portfolio.userId),
      Profile.findOne({ userId: portfolio.userId }),
      Project.find({ userId: portfolio.userId }),
    ]);

    const extractGithubUsername = (profile, user) => {
      const githubUrl = profile?.links?.github || '';
      const match = githubUrl.match(/github\.com\/([^/]+)/i);
      return match?.[1] || user?.username || '';
    };

    const buildGithubFromProjects = (projects) =>
      (projects || []).map((project) => ({
        name: project.name,
        languages: project.languages?.length
          ? project.languages
          : project.language
            ? [project.language]
            : [],
        topics: project.topics || [],
        isFork: project.isFork || false,
        isEmpty: project.isEmpty || false,
      }));

    const baseUsername = extractGithubUsername(baseProfile, baseUser);
    if (!baseUsername) {
      return res.status(200).json({
        success: true,
        data: { matches: [] },
        message: 'No GitHub username available for similarity matching.',
      });
    }

    const [baseContributions, candidatePortfolios] = await Promise.all([
      fetchGitHubContributions(baseUsername),
      Portfolio.find({ _id: { $ne: portfolio._id }, published: true }).limit(12),
    ]);

    const candidates = await Promise.all(
      candidatePortfolios.map(async (candidate) => {
        const [user, profile, projects] = await Promise.all([
          User.findById(candidate.userId),
          Profile.findOne({ userId: candidate.userId }),
          Project.find({ userId: candidate.userId }),
        ]);

        const username = extractGithubUsername(profile, user);
        if (!username) return null;

        const contributions = await fetchGitHubContributions(username);

        return {
          username,
          slug: candidate.slug,
          name: profile?.name || user?.name || username,
          avatar: profile?.avatar || user?.avatar || '',
          githubUrl: profile?.links?.github || '',
          repos: buildGithubFromProjects(projects),
          contributions,
        };
      })
    );

    const filteredCandidates = candidates.filter(Boolean);
    const candidateGithub = filteredCandidates.map((candidate) => ({
      profile: { username: candidate.username },
      repos: candidate.repos,
      contributions: candidate.contributions,
    }));

    const similar = findSimilarDevelopers(
      {
        profile: { username: baseUsername },
        repos: buildGithubFromProjects(baseProjects),
        contributions: baseContributions,
      },
      candidateGithub
    );

    const byUsername = new Map(filteredCandidates.map((candidate) => [candidate.username, candidate]));
    const matches = similar
      .map((match) => {
        const candidate = byUsername.get(match.username);
        if (!candidate) return null;
        return {
          username: candidate.username,
          name: candidate.name,
          slug: candidate.slug,
          avatar: candidate.avatar,
          githubUrl: candidate.githubUrl,
          score: match.score,
        };
      })
      .filter(Boolean);

    res.status(200).json({
      success: true,
      data: { matches },
      message: 'Similar developers retrieved',
    });
  } catch (error) {
    console.error('Get similar developers error:', error.message);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to retrieve similar developers',
    });
  }
};

/**
 * updatePortfolio — Updates mutable fields on the user's portfolio (theme, etc.)
 *
 * Route: PUT /api/portfolio/update (protected)
 */
const updatePortfolio = async (req, res) => {
  try {
    const allowedFields = ['theme', 'customDomain'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'No portfolio found. Generate one first.',
      });
    }

    res.status(200).json({
      success: true,
      data: { portfolio },
      message: 'Portfolio updated',
    });
  } catch (error) {
    console.error('Update portfolio error:', error.message);
    res.status(500).json({
      success: false,
      data: null,
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
  getSimilarDevelopers,
};
