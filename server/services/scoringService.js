/**
 * scoringService.js — Scores each project 0–100 based on
 * stars, forks, recency, description quality, languages, and pinned status.
 */

/**
 * scoreProject — Calculates a 0–100 quality score for a single project.
 *
 * Scoring breakdown:
 *   - Stars:              up to 30 points (log scale)
 *   - Forks:              up to 20 points (log scale)
 *   - Recency:            up to 25 points (updated within 6 months = full)
 *   - Has description:    10 points
 *   - Multiple languages: 10 points
 *   - Is pinned:          5 bonus points
 *
 * @param {object} project — project data object
 * @returns {number} score between 0 and 100
 */
const scoreProject = (project) => {
  let score = 0;

  // Stars — logarithmic scale, capped at 30
  // log2(1) = 0, log2(2) = 1, log2(1024) = 10 → 30 pts
  if (project.stars > 0) {
    score += Math.min(30, Math.round(Math.log2(project.stars + 1) * 3));
  }

  // Forks — logarithmic scale, capped at 20
  if (project.forks > 0) {
    score += Math.min(20, Math.round(Math.log2(project.forks + 1) * 3));
  }

  // Recency — updated within 6 months gets full 25 points
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
    // Older than 2 years → 0 recency points
  }

  // Has description — 10 points
  if (project.description && project.description.trim().length > 0) {
    score += 10;
  }

  // Multiple languages — 10 points
  if (project.languages && project.languages.length > 1) {
    score += 10;
  }

  // Pinned bonus — 5 points
  if (project.pinned) {
    score += 5;
  }

  // Clamp to 0–100
  return Math.min(100, Math.max(0, score));
};

/**
 * scoreAndSort — Scores an array of projects and returns them
 * sorted by score in descending order.
 * @param {Array} projects — array of project objects
 * @returns {Array} scored and sorted projects
 */
const scoreAndSort = (projects) => {
  return projects
    .map((project) => ({
      ...project,
      score: scoreProject(project),
    }))
    .sort((a, b) => b.score - a.score);
};

module.exports = { scoreProject, scoreAndSort };
