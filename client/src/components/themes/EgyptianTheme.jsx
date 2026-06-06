import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════
   RETRO PIXEL EGYPT THEME — Pyramid Pixel Adventure
   Design Language: Pixelated Golden sands, Warm Orange, Tomb Ink, Pixel Borders
   Typography: "JetBrains Mono", monospace (16-bit retro feel)
   Special: Retro 8-bit style elements, golden pixel boxes, custom micro-animations
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
   COMPONENT: RETRO PIXEL LABEL
═══════════════════════════════════════════════════════════ */
const PixelLabel = ({ children }) => (
  <div className="flex items-center gap-4 mb-6">
    <span style={{ fontSize: 18 }}>🔸</span>
    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#ffb000', textShadow: '2px 2px 0px #000' }}>
      {children}
    </span>
    <span style={{ fontSize: 18 }}>🔸</span>
  </div>
);


export const EgyptianTheme = ({ rootUser, profile, repos = [] }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
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

  /* 8-bit color palette */
  const GOLD = '#ffb000';
  const GOLD_DARK = '#cc8400';
  const INK = '#120d06';
  const SAND = '#ffe0a8';
  const SAND_MID = '#f5c582';
  const MONO = '"JetBrains Mono", monospace';

  return (
    <div style={{ minHeight: '100vh', background: INK, color: SAND, fontFamily: MONO, overflowX: 'hidden', imageRendering: 'pixelated' }}>
      
      {/* Scroll-driven Pixel Progress Indicator */}
      <div 
        className="pixel-scroll-progress"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '8px',
          background: GOLD,
          width: `${Math.min(100, (scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100 || 0)}%`,
          zIndex: 100,
          boxShadow: '0 2px 0px #000',
          transition: 'width 0.1s ease-out'
        }} 
      />

      {/* ── BACKGROUND LAYERS (Pixel Parallax Scroll) ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <img 
          src="/assets/themes/egyptian_bg.png" 
          alt=""
          className="pixel-parallax-bg"
          style={{ width: '100%', height: '120%', objectFit: 'cover', opacity: 0.35,
                   transform: `scale(1.05) translateY(${scrollY * 0.1}px)`, imageRendering: 'pixelated' }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(18,13,6,0.8) 0%, transparent 50%, rgba(18,13,6,0.98) 100%)' }} />
      </div>

      {/* Floating 8-bit pyramid / coin particles - morphs scale & rotation on scroll */}
      <div 
        className="pixel-pyramid-float"
        style={{ 
          position: 'fixed', 
          right: '8%', 
          bottom: '12%', 
          pointerEvents: 'none', 
          zIndex: 1, 
          opacity: 0.15,
          transform: `translateY(${scrollY * -0.05}px) rotate(${scrollY * 0.1}deg) scale(${1 + (scrollY * 0.0005)})` 
        }} 
      >
        <svg width="220" height="220" viewBox="0 0 16 16" fill="none" style={{ imageRendering: 'pixelated' }}>
          <path d="M8 1 L15 15 H1 Z" fill={GOLD} />
          <path d="M8 1 L8 15 H1 Z" fill={GOLD_DARK} />
        </svg>
      </div>

      {/* ═══ PIXEL ART MUMMY — Real Sprite Sheet Animation ═══ */}
      <MummySprite />

      {/* ── STICKY RETRO NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all 0.3s',
        background: scrollY > 60 ? `rgba(18,13,6,0.95)` : 'transparent',
        borderBottom: `4px solid ${scrollY > 60 ? GOLD : 'transparent'}`,
        boxShadow: scrollY > 60 ? '0 4px 0 #000' : 'none'
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24, animation: 'spin 4s steps(4) infinite' }}>🪙</span>
            <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, textShadow: '2px 2px 0px #000' }}>
              {name.split(' ')[0]}.EXE
            </span>
          </div>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="hidden md:flex">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: SAND, textDecoration: 'none', transition: 'all 0.2s', textShadow: '1px 1px 0px #000' }}
                 onMouseEnter={e => e.currentTarget.style.color = GOLD}
                 onMouseLeave={e => e.currentTarget.style.color = SAND}>
                [{l.label}]
              </a>
            ))}
            {links.github && (
              <a href={links.github} target="_blank" rel="noreferrer"
                 style={{ fontFamily: MONO, fontSize: 12, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 16px', border: `3px solid ${GOLD}`, background: '#000', color: GOLD, textDecoration: 'none', boxShadow: '3px 3px 0px #000' }}
                 onMouseEnter={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = '#000'; }}
                 onMouseLeave={e => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = GOLD; }}>
                GITHUB
              </a>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}
                  style={{ background: '#000', border: `3px solid ${GOLD}`, cursor: 'pointer', padding: '6px 12px', color: GOLD, fontFamily: MONO, fontSize: 12 }}>
            {menuOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{ background: '#120d06', borderBottom: `4px solid ${GOLD}`, padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {navLinks.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                 style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: SAND, textDecoration: 'none' }}>
                &gt; {l.label}
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
        <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '120px', paddingBottom: '80px', paddingLeft: '32px', paddingRight: '32px', maxWidth: 1280, margin: '0 auto' }}>
          <motion.div 
            style={{ width: '100%' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
              <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD }}>
                LEVEL 01 // {headline}
              </span>
            </div>

            {/* Name */}
            <h1 style={{ fontFamily: MONO, fontSize: 'clamp(2.5rem, 8vw, 6.5rem)', lineHeight: 1.1, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 32, color: '#fff', textShadow: `6px 6px 0px ${GOLD_DARK}, 12px 12px 0px #000` }}>
              {name}
            </h1>

            {/* Bio Quote */}
            <div style={{ maxWidth: 680, background: 'rgba(0,0,0,0.6)', border: `4px solid ${GOLD}`, padding: '24px', boxShadow: '8px 8px 0px #000', marginBottom: 48 }}>
              <p style={{ fontFamily: MONO, fontSize: 'clamp(0.95rem, 2vw, 1.25rem)', lineHeight: 1.6, color: SAND }}>
                "{bio}"
              </p>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 64 }}>
              <a href="#projects"
                 style={{ fontFamily: MONO, fontSize: 13, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '16px 36px', background: GOLD, color: '#000', textDecoration: 'none', border: '4px solid #fff', boxShadow: '6px 6px 0px #000', imageRendering: 'pixelated' }}
                 className="retro-btn-hover">
                PLAY PROJECT
              </a>
              <a href="#contact"
                 style={{ fontFamily: MONO, fontSize: 13, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '16px 36px', background: '#000', color: SAND, textDecoration: 'none', border: `4px solid ${GOLD}`, boxShadow: '6px 6px 0px #000' }}
                 className="retro-btn-hover">
                CONTACT MISSION
              </a>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, paddingTop: 40, borderTop: `4px dashed ${GOLD}` }}>
              {[
                { value: repos.length, label: 'QUESTS_COMPLETED' },
                { value: skills.length, label: 'SKILLS_UNLOCKED' },
                { value: experience.length, label: 'SAVE_SLOTS' },
              ].map(s => (
                <div key={s.label} style={{ background: '#000', border: `3px solid ${GOLD_DARK}`, padding: '16px 24px', boxShadow: '4px 4px 0px #000' }}>
                  <div style={{ fontFamily: MONO, fontSize: '2rem', fontWeight: 900, color: GOLD, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: SAND, opacity: 0.7, marginTop: 8 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════
            02. ABOUT
        ═══════════════════════════════════════════════ */}
        <motion.section 
          id="about" 
          className="scroll-reveal-section"
          style={{ padding: '96px 32px', maxWidth: 1280, margin: '0 auto' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <PixelLabel>CHARACTER PROFILE</PixelLabel>
          <h2 style={{ fontFamily: MONO, fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, marginBottom: 48, color: '#fff', textShadow: '4px 4px 0px #000' }}>THE ARCHITECT</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }} className="grid-cols-1 md:grid-cols-2">
            <div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: SAND, marginBottom: 32 }}>{intro}</p>
              {location && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: '#000', border: `3px solid ${GOLD}`, padding: '12px 18px', marginBottom: 32, boxShadow: '4px 4px 0px #000' }}>
                  <span style={{ fontSize: 18 }}>📍</span>
                  <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD }}>{location}</span>
                </div>
              )}
              {education.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {education.map((edu, i) => (
                    <div key={i} style={{ padding: '16px 20px', background: '#000', border: `3px solid ${GOLD_DARK}`, borderLeft: `6px solid ${GOLD}`, boxShadow: '4px 4px 0px #000' }}>
                      <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 900, color: GOLD, marginBottom: 4 }}>{edu.year}</div>
                      <div style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color: '#fff' }}>{edu.degree || edu.field}</div>
                      <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{edu.institution}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, marginBottom: 20 }}>SPECIALIZATIONS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {(skills.length > 0 ? skills.slice(0, 16) : ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Python', 'Docker', 'AWS', 'GraphQL', 'Next.js', 'PostgreSQL', 'Redis', 'Tailwind CSS']).map(s => (
                  <span key={s} style={{ padding: '10px 18px', fontSize: 12, fontFamily: MONO, fontWeight: 700, border: `3px solid ${GOLD_DARK}`, color: GOLD, background: '#000', boxShadow: '3px 3px 0px #000', cursor: 'default', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '5px 5px 0px #000'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = GOLD_DARK; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '3px 3px 0px #000'; }}>
                    [{s}]
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════
            03. PROJECTS
        ═══════════════════════════════════════════════ */}
        <motion.section 
          id="projects" 
          className="scroll-reveal-section"
          style={{ padding: '96px 0', background: 'rgba(0,0,0,0.85)', borderTop: `4px solid ${GOLD}`, borderBottom: `4px solid ${GOLD}` }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
            <PixelLabel>MISSION SLOTS</PixelLabel>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 20 }}>
              <h2 style={{ fontFamily: MONO, fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, color: '#fff', textShadow: '4px 4px 0px #000' }}>SELECTED RUNS</h2>
              <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: GOLD }}>CATALOG_DATABASE</span>
            </div>

            {/* Filters */}
            {techTags.length > 1 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 48 }}>
                {techTags.map(tag => (
                  <button key={tag} onClick={() => setActiveFilter(tag)}
                          style={{ padding: '8px 18px', fontFamily: MONO, fontSize: 11, fontWeight: 900, cursor: 'pointer', transition: 'all 0.15s',
                                   border: `3px solid ${activeFilter === tag ? GOLD : `${GOLD_DARK}50`}`,
                                   color: activeFilter === tag ? '#000' : GOLD,
                                   background: activeFilter === tag ? GOLD : '#000',
                                   boxShadow: '3px 3px 0px #000' }}>
                    {tag.toUpperCase()}
                  </button>
                ))}
              </div>
            )}

            {/* Projects Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 32 }}>
              {filteredRepos.map((repo) => (
                <motion.div
                  key={repo._id}
                  layoutId={`egyptian-project-${repo._id}`}
                  onClick={() => setSelectedProject(repo)}
                  className="scroll-reveal-card"
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block', cursor: 'pointer' }}
                >
                  <div style={{ background: '#120d06', padding: '32px', height: '100%', display: 'flex', flexDirection: 'column', border: `4px solid ${GOLD_DARK}`, boxShadow: '6px 6px 0px #000', transition: 'all 0.2s' }}
                       onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.transform = 'translate(-4px, -4px)'; e.currentTarget.style.boxShadow = '10px 10px 0px #000'; }}
                       onMouseLeave={e => { e.currentTarget.style.borderColor = GOLD_DARK; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '6px 6px 0px #000'; }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                      <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 900, padding: '4px 8px', background: GOLD, color: '#000', border: '2px solid #fff' }}>
                        {repo.language?.toUpperCase() || 'CODE'}
                      </span>
                      <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: GOLD }}>SCORE: {repo.stars || 0}</span>
                    </div>
                    <h3 style={{ fontFamily: MONO, fontSize: 22, fontWeight: 900, marginBottom: 12, color: '#fff' }}>{repo.name.toUpperCase()}</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: SAND, marginBottom: 24, flex: 1 }} className="line-clamp-4">
                      {repo.description || 'A pixelated artifact recovered from the code temple.'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: `3px dashed ${GOLD_DARK}` }}>
                      <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 900, color: GOLD }}>
                        EXPAND QUEST &gt;&gt;
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {links.github && (
              <div style={{ textAlign: 'center', marginTop: 48 }}>
                <a href={links.github} target="_blank" rel="noreferrer"
                   style={{ display: 'inline-block', padding: '16px 36px', border: `4px solid ${GOLD}`, background: '#000', fontFamily: MONO, fontSize: 12, fontWeight: 900, color: GOLD, textDecoration: 'none', boxShadow: '6px 6px 0px #000' }}
                   className="retro-btn-hover">
                  VISIT ARCHIVE TEMPLE ↗
                </a>
              </div>
            )}
          </div>
        </motion.section>

        {/* DETAILED PROJECT ZOOM OVERLAY */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                layoutId={`egyptian-project-${selectedProject._id}`}
                style={{ background: '#120d06', maxWidth: 600, width: '100%', padding: '36px', border: `4px solid ${GOLD}`, boxShadow: '12px 12px 0px #000', position: 'relative' }}
                onClick={e => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 900, padding: '4px 8px', background: GOLD, color: '#000', border: '2px solid #fff' }}>
                    {selectedProject.language?.toUpperCase() || 'QUEST'}
                  </span>
                  <button 
                    onClick={() => setSelectedProject(null)}
                    style={{ background: '#000', border: `2px solid ${GOLD}`, fontFamily: MONO, fontSize: 10, fontWeight: 900, padding: '6px 12px', color: GOLD, cursor: 'pointer' }}
                  >
                    CLOSE [X]
                  </button>
                </div>
                
                <h3 style={{ fontFamily: MONO, fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 16 }}>
                  {selectedProject.name.toUpperCase()}
                </h3>
                
                <div style={{ height: 4, background: GOLD, marginBottom: 24 }} />
                
                <p style={{ fontSize: 15, lineHeight: 1.7, color: SAND, marginBottom: 28 }}>
                  {selectedProject.description || 'A pixelated artifact recovered from the code temple.'}
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '16px', background: '#000', border: `3px solid ${GOLD_DARK}`, marginBottom: 28 }}>
                  <div>
                    <span style={{ fontFamily: MONO, fontSize: 9, color: SAND, opacity: 0.6 }}>SCORE</span>
                    <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 900, color: GOLD, marginTop: 4 }}>★ {selectedProject.stars || 0}</div>
                  </div>
                  <div>
                    <span style={{ fontFamily: MONO, fontSize: 9, color: SAND, opacity: 0.6 }}>REPLICAS</span>
                    <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 900, color: '#fff', marginTop: 4 }}>⑂ {selectedProject.forks || 0}</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {selectedProject.repoUrl && (
                    <a 
                      href={selectedProject.repoUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ padding: '12px 28px', background: GOLD, color: '#000', border: '3px solid #fff', fontFamily: MONO, fontSize: 11, fontWeight: 900, textDecoration: 'none', boxShadow: '4px 4px 0px #000' }}
                    >
                      DOWNLOAD CODE ↗
                    </a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════
            04. SKILLS
        ═══════════════════════════════════════════════ */}
        <motion.section 
          id="skills" 
          className="scroll-reveal-section"
          style={{ padding: '96px 32px', maxWidth: 1280, margin: '0 auto' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <PixelLabel>UPGRADE MATRIX</PixelLabel>
          <h2 style={{ fontFamily: MONO, fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, marginBottom: 48, color: '#fff', textShadow: '4px 4px 0px #000' }}>CRAFT & MASTERY</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 32 }}>
            {[
              { label: 'Frontend', items: categorized.frontend.length > 0 ? categorized.frontend : ['React', 'TypeScript', 'Tailwind', 'Next.js', 'HTML/CSS'], icon: '🛡️' },
              { label: 'Backend', items: categorized.backend.length > 0 ? categorized.backend : ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Python'], icon: '🗡️' },
              { label: 'Cloud & Tools', items: categorized.tools.length > 0 ? categorized.tools : ['Git', 'Docker', 'AWS', 'CI/CD', 'Linux'], icon: '🔑' },
            ].map(cat => (
              <div key={cat.label} className="scroll-reveal-card" style={{ background: '#000', border: `4px solid ${GOLD_DARK}`, padding: '32px', boxShadow: '6px 6px 0px #000' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                  <span style={{ fontSize: 32 }}>{cat.icon}</span>
                  <div>
                    <div style={{ fontFamily: MONO, fontSize: 18, fontWeight: 900, color: GOLD }}>{cat.label.toUpperCase()}</div>
                  </div>
                </div>
                <div style={{ height: 4, background: GOLD, marginBottom: 24 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {cat.items.map((skill, i) => (
                    <div key={skill}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: SAND }}>{skill.toUpperCase()}</span>
                        <span style={{ fontFamily: MONO, fontSize: 11, color: GOLD }}>LV.{(5 - i) * 20}</span>
                      </div>
                      <div style={{ height: 12, background: '#120d06', border: `2px solid ${GOLD_DARK}`, padding: '1px' }}>
                        <div style={{ height: '100%', width: `${Math.max(45, 100 - i * 15)}%`, background: GOLD }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════
            05. EXPERIENCE TIMELINE
        ═══════════════════════════════════════════════ */}
        {experience.length > 0 && (
          <motion.section 
            id="experience" 
            className="scroll-reveal-section"
            style={{ padding: '96px 32px', background: 'rgba(0,0,0,0.85)', borderTop: `4px solid ${GOLD}`, borderBottom: `4px solid ${GOLD}` }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>
              <PixelLabel>QUEST LOG</PixelLabel>
              <h2 style={{ fontFamily: MONO, fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, marginBottom: 48, color: '#fff', textShadow: '4px 4px 0px #000' }}>ADVENTURE TIMELINE</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {experience.map((exp, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 32, padding: '32px 0', borderBottom: `3px dashed ${GOLD_DARK}` }} className="flex-col md:flex-row">
                    <div style={{ minWidth: 160, fontFamily: MONO, fontSize: 12, fontWeight: 700, color: GOLD, paddingTop: 4 }}>
                      [{exp.startDate} - {exp.endDate || 'NOW'}]
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 12 }}>
                        <h3 style={{ fontFamily: MONO, fontSize: 22, fontWeight: 900, color: '#fff' }}>{exp.role.toUpperCase()}</h3>
                        <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 900, padding: '4px 12px', border: `2px solid ${GOLD}`, background: '#000', color: GOLD }}>
                          {exp.company.toUpperCase()}
                        </span>
                      </div>
                      {exp.description && (
                        <p style={{ fontSize: 14, lineHeight: 1.7, color: SAND, maxWidth: 800 }}>{exp.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* ═══════════════════════════════════════════════
            06. RESUME
        ═══════════════════════════════════════════════ */}
        <motion.section 
          className="scroll-reveal-section"
          style={{ padding: '64px 32px', background: INK, borderBottom: `4px solid ${GOLD}` }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
            <div>
              <PixelLabel>ARTIFACT STORAGE</PixelLabel>
              <h2 style={{ fontFamily: MONO, fontSize: 'clamp(1.8rem, 3vw, 3rem)', fontWeight: 900, color: '#fff', textShadow: '3px 3px 0px #000' }}>DOWNLOAD SCROLL</h2>
            </div>
            <a href="/resume.pdf" download
               style={{ padding: '16px 36px', background: GOLD, color: '#000', border: '4px solid #fff', fontFamily: MONO, fontSize: 13, fontWeight: 900, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 12, boxShadow: '6px 6px 0px #000' }}
               className="retro-btn-hover">
              <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              GET RESUME.PDF
            </a>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════
            07. CONTACT
        ═══════════════════════════════════════════════ */}
        <motion.section 
          id="contact" 
          className="scroll-reveal-section"
          style={{ padding: '96px 32px', maxWidth: 1280, margin: '0 auto' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <PixelLabel>OPEN TRANSMISSION</PixelLabel>
          <h2 style={{ fontFamily: MONO, fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, marginBottom: 48, color: '#fff', textShadow: '4px 4px 0px #000' }}>SEND MESSENGER</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }} className="grid-cols-1 md:grid-cols-2">
            {/* Info */}
            <div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: SAND, marginBottom: 36 }}>
                HAVE A QUEST OR QUEST-CONTRACT IN MIND? DEPLOY A TRANSMISSION BELOW.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {email && (
                  <a href={`mailto:${email}`} style={{ display: 'flex', alignItems: 'center', gap: 20, textDecoration: 'none', padding: '16px', border: `3px solid ${GOLD_DARK}`, background: '#000', boxShadow: '4px 4px 0px #000' }}>
                    <div style={{ fontSize: 24 }}>✉️</div>
                    <div>
                      <div style={{ fontFamily: MONO, fontSize: 9, color: GOLD, opacity: 0.7 }}>EMAIL_LINK</div>
                      <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: SAND }}>{email}</div>
                    </div>
                  </a>
                )}
                {links.linkedin && (
                  <a href={links.linkedin} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 20, textDecoration: 'none', padding: '16px', border: `3px solid ${GOLD_DARK}`, background: '#000', boxShadow: '4px 4px 0px #000' }}>
                    <div style={{ fontSize: 24 }}>🌐</div>
                    <div>
                      <div style={{ fontFamily: MONO, fontSize: 9, color: GOLD, opacity: 0.7 }}>LINKEDIN_PROFILE</div>
                      <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: SAND }}>VIEW PROFILE ↗</div>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={onSubmit} style={{ background: '#000', border: `4px solid ${GOLD}`, padding: '24px', boxShadow: '8px 8px 0px #000' }}>
              {sent && (
                <div style={{ padding: '12px 18px', marginBottom: 20, background: GOLD, border: `2px solid #fff`, fontFamily: MONO, fontSize: 11, fontWeight: 900, color: '#000', textAlign: 'center' }}>
                  TRANSMISSION SUCCESSFUL ✓
                </div>
              )}
              {[
                { name: 'name', label: 'NAME', type: 'text', placeholder: 'ENTER NAME' },
                { name: 'email', label: 'EMAIL', type: 'email', placeholder: 'ENTER EMAIL' },
              ].map(f => (
                <div key={f.name} style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontFamily: MONO, fontSize: 10, fontWeight: 900, color: GOLD, marginBottom: 8 }}>{f.label}</label>
                  <input name={f.name} type={f.type} value={form[f.name]} onChange={onChange} required placeholder={f.placeholder}
                         style={{ width: '100%', padding: '12px 16px', fontFamily: MONO, fontSize: 13, background: '#120d06', border: `2px solid ${GOLD_DARK}`, color: SAND, outline: 'none', boxSizing: 'border-box' }}
                         onFocus={e => e.currentTarget.style.borderColor = GOLD}
                         onBlur={e => e.currentTarget.style.borderColor = GOLD_DARK} />
                </div>
              ))}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontFamily: MONO, fontSize: 10, fontWeight: 900, color: GOLD, marginBottom: 8 }}>MESSAGE</label>
                <textarea name="message" value={form.message} onChange={onChange} required rows={4} placeholder="ENTER DETAILS..."
                          style={{ width: '100%', padding: '12px 16px', fontFamily: MONO, fontSize: 13, background: '#120d06', border: `2px solid ${GOLD_DARK}`, color: SAND, outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                          onFocus={e => e.currentTarget.style.borderColor = GOLD}
                          onBlur={e => e.currentTarget.style.borderColor = GOLD_DARK} />
              </div>
              <button type="submit"
                      style={{ width: '100%', padding: '16px', background: GOLD, color: '#000', border: '3px solid #fff', fontFamily: MONO, fontSize: 12, fontWeight: 900, cursor: 'pointer', transition: 'all 0.15s', boxShadow: '4px 4px 0px #000' }}
                      className="retro-btn-hover">
                LAUNCH TRANSMISSION
              </button>
            </form>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════════════════
            08. FOOTER
        ═══════════════════════════════════════════════ */}
        <footer style={{ padding: '64px 32px', background: '#000', borderTop: `4px solid ${GOLD}` }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 48, marginBottom: 48 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 20 }}>🪙</span>
                  <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 900, color: GOLD }}>{name.split(' ')[0]}.EXE</span>
                </div>
                <p style={{ fontSize: 12, opacity: 0.6, lineHeight: 1.6 }}>{headline.toUpperCase()}</p>
              </div>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 900, color: GOLD, marginBottom: 16 }}>NAVIGATE</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {navLinks.map(l => (
                    <a key={l.href} href={l.href} style={{ fontFamily: MONO, fontSize: 12, textDecoration: 'none', color: SAND, opacity: 0.6 }}
                       onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                       onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}>
                      [{l.label.toUpperCase()}]
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 900, color: GOLD, marginBottom: 16 }}>CONNECT</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {links.github && <a href={links.github} target="_blank" rel="noreferrer" style={{ fontFamily: MONO, fontSize: 12, textDecoration: 'none', color: SAND, opacity: 0.6 }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}>GITHUB ↗</a>}
                  {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" style={{ fontFamily: MONO, fontSize: 12, textDecoration: 'none', color: SAND, opacity: 0.6 }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}>LINKEDIN ↗</a>}
                </div>
              </div>
            </div>

            <div style={{ height: 2, background: GOLD_DARK, marginBottom: 24 }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <span style={{ fontFamily: MONO, fontSize: 10, opacity: 0.5 }}>
                © {new Date().getFullYear()} {name.toUpperCase()}. ALL RIGHTS RESERVED.
              </span>
              <span style={{ fontFamily: MONO, fontSize: 10, opacity: 0.5 }}>
                BUILT WITH PORTFORGE_LUXOR_RETRO
              </span>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        html {
          scroll-behavior: smooth;
        }
        * {
          box-sizing: border-box;
        }
        ::selection {
          background: ${GOLD};
          color: #000;
        }
        @media (max-width: 768px) {
          section {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }

        /* Modern Scroll-driven Progress Indicator using CSS Scroll Timeline */
        @supports (animation-timeline: scroll()) {
          .pixel-scroll-progress {
            width: 0% !important;
            animation: grow-progress linear both;
            animation-timeline: scroll(root);
          }
          @keyframes grow-progress {
            to { width: 100% !important; }
          }
        }

        /* Scroll-Driven Parallax Background */
        @supports (animation-timeline: scroll()) {
          .pixel-parallax-bg {
            transform: translateY(0) scale(1) !important;
            animation: parallax-scroll linear both;
            animation-timeline: scroll(root);
          }
          @keyframes parallax-scroll {
            to { transform: translateY(180px) scale(1.1) !important; }
          }
        }

        /* Scroll-Driven Floating Amulet (Spin and Drop) */
        @supports (animation-timeline: scroll()) {
          .pixel-pyramid-float {
            transform: translateY(0px) rotate(0deg) scale(1) !important;
            animation: amulet-action linear both;
            animation-timeline: scroll(root);
          }
          @keyframes amulet-action {
            50% { transform: translateY(-80px) rotate(180deg) scale(1.2) !important; }
            100% { transform: translateY(-160px) rotate(360deg) scale(0.9) !important; }
          }
        }

        /* Scroll-Driven Section Reveal Animations (CSS View Timeline) */
        @supports (animation-timeline: view()) {
          .scroll-reveal-section {
            opacity: 0.1;
            transform: translateY(60px);
            animation: reveal-fade linear both;
            animation-timeline: view();
            animation-range: entry 10% cover 30%;
          }
          @keyframes reveal-fade {
            to { opacity: 1; transform: translateY(0); }
          }

          /* Interactive 8-bit Card scaling */
          .scroll-reveal-card {
            transform: scale(0.85);
            opacity: 0.5;
            animation: card-pop linear both;
            animation-timeline: view();
            animation-range: entry 5% cover 25%;
          }
          @keyframes card-pop {
            to { transform: scale(1); opacity: 1; }
          }
        }

        /* Retro button tactile hovers */
        .retro-btn-hover:hover {
          transform: translate(-2px, -2px) !important;
          box-shadow: 8px 8px 0px #000 !important;
          filter: brightness(1.1);
        }
        .retro-btn-hover:active {
          transform: translate(2px, 2px) !important;
          box-shadow: 2px 2px 0px #000 !important;
        }

        /* 8-bit spin animation */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* ═══════════════════════════════════════
           PIXEL MUMMY — Full Character Animation
           ═══════════════════════════════════════ */

        /* Container: scroll drives horizontal walk */
        .pixel-mummy-container {
          transform: translateX(0px);
          transition: none;
        }

        /* Drop shadow ellipse under feet */
        .mummy-shadow {
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 44px;
          height: 8px;
          background: rgba(0,0,0,0.5);
          border-radius: 50%;
          animation: shadow-pulse 0.6s steps(2) infinite alternate;
        }
        @keyframes shadow-pulse {
          to { transform: translateX(-50%) scaleX(0.8); opacity: 0.3; }
        }

        /* Master SVG — constant idle bob */
        .mummy-svg {
          animation: mummy-idle-bob 0.7s steps(2) infinite alternate;
          transform-origin: bottom center;
          filter: drop-shadow(0 0 8px rgba(255,34,0,0.3));
        }
        @keyframes mummy-idle-bob {
          0%   { transform: translateY(0px) scaleY(1); }
          100% { transform: translateY(-4px) scaleY(1.03); }
        }

        /* Eyes: menacing glow pulse */
        .mummy-eye {
          filter: drop-shadow(0 0 3px #ff2200);
          animation: eye-danger 1.2s steps(3) infinite alternate;
        }
        @keyframes eye-danger {
          0%   { opacity: 0.5; filter: drop-shadow(0 0 2px #ff2200); }
          50%  { opacity: 1;   filter: drop-shadow(0 0 6px #ff6600) drop-shadow(0 0 12px #ff0000); }
          100% { opacity: 0.8; filter: drop-shadow(0 0 4px #ff2200); }
        }
        .eye-glow {
          animation: glow-flicker 1.2s steps(3) infinite alternate;
        }
        @keyframes glow-flicker {
          0%   { opacity: 0.1; }
          100% { opacity: 0.4; }
        }

        /* Head bandage flap flutter */
        .head-flap {
          transform-origin: left center;
          animation: flap-flutter 0.4s steps(2) infinite alternate;
        }
        @keyframes flap-flutter {
          0%   { transform: rotateZ(-5deg) translateY(0); }
          100% { transform: rotateZ(8deg)  translateY(-1px); }
        }

        /* LEFT arm: reaches forward, then pulls back (walk swing) */
        .mummy-arm-left {
          transform-origin: 3px 9px;
          animation: arm-swing-left 0.6s steps(4) infinite;
        }
        @keyframes arm-swing-left {
          0%   { transform: rotate(0deg); }
          25%  { transform: rotate(-30deg); }
          50%  { transform: rotate(0deg); }
          75%  { transform: rotate(20deg); }
          100% { transform: rotate(0deg); }
        }

        /* RIGHT arm: opposite phase */
        .mummy-arm-right {
          transform-origin: 15px 9px;
          animation: arm-swing-right 0.6s steps(4) infinite;
        }
        @keyframes arm-swing-right {
          0%   { transform: rotate(0deg); }
          25%  { transform: rotate(20deg); }
          50%  { transform: rotate(0deg); }
          75%  { transform: rotate(-30deg); }
          100% { transform: rotate(0deg); }
        }

        /* LEFT leg: 4-frame walk cycle */
        .leg-left {
          transform-origin: 7px 18px;
          animation: leg-walk-left 0.6s steps(4) infinite;
        }
        .foot-left {
          transform-origin: 7px 24px;
          animation: foot-walk-left 0.6s steps(4) infinite;
        }
        @keyframes leg-walk-left {
          0%   { transform: translateY(0) skewX(0deg); }
          25%  { transform: translateY(-3px) skewX(-8deg); }
          50%  { transform: translateY(0) skewX(0deg); }
          75%  { transform: translateY(1px) skewX(5deg); }
          100% { transform: translateY(0) skewX(0deg); }
        }
        @keyframes foot-walk-left {
          0%   { transform: translateY(0) scaleX(1); }
          25%  { transform: translateY(-2px) scaleX(0.9); }
          50%  { transform: translateY(0) scaleX(1); }
          75%  { transform: translateY(1px) scaleX(1.1); }
          100% { transform: translateY(0) scaleX(1); }
        }

        /* RIGHT leg: opposite phase */
        .leg-right {
          transform-origin: 11px 18px;
          animation: leg-walk-right 0.6s steps(4) infinite;
        }
        .foot-right {
          transform-origin: 11px 24px;
          animation: foot-walk-right 0.6s steps(4) infinite;
        }
        @keyframes leg-walk-right {
          0%   { transform: translateY(0) skewX(0deg); }
          25%  { transform: translateY(1px) skewX(5deg); }
          50%  { transform: translateY(0) skewX(0deg); }
          75%  { transform: translateY(-3px) skewX(-8deg); }
          100% { transform: translateY(0) skewX(0deg); }
        }
        @keyframes foot-walk-right {
          0%   { transform: translateY(0) scaleX(1); }
          25%  { transform: translateY(1px) scaleX(1.1); }
          50%  { transform: translateY(0) scaleX(1); }
          75%  { transform: translateY(-2px) scaleX(0.9); }
          100% { transform: translateY(0) scaleX(1); }
        }

        /* Dangling bandage strips sway */
        .dangle {
          transform-origin: center top;
        }
        .d1 { animation: dangle-sway 0.5s steps(2) infinite alternate; }
        .d2 { animation: dangle-sway2 0.5s steps(2) infinite alternate; }
        @keyframes dangle-sway {
          0%   { transform: rotate(-15deg) scaleY(1); }
          100% { transform: rotate(20deg) scaleY(1.2); }
        }
        @keyframes dangle-sway2 {
          0%   { transform: rotate(15deg) scaleY(1.1); }
          100% { transform: rotate(-20deg) scaleY(0.9); }
        }

        /* Trailing bandage scraps behind the mummy */
        .bandage-trail {
          transform-origin: right center;
        }
        .t1 { animation: trail-flutter 0.3s steps(2) infinite alternate; }
        .t2 { animation: trail-flutter 0.4s steps(2) 0.1s infinite alternate; }
        .t3 { animation: trail-flutter 0.5s steps(2) 0.2s infinite alternate; }
        @keyframes trail-flutter {
          0%   { transform: scaleX(1) translateY(0); opacity: 0.7; }
          100% { transform: scaleX(1.4) translateY(1px); opacity: 0.3; }
        }

        /* ── SCROLL-DRIVEN: mummy walks across screen ── */
        @supports (animation-timeline: scroll()) {
          .pixel-mummy-container {
            animation: mummy-march linear both;
            animation-timeline: scroll(root);
          }
          @keyframes mummy-march {
            0%   { transform: translateX(0px); }
            100% { transform: translateX(calc(100vw - 100px)); }
          }

          /* Speed up walk cycle as mummy moves (tied to scroll) */
          .mummy-svg {
            animation: mummy-idle-bob 0.7s steps(2) infinite alternate;
          }
        }
      `}</style>
    </div>
  );
};

