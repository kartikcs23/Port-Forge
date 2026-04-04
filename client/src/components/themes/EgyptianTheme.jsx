import React, { useState, useEffect } from 'react';

/* ═══════════════════════════════════════════════════════════
   LUXOR THEME — Editorial Egyptian Portfolio
   Design Language: Warm sand, deep ink, gold accents
   Typography: Playfair Display (serif) + DM Sans (mono labels)
═══════════════════════════════════════════════════════════ */

/* Skills Categorization */
const FRONTEND_KEYWORDS = ['react', 'vue', 'angular', 'html', 'css', 'tailwind', 'typescript', 'javascript', 'next', 'svelte'];
const BACKEND_KEYWORDS = ['node', 'express', 'django', 'flask', 'python', 'java', 'mongodb', 'postgres', 'mysql', 'redis', 'graphql'];
const TOOLS_KEYWORDS = ['git', 'docker', 'aws', 'linux', 'figma', 'postman', 'ci', 'vercel'];
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
  const tags = new Set(['All']);
  repos.forEach(r => { if (r.language) tags.add(r.language); });
  return [...tags];
};

const useContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const onSubmit = e => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', message: '' });
  };
  return { form, sent, onChange, onSubmit };
};

/* ═══════════════════════════════════════════════════════════
   COMPONENT: SECTION LABEL (Utility)
═══════════════════════════════════════════════════════════ */
const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-4 mb-6">
    <div style={{ width: 32, height: 2, background: '#c5a021' }} />
    <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 10, fontWeight: 900, letterSpacing: '0.6em', textTransform: 'uppercase', color: '#8c6c00' }}>
      {children}
    </span>
  </div>
);

export const EgyptianTheme = ({ rootUser, profile, repos = [] }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { form, sent, onChange, onSubmit } = useContactForm();

  const name = profile?.name || rootUser?.name || 'Developer';
  const headline = profile?.headline || 'Full-Stack Developer';
  const bio = profile?.bio || 'Building clean interfaces and robust backends for the next generation of digital products.';
  const intro = profile?.intro || bio;
  const email = profile?.email || rootUser?.email || '';
  const location = profile?.location || '';
  const skills = profile?.skills || [];
  const experience = profile?.experience || [];
  const education = profile?.education || [];
  const links = profile?.links || {};

  const categorized = categorizeSkills(skills);
  const techTags = getAllTechTags(repos);
  const filteredRepos = activeFilter === 'All' ? repos : repos.filter(r => r.language === activeFilter);

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

  /* Shared styles */
  const GOLD = '#c5a021';
  const GOLD_DARK = '#8c6c00';
  const INK = '#1a1208';
  const SAND = '#fff8f3';
  const SAND_MID = '#f5e6d3';
  const SANS = '"DM Sans", sans-serif';
  const SERIF = '"Playfair Display", Georgia, serif';

  return (
    <div style={{ minHeight: '100vh', background: SAND, color: INK, fontFamily: SANS, overflowX: 'hidden' }}>
      
      {/* ── BACKGROUND LAYERS ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <img src="/assets/themes/egyptian_bg.png" alt=""
             style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55,
                      transform: `scale(1.03) translateY(${scrollY * 0.015}px)`, transition: 'transform 0.1s linear' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 30%, rgba(255,248,243,0.4) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, ${SAND} 0%, transparent 15%, transparent 85%, ${SAND} 100%)` }} />
      </div>

      {/* ── STICKY NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all 0.3s',
        background: scrollY > 60 ? `rgba(255,248,243,0.92)` : 'transparent',
        backdropFilter: scrollY > 60 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 60 ? `1px solid rgba(197,160,33,0.2)` : 'none',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '18px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 8, height: 8, background: GOLD, transform: 'rotate(45deg)' }} />
            <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 900, letterSpacing: '0.5em', textTransform: 'uppercase', color: INK }}>
              {name.split(' ')[0]}.folio
            </span>
          </div>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', gap: 48, alignItems: 'center' }} className="hidden md:flex">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: `${INK}60`, textDecoration: 'none', transition: 'color 0.2s' }}
                 onMouseEnter={e => e.currentTarget.style.color = GOLD}
                 onMouseLeave={e => e.currentTarget.style.color = `${INK}60`}>
                {l.label}
              </a>
            ))}
            {links.github && (
              <a href={links.github} target="_blank" rel="noreferrer"
                 style={{ fontFamily: SANS, fontSize: 11, fontWeight: 900, letterSpacing: '0.35em', textTransform: 'uppercase', padding: '10px 24px', border: `1px solid ${GOLD}40`, color: INK, textDecoration: 'none', transition: 'all 0.2s' }}
                 onMouseEnter={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = '#fff'; }}
                 onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = INK; }}>
                GitHub ↗
              </a>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
            <div style={{ width: 24, height: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ height: 1.5, background: INK, transition: 'all 0.3s',
                  transform: menuOpen ? (i === 0 ? 'rotate(45deg) translateY(8px)' : i === 2 ? 'rotate(-45deg) translateY(-8px)' : 'none') : 'none',
                  opacity: menuOpen && i === 1 ? 0 : 1 }} />
              ))}
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{ background: `rgba(255,248,243,0.97)`, backdropFilter: 'blur(20px)', borderBottom: `1px solid ${GOLD}20`, padding: '24px 48px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {navLinks.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                 style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: `${INK}60`, textDecoration: 'none' }}>
                {l.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* CONTENT WRAPPER */}
      <div style={{ position: 'relative', zIndex: 10 }}>

        {/* ═══════════════════════════════════════════════
            01. HERO
        ═══════════════════════════════════════════════ */}
        <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-end', paddingBottom: '10vh', paddingTop: '20vh', padding: '20vh 48px 10vh', maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ width: '100%' }}>
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
              <div style={{ width: 48, height: 2, background: GOLD }} />
              <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 900, letterSpacing: '0.7em', textTransform: 'uppercase', color: GOLD_DARK }}>
                {headline}
              </span>
            </div>

            {/* Name */}
            <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(3.5rem, 10vw, 10rem)', lineHeight: 0.85, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 48, color: INK }}
                className="luxor-shimmer">
              {name}
            </h1>

            {/* Bio Quote */}
            <div style={{ maxWidth: 640, borderLeft: `5px solid ${GOLD}`, paddingLeft: 40, paddingTop: 8, paddingBottom: 8, marginBottom: 56 }}>
              <p style={{ fontFamily: SERIF, fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', fontStyle: 'italic', lineHeight: 1.5, color: `${INK}CC` }}>
                "{bio}"
              </p>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 80 }}>
              <a href="#projects"
                 style={{ fontFamily: SANS, fontSize: 12, fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase', padding: '18px 48px', background: INK, color: SAND, textDecoration: 'none', transition: 'all 0.3s' }}
                 onMouseEnter={e => { e.currentTarget.style.background = GOLD; }}
                 onMouseLeave={e => { e.currentTarget.style.background = INK; }}>
                View Projects
              </a>
              <a href="#contact"
                 style={{ fontFamily: SANS, fontSize: 12, fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase', padding: '18px 48px', border: `2px solid ${INK}30`, color: INK, textDecoration: 'none', transition: 'all 0.3s' }}
                 onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD_DARK; }}
                 onMouseLeave={e => { e.currentTarget.style.borderColor = `${INK}30`; e.currentTarget.style.color = INK; }}>
                Contact Me
              </a>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 64, paddingTop: 48, borderTop: `1px solid ${INK}10` }}>
              {[
                { value: repos.length, label: 'Projects Built' },
                { value: skills.length, label: 'Skills Mastered' },
                { value: experience.length, label: 'Experiences' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: SERIF, fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, color: GOLD, lineHeight: 1 }}>{s.value}+</div>
                  <div style={{ fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.4, marginTop: 6 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            02. ABOUT
        ═══════════════════════════════════════════════ */}
        <section id="about" style={{ padding: '128px 48px', maxWidth: 1280, margin: '0 auto' }}>
          <SectionLabel>01 // About</SectionLabel>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(2.5rem, 5vw, 5rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 64, color: INK }}>The Architect</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }} className="grid-cols-1 md:grid-cols-2">
            <div>
              <p style={{ fontSize: 20, lineHeight: 1.8, color: `${INK}AA`, marginBottom: 32 }}>{intro}</p>
              {location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                  <div style={{ width: 20, height: 20, border: `1px solid ${GOLD}50`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 6, height: 6, background: GOLD, borderRadius: '50%' }} />
                  </div>
                  <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', opacity: 0.5 }}>{location}</span>
                </div>
              )}
              {education.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {education.map((edu, i) => (
                    <div key={i} style={{ padding: '20px 24px', background: `${SAND_MID}80`, borderLeft: `3px solid ${GOLD}` }}>
                      <div style={{ fontFamily: SANS, fontSize: 10, fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase', color: GOLD, marginBottom: 4 }}>{edu.year}</div>
                      <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700 }}>{edu.degree || edu.field}</div>
                      <div style={{ fontSize: 14, opacity: 0.6 }}>{edu.institution}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div style={{ fontFamily: SANS, fontSize: 10, fontWeight: 900, letterSpacing: '0.5em', textTransform: 'uppercase', opacity: 0.3, marginBottom: 20 }}>Specializations</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {(skills.length > 0 ? skills.slice(0, 16) : ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Python', 'Docker', 'AWS', 'GraphQL', 'Next.js', 'PostgreSQL', 'Redis', 'Tailwind CSS']).map(s => (
                  <span key={s} style={{ padding: '8px 18px', fontSize: 12, fontFamily: SANS, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', border: `1px solid ${GOLD}30`, color: GOLD_DARK, background: `${GOLD}08`, cursor: 'default', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = GOLD; }}
                        onMouseLeave={e => { e.currentTarget.style.background = `${GOLD}08`; e.currentTarget.style.color = GOLD_DARK; e.currentTarget.style.borderColor = `${GOLD}30`; }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            03. PROJECTS
        ═══════════════════════════════════════════════ */}
        <section id="projects" style={{ padding: '128px 0', background: SAND_MID }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
            <SectionLabel>02 // Projects</SectionLabel>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 20 }}>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(2.5rem, 5vw, 5rem)', fontWeight: 900, letterSpacing: '-0.03em', color: INK }}>Selected Works</h2>
              <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.3 }}>Archive_Catalog</span>
            </div>

            {/* Filters */}
            {techTags.length > 1 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 64 }}>
                {techTags.map(tag => (
                  <button key={tag} onClick={() => setActiveFilter(tag)}
                          style={{ padding: '8px 20px', fontFamily: SANS, fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.25s',
                                   border: `1px solid ${activeFilter === tag ? GOLD : `${INK}20`}`,
                                   color: activeFilter === tag ? GOLD_DARK : `${INK}50`,
                                   background: activeFilter === tag ? `${GOLD}12` : 'transparent' }}>
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* Projects Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 32 }}>
              {filteredRepos.map((repo, idx) => (
                <a key={repo._id} href={repo.repoUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div style={{ background: SAND, padding: 40, height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.4s', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', borderLeft: `3px solid transparent` }}
                       onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.1)'; e.currentTarget.style.borderLeftColor = GOLD; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                       onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)'; e.currentTarget.style.borderLeftColor = 'transparent'; e.currentTarget.style.transform = 'none'; }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                      <div>
                        <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase', color: GOLD }}>
                          {repo.language || 'Project'}
                        </span>
                      </div>
                      <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, opacity: 0.2 }}>★ {repo.stars || 0}</span>
                    </div>
                    <h3 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 16, color: INK, lineHeight: 1.1 }}>{repo.name}</h3>
                    <p style={{ fontSize: 15, lineHeight: 1.7, color: `${INK}80`, marginBottom: 32, flex: 1 }}>
                      {repo.description || 'An architectural solution crafted with precision for scalability and modern development workflows.'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20, borderTop: `1px solid ${INK}08` }}>
                      <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD }}>
                        View Project ↗
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {links.github && (
              <div style={{ textAlign: 'center', marginTop: 64 }}>
                <a href={links.github} target="_blank" rel="noreferrer"
                   style={{ display: 'inline-block', padding: '16px 48px', border: `2px solid ${INK}20`, fontFamily: SANS, fontSize: 12, fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase', color: INK, textDecoration: 'none', transition: 'all 0.3s' }}
                   onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD_DARK; }}
                   onMouseLeave={e => { e.currentTarget.style.borderColor = `${INK}20`; e.currentTarget.style.color = INK; }}>
                  All Archives on GitHub ↗
                </a>
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            04. SKILLS
        ═══════════════════════════════════════════════ */}
        <section id="skills" style={{ padding: '128px 48px', maxWidth: 1280, margin: '0 auto' }}>
          <SectionLabel>03 // Skills</SectionLabel>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(2.5rem, 5vw, 5rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 80, color: INK }}>Craft & Mastery</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 32 }}>
            {[
              { label: 'Frontend', items: categorized.frontend.length > 0 ? categorized.frontend : ['React', 'TypeScript', 'Tailwind', 'Next.js', 'HTML/CSS'], icon: '◈' },
              { label: 'Backend', items: categorized.backend.length > 0 ? categorized.backend : ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Python'], icon: '◉' },
              { label: 'Tools & Cloud', items: categorized.tools.length > 0 ? categorized.tools : ['Git', 'Docker', 'AWS', 'CI/CD', 'Linux'], icon: '◎' },
            ].map(cat => (
              <div key={cat.label} style={{ background: SAND_MID, padding: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                  <span style={{ fontSize: 24, color: GOLD }}>{cat.icon}</span>
                  <div>
                    <div style={{ fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: '0.5em', textTransform: 'uppercase', opacity: 0.4, marginBottom: 2 }}>Category</div>
                    <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 900, color: INK }}>{cat.label}</div>
                  </div>
                </div>
                <div style={{ height: 2, background: `${GOLD}30`, marginBottom: 32 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {cat.items.map((skill, i) => (
                    <div key={skill}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: INK }}>{skill}</span>
                      </div>
                      <div style={{ height: 2, background: `${INK}08`, borderRadius: 99 }}>
                        <div style={{ height: '100%', width: `${Math.max(55, 100 - i * 10)}%`, background: GOLD, borderRadius: 99, opacity: 0.7 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            05. EXPERIENCE TIMELINE
        ═══════════════════════════════════════════════ */}
        {experience.length > 0 && (
          <section id="experience" style={{ padding: '128px 48px', background: INK }}>
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 32, height: 2, background: GOLD }} />
                <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 900, letterSpacing: '0.6em', textTransform: 'uppercase', color: GOLD }}>04 // Experience</span>
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(2.5rem, 5vw, 5rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 80, color: SAND }}>Command History</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {experience.map((exp, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 64, padding: '48px 0', borderBottom: `1px solid rgba(255,248,243,0.06)` }} className="group">
                    <div style={{ minWidth: 120, fontFamily: SANS, fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: `${SAND}40`, paddingTop: 8 }}>
                      <div>{exp.startDate}</div>
                      <div style={{ marginTop: 4 }}>→ {exp.endDate || 'Now'}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                        <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, color: SAND, letterSpacing: '-0.02em' }}>{exp.role}</h3>
                        <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase', padding: '8px 20px', border: `1px solid ${GOLD}40`, color: GOLD }}>
                          {exp.company}
                        </span>
                      </div>
                      {exp.description && (
                        <p style={{ fontSize: 17, lineHeight: 1.7, color: `${SAND}70`, maxWidth: 640 }}>{exp.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════
            06. RESUME
        ═══════════════════════════════════════════════ */}
        <section style={{ padding: '80px 48px', background: SAND_MID }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
            <div>
              <div style={{ fontFamily: SANS, fontSize: 10, fontWeight: 900, letterSpacing: '0.6em', textTransform: 'uppercase', color: GOLD, marginBottom: 8 }}>Credentials</div>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(2rem, 4vw, 4rem)', fontWeight: 900, color: INK, letterSpacing: '-0.03em' }}>Download Resume</h2>
            </div>
            <a href="/resume.pdf" download
               style={{ padding: '20px 56px', background: INK, color: SAND, fontFamily: SANS, fontSize: 12, fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 12, transition: 'all 0.3s' }}
               onMouseEnter={e => { e.currentTarget.style.background = GOLD; }}
               onMouseLeave={e => { e.currentTarget.style.background = INK; }}>
              <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Download PDF
            </a>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            07. CONTACT
        ═══════════════════════════════════════════════ */}
        <section id="contact" style={{ padding: '128px 48px', maxWidth: 1280, margin: '0 auto' }}>
          <SectionLabel>06 // Contact</SectionLabel>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(2.5rem, 5vw, 5rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 80, color: INK }}>Let's Build Together</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }} className="grid-cols-1 md:grid-cols-2">
            {/* Info */}
            <div>
              <p style={{ fontSize: 20, lineHeight: 1.8, color: `${INK}80`, marginBottom: 48 }}>
                Have a project in mind or want to collaborate? I'd love to hear from you. Let's create something exceptional together.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {email && (
                  <a href={`mailto:${email}`} style={{ display: 'flex', alignItems: 'center', gap: 20, textDecoration: 'none', padding: '20px 24px', border: `1px solid transparent`, transition: 'all 0.3s' }}
                     onMouseEnter={e => { e.currentTarget.style.borderColor = `${GOLD}30`; e.currentTarget.style.background = `${GOLD}06`; }}
                     onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}>
                    <div style={{ width: 44, height: 44, border: `1px solid ${GOLD}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg style={{ width: 16, height: 16, color: GOLD }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    </div>
                    <div>
                      <div style={{ fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.4, marginBottom: 2 }}>Email</div>
                      <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, color: INK }}>{email}</div>
                    </div>
                  </a>
                )}
                {links.linkedin && (
                  <a href={links.linkedin} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 20, textDecoration: 'none', padding: '20px 24px', border: `1px solid transparent`, transition: 'all 0.3s' }}
                     onMouseEnter={e => { e.currentTarget.style.borderColor = `${GOLD}30`; e.currentTarget.style.background = `${GOLD}06`; }}
                     onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}>
                    <div style={{ width: 44, height: 44, border: `1px solid ${GOLD}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg style={{ width: 16, height: 16, color: GOLD }} fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>
                    </div>
                    <div>
                      <div style={{ fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.4, marginBottom: 2 }}>LinkedIn</div>
                      <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, color: INK }}>View Profile ↗</div>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={onSubmit}>
              {sent && (
                <div style={{ padding: '14px 24px', marginBottom: 24, background: `${GOLD}15`, border: `1px solid ${GOLD}40`, fontFamily: SANS, fontSize: 12, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD_DARK, textAlign: 'center' }}>
                  Message Sent — Awaiting Reply ✓
                </div>
              )}
              {[
                { name: 'name', label: 'Your Name', type: 'text', placeholder: 'Full Name' },
                { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
              ].map(f => (
                <div key={f.name} style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontFamily: SANS, fontSize: 10, fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.4, marginBottom: 8 }}>{f.label}</label>
                  <input name={f.name} type={f.type} value={form[f.name]} onChange={onChange} required placeholder={f.placeholder}
                         style={{ width: '100%', padding: '16px 20px', fontFamily: SANS, fontSize: 14, background: 'transparent', border: `1px solid ${INK}15`, color: INK, outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                         onFocus={e => e.currentTarget.style.borderColor = GOLD}
                         onBlur={e => e.currentTarget.style.borderColor = `${INK}15`} />
                </div>
              ))}
              <div style={{ marginBottom: 32 }}>
                <label style={{ display: 'block', fontFamily: SANS, fontSize: 10, fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.4, marginBottom: 8 }}>Message</label>
                <textarea name="message" value={form.message} onChange={onChange} required rows={6} placeholder="Your message..."
                          style={{ width: '100%', padding: '16px 20px', fontFamily: SANS, fontSize: 14, background: 'transparent', border: `1px solid ${INK}15`, color: INK, outline: 'none', resize: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                          onFocus={e => e.currentTarget.style.borderColor = GOLD}
                          onBlur={e => e.currentTarget.style.borderColor = `${INK}15`} />
              </div>
              <button type="submit"
                      style={{ width: '100%', padding: '18px', background: INK, color: SAND, fontFamily: SANS, fontSize: 13, fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', transition: 'background 0.3s' }}
                      onMouseEnter={e => e.currentTarget.style.background = GOLD}
                      onMouseLeave={e => e.currentTarget.style.background = INK}>
                Send Message
              </button>
            </form>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            08. FOOTER
        ═══════════════════════════════════════════════ */}
        <footer style={{ padding: '80px 48px', background: INK, color: SAND }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 48, marginBottom: 64 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, background: GOLD, transform: 'rotate(45deg)' }} />
                  <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 900, letterSpacing: '0.5em', textTransform: 'uppercase' }}>{name.split(' ')[0]}.folio</span>
                </div>
                <p style={{ fontSize: 14, opacity: 0.4, lineHeight: 1.6 }}>{headline}</p>
              </div>
              <div>
                <div style={{ fontFamily: SANS, fontSize: 10, fontWeight: 900, letterSpacing: '0.5em', textTransform: 'uppercase', opacity: 0.3, marginBottom: 20 }}>Navigate</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {navLinks.map(l => (
                    <a key={l.href} href={l.href} style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, opacity: 0.4, textDecoration: 'none', color: SAND, transition: 'opacity 0.2s, color 0.2s' }}
                       onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = GOLD; }}
                       onMouseLeave={e => { e.currentTarget.style.opacity = '0.4'; e.currentTarget.style.color = SAND; }}>
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: SANS, fontSize: 10, fontWeight: 900, letterSpacing: '0.5em', textTransform: 'uppercase', opacity: 0.3, marginBottom: 20 }}>Connect</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {links.github && <a href={links.github} target="_blank" rel="noreferrer" style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, opacity: 0.4, textDecoration: 'none', color: SAND, transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = GOLD; }} onMouseLeave={e => { e.currentTarget.style.opacity = '0.4'; e.currentTarget.style.color = SAND; }}>GitHub ↗</a>}
                  {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, opacity: 0.4, textDecoration: 'none', color: SAND, transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = GOLD; }} onMouseLeave={e => { e.currentTarget.style.opacity = '0.4'; e.currentTarget.style.color = SAND; }}>LinkedIn ↗</a>}
                  {email && <a href={`mailto:${email}`} style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, opacity: 0.4, textDecoration: 'none', color: SAND, transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = GOLD; }} onMouseLeave={e => { e.currentTarget.style.opacity = '0.4'; e.currentTarget.style.color = SAND; }}>Email ↗</a>}
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: `${SAND}08`, marginBottom: 32 }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.25 }}>
                © {new Date().getFullYear()} {name}. All Rights Reserved.
              </span>
              <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.25 }}>
                Built with PortForge_Luxor
              </span>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        ::selection { background: rgba(197,160,33,0.3); }
        @media (max-width: 768px) { section { padding-left: 24px !important; padding-right: 24px !important; } }

        /* ── LUXOR GOLD SHIMMER ── */
        .luxor-shimmer {
          background: linear-gradient(
            120deg,
            #1a1208 20%,
            #c5a021 38%,
            #f5d77a 50%,
            #c5a021 62%,
            #1a1208 80%
          );
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gold-sweep 5s linear infinite;
        }
        @keyframes gold-sweep {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        /* ── FLOATING DUST PARTICLES ── */
        .luxor-dust::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            radial-gradient(1px 1px at 15% 80%, rgba(197,160,33,0.7), transparent),
            radial-gradient(1.5px 1.5px at 35% 60%, rgba(197,160,33,0.5), transparent),
            radial-gradient(1px 1px at 55% 90%, rgba(197,160,33,0.6), transparent),
            radial-gradient(2px 2px at 75% 70%, rgba(197,160,33,0.4), transparent),
            radial-gradient(1px 1px at 90% 50%, rgba(197,160,33,0.7), transparent),
            radial-gradient(1.5px 1.5px at 25% 30%, rgba(197,160,33,0.5), transparent),
            radial-gradient(1px 1px at 65% 20%, rgba(197,160,33,0.6), transparent);
          animation: dust-rise 12s ease-in-out infinite alternate;
        }
        @keyframes dust-rise {
          0%   { transform: translateY(0) opacity(0.4); }
          100% { transform: translateY(-40px); opacity: 0.8; }
        }

        /* ── SECTION FADE-IN ── */
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.8s ease both; }
      `}</style>
    </div>
  );
};
