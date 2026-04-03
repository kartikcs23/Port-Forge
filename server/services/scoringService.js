const axios = require('axios');

const scoreProject = async (project) => {
  let score = 0;

  // AI-Assisted Readme Quality Scoring
  if (project.readme) {
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'placeholder_api_key_here') {
      try {
        const apiKey = process.env.GEMINI_API_KEY.trim();
        const response = await axios.post(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey,
          {
            contents: [{
              parts: [{
                text: 'Rate the quality, detail, and formatting of this GitHub project README out of 35 points. Return ONLY a single integer number between 0 and 35. Do not include any other text.\n\nREADME:\n' + project.readme.substring(0, 3000) 
              }]
            }]
          },
          { headers: { 'Content-Type': 'application/json' } }
        );
        const aiScore = parseInt(response.data.candidates[0].content.parts[0].text.trim(), 10);
        if (!isNaN(aiScore)) {
          score += Math.min(35, Math.max(0, aiScore));
        }
      } catch (err) {
        console.error('Gemini API Error, falling back to manual scoring:', err.response?.data || err.message);
        fallbackReadmeScore();
      }
    } else {
      fallbackReadmeScore();
    }

    function fallbackReadmeScore() {
      const text = project.readme.toLowerCase();
      if (text.length > 500) score += 5;
      if (text.length > 1500) score += 10;
      if (text.includes('features')) score += 5;
      if (text.includes('installation') || text.includes('getting started')) score += 5;
      if (text.includes('usage') || text.includes('how to use')) score += 5;
      if (project.readme.includes('![')) score += 5;
    }
  }

  // Stars - logarithmic scale, capped at 30
  if (project.stars > 0) {
    score += Math.min(30, Math.round(Math.log2(project.stars + 1) * 3));
  }

  // Forks - logarithmic scale, capped at 20
  if (project.forks > 0) {
    score += Math.min(20, Math.round(Math.log2(project.forks + 1) * 3));
  }

  // Recency - updated within 6 months gets full 25 points
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const updatedDate = new Date(project.updatedAt);

  if (updatedDate >= sixMonthsAgo) {
    score += 25;
  } else {
    // Decay linearly over the next 18 months (total 2 years)
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    if (updatedDate >= twoYearsAgo) {
      const totalDecayRange = sixMonthsAgo - twoYearsAgo;
      const timeFromSixMonths = sixMonthsAgo - updatedDate;
      const decay = 1 - timeFromSixMonths / totalDecayRange;
      score += Math.round(25 * Math.max(0, decay));
    }
  }

  // Has description - 10 points
  if (project.description && project.description.trim().length > 0) {
    score += 10;
  }

  // Multiple languages - 10 points
  if (project.languages && project.languages.length > 1) {
    score += 10;
  }

  // Pinned bonus - 5 points
  if (project.pinned) {
    score += 5;
  }

  // Clamp to 0-100
  return Math.min(100, Math.max(0, score));
};

const scoreAndSort = async (projects) => {
  const scoredProjects = await Promise.all(
    projects.map(async (project) => ({
      ...project,
      score: await scoreProject(project),
    }))
  );

  return scoredProjects.sort((a, b) => b.score - a.score);
};

module.exports = { scoreProject, scoreAndSort };
