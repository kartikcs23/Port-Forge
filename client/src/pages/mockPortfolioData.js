export const mockProfile = {
  name: 'Amara Nkosi',
  headline: 'Full-Stack Engineer',
  bio: 'Building precise interfaces and battle-tested backends. Committed to work that ships, scales, and endures across every layer of the stack.',
  intro: 'I write software for humans. After five years shipping production systems at startups and agencies, I have developed a deep respect for code that is readable, fast, and maintainable. When I am not writing TypeScript, I am reading about distributed systems or taking apart mechanical keyboards.',
  email: 'amara@example.com',
  location: 'Cairo, Egypt',
  avatarUrl: '',
  resumeUrl: '/resume.pdf',
  skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'GraphQL', 'Python', 'Docker', 'AWS', 'Git', 'Linux', 'Figma'],
  experience: [
    {
      role: 'Senior Frontend Engineer',
      company: 'Pharaoh Digital',
      startDate: '2022',
      endDate: null,
      description: 'Lead the UI rebuild of a fintech platform serving 200k users. Reduced bundle size by 40% and brought Lighthouse scores from 62 to 96.',
    },
    {
      role: 'Full-Stack Developer',
      company: 'NileWave Studio',
      startDate: '2020',
      endDate: '2022',
      description: 'Built and maintained three client-facing SaaS products. Owned the backend API layer in Node.js and helped migrate a legacy PHP monolith to microservices.',
    },
    {
      role: 'Junior Developer',
      company: 'SandDune Labs',
      startDate: '2019',
      endDate: '2020',
      description: 'First engineering role. Worked on React dashboards and internal tooling.',
    },
  ],
  education: [
    { degree: 'BSc Computer Science', institution: 'Cairo University', year: '2019' },
  ],
  links: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
};

export const mockRepos = [
  { _id: '1', name: 'nile-ui', description: 'A component library built for speed. 40+ accessible React components with zero runtime CSS-in-JS dependencies.', language: 'TypeScript', stars: 312, forks: 28, repoUrl: 'https://github.com' },
  { _id: '2', name: 'cartouche', description: 'Minimalist REST client for Node.js. Handles retries, timeouts, and response validation with a clean chainable API.', language: 'JavaScript', stars: 87, forks: 11, repoUrl: 'https://github.com' },
  { _id: '3', name: 'pyramid-cache', description: 'LRU cache implementation with TTL support and Redis sync. Drop-in replacement for in-memory caches that need persistence.', language: 'TypeScript', stars: 55, forks: 6, repoUrl: 'https://github.com' },
  { _id: '4', name: 'sand-orm', description: 'Lightweight query builder for PostgreSQL. No magic, no decorators — just SQL with a fluent interface.', language: 'TypeScript', stars: 203, forks: 19, repoUrl: 'https://github.com' },
  { _id: '5', name: 'ankh-auth', description: 'JWT authentication middleware for Express with refresh token rotation, device tracking, and rate limiting built in.', language: 'JavaScript', stars: 44, forks: 5, repoUrl: 'https://github.com' },
  { _id: '6', name: 'khepri-deploy', description: 'Zero-downtime deployment scripts for VPS setups. Wraps Docker Compose with health checks and rollback logic.', language: 'Python', stars: 29, forks: 3, repoUrl: 'https://github.com' },
];
