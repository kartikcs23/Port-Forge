const axios = require('axios');

const getGithubToken = () =>
  process.env.GITHUB_TOKEN || process.env.GITHUB_PAT || process.env.GITHUB_ACCESS_TOKEN || '';

const hasGithubToken = () => Boolean(getGithubToken());

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

/**
 * fetchGitHubRepos — Fetches all public repos for the given username.
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
      description: repo.description || '',
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      language: repo.language || '',
      languages: repo.language ? [repo.language] : [],
      repoUrl: repo.html_url,
      isFork: !!repo.fork,
      isEmpty: Number(repo.size || 0) === 0,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      topics: repo.topics || [],
    }));

    const fetchRepoLanguages = async (repoName) => {
      try {
        const { data } = await axios.get(
          `https://api.github.com/repos/${username}/${repoName}/languages`,
          { headers: buildGithubHeaders() }
        );
        return Object.entries(data || {})
          .sort((a, b) => b[1] - a[1])
          .map(([lang]) => lang);
      } catch (error) {
        if (error.response?.status === 403) {
          console.warn(`GitHub rate limit hit while fetching languages for ${repoName}.`);
        }
        return [];
      }
    };

    const fetchRepoCommitCount = async (repoName) => {
      try {
        const response = await axios.get(
          `https://api.github.com/repos/${username}/${repoName}/commits`,
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
          console.warn(`GitHub rate limit hit while fetching commits for ${repoName}.`);
        }
        return 0;
      }
    };

    // Fetch READMEs and enrich repo metadata concurrently
    await Promise.all(
      mappedRepos.map(async (repo) => {
        try {
          const readmeRes = await axios.get(
            `https://api.github.com/repos/${username}/${repo.name}/readme`,
            {
              headers: buildGithubHeaders('application/vnd.github.raw'),
            }
          );
          repo.readme = readmeRes.data;
          repo.readmeLength = readmeRes.data ? readmeRes.data.length : 0;
        } catch (err) {
          repo.readme = ''; // No readme or rate limited
          repo.readmeLength = 0;
        }

        const [languages, totalCommits] = await Promise.all([
          fetchRepoLanguages(repo.name),
          fetchRepoCommitCount(repo.name),
        ]);

        if (languages.length > 0) {
          repo.languages = languages;
          repo.language = languages[0];
        }

        repo.totalCommits = totalCommits || 0;
      })
    );

    return mappedRepos;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please wait a while before syncing again.');
    }
    throw error;
  }
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
  hasGithubToken,
  fetchGitHubProfile,
  fetchGitHubRepos,
  fetchGitHubContributions,
  fetchGitHubEvents,
  fetchGitHubIssueStats,
};
