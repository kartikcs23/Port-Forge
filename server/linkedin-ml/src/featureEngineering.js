function sumBy(list, getter) {
  return list.reduce((acc, item) => acc + getter(item), 0);
}

function uniqueCount(list, getter) {
  const set = new Set();
  list.forEach((item) => {
    const value = getter(item);
    if (value) {
      set.add(value);
    }
  });
  return set.size;
}

function buildFeatures({ github, linkedin }) {
  const repos = github.repos || [];
  const commits = github.commits || [];

  const totalStars = sumBy(repos, (r) => Number(r.stars || 0));
  const totalForks = sumBy(repos, (r) => Number(r.forks || 0));
  const totalCommits = sumBy(repos, (r) => Number(r.totalCommits || 0));
  const languages = {};

  repos.forEach((repo) => {
    if (Array.isArray(repo.languages)) {
      repo.languages.forEach((lang) => {
        if (!lang) return;
        languages[lang] = (languages[lang] || 0) + 1;
      });
      return;
    }
    const langMap = repo.languages || {};
    Object.keys(langMap).forEach((lang) => {
      languages[lang] = (languages[lang] || 0) + Number(langMap[lang] || 0);
    });
  });

  const primaryLanguage = Object.keys(languages).sort((a, b) => languages[b] - languages[a])[0] || null;
  const repoCount = repos.length;
  const activeRepoCount = repos.filter((r) => !r.isFork && !r.isEmpty).length;
  const nightCommits = commits.filter((c) => {
    const hour = new Date(c.date).getUTCHours();
    return hour >= 0 && hour <= 4;
  }).length;

  const linkedinSkills = linkedin && linkedin.skills ? linkedin.skills.length : 0;
  const linkedinPositions = linkedin && linkedin.positions ? linkedin.positions.length : 0;

  return {
    repoCount,
    activeRepoCount,
    totalStars,
    totalForks,
    totalCommits,
    primaryLanguage,
    languageCount: Object.keys(languages).length,
    nightCommits,
    linkedinSkills,
    linkedinPositions
  };
}

module.exports = {
  buildFeatures
};
