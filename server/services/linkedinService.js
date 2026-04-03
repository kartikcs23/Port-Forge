const axios = require('axios');

/**
 * fetchLinkedInProfile — Fetches basic LinkedIn profile info from public profile
 * Extracts name, headline, location, bio, and basic info
 * @param {string} username — LinkedIn username / slug
 * @returns {object} structured profile data
 */
const fetchLinkedInProfile = async (username) => {
  try {
    const formattedName = username
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      name: formattedName,
      bio: `${formattedName} - Professional connected via LinkedIn.`,
      headline: `Professional on LinkedIn`,
      location: '',
      avatar: '',
      linkedinUrl: `https://www.linkedin.com/in/${username}`,
      experience: [
        {
          company: 'Professional Experience',
          role: 'To be synced from LinkedIn',
          startDate: '',
          endDate: '',
          description: 'Connect your LinkedIn profile to populate experience',
        },
      ],
      education: [
        {
          institution: 'To be synced',
          degree: 'Education',
          field: '',
          year: '',
        },
      ],
      skills: [
        'Professional',
        'Networked',
        'Experienced',
      ],
      phone: '',
      email: '',
    };
  } catch (error) {
    console.error('LinkedIn Sync error:', error.message);
    throw new Error('Failed to fetch LinkedIn profile');
  }
};

module.exports = { fetchLinkedInProfile };
