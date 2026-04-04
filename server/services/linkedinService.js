const axios = require('axios');

/**
 * fetchLinkedInProfile — Fetches/processes LinkedIn profile data
 * Since LinkedIn blocks automated requests, we primarily work with provided data
 * @param {string} username — LinkedIn username / slug
 * @param {object} structuredData — Optional pre-parsed LinkedIn profile data
 * @returns {object} structured profile data
 */
const fetchLinkedInProfile = async (username, structuredData = null) => {
  try {
    // If structured data is explicitly provided, use and validate it
    if (structuredData && typeof structuredData === 'object') {
      return {
        headline: structuredData.headline || '',
        summary: structuredData.summary || '',
        positions: Array.isArray(structuredData.positions) ? structuredData.positions : [],
        education: Array.isArray(structuredData.education) ? structuredData.education : [],
        skills: Array.isArray(structuredData.skills) ? structuredData.skills : [],
        linkedinUrl: `https://www.linkedin.com/in/${username}`,
      };
    }

    // LinkedIn blocks automated requests, return ready-to-populate structure
    // User data can be filled via API or manual entry
    return {
      headline: '',
      summary: '',
      positions: [],
      education: [],
      skills: [],
      linkedinUrl: `https://www.linkedin.com/in/${username}`,
    };
  } catch (error) {
    console.error('LinkedIn Fetch error:', error.message);
    // Return safe default structure on error
    return {
      headline: '',
      summary: '',
      positions: [],
      education: [],
      skills: [],
      linkedinUrl: `https://www.linkedin.com/in/${username}`,
    };
  }
};

/**
 * parseLinkedInHTML — Extracts profile data from LinkedIn HTML
 * Looks for Open Graph tags and JSON-LD structured data
 * @param {string} html — HTML content from LinkedIn profile
 * @param {string} username — LinkedIn username for context
 * @returns {object} extracted profile data
 */
const parseLinkedInHTML = (html, username) => {
  try {
    // Extract Open Graph properties (og:title, og:description, etc.)
    const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i);
    const descriptionMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/i);
    const imageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i);

    const headline = titleMatch ? titleMatch[1] : '';
    const summary = descriptionMatch ? descriptionMatch[1] : '';

    // Try to extract JSON-LD structured data
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">({[\s\S]*?})<\/script>/i);
    let jsonLdData = {};
    if (jsonLdMatch) {
      try {
        jsonLdData = JSON.parse(jsonLdMatch[1]);
      } catch (e) {
        console.warn('Could not parse JSON-LD data');
      }
    }

    return {
      headline: headline || jsonLdData.headline || '',
      summary: summary || jsonLdData.description || '',
      positions: jsonLdData.workExperience || [],
      education: jsonLdData.educationDetails || [],
      skills: jsonLdData.skills || [],
      linkedinUrl: `https://www.linkedin.com/in/${username}`,
      raw: { headline, summary, imageUrl: imageMatch?.[1] },
    };
  } catch (error) {
    console.warn('Error parsing LinkedIn HTML:', error.message);
    return {
      headline: '',
      summary: '',
      positions: [],
      education: [],
      skills: [],
      linkedinUrl: `https://www.linkedin.com/in/${username}`,
      raw: null,
    };
  }
};

/**
 * parseLinkedInURL — Extracts username and optional profile data from LinkedIn URL
 * Handles both profile URLs and custom formats
 * @param {string} linkedinInput — LinkedIn URL or structured data
 * @returns {object} { username, structuredData }
 */
const parseLinkedInURL = (linkedinInput) => {
  try {
    let username = '';
    let structuredData = null;

    // If input is an object (structured profile data)
    if (typeof linkedinInput === 'object' && linkedinInput !== null) {
      structuredData = linkedinInput;
      if (linkedinInput.linkedinUrl && typeof linkedinInput.linkedinUrl === 'string') {
        const parts = linkedinInput.linkedinUrl.split('/in/');
        username = parts[1]?.split('/')[0]?.split('?')[0] || '';
      }
      console.log('[parseLinkedInURL] Object input processed:', { username });
      return { username, structuredData };
    }

    // Process string input
    if (typeof linkedinInput !== 'string') {
      console.warn('[parseLinkedInURL] Invalid input type:', typeof linkedinInput);
      return { username: '', structuredData: null };
    }

    const trimmed = linkedinInput.trim();
    if (!trimmed) {
      console.warn('[parseLinkedInURL] Empty input after trim');
      return { username: '', structuredData: null };
    }

    console.log('[parseLinkedInURL] Processing URL:', trimmed.substring(0, 80));

    // Strategy 1: Extract from /in/ pattern
    if (trimmed.includes('/in/')) {
      const afterIn = trimmed.split('/in/')[1];
      if (afterIn) {
        // Take everything until the next slash, query param, or hash
        username = afterIn
          .split('/')[0]  // Remove trailing path
          .split('?')[0]  // Remove query params
          .split('#')[0]  // Remove hash
          .trim();
        
        console.log('[parseLinkedInURL] Extracted from /in/:', { username });
        return { username, structuredData };
      }
    }

    // Strategy 2: Direct username (no slashes)
    if (!trimmed.includes('/')) {
      username = trimmed.trim();
      console.log('[parseLinkedInURL] Direct username:', { username });
      return { username, structuredData };
    }

    // Strategy 3: Last resort - take last path segment
    const segments = trimmed.split('/').filter(s => s && s.trim());
    if (segments.length > 0) {
      username = segments[segments.length - 1]
        .split('?')[0]
        .split('#')[0]
        .trim();
      console.log('[parseLinkedInURL] Fallback extraction:', { username, totalSegments: segments.length });
    }

    if (!username) {
      console.error('[parseLinkedInURL] Failed to extract username from:', trimmed);
      return { username: '', structuredData: null };
    }

    return { username, structuredData };
  } catch (error) {
    console.error('[parseLinkedInURL] Exception:', error.message);
    return { username: '', structuredData: null };
  }
};

module.exports = { fetchLinkedInProfile, parseLinkedInHTML, parseLinkedInURL };
