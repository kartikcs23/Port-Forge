function vectorize(github) {
  const repos = github.repos || [];
  const languageTotals = {};

  repos.forEach((repo) => {
    const langMap = repo.languages || {};
    Object.keys(langMap).forEach((lang) => {
      languageTotals[lang] = (languageTotals[lang] || 0) + Number(langMap[lang] || 0);
    });
  });

  const keys = Object.keys(languageTotals).sort();
  const vector = keys.map((k) => languageTotals[k]);
  return { keys, vector };
}

function cosineSimilarity(a, b) {
  const len = Math.min(a.length, b.length);
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < len; i += 1) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function alignVectors(baseKeys, otherKeys, otherVector) {
  const map = {};
  otherKeys.forEach((k, i) => {
    map[k] = otherVector[i];
  });
  return baseKeys.map((k) => map[k] || 0);
}

function findSimilarDevelopers(baseGithub, candidates) {
  const base = vectorize(baseGithub);
  return candidates
    .map((candidate) => {
      const cand = vectorize(candidate);
      const aligned = alignVectors(base.keys, cand.keys, cand.vector);
      const score = cosineSimilarity(base.vector, aligned);
      return {
        username: candidate.profile ? candidate.profile.username : 'unknown',
        score: Number(score.toFixed(3))
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

module.exports = {
  findSimilarDevelopers
};
