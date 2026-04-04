const { fetchGitHubProfile, fetchGitHubRepos } = require('../services/githubService');
const { fetchLinkedInProfile } = require('../services/linkedinService');
const { scoreAndSort } = require('../services/scoringService');
const Project = require('../models/Project');
const Profile = require('../models/Profile');
const User = require('../models/User');

const syncGithub = async (req, res) => {
  try {
    const rawLink = req.query.link || '';
    if (!rawLink) {
      return res.status(400).json({
        success: false,
        message: 'A GitHub link or username string is required as a query parameter (?link=...).',
      });
    }

    let username = rawLink.trim();
    if (username.toLowerCase().includes('github.com/')) {
      username = username.toLowerCase().split('github.com/')[1].split('/')[0];
    } else if (username.includes('/')) {
        username = username.split('/').pop() || username.split('/')[0];
    }

    if (!username) {
        return res.status(400).json({
          success: false,
          message: 'Could not parse a valid username from the provided link.',
        });
    }

    const [githubProfile, githubRepos] = await Promise.all([
      fetchGitHubProfile(username),
      fetchGitHubRepos(username),
    ]);

    const scoredRepos = await scoreAndSort(githubRepos);

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

    await Profile.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: {
          userId: req.user._id,
          name: githubProfile.name || '',
          avatar: githubProfile.avatar || '',
          bio: githubProfile.bio,
          location: githubProfile.location,
          'links.github': githubProfile.githubUrl,
        },
      },
      { upsert: true, new: true }
    );

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
      message: error.message || 'Failed to sync GitHub data. Ensure the profile exists and is public.',
    });
  }
};

module.exports = { syncGithub };

