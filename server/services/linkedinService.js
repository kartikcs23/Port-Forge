const axios = require('axios');

/**
 * fetchLinkedInProfile — Simulates fetching a basic overview of a LinkedIn profile
 * from a public profile username without OAuth (since LinkedIn has no public API).
 * @param {string} username — LinkedIn username / slug
 * @returns {object} structured profile data
 */
const fetchLinkedInProfile = async (username) => {
  try {
    // Generate a basic synthesized overview based on the provided link
    // since direct LinkedIn scraping is blocked without an API/session.
    
    // Capitalize first letter of username for a default display name
    const formattedName = username
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      name: formattedName,
      bio: `${formattedName} - Professional connected via LinkedIn.`,
      location: '',
      avatar: '',
      linkedinUrl: `https://www.linkedin.com/in/${username}`,
      experience: [],
      education: [],
      skills: [],
    };
  } catch (error) {
    console.error('LinkedIn Sync error:', error.message);
    throw new Error('Failed to fetch LinkedIn profile');
  }
};

module.exports = { fetchLinkedInProfile };
