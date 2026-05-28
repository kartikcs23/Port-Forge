const Project = require('../models/Project');
const Profile = require('../models/Profile');
const User = require('../models/User');
const {
  fetchGitHubContributions,
  fetchGitHubEvents,
  fetchGitHubIssueStats,
  fetchGitHubRepos,
  hasGithubToken,
} = require('../services/githubService');

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

    const extractGithubUsername = (url) => {
      if (!url) return '';
      return url.match(/github\.com\/([^/]+)/i)?.[1] || '';
    };

    const githubUrl = profile?.links?.github || '';
    const githubUsernameFromUrl = extractGithubUsername(githubUrl);
    const githubUsernameFromProjects =
      projects.map((project) => extractGithubUsername(project.repoUrl)).find(Boolean) || '';
    const githubUsername =
      githubUsernameFromUrl ||
      githubUsernameFromProjects ||
      user?.username ||
      user?.name?.toLowerCase().replace(/\s+/g, '') ||
      'unknown';
    const safeUsername = githubUsername && githubUsername !== 'unknown' ? githubUsername : '';
    const canUseGitHubApi = hasGithubToken();

    const createdAtValues = new Set(
      projects
        .map((project) => project.githubCreatedAt || project.createdAt)
        .filter(Boolean)
        .map((value) => (value instanceof Date ? value.toISOString() : String(value)))
    );

    const needsRepoRefresh =
      !!safeUsername &&
      (createdAtValues.size <= 1 ||
        projects.some(
          (project) =>
            !project.githubCreatedAt ||
            !project.githubUpdatedAt ||
            !project.language ||
            !project.totalCommits
        ));

    let freshRepos = [];
    if (needsRepoRefresh && canUseGitHubApi) {
      try {
        freshRepos = await fetchGitHubRepos(safeUsername);
      } catch (error) {
        console.warn('GitHub repo refresh skipped:', error.message);
      }
    }
    const repoById = new Map(freshRepos.map((repo) => [repo.repoId, repo]));
    const repoByName = new Map(freshRepos.map((repo) => [repo.name, repo]));

    const updateOps =
      freshRepos.length > 0
        ? freshRepos.map((repo) => ({
            updateOne: {
              filter: { userId, repoId: repo.repoId },
              update: {
                $set: {
                  name: repo.name,
                  description: repo.description,
                  stars: repo.stars,
                  forks: repo.forks,
                  language: repo.language || '',
                  languages: repo.languages || [],
                  repoUrl: repo.repoUrl,
                  topics: repo.topics || [],
                  readmeLength: repo.readmeLength || 0,
                  totalCommits: repo.totalCommits || 0,
                  isFork: !!repo.isFork,
                  isEmpty: !!repo.isEmpty,
                  githubCreatedAt: repo.createdAt,
                  githubUpdatedAt: repo.updatedAt,
                },
              },
            },
          }))
        : [];

    if (updateOps.length > 0) {
      await Project.bulkWrite(updateOps, { ordered: false });
    }

    const [contributions, commits, issueStats] = await Promise.all([
      fetchGitHubContributions(safeUsername),
      canUseGitHubApi ? fetchGitHubEvents(safeUsername) : Promise.resolve([]),
      canUseGitHubApi ? fetchGitHubIssueStats(safeUsername) : Promise.resolve({ closed: 0 }),
    ]);

    const buildContributionFallback = (commitEvents) => {
      const map = new Map();
      (commitEvents || []).forEach((commit) => {
        const dateKey = commit?.date?.split('T')[0];
        if (!dateKey) return;
        map.set(dateKey, (map.get(dateKey) || 0) + 1);
      });
      return Array.from(map.entries()).map(([date, count]) => ({ date, count }));
    };

    const normalizedContributions =
      contributions && contributions.length > 0 ? contributions : buildContributionFallback(commits);

    const normalizeLanguages = (repo) => {
      if (Array.isArray(repo.languages)) {
        const map = {};
        repo.languages.forEach((lang) => {
          if (!lang) return;
          map[lang] = (map[lang] || 0) + 1;
        });
        return map;
      }
      if (repo.languages && typeof repo.languages === 'object') {
        return repo.languages;
      }
      if (repo.language) {
        return { [repo.language]: 1 };
      }
      return {};
    };

    // Build GitHub JSON structure for ML module
    const githubData = {
      profile: {
        username: githubUsername,
        name: user?.name || 'Unknown',
        bio: profile?.bio || '',
        createdAt: user?.createdAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
      },
      repos: projects.map((p) => {
        const fresh = repoById.get(p.repoId) || repoByName.get(p.name) || null;
        const merged = {
          name: fresh?.name || p.name || '',
          description: fresh?.description || p.description || '',
          primaryLanguage:
            fresh?.language ||
            p.language ||
            (Array.isArray(p.languages) ? p.languages[0] : null) ||
            'Unknown',
          stars: fresh?.stars ?? p.stars ?? 0,
          forks: fresh?.forks ?? p.forks ?? 0,
          openIssues: 0,
          totalIssuesClosed: 0,
          totalCommits: fresh?.totalCommits ?? p.totalCommits ?? 0,
          isFork: fresh?.isFork ?? p.isFork ?? false,
          isEmpty: fresh?.isEmpty ?? !p.name,
          createdAt:
            fresh?.createdAt ||
            (p.githubCreatedAt || p.createdAt)?.toISOString().split('T')[0] ||
            new Date().toISOString().split('T')[0],
          updatedAt:
            fresh?.updatedAt ||
            (p.githubUpdatedAt || p.updatedAt)?.toISOString().split('T')[0] ||
            new Date().toISOString().split('T')[0],
          readmeLength: fresh?.readmeLength ?? p.readmeLength ?? 0,
          topics: fresh?.topics || p.topics || [],
          languages: normalizeLanguages({
            languages: fresh?.languages || p.languages,
            language: fresh?.language || p.language,
          }),
        };
        return merged;
      }),
      commits,
      issues: [],
      issueStats,
      contributions: normalizedContributions
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
