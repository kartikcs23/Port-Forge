const axios = require('axios');

/**
 * fetchLinkedInProfile — Fetches the authenticated user's LinkedIn profile.
 * Uses LinkedIn v2 API (OpenID Connect / Sign In with LinkedIn).
 * @param {string} accessToken — LinkedIn OAuth access token
 * @returns {object} structured profile data
 */
const fetchLinkedInProfile = async (accessToken) => {
  try {
    // Fetch basic profile via userinfo endpoint (OIDC)
    const { data: profile } = await axios.get(
      'https://api.linkedin.com/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return {
      name: profile.name || `${profile.given_name || ''} ${profile.family_name || ''}`.trim(),
      bio: profile.headline || '',
      avatar: profile.picture || '',
      location: profile.locale
        ? `${profile.locale.language}-${profile.locale.country}`
        : '',
      linkedinUrl: '',
      experience: [],
      education: [],
      skills: [],
    };
  } catch (error) {
    console.error('LinkedIn API error:', error.response?.data || error.message);
    throw new Error('Failed to fetch LinkedIn profile');
  }
};

module.exports = { fetchLinkedInProfile };
