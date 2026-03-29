const axios = require('axios');

/**
 * fetchGitHubProfile — Fetches the authenticated user's GitHub profile.
 * @param {string} accessToken — GitHub OAuth access token
 * @returns {object} { name, bio, avatar, location, githubUrl }
 */
const fetchGitHubProfile = async (accessToken) => {
  const { data } = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
    },
  });

  return {
    name: data.name || data.login,
    bio: data.bio || '',
    avatar: data.avatar_url || '',
    location: data.location || '',
    githubUrl: data.html_url || '',
  };
};

/**
 * fetchGitHubRepos — Fetches all public repos for the authenticated user.
 * Sorted by last updated, returns up to 100 repos.
 * @param {string} accessToken — GitHub OAuth access token
 * @returns {Array} Array of structured project objects
 */
const fetchGitHubRepos = async (accessToken) => {
  const { data: repos } = await axios.get(
    'https://api.github.com/user/repos',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
      },
      params: {
        sort: 'updated',
        per_page: 100,
        type: 'owner', // only repos owned by the user
      },
    }
  );

  return repos.map((repo) => ({
    repoId: String(repo.id),
    name: repo.name,
    description: repo.description || '',
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    languages: repo.language ? [repo.language] : [],
    repoUrl: repo.html_url,
    updatedAt: repo.updated_at,
    topics: repo.topics || [],
  }));
};

module.exports = { fetchGitHubProfile, fetchGitHubRepos };
