const axios = require('axios');
const pdfParse = require('pdf-parse/lib/pdf-parse.js');

/**
 * fetchGitHubData — Fetches user profile and public repository data from GitHub REST API in parallel.
 * 
 * @param {string} username - Cleaned GitHub username
 * @returns {Promise<object>} Extracted GitHub user metrics and top repos
 */
const fetchGitHubData = async (username) => {
  const headers = {
    'User-Agent': 'PortForge-Candidate-Analysis',
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const [userRes, reposRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`, { headers }),
      axios.get(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers }),
    ]);

    const user = userRes.data;
    const repos = Array.isArray(reposRes.data) ? reposRes.data : [];

    const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    const totalForks = repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);

    // Compute top languages used
    const langCounts = {};
    repos.forEach((repo) => {
      if (repo.language) {
        langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
      }
    });

    const topLanguages = Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([lang]) => lang);

    // Sort repos by stars desc, take top 5
    const topRepos = [...repos]
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 5)
      .map((repo) => ({
        name: repo.name,
        description: repo.description || 'No description provided',
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        language: repo.language || 'N/A',
        url: repo.html_url,
      }));

    return {
      login: user.login,
      name: user.name || user.login,
      bio: user.bio || 'No bio provided',
      public_repos: user.public_repos || repos.length,
      followers: user.followers || 0,
      following: user.following || 0,
      totalStars,
      totalForks,
      topLanguages,
      topRepos,
    };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('GitHub username not found');
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch GitHub data');
  }
};

/**
 * fetchLeetCodeData — Fetches candidate problem solving stats from LeetCode official GraphQL API.
 * 
 * @param {string} username - LeetCode username
 * @returns {Promise<object|null>} LeetCode metrics or null if username not provided
 */
const fetchLeetCodeData = async (username) => {
  if (!username) return null;

  const cleanUser = String(username)
    .trim()
    .replace(/^@/, '')
    .replace(/.*leetcode\.com\/(?:u\/)?/, '')
    .replace(/\/$/, '');

  if (!cleanUser) return null;

  try {
    const response = await axios.post(
      'https://leetcode.com/graphql',
      {
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              username
              profile {
                reputation
                ranking
              }
              submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
            }
          }
        `,
        variables: { username: cleanUser },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Referer: 'https://leetcode.com',
        },
        timeout: 7000,
      }
    );

    const matchedUser = response.data?.data?.matchedUser;
    if (!matchedUser) {
      return {
        username: cleanUser,
        found: false,
        summaryText: `User '@${cleanUser}' was not found on LeetCode.`,
      };
    }

    const submissions = matchedUser.submitStatsGlobal?.acSubmissionNum || [];
    const totalSolved = submissions.find((s) => s.difficulty === 'All')?.count || 0;
    const easySolved = submissions.find((s) => s.difficulty === 'Easy')?.count || 0;
    const mediumSolved = submissions.find((s) => s.difficulty === 'Medium')?.count || 0;
    const hardSolved = submissions.find((s) => s.difficulty === 'Hard')?.count || 0;
    const ranking = matchedUser.profile?.ranking || 'N/A';

    return {
      username: matchedUser.username,
      found: true,
      ranking,
      reputation: matchedUser.profile?.reputation || 0,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      summaryText: `LeetCode Handle: @${matchedUser.username} | Total Solved: ${totalSolved} (Easy: ${easySolved}, Medium: ${mediumSolved}, Hard: ${hardSolved}) | Global Rank: ${ranking}`,
    };
  } catch (err) {
    console.warn('LeetCode fetch notice:', err.message);
    return {
      username: cleanUser,
      found: false,
      summaryText: `LeetCode stats for '@${cleanUser}' could not be retrieved (${err.message}).`,
    };
  }
};

/**
 * parseResumeBuffer — Parses PDF buffer attached to the request using pdf-parse.
 * 
 * @param {Buffer} buffer - PDF buffer from multer
 * @param {string} [filename] - Original filename
 * @returns {Promise<object|null>} Extracted text & snippet
 */
const parseResumeBuffer = async (buffer, filename = 'resume.pdf') => {
  if (!buffer) return null;

  try {
    const pdfData = await pdfParse(buffer);
    const rawText = pdfData.text || '';

    if (!rawText || rawText.trim().length < 20) {
      return {
        parsed: false,
        filename,
        message: 'Could not extract readable text from this PDF file.',
      };
    }

    const cleanedText = rawText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .join('\n');

    // Take top 3500 chars for AI prompt analysis
    const snippet = cleanedText.slice(0, 3500);

    return {
      parsed: true,
      filename,
      characterCount: cleanedText.length,
      snippet,
      rawText: cleanedText,
    };
  } catch (err) {
    console.warn('Resume PDF parsing warning:', err.message);
    return {
      parsed: false,
      filename,
      message: `Failed to parse PDF: ${err.message}`,
    };
  }
};

/**
 * buildPrompt — Constructs structured prompt for Groq LLaMA 3 analysis.
 */
const buildPrompt = ({ githubData, leetcodeData, resumeData, techStack, targetRole }) => {
  const repoList = githubData.topRepos.length > 0
    ? githubData.topRepos.map(r => `- ${r.name} (${r.stars} ⭐, ${r.forks} 🍴, Language: ${r.language}): ${r.description}`).join('\n')
    : 'No public repositories found.';

  const leetcodeSummary = leetcodeData
    ? leetcodeData.summaryText
    : 'Not provided by candidate.';

  const techStackString = Array.isArray(techStack) ? techStack.join(', ') : techStack;

  const resumeSection = resumeData && resumeData.parsed
    ? `SCANNED CANDIDATE RESUME (${resumeData.filename}, ${resumeData.characterCount} characters):\n${resumeData.snippet}`
    : 'No PDF resume attached.';

  return `You are an expert technical recruiter and senior software engineering manager conducting a comprehensive candidate assessment.
Evaluate the candidate based on their real GitHub activity, real LeetCode profile metrics, scanned PDF resume, selected tech stack (${techStackString}), and target job role (${targetRole}).

CANDIDATE PROFILE:
- Name / GitHub Handle: ${githubData.name} (@${githubData.login})
- Bio: ${githubData.bio}
- Target Role: ${targetRole}
- Selected Tech Stack: ${techStackString}
- Real LeetCode Metrics: ${leetcodeSummary}

${resumeSection}

REAL GITHUB METRICS:
- Public Repositories: ${githubData.public_repos}
- Total Stars Earned: ${githubData.totalStars}
- Total Forks Earned: ${githubData.totalForks}
- Followers: ${githubData.followers} | Following: ${githubData.following}
- Top Languages Used: ${githubData.topLanguages.join(', ') || 'None specified'}

TOP PUBLIC REPOSITORIES:
${repoList}

EVALUATION INSTRUCTIONS:
Assess the candidate thoroughly. Focus on technical assessment, GitHub insights, LeetCode performance, ATS resume score breakdown, tech stack match, strengths & concerns, and experience level match.
Return ONLY a valid, single JSON object adhering strictly to the schema below. Do not wrap in markdown code blocks (\`\`\`json), do not include intro or outro text.

EXACT JSON SCHEMA:
{
  "candidateName": "${githubData.name}",
  "assessedLevel": "<Junior | Mid-Level | Senior | Intern>",
  "overallScore": <integer 0-100>,
  "statusLabel": "<EXCELLENT | GOOD | AVERAGE | NEEDS IMPROVEMENT>",
  "summary": "<3-4 sentences executive summary highlighting qualifications, fit for target role, and key observations>",
  "strengths": [
    "<detailed strength 1>",
    "<detailed strength 2>",
    "<detailed strength 3>",
    "<detailed strength 4>"
  ],
  "concerns": [
    "<detailed concern/risk 1>",
    "<detailed concern/risk 2>"
  ],
  "technicalAssessment": {
    "primaryStack": "<e.g., Full-stack development / Backend systems>",
    "experienceLevel": "<e.g., Junior / Mid / Senior>",
    "specializations": ["<specialization 1>", "<specialization 2>"]
  },
  "leetcodeAssessment": {
    "problemSolving": "<1-2 sentences on problem-solving ability>",
    "difficultyBalance": "<1-2 sentences on balance between Easy/Medium/Hard>",
    "contestPerformance": "<1 sentence on rating/contest participation>",
    "summary": "<1 sentence overall LeetCode summary>"
  },
  "atsBreakdown": {
    "overallScore": <integer 0-100>,
    "keywords": <integer 0-100>,
    "format": <integer 0-100>,
    "experience": <integer 0-100>,
    "education": <integer 0-100>,
    "skills": <integer 0-100>,
    "improvementSuggestions": [
      "<suggestion 1>",
      "<suggestion 2>",
      "<suggestion 3>"
    ]
  },
  "githubInsights": {
    "activityLevel": "<1-2 sentence analysis of activity level & commits>",
    "codeQuality": "<1-2 sentence analysis of code quality & architecture>",
    "consistency": "<1-2 sentence analysis of streak & activity consistency>",
    "collaboration": "<1-2 sentence analysis of collaboration, PRs, stars & forks>"
  },
  "techStackMatch": {
    "matched": ["<tech 1>", "<tech 2>"],
    "missing": ["<tech 3>"],
    "matchScore": <integer 0-100>,
    "summary": "<1-2 sentences summarizing tech stack alignment>"
  },
  "experienceLevelMatch": {
    "required": "${targetRole}",
    "assessed": "<Junior / Mid / Senior / Intern>",
    "summary": "<1-2 sentences summarizing experience level alignment>"
  },
  "topSkills": ["<skill 1>", "<skill 2>", "<skill 3>", "<skill 4>", "<skill 5>"],
  "standoutProject": {
    "name": "<name of standout repo>",
    "reason": "<why it stands out>"
  }
}`;
};

/**
 * analyzeCandidate — Main service method. Fetches GitHub, LeetCode, parses optional PDF resume, and generates AI analysis.
 */
const analyzeCandidate = async ({ githubUsername, leetcodeUsername, leetcode, techStack, targetRole, resumeFile, resumeText }) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured in server environment variables.');
  }

  const lcUser = leetcodeUsername || leetcode;

  // Step 1: Fetch GitHub Data, LeetCode Data, and parse Resume PDF in parallel
  const [githubData, leetcodeData, resumeData] = await Promise.all([
    fetchGitHubData(githubUsername),
    fetchLeetCodeData(lcUser),
    resumeFile ? parseResumeBuffer(resumeFile.buffer, resumeFile.originalname) : Promise.resolve(resumeText ? { parsed: true, filename: 'Pasted Resume Text', characterCount: resumeText.length, snippet: resumeText.slice(0, 3500) } : null),
  ]);

  // Step 2: Build prompt
  const prompt = buildPrompt({ githubData, leetcodeData, resumeData, techStack, targetRole });

  // Step 3: POST request to Groq API with model fallback support
  try {
    const candidateModels = [
      process.env.GROQ_MODEL,
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'mixtral-8x7b-32768',
    ].filter(Boolean);

    let response;
    let lastError;

    for (const modelName of candidateModels) {
      try {
        response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: modelName,
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.2,
            max_tokens: 1400,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (response?.data?.choices?.[0]?.message?.content) {
          break; // Successfully got response
        }
      } catch (err) {
        lastError = err;
        console.warn(`[Groq AI] Model ${modelName} failed:`, err.response?.data?.error?.message || err.message);
      }
    }

    if (!response?.data?.choices?.[0]?.message?.content) {
      throw lastError || new Error('No response content returned from AI model');
    }

    // Step 4: Extract response content
    const rawContent = response.data?.choices?.[0]?.message?.content;
    if (!rawContent) {
      throw new Error('No response content returned from AI model');
    }

    // Step 5: Strip markdown fences if present
    let cleanedJson = rawContent.trim();
    if (cleanedJson.startsWith('```')) {
      cleanedJson = cleanedJson.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }

    // Step 6: Parse JSON
    let analysis;
    try {
      analysis = JSON.parse(cleanedJson);
    } catch (parseErr) {
      const firstBrace = cleanedJson.indexOf('{');
      const lastBrace = cleanedJson.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        try {
          analysis = JSON.parse(cleanedJson.substring(firstBrace, lastBrace + 1));
        } catch (subParseErr) {
          throw new Error('AI returned invalid JSON');
        }
      } else {
        throw new Error('AI returned invalid JSON');
      }
    }

    // Step 7: Return structured data
    return {
      githubData,
      leetcodeData,
      resumeData,
      analysis,
    };
  } catch (error) {
    if (error.message === 'AI returned invalid JSON' || error.message === 'GitHub username not found') {
      throw error;
    }
    const apiError = error.response?.data?.error?.message || error.message || 'AI request failed';
    throw new Error(`AI Analysis Error: ${apiError}`);
  }
};

module.exports = {
  fetchGitHubData,
  fetchLeetCodeData,
  parseResumeBuffer,
  buildPrompt,
  analyzeCandidate,
};
