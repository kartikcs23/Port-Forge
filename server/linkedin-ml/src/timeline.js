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
    addEvent(events, commit.date, 'Commit activity', 'github');
  });

  if (linkedin && linkedin.positions) {
    linkedin.positions.forEach((pos) => {
      const title = [pos.Title, pos.Company].filter(Boolean).join(' at ');
      addEvent(events, pos['Started On'] || pos['Start Date'], title, 'linkedin');
    });
  }

  if (linkedin && linkedin.education) {
    linkedin.education.forEach((edu) => {
      const title = [edu['School Name'], edu.Degree].filter(Boolean).join(' - ');
      addEvent(events, edu['Start Date'], title, 'linkedin');
    });
  }

  return events
    .filter((e) => e.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

module.exports = {
  buildTimeline
};
