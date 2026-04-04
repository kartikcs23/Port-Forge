import React, { useState, useEffect } from 'react';

/* ═══════════════════════════════════════════════════════════
   BRUTALIST THEME — Raw Editorial Portfolio
   Design Language: Bold black strokes, white space, accent pops
   Typography: System mono + Display overtaking everything
═══════════════════════════════════════════════════════════ */

const FRONTEND_KEYWORDS = ['react', 'vue', 'angular', 'html', 'css', 'tailwind', 'typescript', 'javascript', 'next', 'svelte', 'redux', 'gatsby'];
const BACKEND_KEYWORDS = ['node', 'express', 'django', 'flask', 'python', 'java', 'mongodb', 'postgres', 'mysql', 'redis', 'graphql', 'rest', 'prisma', 'jwt'];
const TOOLS_KEYWORDS = ['git', 'docker', 'aws', 'gcp', 'azure', 'linux', 'nginx', 'ci', 'figma', 'postman', 'vercel', 'netlify', 'webpack', 'vite'];
const categorizeSkills = (skills = []) => {
  const frontend = [], backend = [], tools = [], other = [];
  skills.forEach(s => {
    const l = s.toLowerCase();
    if (FRONTEND_KEYWORDS.some(k => l.includes(k))) frontend.push(s);
    else if (BACKEND_KEYWORDS.some(k => l.includes(k))) backend.push(s);
    else if (TOOLS_KEYWORDS.some(k => l.includes(k))) tools.push(s);
    else other.push(s);
  });
  return { frontend, backend, tools: [...tools, ...other] };
};
const getAllTechTags = (repos = []) => {
  const tags = new Set(['ALL']);
  repos.forEach(r => { if (r.language) tags.add(r.language.toUpperCase()); });
  return [...tags];
};
const useContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const onSubmit = e => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setForm({ name: '', email: '', message: '' });
  };
  return { form, sent, onChange, onSubmit };
};

/* ── BRUTALIST SECTION STAMP ── */
const SectionStamp = ({ children, color = 'bg-white', rotate = '-rotate-1', extraClass = '' }) => (
  <div className="relative inline-block mb-16">
    <div className={`${color} border-[6px] border-ink px-10 py-5 shadow-[10px_10px_0px_0px_#111] relative z-10 ${rotate} ${extraClass}`}>
      <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">{children}</h2>
    </div>
  </div>
);

export const BrutalistTheme = ({ rootUser, profile, repos = [] }) => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { form, sent, onChange, onSubmit } = useContactForm();

  const name = profile?.name || rootUser?.name || 'Developer';
  const headline = profile?.headline || 'Full-Stack Developer';
  const bio = profile?.bio || 'Full-stack developer building high-impact digital products for the modern web. No noise, just code that ships.';
  const intro = profile?.intro || bio;
  const email = profile?.email || rootUser?.email || '';
  const location = profile?.location || '';
  const skills = profile?.skills || [];
  const experience = profile?.experience || [];
  const education = profile?.education || [];
  const links = profile?.links || {};
  const avatar = profile?.avatarUrl || profile?.avatar || '';

  const categorized = categorizeSkills(skills);
  const techTags = getAllTechTags(repos);
  const filteredRepos = activeFilter === 'ALL' ? repos : repos.filter(r => r.language?.toUpperCase() === activeFilter);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#skills', label: 'Skills' },
    { href: '#experience', label: 'Experience' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-background text-ink font-sans selection:bg-accent selection:text-white overflow-x-hidden">

      {/* ── DOT GRID TEXTURE ── */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025] z-0"
           style={{ backgroundImage: 'radial-gradient(#111 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />

      {/* ══════════════════════════════════════
          STICKY NAV
      ══════════════════════════════════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 60 ? 'border-b-[4px] border-ink bg-background/95 backdrop-blur-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          {/* Brand */}
          <a href="#hero" className="flex items-center gap-3 group no-underline">
            <div className="w-8 h-8 bg-ink group-hover:bg-accent transition-colors flex items-center justify-center">
              <span className="text-white font-black text-xs">{name.charAt(0)}</span>
            </div>
            <span className="font-black text-[13px] uppercase tracking-[0.4em]">{name.split(' ')[0]}_FOLIO</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <a key={l.href} href={l.href}
                 className="font-black text-[11px] uppercase tracking-[0.35em] text-ink/40 hover:text-accent border-b-[3px] border-transparent hover:border-accent transition-all pb-0.5 no-underline">
                {l.label}
              </a>
            ))}
            <a href="#contact"
               className="bg-accent text-white border-[3px] border-ink px-6 py-2.5 font-black text-[11px] uppercase tracking-[0.3em] shadow-[5px_5px_0px_0px_#111] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#111] transition-all no-underline">
              Hire Me
            </a>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden border-[3px] border-ink p-2 bg-white shadow-[3px_3px_0_0_#111]">
            <div className="w-6 flex flex-col gap-1.5">
              {[0,1,2].map(i => (
                <div key={i} className={`h-[2px] bg-ink transition-all duration-300 ${menuOpen && i === 0 ? 'rotate-45 translate-y-[7px]' : ''} ${menuOpen && i === 1 ? 'opacity-0' : ''} ${menuOpen && i === 2 ? '-rotate-45 -translate-y-[7px]' : ''}`} />
              ))}
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-background border-t-[4px] border-ink">
            <div className="flex flex-col px-6 py-6 gap-5">
              {navLinks.map(l => (
                <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                   className="font-black text-[12px] uppercase tracking-[0.35em] text-ink/50 hover:text-accent transition-colors no-underline">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ══════════════════════════════════════
          01. HERO
      ══════════════════════════════════════ */}
      <section id="hero" className="relative z-10 min-h-screen pt-32 pb-24 border-b-[6px] border-ink overflow-hidden"
               style={{ background: '#FAF9F6' }}>
        {/* Accent Blob */}
        <div className="absolute top-[-15%] right-[-10%] w-[700px] h-[700px] bg-accent opacity-[0.07] rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-8 space-y-10">
              {/* Badge */}
              <div className="inline-block bg-accent text-white border-[4px] border-ink px-6 py-2 font-black text-xs uppercase tracking-[0.4em] shadow-[6px_6px_0px_0px_#111] -rotate-1">
                {headline}
              </div>

              {/* Name */}
              <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.82] break-words brutalist-glitch"
                  data-text={name}>
                {name}
              </h1>

              {/* Bio */}
              <div className="max-w-2xl border-l-[8px] border-accent pl-8 py-4 bg-white border-[4px] border-ink shadow-[8px_8px_0_0_#111]">
                <p className="text-xl font-bold leading-relaxed text-ink/80">{bio}</p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-5 pt-4">
                <a href="#projects"
                   className="bg-ink text-white border-[4px] border-ink px-10 py-4 font-black text-sm uppercase tracking-[0.3em] shadow-[8px_8px_0px_0px_#0055FF] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all no-underline">
                  View Projects
                </a>
                <a href="#contact"
                   className="bg-white text-ink border-[4px] border-ink px-10 py-4 font-black text-sm uppercase tracking-[0.3em] shadow-[8px_8px_0px_0px_#111] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all no-underline">
                  Contact Me
                </a>
                {links.github && (
                  <a href={links.github} target="_blank" rel="noreferrer"
                     className="bg-yellow-400 text-ink border-[4px] border-ink px-10 py-4 font-black text-sm uppercase tracking-[0.3em] shadow-[8px_8px_0px_0px_#111] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all no-underline">
                    GitHub ↗
                  </a>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-0 pt-8 border-t-[4px] border-ink">
                {[
                  { value: repos.length, label: 'Projects' },
                  { value: skills.length, label: 'Skills' },
                  { value: experience.length, label: 'Roles' },
                ].map((s, i) => (
                  <div key={s.label} className={`flex-1 min-w-[100px] py-8 px-6 border-r-[4px] border-ink last:border-r-0 ${i % 2 === 0 ? 'bg-white' : 'bg-background'}`}>
                    <div className="text-5xl font-black text-accent">{s.value}+</div>
                    <div className="font-black text-[10px] uppercase tracking-[0.4em] opacity-50 mt-2">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Avatar */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="relative group">
                <div className="absolute inset-0 bg-accent blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
                <div className="w-72 h-72 md:w-80 md:h-80 border-[8px] border-ink shadow-[20px_20px_0px_0px_rgba(17,17,17,1)] overflow-hidden bg-ink relative z-10 -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  {avatar ? (
                    <img src={avatar} alt={name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full bg-ink flex items-center justify-center">
                      <span className="text-[10rem] font-black text-accent leading-none">{name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                {/* Decorative square */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-yellow-400 border-[4px] border-ink z-0" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          02. ABOUT
      ══════════════════════════════════════ */}
      <section id="about" className="relative z-10 py-32 border-b-[6px] border-ink bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionStamp color="bg-white" rotate="-rotate-1">About_Me</SectionStamp>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <p className="text-xl font-bold leading-relaxed text-ink/70">{intro}</p>
              {location && (
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 bg-ink flex items-center justify-center">
                    <div className="w-2 h-2 bg-white" />
                  </div>
                  <span className="font-black text-sm uppercase tracking-[0.3em] opacity-50">{location}</span>
                </div>
              )}
              {education.length > 0 && (
                <div className="space-y-4">
                  <div className="font-black text-[10px] uppercase tracking-[0.5em] opacity-30 mb-4">Education</div>
                  {education.map((edu, i) => (
                    <div key={i} className="border-[4px] border-ink p-6 bg-background shadow-[6px_6px_0_0_#111]">
                      <div className="bg-accent text-white px-4 py-1 font-black text-xs uppercase tracking-widest inline-block mb-3 shadow-[3px_3px_0_0_#111]">{edu.year}</div>
                      <div className="font-black text-xl uppercase tracking-tight">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</div>
                      <div className="font-bold text-sm text-ink/60 mt-1 uppercase tracking-[0.15em]">{edu.institution}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Skills tags in about */}
            <div>
              <div className="font-black text-[10px] uppercase tracking-[0.5em] opacity-30 mb-6">Specializations</div>
              <div className="flex flex-wrap gap-3">
                {(skills.length > 0 ? skills.slice(0, 16) : ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Docker', 'AWS', 'GraphQL', 'Python', 'PostgreSQL', 'Redis', 'Next.js', 'Tailwind']).map((s, i) => (
                  <span key={s}
                        className={`px-4 py-2 font-black text-xs uppercase tracking-[0.2em] border-[3px] border-ink shadow-[3px_3px_0_0_#111] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_0_#111] transition-all cursor-default ${i % 4 === 0 ? 'bg-accent text-white' : i % 4 === 1 ? 'bg-yellow-400 text-ink' : i % 4 === 2 ? 'bg-ink text-white' : 'bg-white text-ink'}`}>
                    {s}
                  </span>
                ))}
              </div>

              {/* Quick links */}
              <div className="mt-12 space-y-3">
                {email && (
                  <a href={`mailto:${email}`} className="flex items-center gap-4 group no-underline">
                    <div className="w-10 h-10 bg-ink flex items-center justify-center group-hover:bg-accent transition-colors">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    </div>
                    <span className="font-black text-sm text-ink/60 group-hover:text-accent transition-colors">{email}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          03. PROJECTS
      ══════════════════════════════════════ */}
      <section id="projects" className="relative z-10 py-32 border-b-[6px] border-ink bg-background">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-start justify-between flex-wrap gap-8 mb-12">
            <SectionStamp color="bg-accent text-white" rotate="rotate-1" extraClass="text-white">
              <span className="text-white">Projects_DB</span>
            </SectionStamp>
            <span className="font-black text-xs uppercase tracking-[0.5em] opacity-30 self-center">TOTAL_{repos.length}</span>
          </div>

          {/* Tech Filter */}
          {techTags.length > 1 && (
            <div className="flex flex-wrap gap-3 mb-12">
              {techTags.map(tag => (
                <button key={tag} onClick={() => setActiveFilter(tag)}
                        className={`px-5 py-2.5 font-black text-xs uppercase tracking-[0.3em] border-[3px] border-ink transition-all shadow-[4px_4px_0_0_#111] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#111] ${activeFilter === tag ? 'bg-accent text-white' : 'bg-white text-ink'}`}>
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Projects Grid */}
          {filteredRepos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredRepos.map((repo, idx) => (
                <div key={repo._id}
                     className="group relative bg-white border-[6px] border-ink p-10 shadow-[12px_12px_0px_0px_#111] hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_#111] hover:border-accent transition-all duration-300 flex flex-col">
                  {/* Top row */}
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-black text-[10px] uppercase tracking-[0.4em] text-accent">{repo.language || 'Project'}</span>
                    <div className="bg-yellow-400 border-[3px] border-ink px-3 py-1 font-black text-xs -rotate-3 shadow-[3px_3px_0_0_#111]">
                      QS: {repo.score}/10
                    </div>
                  </div>

                  <h3 className="text-3xl font-black uppercase tracking-tight mb-4 group-hover:text-accent transition-colors leading-[0.9]">
                    {repo.name}
                  </h3>
                  <p className="text-base font-bold text-ink/60 leading-relaxed flex-grow mb-8 line-clamp-4">
                    {repo.description || 'Professional-grade architecture featuring clean code principles and robust documentation.'}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-6 border-t-[4px] border-ink mt-auto">
                    <div className="flex gap-6">
                      <div>
                        <div className="font-black text-[9px] uppercase tracking-widest text-ink/40">STARS</div>
                        <div className="font-black text-2xl leading-none">{repo.stars || 0}</div>
                      </div>
                      <div>
                        <div className="font-black text-[9px] uppercase tracking-widest text-ink/40">FORKS</div>
                        <div className="font-black text-2xl leading-none">{repo.forks || 0}</div>
                      </div>
                    </div>
                    {repo.repoUrl && (
                      <a href={repo.repoUrl} target="_blank" rel="noreferrer"
                         className="bg-ink text-white border-[3px] border-ink p-3 hover:bg-accent transition-colors shadow-[4px_4px_0_0_#0055FF] no-underline">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.011-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.292c0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-[6px] border-ink p-16 text-center bg-white shadow-[10px_10px_0_0_#111]">
              <div className="font-black text-2xl uppercase">No_{activeFilter}_Projects_Found</div>
            </div>
          )}

          {links.github && (
            <div className="mt-12 text-center">
              <a href={links.github} target="_blank" rel="noreferrer"
                 className="inline-flex items-center gap-4 bg-white border-[4px] border-ink px-12 py-5 font-black text-sm uppercase tracking-[0.3em] shadow-[8px_8px_0_0_#111] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all no-underline">
                All_Repos ↗
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          04. SKILLS
      ══════════════════════════════════════ */}
      <section id="skills" className="relative z-10 py-32 border-b-[6px] border-ink bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionStamp color="bg-yellow-400" rotate="rotate-1">Skills_Stack</SectionStamp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Frontend', icon: '◈', items: categorized.frontend.length > 0 ? categorized.frontend : ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'HTML/CSS', 'Redux'], accent: 'bg-accent text-white' },
              { label: 'Backend', icon: '◉', items: categorized.backend.length > 0 ? categorized.backend : ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Python', 'GraphQL'], accent: 'bg-ink text-white' },
              { label: 'Tools', icon: '◎', items: categorized.tools.length > 0 ? categorized.tools : ['Git', 'Docker', 'AWS', 'CI/CD', 'Linux', 'Figma'], accent: 'bg-yellow-400 text-ink' },
            ].map(cat => (
              <div key={cat.label} className="border-[6px] border-ink bg-background shadow-[10px_10px_0_0_#111]">
                {/* Header */}
                <div className={`${cat.accent} border-b-[6px] border-ink px-8 py-5 flex items-center gap-4`}>
                  <span className="text-2xl font-black">{cat.icon}</span>
                  <h3 className="font-black text-xl uppercase tracking-tighter">{cat.label}</h3>
                </div>
                {/* Items */}
                <div className="p-6 space-y-3">
                  {cat.items.map((skill, i) => (
                    <div key={skill} className="flex items-center gap-3 group">
                      <div className="w-3 h-3 border-[2px] border-ink group-hover:bg-accent transition-colors flex-shrink-0" />
                      <span className="font-black text-sm uppercase tracking-[0.15em] group-hover:text-accent transition-colors">{skill}</span>
                      {/* Brutalist Progress */}
                      <div className="ml-auto flex gap-1">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <div key={j} className={`w-3 h-3 border-[2px] border-ink ${j < Math.max(3, 5 - i) ? 'bg-accent' : 'bg-white'}`} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          05. EXPERIENCE
      ══════════════════════════════════════ */}
      {experience.length > 0 && (
        <section id="experience" className="relative z-10 py-32 border-b-[6px] border-ink bg-ink text-white">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="relative inline-block mb-16">
              <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter bg-white text-ink border-[6px] border-white px-10 py-5 shadow-[10px_10px_0px_0px_rgba(0,85,255,1)] relative z-10 -rotate-1">
                Experience
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {experience.map((exp, idx) => (
                <div key={idx}
                     className="group border-[4px] border-white/20 p-10 hover:border-accent hover:bg-white/5 transition-all duration-300 relative overflow-hidden">
                  {/* Hover Accent Line */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 pb-6 border-b-[3px] border-white/10">
                    <div>
                      <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none group-hover:text-accent transition-colors mb-2">
                        {exp.role}
                      </h3>
                      <p className="font-black uppercase tracking-[0.3em] text-accent/80 text-sm">{exp.company}</p>
                    </div>
                    <div className="bg-white text-ink px-6 py-2.5 font-black text-xs uppercase tracking-widest shadow-[5px_5px_0_0_#0055FF] flex-shrink-0">
                      {exp.startDate} → {exp.endDate || 'Present'}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-white/60 font-bold leading-relaxed text-lg">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education (if exists) */}
      {education.length > 0 && (
        <section className="relative z-10 py-24 border-b-[6px] border-ink bg-yellow-400">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <SectionStamp color="bg-ink text-white" rotate="-rotate-1" extraClass="text-white">
              <span className="text-white">Education_Log</span>
            </SectionStamp>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {education.map((edu, idx) => (
                <div key={idx} className="border-[5px] border-ink p-8 bg-white shadow-[8px_8px_0_0_#111]">
                  <div className="bg-ink text-white px-4 py-1.5 font-black text-xs uppercase tracking-widest inline-block mb-4 shadow-[3px_3px_0_0_#0055FF]">
                    GRADUATED_{edu.year}
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-2 leading-tight">{edu.institution}</h3>
                  <p className="font-bold uppercase tracking-[0.1em] text-ink/60 text-sm border-l-[5px] border-accent pl-4 py-1">
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          06. RESUME
      ══════════════════════════════════════ */}
      <section className="relative z-10 py-24 border-b-[6px] border-ink bg-background">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 border-[6px] border-ink p-12 bg-white shadow-[14px_14px_0_0_#111]">
            <div>
              <div className="font-black text-[10px] uppercase tracking-[0.6em] text-accent mb-3">Credentials_File</div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">Download<br/>Resume_</h2>
            </div>
            <a href="/resume.pdf" download
               className="bg-ink text-white border-[4px] border-ink px-12 py-6 font-black text-sm uppercase tracking-[0.4em] shadow-[8px_8px_0px_0px_#0055FF] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all no-underline flex items-center gap-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Get_.PDF
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          07. CONTACT
      ══════════════════════════════════════ */}
      <section id="contact" className="relative z-10 py-32 border-b-[6px] border-ink bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionStamp color="bg-accent text-white" rotate="rotate-1">
            <span className="text-white">Contact_Me</span>
          </SectionStamp>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Info side */}
            <div className="space-y-8">
              <p className="text-xl font-bold text-ink/70 leading-relaxed max-w-lg border-l-[8px] border-ink pl-8">
                Got a project? Want to collaborate? Let's talk. I respond within 24 hours — no fluff, just results.
              </p>

              <div className="space-y-4">
                {email && (
                  <a href={`mailto:${email}`}
                     className="flex items-center gap-5 group border-[4px] border-ink p-5 bg-background shadow-[6px_6px_0_0_#111] hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0_0_#111] transition-all no-underline">
                    <div className="w-12 h-12 bg-ink group-hover:bg-accent flex items-center justify-center transition-colors flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    </div>
                    <div>
                      <div className="font-black text-[9px] uppercase tracking-[0.5em] opacity-40">Email</div>
                      <div className="font-black text-base group-hover:text-accent transition-colors">{email}</div>
                    </div>
                  </a>
                )}
                {links.linkedin && (
                  <a href={links.linkedin} target="_blank" rel="noreferrer"
                     className="flex items-center gap-5 group border-[4px] border-ink p-5 bg-background shadow-[6px_6px_0_0_#111] hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0_0_#111] transition-all no-underline">
                    <div className="w-12 h-12 bg-ink group-hover:bg-accent flex items-center justify-center transition-colors flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>
                    </div>
                    <div>
                      <div className="font-black text-[9px] uppercase tracking-[0.5em] opacity-40">LinkedIn</div>
                      <div className="font-black text-base group-hover:text-accent transition-colors">View Profile ↗</div>
                    </div>
                  </a>
                )}
                {links.github && (
                  <a href={links.github} target="_blank" rel="noreferrer"
                     className="flex items-center gap-5 group border-[4px] border-ink p-5 bg-background shadow-[6px_6px_0_0_#111] hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0_0_#111] transition-all no-underline">
                    <div className="w-12 h-12 bg-ink group-hover:bg-accent flex items-center justify-center transition-colors flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>
                    </div>
                    <div>
                      <div className="font-black text-[9px] uppercase tracking-[0.5em] opacity-40">GitHub</div>
                      <div className="font-black text-base group-hover:text-accent transition-colors">View Repos ↗</div>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={onSubmit} className="space-y-5">
              {sent && (
                <div className="border-[4px] border-accent bg-accent/10 p-4 font-black text-sm uppercase tracking-[0.3em] text-accent text-center shadow-[4px_4px_0_0_#111]">
                  MESSAGE_SENT_SUCCESSFULLY_ ✓
                </div>
              )}
              {[
                { name: 'name', label: 'Full_Name', type: 'text', placeholder: 'Your Name' },
                { name: 'email', label: 'Email_Address', type: 'email', placeholder: 'you@email.com' },
              ].map(f => (
                <div key={f.name}>
                  <label className="block font-black text-[9px] uppercase tracking-[0.5em] opacity-40 mb-2">{f.label}</label>
                  <input name={f.name} type={f.type} value={form[f.name]} onChange={onChange} required
                         placeholder={f.placeholder}
                         className="w-full border-[4px] border-ink px-5 py-4 font-black text-sm bg-background focus:border-accent outline-none transition-colors shadow-[4px_4px_0_0_#111] placeholder:text-ink/30" />
                </div>
              ))}
              <div>
                <label className="block font-black text-[9px] uppercase tracking-[0.5em] opacity-40 mb-2">Message_Text</label>
                <textarea name="message" value={form.message} onChange={onChange} required rows={6} placeholder="Your message..."
                          className="w-full border-[4px] border-ink px-5 py-4 font-black text-sm bg-background focus:border-accent outline-none resize-none transition-colors shadow-[4px_4px_0_0_#111] placeholder:text-ink/30" />
              </div>
              <button type="submit"
                      className="w-full bg-ink text-white border-[4px] border-ink py-5 font-black text-sm uppercase tracking-[0.4em] shadow-[8px_8px_0px_0px_#0055FF] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all hover:bg-accent">
                Send_Message_ →
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          08. FOOTER
      ══════════════════════════════════════ */}
      <footer className="relative z-10 bg-ink text-white border-t-[6px] border-ink py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16 pb-16 border-b-[4px] border-white/10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-accent flex items-center justify-center">
                  <span className="font-black text-white text-sm">{name.charAt(0)}</span>
                </div>
                <span className="font-black text-sm uppercase tracking-[0.4em]">{name.split(' ')[0]}_FOLIO</span>
              </div>
              <p className="font-bold text-white/40 text-sm leading-relaxed">{headline}</p>
              <div className="mt-4 font-black text-[9px] uppercase tracking-widest text-white/20">
                BUILD_TIMESTAMP: {new Date().toISOString().split('T')[0]}
              </div>
            </div>
            {/* Nav */}
            <div>
              <div className="font-black text-[9px] uppercase tracking-[0.5em] opacity-20 mb-6">Navigate</div>
              <div className="flex flex-col gap-4">
                {navLinks.map(l => (
                  <a key={l.href} href={l.href}
                     className="font-black text-sm uppercase tracking-[0.25em] text-white/40 hover:text-accent transition-colors no-underline">
                    {l.label}_
                  </a>
                ))}
              </div>
            </div>
            {/* Social */}
            <div>
              <div className="font-black text-[9px] uppercase tracking-[0.5em] opacity-20 mb-6">Connect</div>
              <div className="flex flex-col gap-4">
                {links.github && <a href={links.github} target="_blank" rel="noreferrer" className="font-black text-sm uppercase tracking-[0.25em] text-white/40 hover:text-accent transition-colors no-underline">GitHub_↗</a>}
                {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" className="font-black text-sm uppercase tracking-[0.25em] text-white/40 hover:text-accent transition-colors no-underline">LinkedIn_↗</a>}
                {email && <a href={`mailto:${email}`} className="font-black text-sm uppercase tracking-[0.25em] text-white/40 hover:text-accent transition-colors no-underline">Email_↗</a>}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <span className="font-black text-[9px] uppercase tracking-[0.5em] text-white/20">
              © {new Date().getFullYear()} {name}. All Rights Reserved.
            </span>
            <span className="font-black text-[9px] uppercase tracking-[0.5em] text-white/20">
              BUILT_WITH_PORTFORGE_BRUTALIST_V3
            </span>
          </div>
        </div>
      </footer>

      <style>{`
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        a { text-decoration: none; }
        ::selection { background: #0055FF; color: #fff; }
        input::placeholder, textarea::placeholder { opacity: 0.3; }
        @media (max-width: 768px) { section { padding-left: 20px !important; padding-right: 20px !important; } }

        /* ── BRUTALIST GLITCH ── */
        .brutalist-glitch { position: relative; }
        .brutalist-glitch::before,
        .brutalist-glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: transparent;
        }
        .brutalist-glitch::before {
          color: #0055FF;
          animation: glitch-top 3s infinite linear;
          clip-path: polygon(0 0, 100% 0, 100% 38%, 0 38%);
        }
        .brutalist-glitch::after {
          color: #FF0000;
          animation: glitch-bot 3.1s infinite linear;
          clip-path: polygon(0 62%, 100% 62%, 100% 100%, 0 100%);
        }
        @keyframes glitch-top {
          0%,94%   { transform: none; opacity: 0; }
          95%      { transform: translateX(-4px) skewX(-4deg); opacity: 0.8; }
          96%      { transform: translateX(4px) skewX(4deg); opacity: 0.8; }
          97%      { transform: translateX(-2px); opacity: 0.6; }
          98%,100% { transform: none; opacity: 0; }
        }
        @keyframes glitch-bot {
          0%,91%   { transform: none; opacity: 0; }
          92%      { transform: translateX(4px) skewX(-2deg); opacity: 0.8; }
          93%      { transform: translateX(-4px) skewX(2deg); opacity: 0.8; }
          94%      { transform: translateX(2px); opacity: 0.6; }
          95%,100% { transform: none; opacity: 0; }
        }

        /* ── STAMP ENTRANCE ── */
        @keyframes stamp-in {
          0%   { transform: scale(1.8) rotate(-6deg); opacity: 0; filter: blur(4px); }
          60%  { transform: scale(0.95) rotate(1deg); opacity: 1; filter: blur(0); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .stamp-in { animation: stamp-in 0.6s cubic-bezier(.22,.68,0,1.5) both; }

        /* ── CARD HOVER SLAM ── */
        @keyframes hover-pop {
          0%   { transform: translateY(0); }
          40%  { transform: translateY(-10px) scale(1.01); }
          100% { transform: translateY(-8px) scale(1.01); }
        }
      `}</style>
    </div>
  );
};
