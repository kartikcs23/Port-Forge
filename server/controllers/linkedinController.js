const Profile = require('../models/Profile');
const User = require('../models/User');

/**
 * analyzeLinkedIn — Runs analysis on user's LinkedIn data
 * 
 * Route: GET /api/linkedin/analyze (protected)
 */
const analyzeLinkedIn = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user's profile (LinkedIn data)
    const profile = await Profile.findOne({ userId });
    const user = await User.findById(userId);

    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'No profile found. Please sync your LinkedIn profile first.',
      });
    }

    // If no linkedinData, create empty structure
    const linkedinData = profile.linkedinData || {
      headline: '',
      summary: '',
      positions: [],
      education: [],
      skills: [],
      linkedinUrl: ''
    };



    // Extract and structure LinkedIn data
    const analysisData = {
      profile: {
        headline: linkedinData.headline || '',
        summary: profile.bio || linkedinData.summary || '',
        name: user?.name || 'Unknown'
      },
      positions: linkedinData.positions || [],
      education: linkedinData.education || [],
      skills: linkedinData.skills || [],
      analysis: {
        totalPositions: (linkedinData.positions || []).length,
        totalEducation: (linkedinData.education || []).length,
        totalSkills: (linkedinData.skills || []).length,
        profileStrength: calculateProfileStrength(linkedinData),
        careerInsights: generateCareerInsights(linkedinData),
        skillsGaps: identifySkillsGaps(linkedinData)
      }
    };

    res.status(200).json({
      success: true,
      data: analysisData,
      message: 'LinkedIn analysis completed successfully'
    });

  } catch (error) {
    console.error('Error analyzing LinkedIn:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze LinkedIn profile',
      error: error.message
    });
  }
};

/**
 * Calculate LinkedIn profile strength based on completeness and data quality
 */
const calculateProfileStrength = (linkedinData) => {
  let strength = 0;
  const weights = {
    headline: 10,
    summary: 15,
    positions: 30,
    education: 20,
    skills: 25,
  };

  // Headline presence
  if (linkedinData.headline && linkedinData.headline.trim().length > 0) {
    strength += weights.headline;
  }

  // Summary/Bio presence and quality
  if (linkedinData.summary && linkedinData.summary.trim().length > 50) {
    strength += weights.summary;
  } else if (linkedinData.summary && linkedinData.summary.trim().length > 0) {
    strength += weights.summary * 0.5;
  }

  // Work experience
  const positions = linkedinData.positions || [];
  if (positions.length > 0) {
    strength += Math.min(weights.positions, weights.positions * (positions.length / 5));
  }

  // Education
  const education = linkedinData.education || [];
  if (education.length > 0) {
    strength += Math.min(weights.education, weights.education * (education.length / 2));
  }

  // Skills - more skills = better profile
  const skills = linkedinData.skills || [];
  if (skills.length > 0) {
    strength += Math.min(weights.skills, weights.skills * Math.min(skills.length / 20, 1));
  }

  return Math.min(Math.round(strength), 100); // Max 100%
};

/**
 * Generate career-related insights from LinkedIn data
 */
const generateCareerInsights = (linkedinData) => {
  const insights = [];
  const positions = linkedinData.positions || [];
  const education = linkedinData.education || [];
  const skills = linkedinData.skills || [];

  // Experience insights
  if (positions.length === 0) {
    insights.push('📊 No work experience listed. Add your professional history to strengthen your profile.');
  } else if (positions.length === 1) {
    insights.push('👨‍💼 You have 1 position listed. Add more roles to showcase your career progression.');
  } else if (positions.length <= 3) {
    insights.push(`👨‍💼 Career profile shows ${positions.length} positions - solid foundation.`);
  } else {
    insights.push(`🚀 Strong career progression with ${positions.length} positions demonstrates experience.`);
  }

  // Education insights
  if (education.length === 0) {
    insights.push('🎓 Add your educational background to increase profile credibility.');
  } else {
    insights.push(`🎓 Educational background with ${education.length} institution${education.length > 1 ? 's' : ''}.`);
  }

  // Skills insights
  if (skills.length === 0) {
    insights.push('🛠️ Add technical and professional skills for better job matching.');
  } else if (skills.length < 5) {
    insights.push(`🛠️ You have ${skills.length} skills listed. Consider expanding to 10-15 relevant skills.`);
  } else if (skills.length < 10) {
    insights.push(`🛠️ Good skill diversity with ${skills.length} skills. Aim for 10-15 skills.`);
  } else {
    insights.push(`🛠️ Comprehensive skill set with ${skills.length} skills - excellent for opportunities.`);
  }

  // Career transition detection
  if (positions.length >= 2) {
    const latestPosition = positions[0];
    const previousPosition = positions[1];
    
    if (latestPosition && previousPosition) {
      const latestTitle = typeof latestPosition === 'string' ? latestPosition : latestPosition.title;
      const previousTitle = typeof previousPosition === 'string' ? previousPosition : previousPosition.title;
      
      if (latestTitle !== previousTitle) {
        insights.push(`📈 Career evolution: ${previousTitle} → ${latestTitle}`);
      }
    }
  }

  // Current employment status
  if (positions.length > 0) {
    const current = positions[0];
    const isCurrentlyEmployed = current.endDate === 'Present' || !current.endDate || current.endDate === '';
    if (isCurrentlyEmployed) {
      insights.push('✅ Currently employed - profile reflects recent experience.');
    }
  }

  // Skills diversity
  const uniqueSkillTypes = new Set();
  const techKeywords = ['JavaScript', 'Python', 'Java', 'React', 'Node', 'SQL', 'AWS'];
  const softKeywords = ['Leadership', 'Communication', 'Project Management', 'Teamwork'];
  
  skills.forEach(skill => {
    if (typeof skill === 'string') {
      if (techKeywords.some(t => skill.includes(t))) uniqueSkillTypes.add('technical');
      if (softKeywords.some(s => skill.includes(s))) uniqueSkillTypes.add('soft');
    }
  });

  if (uniqueSkillTypes.size >= 2) {
    insights.push('💼 Good mix of technical and soft skills.');
  }

  return insights;
};

/**
 * Identify potential skills gaps and recommendations
 */
const identifySkillsGaps = (linkedinData) => {
  const gaps = [];
  const skills = (linkedinData.skills || []).map(s => typeof s === 'string' ? s.toLowerCase() : '');
  const positions = linkedinData.positions || [];

  // Common in-demand tech skills
  const inDemandTech = [
    'javascript', 'python', 'typescript', 'react', 'node.js', 
    'aws', 'docker', 'kubernetes', 'sql', 'git', 'rest api',
    'mongodb', 'postgresql', 'vue', 'angular', 'java',
    'golang', 'rust', 'cloud', 'devops', 'ci/cd'
  ];

  // Common professional skills
  const inDemandSoft = [
    'leadership', 'communication', 'project management',
    'agile', 'scrum', 'teamwork', 'problem solving',
    'presentation', 'mentoring', 'strategic thinking'
  ];

  // If no skills at all
  if (skills.length === 0) {
    if (positions.length > 0) {
      gaps.push('⚠️ Add at least 5-10 relevant skills to your profile.');
    }
    return gaps;
  }

  // Find missing tech skills
  let missingTechCount = 0;
  inDemandTech.forEach(skill => {
    if (!skills.some(s => s.includes(skill)) && missingTechCount < 3) {
      gaps.push(`→ Consider adding "${skill}" (in-demand skill)`);
      missingTechCount++;
    }
  });

  // Find missing soft skills
  let missingSoftCount = 0;
  inDemandSoft.forEach(skill => {
    if (!skills.some(s => s.includes(skill)) && missingSoftCount < 2) {
      gaps.push(`→ Add "${skill}" for stronger candidacy`);
      missingSoftCount++;
    }
  });

  // If skills are too few
  if (skills.length < 10) {
    gaps.push(`⚠️ Expand skills to ${10 - skills.length} more areas for better visibility.`);
  }

  // If no positions but has skills, suggest adding experience
  if (positions.length === 0 && skills.length > 0) {
    gaps.push('→ Add work experience to demonstrate real-world skill application.');
  }

  return gaps.length > 0 ? gaps : ['✅ Skills profile looks strong!'];
};

module.exports = {
  analyzeLinkedIn
};
