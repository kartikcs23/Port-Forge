const { fetchGitHubProfile, fetchGitHubRepos } = require('../services/githubService');
const { fetchLinkedInProfile } = require('../services/linkedinService');
const { scoreAndSort } = require('../services/scoringService');
const Project = require('../models/Project');
const Profile = require('../models/Profile');
const User = require('../models/User');

/**
 * syncGithub — Fetches GitHub profile + repos for the authenticated user,
 * scores the repos, and upserts them into the database.
 *
 * Route: GET /api/sync/github (protected)
 *
 * Note: Requires the user to have a GitHub access token stored.
 * In Phase 1, the token must be passed via the `x-github-token` header.
 * After OAuth is fully wired, the token will come from the OAuth flow.
 */
const syncGithub = async (req, res) => {
  try {
    // Get GitHub token from header (temporary) or from user's stored token
    const githubToken = req.headers['x-github-token'];

    if (!githubToken) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'GitHub access token is required. Pass it via x-github-token header.',
      });
    }

    // Fetch profile and repos from GitHub API
    const [githubProfile, githubRepos] = await Promise.all([
      fetchGitHubProfile(githubToken),
      fetchGitHubRepos(githubToken),
    ]);

    // Score and sort repos
    const scoredRepos = scoreAndSort(githubRepos);

    // Upsert each repo into the Projects collection
    const projectOps = scoredRepos.map((repo) => ({
      updateOne: {
        filter: { userId: req.user._id, repoId: repo.repoId },
        update: {
          $set: {
            userId: req.user._id,
            repoId: repo.repoId,
            name: repo.name,
            description: repo.description,
            stars: repo.stars,
            forks: repo.forks,
            languages: repo.languages,
            score: repo.score,
            repoUrl: repo.repoUrl,
            updatedAt: repo.updatedAt,
          },
        },
        upsert: true,
      },
    }));

    if (projectOps.length > 0) {
      await Project.bulkWrite(projectOps);
    }

    // Upsert profile data
    await Profile.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: {
          userId: req.user._id,
          bio: githubProfile.bio,
          location: githubProfile.location,
          'links.github': githubProfile.githubUrl,
        },
      },
      { upsert: true, new: true }
    );

    // Update user avatar if available
    if (githubProfile.avatar) {
      await User.findByIdAndUpdate(req.user._id, {
        avatar: githubProfile.avatar,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        profile: githubProfile,
        projectsCount: scoredRepos.length,
        topProjects: scoredRepos.slice(0, 5),
      },
      message: `Successfully synced ${scoredRepos.length} GitHub repositories`,
    });
  } catch (error) {
    console.error('Sync GitHub error:', error.message);
    res.status(500).json({
      success: false,
      data: null,
      message: error.message || 'Failed to sync GitHub data',
    });
  }
};

/**
 * syncLinkedin — Fetches LinkedIn profile for the authenticated user
 * and saves it to the Profile collection.
 *
 * Route: GET /api/sync/linkedin (protected)
 */
const syncLinkedin = async (req, res) => {
  try {
    const linkedinToken = req.headers['x-linkedin-token'];

    if (!linkedinToken) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'LinkedIn access token is required. Pass it via x-linkedin-token header.',
      });
    }

    const linkedinProfile = await fetchLinkedInProfile(linkedinToken);

    // Upsert profile data
    await Profile.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: {
          userId: req.user._id,
          bio: linkedinProfile.bio || undefined,
          location: linkedinProfile.location || undefined,
          'links.linkedin': linkedinProfile.linkedinUrl,
        },
        $addToSet: {
          skills: { $each: linkedinProfile.skills || [] },
        },
        $push: {
          experience: { $each: linkedinProfile.experience || [] },
          education: { $each: linkedinProfile.education || [] },
        },
      },
      { upsert: true, new: true }
    );

    // Update user avatar if not already set
    if (linkedinProfile.avatar) {
      await User.findByIdAndUpdate(
        req.user._id,
        { $setOnInsert: { avatar: linkedinProfile.avatar } },
        { upsert: false }
      );
    }

    res.status(200).json({
      success: true,
      data: { profile: linkedinProfile },
      message: 'Successfully synced LinkedIn profile',
    });
  } catch (error) {
    console.error('Sync LinkedIn error:', error.message);
    res.status(500).json({
      success: false,
      data: null,
      message: error.message || 'Failed to sync LinkedIn data',
    });
  }
};

module.exports = { syncGithub, syncLinkedin };
