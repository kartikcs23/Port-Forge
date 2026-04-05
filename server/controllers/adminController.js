const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Profile = require('../models/Profile');
const Project = require('../models/Project');

/**
 * Get Admin Dashboard Stats
 */
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPortfolios = await Portfolio.countDocuments();
    const publishedPortfolios = await Portfolio.countDocuments({ published: true });
    const totalProjects = await Project.countDocuments();

    // Recent users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Recent portfolios
    const recentPortfolios = await Portfolio.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // User growth over time (last 12 months)
    const monthlyStats = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const usersInMonth = await User.countDocuments({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      });

      const portfoliosInMonth = await Portfolio.countDocuments({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      });

      monthlyStats.push({
        month: startOfMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        users: usersInMonth,
        portfolios: portfoliosInMonth
      });
    }

    // Top skills analysis
    const skillStats = await Profile.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // System health metrics
    const activeUsers = await User.countDocuments({
      updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalPortfolios,
        publishedPortfolios,
        totalProjects,
        recentUsers,
        recentPortfolios,
        activeUsers,
        publishRate: totalPortfolios > 0 ? ((publishedPortfolios / totalPortfolios) * 100).toFixed(1) : 0,
        monthlyStats,
        topSkills: skillStats,
        systemHealth: {
          status: 'healthy',
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
          nodeVersion: process.version
        }
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin statistics'
    });
  }
};

/**
 * Get All Users (Admin) with advanced filtering
 */
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.plan) filter.plan = req.query.plan;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get portfolio count for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const portfolioCount = await Portfolio.countDocuments({ userId: user._id });
        const publishedCount = await Portfolio.countDocuments({ userId: user._id, published: true });
        const projectCount = await Project.countDocuments({ userId: user._id });

        return {
          ...user,
          stats: {
            portfolios: portfolioCount,
            publishedPortfolios: publishedCount,
            projects: projectCount
          }
        };
      })
    );

    const totalUsers = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        users: usersWithStats,
        pagination: {
          page,
          limit,
          total: totalUsers,
          pages: Math.ceil(totalUsers / limit)
        },
        filters: {
          role: req.query.role,
          plan: req.query.plan,
          search: req.query.search
        }
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

/**
 * Update User Role (Admin)
 */
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, plan } = req.body;

    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be "user" or "admin"'
      });
    }

    if (plan && !['free', 'pro'].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan. Must be "free" or "pro"'
      });
    }

    const updateData = {};
    if (role) updateData.role = role;
    if (plan) updateData.plan = plan;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { user },
      message: `User updated successfully`
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};

/**
 * Delete User (Admin) with cascade delete
 */
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Don't allow deleting self
    if (req.adminUser._id.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Get user info before deletion
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete associated data
    const deleteResults = await Promise.all([
      Portfolio.deleteMany({ userId }),
      Profile.deleteMany({ userId }),
      Project.deleteMany({ userId }),
      User.findByIdAndDelete(userId)
    ]);

    res.status(200).json({
      success: true,
      message: `User "${user.name}" and all associated data deleted successfully`,
      deletedData: {
        portfolios: deleteResults[0].deletedCount,
        profiles: deleteResults[1].deletedCount,
        projects: deleteResults[2].deletedCount
      }
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};

/**
 * Get All Portfolios (Admin) with advanced features
 */
const getAllPortfolios = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.published !== undefined) {
      filter.published = req.query.published === 'true';
    }
    if (req.query.theme) filter.theme = req.query.theme;
    if (req.query.search) {
      // Find portfolios by slug or user name
      const users = await User.find({
        name: { $regex: req.query.search, $options: 'i' }
      }).select('_id');

      filter.$or = [
        { slug: { $regex: req.query.search, $options: 'i' } },
        { userId: { $in: users.map(u => u._id) } }
      ];
    }

    const portfolios = await Portfolio.find(filter)
      .populate('userId', 'name email avatar role plan')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get project count for each portfolio
    const portfoliosWithStats = await Promise.all(
      portfolios.map(async (portfolio) => {
        const projectCount = await Project.countDocuments({ userId: portfolio.userId._id });

        return {
          ...portfolio,
          stats: {
            projects: projectCount,
            views: portfolio.views || 0
          }
        };
      })
    );

    const totalPortfolios = await Portfolio.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        portfolios: portfoliosWithStats,
        pagination: {
          page,
          limit,
          total: totalPortfolios,
          pages: Math.ceil(totalPortfolios / limit)
        },
        filters: {
          published: req.query.published,
          theme: req.query.theme,
          search: req.query.search
        }
      }
    });
  } catch (error) {
    console.error('Get all portfolios error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolios'
    });
  }
};

/**
 * Toggle Portfolio Publish Status (Admin)
 */
const togglePortfolioPublish = async (req, res) => {
  try {
    const { portfolioId } = req.params;

    const portfolio = await Portfolio.findById(portfolioId);

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    portfolio.published = !portfolio.published;
    await portfolio.save();

    res.status(200).json({
      success: true,
      data: { portfolio },
      message: `Portfolio ${portfolio.published ? 'published' : 'unpublished'}`
    });
  } catch (error) {
    console.error('Toggle portfolio publish error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle portfolio publish status'
    });
  }
};

/**
 * Bulk Operations (Admin)
 */
const bulkUpdateUsers = async (req, res) => {
  try {
    const { userIds, updates } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'userIds array is required'
      });
    }

    const updateData = {};
    if (updates.role) updateData.role = updates.role;
    if (updates.plan) updateData.plan = updates.plan;

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      updateData
    );

    res.status(200).json({
      success: true,
      data: {
        matched: result.matchedCount,
        modified: result.modifiedCount
      },
      message: `Updated ${result.modifiedCount} users`
    });
  } catch (error) {
    console.error('Bulk update users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bulk update users'
    });
  }
};

const bulkDeletePortfolios = async (req, res) => {
  try {
    const { portfolioIds } = req.body;

    if (!portfolioIds || !Array.isArray(portfolioIds) || portfolioIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'portfolioIds array is required'
      });
    }

    const result = await Portfolio.deleteMany({ _id: { $in: portfolioIds } });

    res.status(200).json({
      success: true,
      data: { deleted: result.deletedCount },
      message: `Deleted ${result.deletedCount} portfolios`
    });
  } catch (error) {
    console.error('Bulk delete portfolios error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bulk delete portfolios'
    });
  }
};

/**
 * System Maintenance (Admin)
 */
const getSystemLogs = async (req, res) => {
  try {
    // This would typically read from log files
    // For now, return mock system logs
    const mockLogs = [
      { timestamp: new Date(), level: 'info', message: 'Server started successfully' },
      { timestamp: new Date(Date.now() - 3600000), level: 'info', message: 'Database connection established' },
      { timestamp: new Date(Date.now() - 7200000), level: 'warn', message: 'High memory usage detected' }
    ];

    res.status(200).json({
      success: true,
      data: { logs: mockLogs }
    });
  } catch (error) {
    console.error('Get system logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system logs'
    });
  }
};

const clearCache = async (req, res) => {
  try {
    // This would typically clear Redis cache or application cache
    // For now, just return success
    res.status(200).json({
      success: true,
      message: 'Cache cleared successfully'
    });
  } catch (error) {
    console.error('Clear cache error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cache'
    });
  }
};

module.exports = {
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
};