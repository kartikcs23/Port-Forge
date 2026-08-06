const { fetchGitHubProfile, fetchAllUserRepos, parseGithubUsername } = require('../services/githubService');
const { fetchLinkedInProfile, parseLinkedInURL } = require('../services/linkedinService');
const { scoreAndSort } = require('../services/scoringService');
const Project = require('../models/Project');
const Profile = require('../models/Profile');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * syncPortfolioSlug — Keeps an existing portfolio's public URL in step with
 * the GitHub username it was synced from, so the "Live URL" shown on the
 * dashboard doesn't stay stuck on a stale/old slug (e.g. a Clerk-name-based
 * one from before a username was known) after a (re-)sync.
 * No-op if the user has no portfolio yet, or the slug already matches.
 */
const syncPortfolioSlug = async (userId, githubUsername) => {
  const base = slugify(githubUsername);
  if (!base) return;

  const portfolio = await Portfolio.findOne({ userId });
  if (!portfolio || portfolio.slug === base) return;

  let candidate = base;
  let existing = await Portfolio.findOne({ slug: candidate, userId: { $ne: userId } });
  while (existing) {
    candidate = `${base}-${Math.random().toString(36).substring(2, 6)}`;
    existing = await Portfolio.findOne({ slug: candidate, userId: { $ne: userId } });
  }

  portfolio.slug = candidate;
  await portfolio.save();
};

const syncGithub = async (req, res) => {
  try {
    const rawLink = req.query.link || '';
    if (!rawLink) {
      return res.status(400).json({
        success: false,
        message: 'A GitHub link or username string is required as a query parameter (?link=...).',
      });
    }

    const username = parseGithubUsername(rawLink);

    if (!username) {
        return res.status(400).json({
          success: false,
          message: 'Could not parse a valid username from the provided link.',
        });
    }

    const [githubProfile, allGithubRepos] = await Promise.all([
      fetchGitHubProfile(username),
      fetchAllUserRepos(username), // owned repos + repos they collaborate on
    ]);

    // Only repos that represent the user's own contribution: exclude forks
    // (commits belong to the upstream author), archived repos, and empty
    // repos (nothing to show). Collaboration repos are already pre-filtered
    // to public, non-fork, non-archived by fetchAllUserRepos.
    const githubRepos = allGithubRepos.filter(
      (repo) => !repo.isFork && !repo.isArchived && !repo.isEmpty
    );

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
            language: repo.language || repo.languages?.[0] || '',
            languages: repo.languages,
            score: repo.score,
            repoUrl: repo.repoUrl,
            githubCreatedAt: repo.createdAt,
            githubUpdatedAt: repo.updatedAt,
            topics: repo.topics || [],
            readmeLength: repo.readmeLength || 0,
            totalCommits: repo.totalCommits || 0,
            isFork: !!repo.isFork,
            isEmpty: !!repo.isEmpty,
            isCollaboration: !!repo.isCollaboration,
            contributionCommits: repo.contributionCommits || 0,
          },
        },
        upsert: true,
      },
    }));

    // Delete all projects for this user that are NOT in the new sync batch.
    // This ensures switching GitHub usernames removes the previous user's repos.
    const newRepoIds = scoredRepos.map((r) => r.repoId);
    await Project.deleteMany({
      userId: req.user._id,
      repoId: { $nin: newRepoIds },
    });

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

    await syncPortfolioSlug(req.user._id, username);

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

const syncLinkedIn = async (req, res) => {
  try {
    const rawLink = req.query.link || req.body?.link || '';
    let linkedinInput = rawLink;
    let structuredData = null;

    console.log('[syncLinkedIn] Received:', { 
      rawLink: rawLink.substring(0, 100), 
      method: req.method,
      hasBody: !!req.body 
    });

    // If POST request with structured data, use that directly
    if (req.body && typeof req.body === 'object' && !req.body.link) {
      structuredData = req.body;
      linkedinInput = structuredData.linkedinUrl || '';
      console.log('[syncLinkedIn] Using POST structured data');
    }

    if (!linkedinInput && !structuredData) {
      console.warn('[syncLinkedIn] Empty input - no URL or data provided');
      return res.status(400).json({
        success: false,
        message: 'A LinkedIn profile URL or structured profile data is required.',
      });
    }

    // Parse LinkedIn input and extract username
    console.log('[syncLinkedIn] Calling parseLinkedInURL with:', linkedinInput.substring(0, 100));
    const { username, structuredData: parsedData } = parseLinkedInURL(linkedinInput || structuredData);
    
    console.log('[syncLinkedIn] Parse result:', { username, hasParsedData: !!parsedData, usernameLength: username?.length });
    
    if (!username || username.length === 0) {
      console.error('[syncLinkedIn] Username extraction failed for:', linkedinInput.substring(0, 100));
      return res.status(400).json({
        success: false,
        message: `Failed to extract valid LinkedIn username from: ${linkedinInput.substring(0, 60)}`,
      });
    }

    const finalStructuredData = structuredData || parsedData;

    // Fetch and parse real LinkedIn profile data
    const linkedinProfile = await fetchLinkedInProfile(username, finalStructuredData);

    // Ensure we have proper data structure
    const profileData = {
      headline: linkedinProfile.headline || '',
      summary: linkedinProfile.summary || '',
      positions: Array.isArray(linkedinProfile.positions) ? linkedinProfile.positions : [],
      education: Array.isArray(linkedinProfile.education) ? linkedinProfile.education : [],
      skills: Array.isArray(linkedinProfile.skills) ? linkedinProfile.skills : [],
      linkedinUrl: linkedinProfile.linkedinUrl || `https://www.linkedin.com/in/${username}`,
    };

    // Update user profile with LinkedIn data
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: {
          userId: req.user._id,
          headline: profileData.headline || 'LinkedIn Professional',
          bio: profileData.summary || 'Professional profile',
          linkedinData: profileData,
          'links.linkedin': profileData.linkedinUrl,
        },
      },
      { upsert: true, new: true }
    );

    console.log('[syncLinkedIn] ✅ Successfully synced for username:', username);

    res.status(200).json({
      success: true,
      data: {
        profile: profileData,
      },
      message: `Successfully synced LinkedIn profile: ${username}`,
    });
  } catch (error) {
    console.error('[syncLinkedIn] ❌ Error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to sync LinkedIn data.',
    });
  }
};

module.exports = { syncGithub, syncLinkedIn };

