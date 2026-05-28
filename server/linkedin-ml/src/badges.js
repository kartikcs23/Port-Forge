function countClosedIssues(issues, issueStats) {
  if (issueStats && Number.isFinite(issueStats.closed)) {
    return Number(issueStats.closed);
  }
  if (typeof issues === 'number') return issues;
  return (issues || []).filter((i) => i.state === 'closed').length;
}

function countNightCommits(commits) {
  return (commits || []).filter((c) => {
    const hour = new Date(c.date).getUTCHours();
    return hour >= 0 && hour <= 4;
  }).length;
}

function uniqueLanguages(repos) {
  const set = new Set();
  (repos || []).forEach((repo) => {
    if (Array.isArray(repo.languages)) {
      repo.languages.forEach((lang) => lang && set.add(lang));
      return;
    }
    if (repo.languages && typeof repo.languages === 'object') {
      Object.keys(repo.languages).forEach((lang) => set.add(lang));
      return;
    }
    if (repo.language) {
      set.add(repo.language);
    }
  });
  return set.size;
}

function assignBadges(github) {
  const repos = github.repos || [];
  const commits = github.commits || [];
  const issues = github.issues || [];
  const issueStats = github.issueStats || {};

  const nightCommits = countNightCommits(commits);
  const closedIssues = countClosedIssues(issues, issueStats);
  const languageCount = uniqueLanguages(repos);
  const repoCount = repos.filter((r) => !r.isFork && !r.isEmpty).length;

  const badges = [];
  if (nightCommits >= 10) badges.push('Night Owl');
  if (languageCount >= 5) badges.push('Polyglot');
  if (closedIssues >= 10) badges.push('Bug Slayer');
  if (repoCount >= 8) badges.push('Project Hopper');

  return {
    badges,
    metrics: {
      nightCommits,
      closedIssues,
      languageCount,
      repoCount
    }
  };
}

module.exports = {
  assignBadges
};
