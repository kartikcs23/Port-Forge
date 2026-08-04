const analysisService = require('../services/analysisService');

/**
 * analyze — Controller endpoint for handling candidate analysis requests.
 * Accepts githubUsername, leetcodeUsername, techStack, targetRole, and optional PDF file 'resume'.
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const analyze = async (req, res) => {
  try {
    const { githubUsername, leetcodeUsername, leetcode, techStack, targetRole, resumeText } = req.body;

    // Validate required fields
    if (!githubUsername || !techStack || !targetRole) {
      return res.status(400).json({
        success: false,
        message: 'githubUsername, techStack, and targetRole are required fields.',
      });
    }

    let parsedTechStack = techStack;

    // Parse techStack if sent as JSON string from FormData
    if (typeof techStack === 'string' && (techStack.startsWith('[') || techStack.startsWith('{'))) {
      try {
        const jsonTechs = JSON.parse(techStack);
        if (Array.isArray(jsonTechs)) {
          parsedTechStack = jsonTechs.join(', ');
        }
      } catch (e) {
        parsedTechStack = techStack;
      }
    } else if (Array.isArray(techStack)) {
      if (techStack.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please select at least one technology in techStack.',
        });
      }
      parsedTechStack = techStack.join(', ');
    }

    const lcUsername = leetcodeUsername || leetcode;

    // Call analysis service with sanitized input and optional resume file
    const result = await analysisService.analyzeCandidate({
      githubUsername: String(githubUsername).trim().replace(/^@/, ''),
      leetcodeUsername: lcUsername ? String(lcUsername).trim().replace(/^@/, '') : '',
      techStack: String(parsedTechStack).trim(),
      targetRole: String(targetRole).trim(),
      resumeFile: req.file || null,
      resumeText: resumeText ? String(resumeText).trim() : '',
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Candidate Analysis Error:', error.message);
    const statusCode = error.message === 'GitHub username not found' ? 404 : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred during candidate analysis',
    });
  }
};

module.exports = {
  analyze,
};
