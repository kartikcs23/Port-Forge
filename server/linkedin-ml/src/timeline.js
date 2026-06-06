function addEvent(events, date, title, source) {
  if (!date || !title) return;
  events.push({ date, title, source });
}

function buildTimeline({ github, linkedin }) {
  const events = [];

  (github.repos || []).forEach((repo) => {
    addEvent(events, repo.createdAt, `Created repo: ${repo.name}`, 'github');
  });

  (github.commits || []).forEach((commit) => {
    const repoLabel = commit.repo ? ` to ${commit.repo}` : '';
    addEvent(events, commit.date, `Commit${repoLabel}`, 'github');
  });

  if (linkedin && linkedin.positions) {
    linkedin.positions.forEach((pos) => {
      const title = [pos.title || pos.Title, pos.company || pos.Company].filter(Boolean).join(' at ');
      const start = pos.startDate || pos['Started On'] || pos['Start Date'];
      addEvent(events, start, title, 'linkedin');
    });
  }

  if (linkedin && linkedin.education) {
    linkedin.education.forEach((edu) => {
      const title = [edu.school || edu['School Name'], edu.degree || edu.Degree].filter(Boolean).join(' - ');
      const start = edu.startDate || edu['Start Date'];
      addEvent(events, start, title, 'linkedin');
    });
  }

  return events
    .filter((e) => e.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

module.exports = {
  buildTimeline
};
