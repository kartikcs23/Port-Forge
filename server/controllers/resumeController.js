// pdf-parse's index.js runs test code on require() which can throw.
// Importing the lib directly bypasses this (standard workaround).
const pdfParse = require('pdf-parse/lib/pdf-parse.js');
const Profile = require('../models/Profile');

// ─── Curated skill keyword list ─────────────────────────────────────────────
const SKILL_KEYWORDS = [
  // Languages
  'javascript','typescript','python','java','c++','c#','c','ruby','go','golang',
  'rust','swift','kotlin','php','scala','r','matlab','perl','haskell','elixir',
  'dart','lua','shell','bash','powershell','sql','html','css','sass','scss',
  // Frontend
  'react','next.js','nextjs','vue','vue.js','angular','svelte','tailwind',
  'bootstrap','jquery','redux','mobx','zustand','webpack','vite','parcel',
  'styled-components','framer-motion','three.js','d3.js','graphql',
  // Backend
  'node.js','nodejs','express','fastify','nestjs','django','flask','fastapi',
  'spring','laravel','rails','asp.net','.net','fiber','gin','echo',
  // Databases
  'mongodb','mongoose','postgresql','postgres','mysql','sqlite','redis',
  'cassandra','dynamodb','firebase','supabase','prisma','sequelize','typeorm',
  'neo4j','elasticsearch',
  // Cloud / DevOps
  'aws','azure','gcp','google cloud','docker','kubernetes','k8s','terraform',
  'ansible','ci/cd','github actions','gitlab ci','jenkins','nginx','apache',
  'linux','ubuntu','debian','centos',
  // AI / ML
  'machine learning','deep learning','tensorflow','pytorch','keras','scikit-learn',
  'pandas','numpy','opencv','nlp','llm','langchain','openai','huggingface',
  // Tools
  'git','github','gitlab','bitbucket','jira','confluence','figma','postman',
  'swagger','jest','mocha','chai','pytest','selenium','cypress','playwright',
  'storybook','webpack','babel','eslint','prettier',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Normalise text: collapse whitespace, trim lines.
 */
const cleanText = (raw) =>
  raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('\n');

/**
 * Extract a single email address.
 */
const extractEmail = (text) => {
  const m = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  return m ? m[0].toLowerCase() : '';
};

/**
 * Extract a phone number.
 */
const extractPhone = (text) => {
  const m = text.match(
    /(?:\+?\d{1,3}[\s\-.]?)?\(?\d{3}\)?[\s\-.]?\d{3}[\s\-.]?\d{4}/
  );
  return m ? m[0].trim() : '';
};

/**
 * Extract GitHub and LinkedIn profile URLs.
 */
const extractLinks = (text) => {
  const github =
    (text.match(/github\.com\/([a-zA-Z0-9\-_]+)/i) || [])[0] || '';
  const linkedin =
    (text.match(/linkedin\.com\/in\/([a-zA-Z0-9\-_%]+)/i) || [])[0] || '';
  return {
    github: github ? `https://${github}` : '',
    linkedin: linkedin ? `https://${linkedin}` : '',
  };
};

/**
 * Extract skills by matching against the curated keyword list.
 * Case-insensitive, whole-word match.
 */
const extractSkills = (text) => {
  const lower = text.toLowerCase();
  return SKILL_KEYWORDS.filter((skill) => {
    // Escape dots for regex (e.g. "node.js")
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?<![a-z])${escaped}(?![a-z])`, 'i').test(lower);
  }).map((s) =>
    // Capitalise first letter of each word for display
    s.replace(/\b\w/g, (c) => c.toUpperCase())
  );
};

/**
 * Heuristically extract the summary / bio block.
 * Looks for a "Summary" or "Objective" section header and grabs the paragraph
 * that follows, or falls back to the first 3 non-contact lines.
 */
const extractBio = (lines) => {
  const summaryIdx = lines.findIndex((l) =>
    /^(summary|objective|profile|about me|about)/i.test(l)
  );
  if (summaryIdx !== -1) {
    // Grab up to 5 lines after the header until the next section header
    const block = [];
    for (let i = summaryIdx + 1; i < Math.min(summaryIdx + 6, lines.length); i++) {
      if (/^[A-Z][A-Z\s]{4,}$/.test(lines[i])) break; // looks like a new section
      block.push(lines[i]);
    }
    return block.join(' ').slice(0, 500);
  }
  // Fallback: first 3 lines that look like prose (> 30 chars, no @/http)
  return lines
    .filter((l) => l.length > 30 && !/@/.test(l) && !/^https?:/.test(l))
    .slice(0, 3)
    .join(' ')
    .slice(0, 500);
};

/**
 * Extract experience blocks.
 * Looks for a Work Experience / Experience section, then reads company + role pairs.
 */
const extractExperience = (lines) => {
  const expIdx = lines.findIndex((l) =>
    /^(work experience|experience|employment|professional experience)/i.test(l)
  );
  if (expIdx === -1) return [];

  const experiences = [];
  let i = expIdx + 1;

  // Scan until next major section
  while (i < lines.length) {
    const line = lines[i];
    if (
      /^(education|skills|projects|certifications|awards|languages|interests)/i.test(
        line
      )
    )
      break;

    // Date range pattern: 2020 – 2023  /  Jan 2020 – Present
    const dateMatch = line.match(
      /(\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?\.?\s*\d{4})\s*[-–—to]+\s*(present|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?\.?\s*\d{4})/i
    );

    if (dateMatch && experiences.length > 0) {
      const last = experiences[experiences.length - 1];
      last.startDate = dateMatch[1].trim();
      last.endDate = dateMatch[2].trim();
    } else if (line.length > 3 && line.length < 80 && !/^\d+$/.test(line)) {
      // Treat short lines as company or role
      if (experiences.length === 0 || experiences[experiences.length - 1].role) {
        experiences.push({ company: line, role: '', startDate: '', endDate: '', description: '' });
      } else {
        experiences[experiences.length - 1].role = line;
      }
    }
    i++;
  }

  return experiences.slice(0, 6); // cap at 6 entries
};

/**
 * Extract education blocks.
 */
const extractEducation = (lines) => {
  const eduIdx = lines.findIndex((l) =>
    /^(education|academic background|qualifications)/i.test(l)
  );
  if (eduIdx === -1) return [];

  const educations = [];
  let i = eduIdx + 1;

  while (i < lines.length) {
    const line = lines[i];
    if (
      /^(work experience|experience|skills|projects|certifications|awards)/i.test(
        line
      )
    )
      break;

    const yearMatch = line.match(/\b(19|20)\d{2}\b/);
    const degreeMatch = line.match(
      /\b(b\.?sc|b\.?tech|m\.?sc|m\.?tech|b\.?e|m\.?e|phd|ph\.d|bachelor|master|associate|diploma|mba|bca|mca)\b/i
    );

    if (line.length > 3 && line.length < 100) {
      if (degreeMatch || yearMatch) {
        educations.push({
          institution: educations.length > 0 && !educations[educations.length - 1].degree
            ? educations[educations.length - 1].institution
            : line,
          degree: degreeMatch ? degreeMatch[0] : '',
          field: '',
          year: yearMatch ? yearMatch[0] : '',
        });
      } else if (
        educations.length === 0 ||
        educations[educations.length - 1].institution
      ) {
        educations.push({ institution: line, degree: '', field: '', year: '' });
      }
    }
    i++;
  }

  return educations.slice(0, 4);
};

/**
 * Extract the candidate's name — usually the very first prominent line.
 */
const extractName = (lines) => {
  // Skip lines that look like contact info or URLs
  const nameLine = lines.find(
    (l) =>
      l.length > 2 &&
      l.length < 60 &&
      !/@/.test(l) &&
      !/https?:/.test(l) &&
      !/^\d/.test(l) &&
      !/resume|cv|curriculum/i.test(l)
  );
  return nameLine || '';
};

// ─── Controller ───────────────────────────────────────────────────────────────

/**
 * uploadResume
 * Accepts a PDF via multer memory storage, parses it, extracts structured
 * profile data, and upserts it into the user's Profile (merge strategy).
 *
 * Route: POST /api/resume/upload (protected, multipart/form-data)
 * Field name: "resume"
 */
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'No file uploaded. Please attach a PDF under the "resume" field.',
      });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Only PDF files are accepted.',
      });
    }

    // --- Parse PDF ---
    const pdfData = await pdfParse(req.file.buffer);
    const rawText = pdfData.text;

    if (!rawText || rawText.trim().length < 20) {
      return res.status(422).json({
        success: false,
        data: null,
        message: 'Could not extract readable text from this PDF. Try a text-based PDF (not a scanned image).',
      });
    }

    const cleaned = cleanText(rawText);
    const lines = cleaned.split('\n');

    // --- Extract structured fields ---
    const extracted = {
      name:       extractName(lines),
      email:      extractEmail(cleaned),
      phone:      extractPhone(cleaned),
      bio:        extractBio(lines),
      skills:     extractSkills(cleaned),
      experience: extractExperience(lines),
      education:  extractEducation(lines),
      links:      extractLinks(cleaned),
    };

    // --- Upsert into Profile (merge: only fill empty fields) ---
    let profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      profile = await Profile.create({ userId: req.user._id });
    }

    const mergeField = (existing, incoming) =>
      !existing || existing.toString().trim() === '' ? incoming : existing;

    const mergeArray = (existing, incoming) =>
      !existing || existing.length === 0 ? incoming : existing;

    profile.name       = mergeField(profile.name,  extracted.name);
    profile.email      = mergeField(profile.email, extracted.email);
    profile.phone      = mergeField(profile.phone, extracted.phone);
    profile.bio        = mergeField(profile.bio,   extracted.bio);
    profile.skills     = mergeArray(profile.skills, extracted.skills);
    profile.experience = mergeArray(profile.experience, extracted.experience);
    profile.education  = mergeArray(profile.education,  extracted.education);

    // Merge links sub-object
    profile.links = {
      github:   mergeField(profile.links?.github,   extracted.links.github),
      linkedin: mergeField(profile.links?.linkedin, extracted.links.linkedin),
      website:  profile.links?.website  || '',
      twitter:  profile.links?.twitter  || '',
    };

    await profile.save();

    return res.status(200).json({
      success: true,
      data: {
        extracted,   // raw extracted data for the frontend preview
        profile,     // full updated profile
      },
      message: `Resume parsed successfully. Found ${extracted.skills.length} skills, ${extracted.experience.length} experience entries, ${extracted.education.length} education entries.`,
    });
  } catch (err) {
    console.error('Resume upload error:', err.message);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to process resume. ' + err.message,
    });
  }
};

module.exports = { uploadResume };
