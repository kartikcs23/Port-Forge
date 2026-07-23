const axios = require('axios');

const getGithubToken = () =>
  process.env.GITHUB_TOKEN || process.env.GITHUB_PAT || process.env.GITHUB_ACCESS_TOKEN || '';

const hasGithubToken = () => Boolean(getGithubToken());

/**
 * parseGithubUsername — Extracts a bare username from a GitHub profile URL
 * or accepts a bare username as-is.
 * @param {string} rawLink — e.g. "https://github.com/torvalds" or "torvalds"
 * @returns {string} lowercase username, or '' if nothing usable was found
 */
const parseGithubUsername = (rawLink = '') => {
  let username = rawLink.trim();
  if (username.toLowerCase().includes('github.com/')) {
    username = username.toLowerCase().split('github.com/')[1].split('/')[0];
  } else if (username.includes('/')) {
    username = username.split('/').pop() || username.split('/')[0];
  }
  return username.toLowerCase();
};

const buildGithubHeaders = (accept = 'application/vnd.github+json') => {
  const headers = { Accept: accept, 'User-Agent': 'PortForge' };
  const token = getGithubToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

/**
 * fetchGitHubProfile — Fetches the GitHub profile by username.
 * @param {string} username — GitHub username
 */
const fetchGitHubProfile = async (username) => {
  try {
    const { data } = await axios.get(`https://api.github.com/users/${username}`, {
      headers: buildGithubHeaders(),
    });

    return {
      name: data.name || data.login,
      bio: data.bio || '',
      avatar: data.avatar_url || '',
      location: data.location || '',
      githubUrl: data.html_url || '',
    };
  } catch (error) {
    if (error.response && error.response.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please wait a while before syncing again.');
    }
    throw error;
  }
};

const fetchRepoLanguages = async (owner, repoName) => {
  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${owner}/${repoName}/languages`,
      { headers: buildGithubHeaders() }
    );
    return Object.entries(data || {})
      .sort((a, b) => b[1] - a[1])
      .map(([lang]) => lang);
  } catch (error) {
    if (error.response?.status === 403) {
      console.warn(`GitHub rate limit hit while fetching languages for ${owner}/${repoName}.`);
    }
    return [];
  }
};

const fetchRepoCommitCount = async (owner, repoName) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repoName}/commits`,
      {
        headers: buildGithubHeaders(),
        params: { per_page: 1 },
      }
    );

    const linkHeader = response.headers?.link || '';
    const match = linkHeader.match(/page=(\d+)>; rel="last"/);
    if (match) {
      return Number(match[1]);
    }

    if (Array.isArray(response.data)) {
      return response.data.length;
    }

    return 0;
  } catch (error) {
    if (error.response?.status === 403) {
      console.warn(`GitHub rate limit hit while fetching commits for ${owner}/${repoName}.`);
    }
    return 0;
  }
};

/**
 * enrichRepoMeta — Fetches README + full language breakdown + commit count
 * for a single repo, addressed by its actual owner (not necessarily the
 * profile being synced — matters for repos the user collaborates on).
 * Mutates and returns the given repo object.
 */
const enrichRepoMeta = async (owner, repo) => {
  try {
    const readmeRes = await axios.get(
      `https://api.github.com/repos/${owner}/${repo.name}/readme`,
      { headers: buildGithubHeaders('application/vnd.github.raw') }
    );
    repo.readme = readmeRes.data;
    repo.readmeLength = readmeRes.data ? readmeRes.data.length : 0;
  } catch (err) {
    repo.readme = ''; // No readme or rate limited
    repo.readmeLength = 0;
  }

  const [languages, totalCommits] = await Promise.all([
    fetchRepoLanguages(owner, repo.name),
    fetchRepoCommitCount(owner, repo.name),
  ]);

  if (languages.length > 0) {
    repo.languages = languages;
    repo.language = languages[0];
  }

  repo.totalCommits = totalCommits || 0;
  return repo;
};

/**
 * fetchGitHubRepos — Fetches all repos owned by the given username, fully
 * enriched with README/languages/commit count.
 * @param {string} username — GitHub username
 */
const fetchGitHubRepos = async (username) => {
  try {
    const { data: repos } = await axios.get(
      `https://api.github.com/users/${username}/repos`,
      {
        headers: buildGithubHeaders(),
        params: {
          sort: 'updated',
          per_page: 100,
          type: 'owner',
        },
      }
    );

    const mappedRepos = repos.map((repo) => ({
      repoId: String(repo.id),
      name: repo.name,
      ownerLogin: username,
      description: repo.description || '',
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      language: repo.language || '',
      languages: repo.language ? [repo.language] : [],
      repoUrl: repo.html_url,
      isFork: !!repo.fork,
      isEmpty: Number(repo.size || 0) === 0,
      isArchived: !!repo.archived,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      topics: repo.topics || [],
    }));

    await Promise.all(mappedRepos.map((repo) => enrichRepoMeta(username, repo)));

    return mappedRepos;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please wait a while before syncing again.');
    }
    throw error;
  }
};

/**
 * fetchContributedRepos — Repos the user has committed to but does NOT own
 * (i.e. collaborator contributions), via the same GraphQL data that powers
 * the "Contributed to" section on a GitHub profile. Public repos only —
 * this is meant to feed a public portfolio, never private repo data.
 * @param {string} username — GitHub username
 * @returns {Promise<Array>} lean repo objects (no README/full language
 *   breakdown yet — call enrichRepoMeta(repo.ownerLogin, repo) for that)
 */
const fetchContributedRepos = async (username) => {
  const token = getGithubToken();
  if (!token || !username) return [];

  try {
    const { data } = await axios.post(
      'https://api.github.com/graphql',
      {
        query: `
          query($login: String!) {
            user(login: $login) {
              contributionsCollection {
                commitContributionsByRepository(maxRepositories: 100) {
                  contributions { totalCount }
                  repository {
                    databaseId
                    name
                    owner { login }
                    description
                    url
                    isFork
                    isArchived
                    isPrivate
                    stargazerCount
                    forkCount
                    diskUsage
                    createdAt
                    updatedAt
                    primaryLanguage { name }
                    repositoryTopics(first: 10) { nodes { topic { name } } }
                  }
                }
              }
            }
          }
        `,
        variables: { login: username },
      },
      { headers: buildGithubHeaders('application/json') }
    );

    const edges = data?.data?.user?.contributionsCollection?.commitContributionsByRepository || [];
    const lowerUsername = username.toLowerCase();

    return edges
      .filter((e) => e.repository && e.repository.owner?.login)
      .filter((e) => e.repository.owner.login.toLowerCase() !== lowerUsername) // not their own repo
      .filter((e) => !e.repository.isPrivate && !e.repository.isFork && !e.repository.isArchived)
      .map((e) => {
        const repo = e.repository;
        return {
          repoId: String(repo.databaseId),
          name: repo.name,
          ownerLogin: repo.owner.login,
          description: repo.description || '',
          stars: repo.stargazerCount || 0,
          forks: repo.forkCount || 0,
          language: repo.primaryLanguage?.name || '',
          languages: repo.primaryLanguage?.name ? [repo.primaryLanguage.name] : [],
          repoUrl: repo.url,
          isFork: false,
          isEmpty: false, // has commit contributions, so never empty
          isArchived: false,
          createdAt: repo.createdAt,
          updatedAt: repo.updatedAt,
          topics: (repo.repositoryTopics?.nodes || []).map((n) => n.topic.name),
          sizeKb: repo.diskUsage || 0,
          isCollaboration: true,
          contributionCommits: e.contributions?.totalCount || 0,
        };
      });
  } catch (error) {
    console.warn('Failed to fetch contributed repos via GraphQL:', error.response?.data?.errors || error.message);
    return [];
  }
};

/**
 * fetchAllUserRepos — Owned repos + repos the user collaborates on (has
 * real commit contributions to but doesn't own), fully enriched and
 * deduplicated by repoId. This is the "did they actually work on it" set —
 * use this instead of fetchGitHubRepos wherever a complete contribution
 * picture matters (syncing, AI ranking).
 * @param {string} username — GitHub username
 */
const fetchAllUserRepos = async (username) => {
  const [ownedRepos, contributedLean] = await Promise.all([
    fetchGitHubRepos(username),
    fetchContributedRepos(username),
  ]);

  const ownedIds = new Set(ownedRepos.map((r) => r.repoId));
  const newContributed = contributedLean.filter((r) => !ownedIds.has(r.repoId));

  await Promise.all(newContributed.map((repo) => enrichRepoMeta(repo.ownerLogin, repo)));

  return [...ownedRepos, ...newContributed];
};

const decodeHtml = (value = '') =>
  value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const countFromTooltip = (tooltip = '') => {
  const text = decodeHtml(tooltip.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
  if (!text || /^No contributions/i.test(text)) return 0;

  const match = text.match(/([\d,]+)\s+contribution/i);
  return match ? Number(match[1].replace(/,/g, '')) : 0;
};

const parseContributions = (html) => {
  const contributions = [];
  if (!html) return contributions;

  const regex =
    /<td\b(?=[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})")(?=[^>]*\bContributionCalendar-day\b)([^>]*)>\s*<\/td>\s*(?:<tool-tip\b[^>]*>([\s\S]*?)<\/tool-tip>)?/g;
  let match = null;
  while ((match = regex.exec(html)) !== null) {
    const attrs = match[2] || '';
    const dataCount = attrs.match(/\bdata-count="(\d+)"/);
    contributions.push({
      date: match[1],
      count: dataCount ? Number(dataCount[1] || 0) : countFromTooltip(match[3]),
    });
  }

  return contributions;
};

const fetchGitHubContributionsGraphQL = async (username) => {
  const token = getGithubToken();
  if (!token || !username) return [];

  try {
    const { data } = await axios.post(
      'https://api.github.com/graphql',
      {
        query: `
          query($login: String!) {
            user(login: $login) {
              contributionsCollection(includePrivateContributions: true) {
                contributionCalendar {
                  weeks {
                    contributionDays {
                      date
                      contributionCount
                    }
                  }
                }
              }
            }
          }
        `,
        variables: { login: username },
      },
      { headers: buildGithubHeaders('application/json') }
    );

    const weeks =
      data?.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
    return weeks.flatMap((week) =>
      (week.contributionDays || []).map((day) => ({
        date: day.date,
        count: Number(day.contributionCount || 0),
      }))
    );
  } catch (error) {
    return [];
  }
};

/**
 * fetchGitHubContributions — Fetches the public contribution calendar.
 * @param {string} username — GitHub username
 */
const fetchGitHubContributions = async (username) => {
  if (!username) return [];

  try {
    const graphContributions = await fetchGitHubContributionsGraphQL(username);
    if (graphContributions.length > 0) {
      return graphContributions;
    }

    const { data } = await axios.get(`https://github.com/users/${username}/contributions`, {
      headers: buildGithubHeaders('text/html'),
    });

    return parseContributions(data);
  } catch (error) {
    return [];
  }
};

/**
 * fetchGitHubEvents — Fetches recent public events to infer commit timing.
 * @param {string} username — GitHub username
 */
const fetchGitHubEvents = async (username) => {
  if (!username) return [];
  const commits = [];

  try {
    for (let page = 1; page <= 3; page += 1) {
      const { data } = await axios.get(`https://api.github.com/users/${username}/events/public`, {
        headers: buildGithubHeaders(),
        params: {
          per_page: 100,
          page,
        },
      });

      if (!Array.isArray(data) || data.length === 0) break;

      data.forEach((event) => {
        if (event.type !== 'PushEvent') return;
        const repoName = event.repo?.name?.split('/')[1] || null;
        const commitCount = event.payload?.commits?.length || 0;
        if (!commitCount) return;
        for (let i = 0; i < commitCount; i += 1) {
          commits.push({
            date: event.created_at,
            repo: repoName,
          });
        }
      });

      if (data.length < 100) break;
    }
  } catch (error) {
    return [];
  }

  return commits;
};

/**
 * fetchGitHubIssueStats — Fetches closed issue count authored by user.
 * @param {string} username — GitHub username
 */
const fetchGitHubIssueStats = async (username) => {
  if (!username) return { closed: 0 };
  try {
    const { data } = await axios.get('https://api.github.com/search/issues', {
      headers: buildGithubHeaders(),
      params: {
        q: `author:${username} type:issue is:closed`,
      },
    });
    return { closed: Number(data.total_count || 0) };
  } catch (error) {
    return { closed: 0 };
  }
};

module.exports = {
  getGithubToken,
  hasGithubToken,
  buildGithubHeaders,
  parseGithubUsername,
  fetchGitHubProfile,
  fetchGitHubRepos,
  fetchContributedRepos,
  fetchAllUserRepos,
  enrichRepoMeta,
  fetchGitHubContributions,
  fetchGitHubEvents,
  fetchGitHubIssueStats,
};
