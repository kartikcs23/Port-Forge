const axios = require('axios');
const { buildGithubHeaders, fetchContributedRepos } = require('./githubService');

/* ═══════════════════════════════════════════════════════
   REPO RANKING SERVICE
   Fetches a candidate repo set for a GitHub user, intelligently
   truncates README content, and builds the single comparative
   ranking prompt sent to the AI. One profile = one AI request.
 ═══════════════════════════════════════════════════════ */

// Hard cap on how many repos we'll ever send in one prompt, even for users
// with huge repo counts — keeps the request within the model's context
// budget (meta/Llama-4-Scout-17B-16E-Instruct on GitHub Models caps input
// at 8000 tokens) and the response fast. Most-recently-updated repos win.
// Collaboration repos (large projects like Next.js/React) tend to carry
// bigger READMEs than solo side-projects, so this — combined with a
// smaller per-README budget below — keeps real accounts with many
// collaborations safely under the limit.
const MAX_CANDIDATE_REPOS = 15;

// Per-README character budget after intelligent section extraction.
const README_CHAR_BUDGET = 600;

/**
 * fetchEligibleRepoList — Combines the user's own repos with repos they
 * collaborate on (real commit contributions, per fetchContributedRepos),
 * normalized to one shape and pre-filtered (fork/archived/empty excluded).
 * Deliberately does NOT fetch README/language data yet — this is what the
 * cache-key check runs against, so a cache hit never pays for the
 * expensive per-repo fetches in enrichCandidates.
 * @param {string} username
 * @returns {Promise<Array>} normalized repos, newest-updated first, each
 *   tagged with ownerLogin (the repo's actual owner — matters for
 *   collaboration repos, where it isn't `username`)
 */
const fetchEligibleRepoList = async (username) => {
  const [{ data: ownedRaw }, contributed] = await Promise.all([
    axios.get(`https://api.github.com/users/${username}/repos`, {
      headers: buildGithubHeaders(),
      params: { per_page: 100, sort: 'updated', type: 'owner' },
    }),
    fetchContributedRepos(username), // already excludes fork/archived/private, normalized
  ]);

  const owned = (ownedRaw || []).map((r) => ({
    repoId: String(r.id),
    name: r.name,
    ownerLogin: username,
    description: r.description || '',
    stars: r.stargazers_count || 0,
    forks: r.forks_count || 0,
    language: r.language || '',
    topics: r.topics || [],
    repoUrl: r.html_url,
    updatedAt: r.updated_at,
    sizeKb: r.size || 0,
    isFork: !!r.fork,
    isArchived: !!r.archived,
    isEmpty: Number(r.size || 0) === 0,
  }));

  const ownedIds = new Set(owned.map((r) => r.repoId));
  const newContributed = contributed.filter((r) => !ownedIds.has(r.repoId));

  return [...owned, ...newContributed]
    .filter((r) => !r.isFork && !r.isArchived && !r.isEmpty)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, MAX_CANDIDATE_REPOS);
};

/**
 * enrichCandidates — Fetches README + language breakdown for an already
 * fork/archived/empty-filtered repo list, and drops any repo without a
 * README (per the exclusion rules). Only called on a cache miss. Uses
 * each repo's own ownerLogin (not necessarily the profile being ranked —
 * matters for collaboration repos).
 * @param {Array} eligibleRepos — from fetchEligibleRepoList
 * @returns {Promise<Array>} fully enriched candidate repos
 */
const enrichCandidates = async (eligibleRepos) => {
  const enriched = await Promise.all(
    eligibleRepos.map(async (repo) => {
      const owner = repo.ownerLogin;
      const [readme, languages] = await Promise.all([
        fetchReadme(owner, repo.name),
        fetchLanguages(owner, repo.name),
      ]);

      if (!readme) return null; // exclusion rule: no README → dropped

      return {
        name: repo.name,
        description: repo.description || '',
        language: repo.language || languages[0] || '',
        languages: languages.length ? languages : repo.language ? [repo.language] : [],
        stars: repo.stars || 0,
        forks: repo.forks || 0,
        updatedAt: repo.updatedAt,
        topics: repo.topics || [],
        sizeKb: repo.sizeKb || 0,
        repoUrl: repo.repoUrl,
        readme: truncateReadme(readme),
        isCollaboration: !!repo.isCollaboration,
        contributionCommits: repo.contributionCommits || 0,
      };
    })
  );

  return enriched.filter(Boolean);
};

/**
 * fetchCandidateRepos — Convenience wrapper: lite fetch + full enrichment
 * in one call. Used by anything that doesn't need the cache-key
 * short-circuit (e.g. one-off scripts/tests).
 */
const fetchCandidateRepos = async (username) => {
  const eligible = await fetchEligibleRepoList(username);
  return enrichCandidates(eligible);
};

const fetchReadme = async (owner, repoName) => {
  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${owner}/${repoName}/readme`,
      { headers: buildGithubHeaders('application/vnd.github.raw') }
    );
    return typeof data === 'string' ? data.trim() : '';
  } catch (err) {
    return '';
  }
};

const fetchLanguages = async (owner, repoName) => {
  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${owner}/${repoName}/languages`,
      { headers: buildGithubHeaders() }
    );
    return Object.entries(data || {})
      .sort((a, b) => b[1] - a[1])
      .map(([lang]) => lang);
  } catch (err) {
    return [];
  }
};

/**
 * truncateReadme — Strips noise (badges, HTML comments, long log/code
 * blocks) and pulls out the sections that actually matter for portfolio
 * evaluation, capped to README_CHAR_BUDGET.
 */
const truncateReadme = (rawReadme) => {
  let text = rawReadme
    // badge lines (shields.io, [![...]](...) rows)
    .replace(/^\s*\[?!\[.*?\]\(.*?\)\]?\(.*?\)\s*$/gm, '')
    .replace(/.*shields\.io.*$/gm, '')
    // HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // collapse long fenced code / log blocks to their first 10 lines
    .replace(/```[\s\S]*?```/g, (block) => {
      const lines = block.split('\n');
      if (lines.length <= 12) return block;
      return [...lines.slice(0, 10), '... (truncated)', '```'].join('\n');
    })
    .trim();

  const SECTION_HEADINGS = {
    overview: /^#{1,3}\s*(overview|about|introduction|description)\b/i,
    features: /^#{1,3}\s*(features|key features|highlights)\b/i,
    techStack: /^#{1,3}\s*(tech stack|technologies|built with|stack)\b/i,
    installation: /^#{1,3}\s*(installation|getting started|setup|quick start)\b/i,
    architecture: /^#{1,3}\s*(architecture|how it works|design|system design)\b/i,
    screenshots: /^#{1,3}\s*(screenshots|demo|preview)\b/i,
  };

  const lines = text.split('\n');
  const headingIndexes = [];
  lines.forEach((line, i) => {
    for (const key of Object.keys(SECTION_HEADINGS)) {
      if (SECTION_HEADINGS[key].test(line.trim())) {
        headingIndexes.push({ key, index: i });
        break;
      }
    }
  });

  let extracted;
  if (headingIndexes.length > 0) {
    // Leading prose before the first heading is the de-facto overview.
    const intro = headingIndexes[0].index > 0 ? lines.slice(0, headingIndexes[0].index).join('\n').trim() : '';
    const sections = headingIndexes.map((h, i) => {
      const end = i + 1 < headingIndexes.length ? headingIndexes[i + 1].index : lines.length;
      return lines.slice(h.index, end).join('\n').trim();
    });
    extracted = [intro, ...sections].filter(Boolean).join('\n\n');
  } else {
    // No recognizable headings — fall back to the cleaned-up top of the file.
    extracted = text;
  }

  if (extracted.length > README_CHAR_BUDGET) {
    extracted = extracted.slice(0, README_CHAR_BUDGET).trim() + '\n...(truncated)';
  }

  return extracted;
};

module.exports = {
  fetchEligibleRepoList,
  enrichCandidates,
  fetchCandidateRepos,
  truncateReadme,
  MAX_CANDIDATE_REPOS,
};
