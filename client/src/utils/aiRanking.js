/**
 * mergeAiRanking — Merges an AI ranking result onto a project list by
 * repository name, and sorts by AI score (highest first). Projects the AI
 * didn't score (e.g. no README) keep their original relative order and
 * sink to the bottom, after every AI-scored project.
 *
 * @param {Array} projects — from usePortfolio().projects
 * @param {Object|null} aiRanking — from usePortfolio().aiRanking
 * @returns {Array} projects, each optionally annotated with aiScore/aiRank/
 *   aiCategory/aiTier/aiReason, sorted by aiScore desc
 */
export const mergeAiRanking = (projects, aiRanking) => {
  if (!aiRanking) return projects;

  const byName = new Map();
  (aiRanking.featured_projects || []).forEach((p) =>
    byName.set(p.repository, { ...p, aiTier: 'featured' })
  );
  (aiRanking.recommended_projects || []).forEach((p) =>
    byName.set(p.repository, { ...p, aiTier: 'recommended' })
  );
  (aiRanking.hidden_projects || []).forEach((p) =>
    byName.set(p.repository, { ...p, aiTier: 'hidden' })
  );

  return [...projects]
    .map((project) => {
      const match = byName.get(project.name);
      return match
        ? {
            ...project,
            aiScore: match.score,
            aiRank: match.rank,
            aiCategory: match.category,
            aiTier: match.aiTier,
            aiReason: match.reason,
          }
        : project;
    })
    .sort((a, b) => {
      if (a.aiScore == null && b.aiScore == null) return 0;
      if (a.aiScore == null) return 1;
      if (b.aiScore == null) return -1;
      return b.aiScore - a.aiScore;
    });
};
