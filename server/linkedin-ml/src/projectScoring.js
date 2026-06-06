function normalize(value, min, max) {
  if (max === min) return 0;
  const v = Math.max(min, Math.min(max, value));
  return (v - min) / (max - min);
}

function scoreProject(repo) {
  const stars = Number(repo.stars || 0);
  const forks = Number(repo.forks || 0);
  const commits = Number(repo.totalCommits || 0);
  const readmeLength = Number(repo.readmeLength || 0);
  const topicsCount = Array.isArray(repo.topics) ? repo.topics.length : 0;
  let langCount = 0;
  if (Array.isArray(repo.languages)) {
    langCount = repo.languages.length;
  } else if (repo.languages && typeof repo.languages === 'object') {
    langCount = Object.keys(repo.languages).length;
  } else if (repo.language) {
    langCount = 1;
  }

  const score =
    normalize(stars, 0, 200) * 0.25 +
    normalize(forks, 0, 50) * 0.15 +
    normalize(commits, 0, 500) * 0.25 +
    normalize(readmeLength, 0, 4000) * 0.15 +
    normalize(topicsCount, 0, 10) * 0.1 +
    normalize(langCount, 0, 6) * 0.1;

  let difficulty = 'Easy';
  if (score >= 0.65) difficulty = 'Hard';
  else if (score >= 0.35) difficulty = 'Normal';

  return {
    name: repo.name,
    score: Number(score.toFixed(3)),
    difficulty,
    signals: {
      stars,
      forks,
      commits,
      readmeLength,
      topicsCount,
      langCount
    }
  };
}

function scoreProjects(github) {
  const repos = github.repos || [];
  return repos
    .filter((r) => !r.isEmpty)
    .map(scoreProject)
    .sort((a, b) => b.score - a.score);
}

module.exports = {
  scoreProjects
};
