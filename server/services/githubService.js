const axios = require('axios');

/**
 * fetchGitHubProfile — Fetches the GitHub profile by username.
 * @param {string} username — GitHub username
 */
const fetchGitHubProfile = async (username) => {
  try {
    const { data } = await axios.get(`https://api.github.com/users/${username}`, {
      headers: {
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
        headers: {
          Accept: 'application/vnd.github+json',
        },
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
      languages: repo.language ? [repo.language] : [],
      repoUrl: repo.html_url,
      updatedAt: repo.updated_at,
      topics: repo.topics || [],
    }));

    // Fetch READMEs concurrently with a fallback (avoids crashing if rate limited)
    await Promise.all(
      mappedRepos.map(async (repo) => {
        try {
          const readmeRes = await axios.get(
            `https://api.github.com/repos/${username}/${repo.name}/readme`,
            {
              headers: {
                Accept: 'application/vnd.github.raw',
              },
            }
          );
          repo.readme = readmeRes.data;
        } catch (err) {
          repo.readme = ''; // No readme or rate limited
        }
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

module.exports = { fetchGitHubProfile, fetchGitHubRepos };