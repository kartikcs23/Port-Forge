const Project = require('../models/Project');
const Profile = require('../models/Profile');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Load ML modules directly
const { buildFeatures } = require('../linkedin-ml/src/featureEngineering');
const { scoreProjects } = require('../linkedin-ml/src/projectScoring');
const { assignBadges } = require('../linkedin-ml/src/badges');
const { buildTimeline } = require('../linkedin-ml/src/timeline');
const { findSimilarDevelopers } = require('../linkedin-ml/src/similarity');

/**
 * analyzeProfile — Runs ML analysis on user's GitHub + LinkedIn data
 * 
 * Route: GET /api/insights/analyze (protected)
 */
const analyzeProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user's projects (GitHub data)
    const projects = await Project.find({ userId });
    const profile = await Profile.findOne({ userId });
    const user = await User.findById(userId);

    if (!projects || projects.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No GitHub repositories found. Sync GitHub first.',
      });
    }

    // Build GitHub JSON structure for ML module
    const githubData = {
      profile: {
        username: user?.username || user?.name?.toLowerCase().replace(/\s+/g, '') || 'unknown',
        name: user?.name || 'Unknown',
        bio: profile?.bio || '',
        createdAt: user?.createdAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
      },
      repos: projects.map((p) => ({
        name: p.name || '',
        description: p.description || '',
        primaryLanguage: Object.keys(p.languages || {})[0] || 'Unknown',
        stars: p.stars || 0,
        forks: p.forks || 0,
        openIssues: 0,
        totalIssuesClosed: 0,
        totalCommits: p.totalCommits || 0,
        isFork: p.isFork || false,
        isEmpty: !p.name,
        createdAt: p.createdAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        updatedAt: p.updatedAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        readmeLength: p.readmeLength || 0,
        topics: p.topics || [],
        languages: p.languages || {}
      })),
      commits: [],
      issues: []
    };

    // Build LinkedIn JSON structure
    const linkedinData = {
      profile: profile ? {
        headline: profile.headline || '',
        summary: profile.bio || ''
      } : null,
      positions: profile?.linkedinData?.positions || [],
      education: profile?.linkedinData?.education || [],
      skills: profile?.linkedinData?.skills || []
    };

    // Run ML analysis directly (no subprocess)
    const features = buildFeatures({ github: githubData, linkedin: linkedinData });
    const projectScores = scoreProjects(githubData);
    const badges = assignBadges(githubData);
    const timeline = buildTimeline({ github: githubData, linkedin: linkedinData });

    const analysis = {
      features,
      projectScores,
      badges,
      timeline,
      similarity: []
    };

    res.status(200).json({
      success: true,
      data: {
        github: githubData,
        linkedin: linkedinData,
        analysis
      },
      message: 'Profile analysis completed successfully'
    });

  } catch (error) {
    console.error('Analyze profile error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze profile'
    });
  }
};

module.exports = {
  analyzeProfile
};
