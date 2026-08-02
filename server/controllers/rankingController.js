const { parseGithubUsername } = require('../services/githubService');
const { fetchEligibleRepoList, enrichCandidates } = require('../services/repoRankingService');
const { rankRepositoriesWithAI } = require('../services/githubModelsService');
const RankingCache = require('../models/RankingCache');
const Profile = require('../models/Profile');

/**
 * resolveUsername — Uses an explicit ?link= query param if given, otherwise
 * falls back to the user's already-synced GitHub link on their profile.
 */
const resolveUsername = async (req) => {
  const rawLink = req.query.link || req.body?.link || '';
  if (rawLink) return parseGithubUsername(rawLink);

  const profile = await Profile.findOne({ userId: req.user._id });
  if (profile?.links?.github) return parseGithubUsername(profile.links.github);

  return '';
};

/**
 * rankRepositories — Analyzes a GitHub profile's repos and returns an
 * AI-ranked featured / recommended / hidden breakdown for portfolio
 * curation. Exactly one AI request per profile per cache miss.
 *
 * Route: GET|POST /api/ranking/analyze (protected)
 * Query/body: { link? } — GitHub profile URL or username; falls back to
 * the signed-in user's synced GitHub link if omitted.
 */
const rankRepositories = async (req, res) => {
  try {
    const username = await resolveUsername(req);
    if (!username) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'No GitHub username provided or synced. Pass ?link=<github-url-or-username> or sync GitHub first.',
      });
    }

    // Cheap: one API call, no README/language fetches yet — enough to
    // compute the cache key and short-circuit before any expensive work.
    const eligible = await fetchEligibleRepoList(username);

    if (eligible.length === 0) {
      return res.status(200).json({
        success: true,
        data: { featured_projects: [], recommended_projects: [], hidden_projects: [], cached: false },
        message: 'No eligible repositories found (forks, archived, and empty repos are excluded).',
      });
    }

    const latestRepoUpdatedAt = eligible.reduce(
      (latest, r) => (new Date(r.updatedAt) > latest ? new Date(r.updatedAt) : latest),
      new Date(0)
    );

    const cached = await RankingCache.findOne({ userId: req.user._id });
    if (
      cached &&
      cached.githubUsername === username &&
      cached.latestRepoUpdatedAt.getTime() === latestRepoUpdatedAt.getTime()
    ) {
      return res.status(200).json({
        success: true,
        data: { ...cached.result, cached: true },
        message: 'Ranking retrieved from cache (no repos changed since last analysis).',
      });
    }

    // Cache miss — now do the expensive per-repo README/language fetch,
    // which also drops any repo without a README.
    const candidates = await enrichCandidates(eligible);

    if (candidates.length === 0) {
      return res.status(200).json({
        success: true,
        data: { featured_projects: [], recommended_projects: [], hidden_projects: [], cached: false },
        message: 'No eligible repositories found (forks, archived, empty, and repos without a README are excluded).',
      });
    }

    const result = await rankRepositoriesWithAI(candidates);

    await RankingCache.findOneAndUpdate(
      { userId: req.user._id },
      {
        userId: req.user._id,
        githubUsername: username,
        latestRepoUpdatedAt,
        repoCount: candidates.length,
        result,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      data: { ...result, cached: false },
      message: `Ranked ${candidates.length} repositories with a single AI request.`,
    });
  } catch (error) {
    console.error('Repository ranking error:', error.message);

    // A transient upstream outage (e.g. a GitHub Models "brownout") isn't
    // something a retry-right-now or an error banner helps with — degrade
    // to showing repos unranked instead of failing the whole request.
    if (error.transient) {
      return res.status(200).json({
        success: true,
        data: { featured_projects: [], recommended_projects: [], hidden_projects: [], cached: false, aiUnavailable: true },
        message: 'AI ranking is temporarily unavailable (GitHub service outage) — showing your repositories unranked for now.',
      });
    }

    res.status(500).json({
      success: false,
      data: null,
      message: error.message || 'Failed to rank repositories',
    });
  }
};

module.exports = { rankRepositories };
