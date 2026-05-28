function vectorize(github) {
  const repos = github.repos || [];
  const contributions = github.contributions || [];
  const languageTotals = {};
  const topicTotals = {};
  const weekdayTotals = {};

  repos.forEach((repo) => {
    if (Array.isArray(repo.languages)) {
      repo.languages.forEach((lang) => {
        if (!lang) return;
        languageTotals[lang] = (languageTotals[lang] || 0) + 1;
      });
    } else if (repo.languages && typeof repo.languages === 'object') {
      Object.keys(repo.languages).forEach((lang) => {
        languageTotals[lang] = (languageTotals[lang] || 0) + Number(repo.languages[lang] || 0);
      });
    } else if (repo.language) {
      languageTotals[repo.language] = (languageTotals[repo.language] || 0) + 1;
    }

    (repo.topics || []).forEach((topic) => {
      if (!topic) return;
      topicTotals[topic] = (topicTotals[topic] || 0) + 1;
    });
  });

  contributions.forEach((entry) => {
    if (!entry?.date) return;
    const day = new Date(entry.date).getUTCDay();
    weekdayTotals[day] = (weekdayTotals[day] || 0) + Number(entry.count || 0);
  });

  const keys = [
    ...Object.keys(languageTotals).map((key) => `lang:${key}`),
    ...Object.keys(topicTotals).map((key) => `topic:${key}`),
    ...Object.keys(weekdayTotals).map((key) => `day:${key}`)
  ].sort();

  const vector = keys.map((key) => {
    if (key.startsWith('lang:')) return languageTotals[key.slice(5)] || 0;
    if (key.startsWith('topic:')) return topicTotals[key.slice(6)] || 0;
    if (key.startsWith('day:')) return weekdayTotals[key.slice(4)] || 0;
    return 0;
  });

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
