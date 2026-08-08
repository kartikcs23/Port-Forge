/**
 * useThemeData — Normalizes the { rootUser, profile, repos } props every
 * theme receives into the shape the 15 lite themes actually consume, with
 * sensible student-portfolio fallbacks when a field hasn't been filled in
 * yet. Not a hook (no state) — just a shared shaping function, named this
 * way to match the convention of the flagship themes' inline destructuring.
 */
export const useThemeData = (rootUser, profile, repos = []) => {
  const name = profile?.name || rootUser?.name || 'Jordan Rivera';
  const headline = profile?.headline || 'Computer Science Student';
  const bio =
    profile?.bio ||
    profile?.intro ||
    'CS student who likes shipping things more than talking about shipping things. Open to internships and collaborations.';
  const email = profile?.email || rootUser?.email || '';
  const location = profile?.location || '';
  const avatar = profile?.avatarUrl || profile?.avatar || '';
  const skills = profile?.skills?.length
    ? profile.skills
    : ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git'];
  const experience = profile?.experience || [];
  const education = profile?.education || [];
  const achievements = profile?.achievements || [];
  const links = profile?.links || {};

  const projects = (repos?.length ? repos : DEFAULT_PROJECTS).slice(0, 6).map((r) => ({
    id: r._id || r.repoId || r.name,
    name: r.name,
    description: r.description || 'No description yet — add one from the dashboard.',
    language: r.language || (r.languages && r.languages[0]) || '',
    stars: r.stars || 0,
    forks: r.forks || 0,
    url: r.repoUrl || r.url || '#',
    score: r.score,
  }));

  const contacts = [
    email && { label: 'Email', value: email, href: `mailto:${email}` },
    links.github && { label: 'GitHub', value: links.github.replace(/^https?:\/\//, ''), href: links.github },
    links.linkedin && { label: 'LinkedIn', value: links.linkedin.replace(/^https?:\/\//, ''), href: links.linkedin },
    links.website && { label: 'Website', value: links.website.replace(/^https?:\/\//, ''), href: links.website },
  ].filter(Boolean);

  return { name, headline, bio, email, location, avatar, skills, experience, education, achievements, links, projects, contacts };
};

const DEFAULT_PROJECTS = [
  { name: 'campus-eats', description: 'A dining-hall wait-time tracker built with a friend for our dorm.', language: 'TypeScript', stars: 12, forks: 3, repoUrl: '#' },
  { name: 'study-sync', description: 'Real-time shared study-session timer with a small Discord bot companion.', language: 'Python', stars: 8, forks: 1, repoUrl: '#' },
  { name: 'algo-viz', description: 'Sorting and pathfinding algorithm visualizer built for a data structures course.', language: 'JavaScript', stars: 21, forks: 5, repoUrl: '#' },
];
