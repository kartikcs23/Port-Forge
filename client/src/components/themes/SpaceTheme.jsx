import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectVisual } from './ProjectVisual';

/* ═══════════════════════════════════════════════════════════
   HUD COMPONENT LIBRARY
═══════════════════════════════════════════════════════════ */
const HUDCorner = ({ pos }) => {
  const corners = {
    tl: 'top-0 left-0 border-t-2 border-l-2',
    tr: 'top-0 right-0 border-t-2 border-r-2',
    bl: 'bottom-0 left-0 border-b-2 border-l-2',
    br: 'bottom-0 right-0 border-b-2 border-r-2',
  };
  return (
    <div className={`absolute w-5 h-5 border-[#22d3ee]/30 group-hover:border-[#22d3ee]/80 transition-all duration-500 ${corners[pos]}`} />
  );
};

const HUDCard = ({ children, className = '', glowColor = '#22d3ee', onClick, layoutId }) => {
  const CardContainer = layoutId ? motion.div : 'div';
  return (
    <CardContainer
      layoutId={layoutId}
      onClick={onClick}
      className={`group relative rounded-sm overflow-hidden transition-all duration-500 ${className}`}
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
           style={{ background: `radial-gradient(circle at 0% 0%, ${glowColor}08 0%, transparent 60%)` }} />
      <HUDCorner pos="tl" />
      <HUDCorner pos="tr" />
      <HUDCorner pos="bl" />
      <HUDCorner pos="br" />
      {children}
    </CardContainer>
  );
};

const NeonDot = ({ color = '#22d3ee', className = '' }) => (
  <div className={`w-2 h-2 rounded-full animate-pulse ${className}`}
       style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}, 0 0 20px ${color}40` }} />
);

const GlowLine = ({ className = '', style = {} }) => (
  <div className={`h-[1px] bg-gradient-to-r from-transparent via-[#22d3ee]/40 to-transparent ${className}`} style={style} />
);

/* ═══════════════════════════════════════════════════════════
   SECTION HEADER
═══════════════════════════════════════════════════════════ */
const SectionHeader = ({ label, title, subtitle }) => (
  <div className="mb-20">
    <div className="flex items-center gap-4 mb-6">
      <NeonDot />
      <span className="font-mono text-[11px] tracking-[0.6em] uppercase text-[#22d3ee] font-bold">{label}</span>
    </div>
    <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-4">{title}</h2>
    {subtitle && <p className="text-white/40 text-xl font-light max-w-xl">{subtitle}</p>}
    <GlowLine className="mt-8" />
  </div>
);

/* ═══════════════════════════════════════════════════════════
   SKILLS CATEGORIZATION
═══════════════════════════════════════════════════════════ */
const FRONTEND_KEYWORDS = ['react', 'vue', 'angular', 'html', 'css', 'tailwind', 'sass', 'typescript', 'javascript', 'next', 'svelte', 'nuxt', 'redux', 'gatsby', 'framer'];
const BACKEND_KEYWORDS = ['node', 'express', 'django', 'flask', 'spring', 'php', 'ruby', 'rails', 'laravel', 'fastapi', 'graphql', 'rest', 'mongodb', 'postgres', 'mysql', 'redis', 'prisma', 'jwt', 'python', 'java'];
const TOOLS_KEYWORDS = ['git', 'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'ci', 'linux', 'nginx', 'webpack', 'vite', 'figma', 'postman', 'terraform', 'vercel', 'netlify'];

const categorizeSkills = (skills = []) => {
  const frontend = [], backend = [], tools = [], other = [];
  skills.forEach(s => {
    const lower = s.toLowerCase();
    if (FRONTEND_KEYWORDS.some(k => lower.includes(k))) frontend.push(s);
    else if (BACKEND_KEYWORDS.some(k => lower.includes(k))) backend.push(s);
    else if (TOOLS_KEYWORDS.some(k => lower.includes(k))) tools.push(s);
    else other.push(s);
  });
  return { frontend, backend, tools: [...tools, ...other] };
};

/* ═══════════════════════════════════════════════════════════
   TECH STACK FILTER TAGS
═══════════════════════════════════════════════════════════ */
const getAllTechTags = (repos = []) => {
  const tags = new Set(['All']);
  repos.forEach(r => { if (r.language) tags.add(r.language); });
  return [...tags];
};

/* ═══════════════════════════════════════════════════════════
   CONTACT FORM HOOK
═══════════════════════════════════════════════════════════ */
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
   MAIN THEME COMPONENT
═══════════════════════════════════════════════════════════ */
export const SpaceTheme = ({ rootUser, profile, repos = [] }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const { form, sent, onChange, onSubmit } = useContactForm();

  const name = profile?.name || rootUser?.name || 'Developer';
  const headline = profile?.headline || 'Full-Stack Developer';
  const bio = profile?.bio || 'I build elegant, scalable digital experiences. Specializing in crafting interfaces that feel premium and backends that never fail you.';
  const intro = profile?.intro || bio;
  const email = profile?.email || rootUser?.email || '';
  const location = profile?.location || '';
  const skills = profile?.skills || [];
  const experience = profile?.experience || [];
  const education = profile?.education || [];
  const achievements = profile?.achievements || [];
  const links = profile?.links || {};
  const avatar = profile?.avatarUrl || profile?.avatar || '';

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

  return (
    <div className="min-h-screen text-white antialiased font-sans overflow-x-hidden"
         style={{ background: '#000005', fontFamily: '"Inter", "DM Sans", sans-serif' }}>

      {/* ── BACKGROUND LAYERS ── */}
      {/* Nebula Image */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img src="/assets/themes/space_bg.png" alt=""
             className="w-full h-full object-cover opacity-20"
             style={{ transform: `scale(1.05) translateY(${scrollY * 0.02}px)`, transition: 'transform 0.1s linear' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(0,0,5,0.7) 100%)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#000005] via-transparent to-[#000005]" />
      </div>

      {/* Cosmic Morphing Background Shape */}
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-30 flex items-center justify-center overflow-hidden">
        <svg className="w-[80vw] h-[80vw] max-w-[900px] max-h-[900px]" viewBox="0 0 200 200">
          <defs>
            <radialGradient id="nebulaGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#22d3ee" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path fill="url(#nebulaGradient)">
            <animate
              attributeName="d"
              dur="25s"
              repeatCount="indefinite"
              values="
                M 100,20 C 140,20 180,60 180,100 C 180,140 140,180 100,180 C 60,180 20,140 20,100 C 20,60 60,20 100,20 Z;
                M 100,30 C 130,45 170,55 170,100 C 170,145 135,170 100,170 C 55,170 30,135 30,100 C 30,55 70,15 100,30 Z;
                M 100,15 C 150,15 160,70 160,100 C 160,135 150,165 100,165 C 50,165 40,120 40,100 C 40,65 50,15 100,15 Z;
                M 100,20 C 140,20 180,60 180,100 C 180,140 140,180 100,180 C 60,180 20,140 20,100 C 20,60 60,20 100,20 Z
              "
            />
          </path>
        </svg>
      </div>

      {/* Starfield Layer 1 */}
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-30"
           style={{ backgroundImage: 'radial-gradient(1px 1px at var(--x, 25%) var(--y, 35%), #fff, transparent), radial-gradient(1px 1px at 80% 60%, #fff, transparent), radial-gradient(1.5px 1.5px at 15% 75%, #fff, transparent), radial-gradient(1px 1px at 60% 20%, #fff, transparent), radial-gradient(1px 1px at 45% 85%, #fff, transparent)', backgroundSize: '600px 600px', animation: 'drift 120s linear infinite' }} />

      {/* HUD Grid */}
      <div className="fixed inset-0 pointer-events-none z-[2] opacity-[0.03]"
           style={{ backgroundImage: 'linear-gradient(rgba(34,211,238,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.5) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-[3] opacity-[0.06]"
           style={{ backgroundImage: 'linear-gradient(transparent 50%, rgba(0,0,0,0.3) 50%)', backgroundSize: '100% 4px' }} />

      {/* Scanline sweep */}
      <div className="scanline-sweep" />

      {/* ── STICKY NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
           style={{ background: scrollY > 50 ? 'rgba(0,0,5,0.85)' : 'transparent', backdropFilter: scrollY > 50 ? 'blur(24px)' : 'none', borderBottom: scrollY > 50 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <NeonDot />
            <span className="font-mono text-[11px] tracking-[0.5em] uppercase font-bold text-white">
              {name.split(' ')[0]}.dev
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map(l => (
              <a key={l.href} href={l.href}
                 className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/40 hover:text-[#22d3ee] transition-colors duration-300">
                {l.label}
              </a>
            ))}
            {links.github && (
              <a href={links.github} target="_blank" rel="noreferrer"
                 className="font-mono text-[11px] tracking-[0.3em] uppercase px-6 py-2.5 border border-[#22d3ee]/30 hover:border-[#22d3ee] hover:bg-[#22d3ee]/10 text-white transition-all duration-300">
                GitHub
              </a>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="w-6 h-4 flex flex-col justify-between">
              <div className={`h-[1px] bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-[7.5px]' : ''}`} />
              <div className={`h-[1px] bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <div className={`h-[1px] bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-[7.5px]' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden" style={{ background: 'rgba(0,0,5,0.95)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex flex-col px-6 py-8 gap-6">
              {navLinks.map(l => (
                <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                   className="font-mono text-[12px] tracking-[0.3em] uppercase text-white/60 hover:text-[#22d3ee] transition-colors">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ═══════════════════════════════════════════════
          01. HERO SECTION
      ═══════════════════════════════════════════════ */}
      <section id="hero" className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-12 pt-24">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <motion.div 
              className="lg:col-span-8"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-4 mb-10">
                <div className="h-[1px] w-16" style={{ background: 'linear-gradient(90deg, transparent, #22d3ee)' }} />
                <span className="font-mono text-[11px] tracking-[0.6em] uppercase text-[#22d3ee] font-bold nebula-type">
                  {headline}
                </span>
              </div>

              {/* Name */}
              <h1 className="font-bold leading-[0.85] mb-10 tracking-tighter hud-pulse"
                  style={{ fontSize: 'clamp(4rem, 12vw, 11rem)', color: '#fff', textShadow: '0 0 80px rgba(34,211,238,0.1)' }}>
                {name}
              </h1>

              {/* Bio */}
              <div className="max-w-2xl mb-16 border-l-4 border-[#8b5cf6] pl-8 py-2"
                   style={{ background: 'rgba(139,92,246,0.04)' }}>
                <p className="text-xl md:text-2xl font-light leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  {bio}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-6">
                <a href="#projects"
                   className="group relative px-10 py-4 font-mono text-[12px] tracking-[0.3em] uppercase font-black overflow-hidden transition-all duration-300"
                   style={{ background: '#22d3ee', color: '#000' }}>
                  <span className="relative z-10">View Projects</span>
                  <div className="absolute inset-0 bg-white translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                  <span className="relative z-10 group-hover:text-black transition-colors">View Projects</span>
                </a>
                <a href="#contact"
                   className="group px-10 py-4 font-mono text-[12px] tracking-[0.3em] uppercase font-black border transition-all duration-300"
                   style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}
                   onMouseEnter={e => { e.currentTarget.style.borderColor = '#22d3ee'; e.currentTarget.style.color = '#22d3ee'; }}
                   onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}>
                  Contact Me
                </a>
                {links.github && (
                  <a href={`${links.github}?tab=repositories`} target="_blank" rel="noreferrer"
                     className="group px-10 py-4 font-mono text-[12px] tracking-[0.3em] uppercase font-black border transition-all duration-300"
                     style={{ borderColor: 'rgba(139,92,246,0.4)', color: 'rgba(139,92,246,0.8)' }}>
                    GitHub_↗
                  </a>
                )}
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-12 mt-20 pt-12"
                   style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {[
                  { value: repos.length, label: 'Projects' },
                  { value: skills.length, label: 'Skills' },
                  { value: experience.length, label: 'Experiences' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-4xl font-bold tracking-tighter" style={{ color: '#22d3ee' }}>{s.value}+</div>
                    <div className="font-mono text-[11px] tracking-[0.3em] uppercase opacity-40 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hero Visual — Morphing Orbiting Core */}
            <div className="lg:col-span-4 hidden lg:flex justify-center items-center">
              <div className="relative w-64 h-64">
                {/* Shape Morphing HUD vector */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                  <defs>
                    <linearGradient id="hudGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                  <path
                    fill="none"
                    stroke="url(#hudGlow)"
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                    className="origin-center"
                    style={{ animation: 'spin-slow 40s linear infinite' }}
                  >
                    <animate
                      attributeName="d"
                      dur="10s"
                      repeatCount="indefinite"
                      values="
                        M 100, 20 A 80,80 0 1,1 99.9,20 Z;
                        M 100, 30 A 70,70 0 1,1 99.9,30 Z;
                        M 100, 15 A 85,85 0 1,1 99.9,15 Z;
                        M 100, 20 A 80,80 0 1,1 99.9,20 Z
                      "
                    />
                  </path>
                  <path
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="1"
                    className="origin-center opacity-40"
                    style={{ animation: 'spin-slow 25s linear infinite reverse' }}
                  >
                    <animate
                      attributeName="d"
                      dur="15s"
                      repeatCount="indefinite"
                      values="
                        M 100, 40 C 130,40 160,70 160,100 C 160,130 130,160 100,160 C 70,160 40,130 40,100 C 40,70 70,40 100,40 Z;
                        M 100, 45 C 135,35 155,65 155,100 C 155,135 135,155 100,155 C 65,155 45,135 45,100 C 45,65 65,45 100,45 Z;
                        M 100, 35 C 125,45 165,75 165,100 C 165,125 125,165 100,165 C 75,165 35,125 35,100 C 35,75 75,35 100,35 Z;
                        M 100, 40 C 130,40 160,70 160,100 C 160,130 130,160 100,160 C 70,160 40,130 40,100 C 40,70 70,40 100,40 Z
                      "
                    />
                  </path>
                  {/* Crosshair accents */}
                  <line x1="100" y1="10" x2="100" y2="25" stroke="#22d3ee" strokeWidth="1.5" />
                  <line x1="100" y1="175" x2="100" y2="190" stroke="#22d3ee" strokeWidth="1.5" />
                  <line x1="10" y1="100" x2="25" y2="100" stroke="#22d3ee" strokeWidth="1.5" />
                  <line x1="175" y1="100" x2="190" y2="100" stroke="#22d3ee" strokeWidth="1.5" />
                </svg>

                {/* Core */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {avatar ? (
                    <div className="w-32 h-32 rounded-full overflow-hidden" style={{ boxShadow: '0 0 0 2px rgba(34,211,238,0.6), 0 0 40px rgba(34,211,238,0.4), 0 0 80px rgba(139,92,246,0.25)' }}>
                      <img src={avatar} alt={name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl"
                         style={{ background: '#fff', color: '#020617', boxShadow: '0 0 40px #fff, 0 0 80px rgba(34,211,238,0.4), 0 0 120px rgba(139,92,246,0.2)' }}>
                      {name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Orbit Dot */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1"
                     style={{ animation: 'spin-slow 30s linear infinite', transformOrigin: '50% 128px' }}>
                  <div className="w-3 h-3 rounded-full bg-[#22d3ee]" style={{ boxShadow: '0 0 12px #22d3ee' }} />
                </div>

                {/* HUD Label */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center">
                  <span className="font-mono text-[10px] tracking-[0.5em] uppercase text-[#22d3ee] opacity-60">System_Syncing</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30">
          <span className="font-mono text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          02. ABOUT SECTION — With horizontal swipe reveal
      ═══════════════════════════════════════════════ */}
      <motion.section 
        id="about" 
        className="relative z-10 py-48 px-6 md:px-12"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader label="01 // About" title="The Story" subtitle="Background, specialization & approach" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div className="space-y-8">
              <p className="text-xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{intro || bio}</p>
              {location && (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border border-[#22d3ee]/40 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22d3ee]" />
                  </div>
                  <span className="font-mono text-[11px] tracking-widest uppercase opacity-50">{location}</span>
                </div>
              )}
              {education.length > 0 && (
                <div className="space-y-4 pt-4">
                  {education.map((edu, i) => (
                    <HUDCard key={i} className="p-6">
                      <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#8b5cf6] mb-1">{edu.year}</div>
                      <div className="text-lg font-bold">{edu.degree || edu.field}</div>
                      <div className="text-white/50 text-sm">{edu.institution}</div>
                    </HUDCard>
                  ))}
                </div>
              )}
            </div>

            {/* Interest Tags */}
            <div>
              <div className="font-mono text-[10px] tracking-[0.5em] uppercase opacity-30 mb-6">Specialization</div>
              <div className="flex flex-wrap gap-3">
                {(skills.length > 0 ? skills.slice(0, 12) : ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Python', 'Docker', 'AWS', 'GraphQL']).map(s => (
                  <span key={s} className="px-4 py-2 font-mono text-[11px] tracking-[0.2em] uppercase transition-all duration-300 cursor-default"
                        style={{ border: '1px solid rgba(34,211,238,0.2)', color: 'rgba(34,211,238,0.7)', background: 'rgba(34,211,238,0.04)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,211,238,0.12)'; e.currentTarget.style.color = '#22d3ee'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,211,238,0.04)'; e.currentTarget.style.color = 'rgba(34,211,238,0.7)'; }}>
                    {s}
                  </span>
                ))}
              </div>

              {/* Contact Info */}
              {(email || links.linkedin) && (
                <div className="mt-12 space-y-4">
                  {email && (
                    <a href={`mailto:${email}`} className="flex items-center gap-4 group">
                      <div className="w-8 h-8 border border-white/10 flex items-center justify-center group-hover:border-[#22d3ee]/50 transition-colors">
                        <svg className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 text-[#22d3ee] transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      </div>
                      <span className="font-mono text-[12px] tracking-widest opacity-50 group-hover:opacity-100 group-hover:text-[#22d3ee] transition-all">{email}</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════
          03. PROJECTS SECTION — With horizontal swipe reveal & layout transition
      ═══════════════════════════════════════════════ */}
      <motion.section 
        id="projects" 
        className="relative z-10 py-48 px-6 md:px-12"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(34,211,238,0.02) 50%, transparent)' }}
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader label="02 // Projects" title="Deployments" subtitle="Engineering solutions built for scale and precision (Click to expand)" />

          {/* Tech Stack Filter */}
          {techTags.length > 1 && (
            <div className="flex flex-wrap gap-3 mb-16">
              {techTags.map(tag => (
                <button key={tag} onClick={() => setActiveFilter(tag)}
                        className="px-5 py-2.5 font-mono text-[11px] tracking-[0.25em] uppercase transition-all duration-300"
                        style={{
                          border: `1px solid ${activeFilter === tag ? '#22d3ee' : 'rgba(255,255,255,0.1)'}`,
                          color: activeFilter === tag ? '#22d3ee' : 'rgba(255,255,255,0.4)',
                          background: activeFilter === tag ? 'rgba(34,211,238,0.08)' : 'transparent',
                        }}>
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Projects Grid */}
          {filteredRepos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRepos.map((repo) => (
                <HUDCard
                  key={repo._id}
                  layoutId={`space-project-${repo._id}`}
                  onClick={() => setSelectedProject(repo)}
                  className="p-8 h-full flex flex-col hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(34,211,238,0.08)] cursor-pointer"
                >
                  {/* Top Row */}
                  <div className="flex justify-between items-start mb-10">
                    <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#8b5cf6] font-bold">
                      {repo.language || 'Project'}
                    </span>
                    <div className="flex items-center gap-2">
                      <NeonDot color={repo.language ? '#22d3ee' : '#8b5cf6'} />
                    </div>
                  </div>

                  <div className="mb-8">
                    <ProjectVisual repo={repo} theme="space" compact />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4 tracking-tight group-hover:text-[#22d3ee] transition-colors">
                      {repo.name}
                    </h3>
                    <p className="text-sm leading-relaxed mb-10 line-clamp-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {repo.description || 'A precision-engineered solution built for resilience and performance at scale.'}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="pt-8 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[10px] opacity-30 tracking-wider">★ {repo.stars || 0}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[10px] tracking-widest uppercase text-[#22d3ee]/50 group-hover:text-[#22d3ee] transition-colors">
                        Details →
                      </span>
                    </div>
                  </div>
                </HUDCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <div className="font-mono text-[11px] tracking-[0.5em] uppercase opacity-20">No Projects Found</div>
            </div>
          )}

          {links.github && (
            <div className="text-center mt-20">
              <a href={links.github} target="_blank" rel="noreferrer"
                 className="inline-flex items-center gap-3 px-10 py-4 border border-white/10 font-mono text-[12px] tracking-[0.3em] uppercase hover:border-[#22d3ee]/50 hover:text-[#22d3ee] transition-all duration-300">
                View All on GitHub ↗
              </a>
            </div>
          )}
        </div>
      </motion.section>

      {/* MATCH CUT DETAILED PROJECT OVERLAY */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              layoutId={`space-project-${selectedProject._id}`}
              className="max-w-2xl w-full relative z-10 bg-[#00000a] p-8 border border-[#22d3ee] shadow-[0_0_50px_rgba(34,211,238,0.25)] flex flex-col gap-6"
              onClick={e => e.stopPropagation()}
            >
              <HUDCorner pos="tl" />
              <HUDCorner pos="tr" />
              <HUDCorner pos="bl" />
              <HUDCorner pos="br" />
              
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs uppercase text-[#8b5cf6] font-bold">
                  {selectedProject.language || 'Project'}
                </span>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="font-mono text-xs uppercase text-white/50 hover:text-[#22d3ee] border border-white/10 px-3 py-1 hover:border-[#22d3ee] transition-colors"
                >
                  Close [X]
                </button>
              </div>
              
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">{selectedProject.name}</h3>
                <GlowLine className="my-4" />
                <p className="text-white/70 leading-relaxed mb-6">
                  {selectedProject.description || 'A precision-engineered solution built for resilience and performance at scale.'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded border border-white/5 font-mono text-xs">
                <div>
                  <span className="opacity-40">STARS</span>
                  <div className="text-xl font-bold text-[#22d3ee] mt-1">★ {selectedProject.stars || 0}</div>
                </div>
                <div>
                  <span className="opacity-40">FORKS</span>
                  <div className="text-xl font-bold text-[#8b5cf6] mt-1">⑂ {selectedProject.forks || 0}</div>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-4">
                {selectedProject.repoUrl && (
                  <a 
                    href={selectedProject.repoUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-6 py-3 font-mono text-xs uppercase bg-[#22d3ee] text-black font-black hover:bg-white transition-colors"
                  >
                    GitHub Repository ↗
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════
          04. SKILLS SECTION — With horizontal swipe reveal
      ═══════════════════════════════════════════════ */}
      <motion.section 
        id="skills" 
        className="relative z-10 py-48 px-6 md:px-12"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader label="03 // Skills" title="Capabilities" subtitle="Technical expertise across the full stack" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Frontend', color: '#22d3ee', items: categorized.frontend.length > 0 ? categorized.frontend : ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'HTML/CSS'] },
              { label: 'Backend', color: '#8b5cf6', items: categorized.backend.length > 0 ? categorized.backend : ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST API'] },
              { label: 'Tools & Cloud', color: '#f59e0b', items: categorized.tools.length > 0 ? categorized.tools : ['Git', 'Docker', 'AWS', 'CI/CD', 'Linux'] },
            ].map(cat => (
              <HUDCard key={cat.label} className="p-8" glowColor={cat.color}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-8 border flex items-center justify-center" style={{ borderColor: `${cat.color}30` }}>
                    <div className="w-3 h-3 rounded-full" style={{ background: cat.color, boxShadow: `0 0 8px ${cat.color}` }} />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.4em] uppercase opacity-40 mb-0.5">Category</div>
                    <div className="font-bold text-lg" style={{ color: cat.color }}>{cat.label}</div>
                  </div>
                </div>
                <GlowLine className="mb-8" style={{ '--tw-gradient-via': cat.color }} />
                <div className="space-y-3">
                  {cat.items.map((skill, i) => (
                    <div key={skill} className="flex items-center gap-3 group cursor-default">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cat.color, opacity: 0.5 }} />
                      <span className="font-mono text-[12px] tracking-widest text-white/70 group-hover:text-white transition-colors">
                        {skill}
                      </span>
                      {/* Progress Bar */}
                      <div className="ml-auto flex-shrink-0 w-16 h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full transition-all duration-1000"
                             style={{ width: `${Math.max(60, 100 - i * 8)}%`, background: cat.color, opacity: 0.7 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </HUDCard>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════
          05. EXPERIENCE / TIMELINE — Swipe reveal
      ═══════════════════════════════════════════════ */}
      {experience.length > 0 && (
        <motion.section 
          id="experience" 
          className="relative z-10 py-48 px-6 md:px-12"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="max-w-7xl mx-auto">
            <SectionHeader label="04 // Experience" title="Command History" subtitle="Career milestones and key deployments" />

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-[1px] hidden md:block"
                   style={{ background: 'linear-gradient(to bottom, transparent, rgba(34,211,238,0.3) 20%, rgba(34,211,238,0.3) 80%, transparent)' }} />

              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div key={idx} className="group flex flex-col md:flex-row gap-8 md:gap-16 relative">
                    {/* Timeline Dot */}
                    <div className="hidden md:flex absolute left-0 top-8 w-12 justify-center">
                      <div className="w-3 h-3 rounded-full border-2 border-[#22d3ee] bg-black group-hover:bg-[#22d3ee] transition-colors"
                           style={{ boxShadow: '0 0 12px rgba(34,211,238,0.4)' }} />
                    </div>

                    {/* Date */}
                    <div className="md:w-48 md:text-right flex-shrink-0 md:pl-0 pl-0 pt-1 font-mono text-[11px] tracking-[0.25em] uppercase opacity-30 group-hover:opacity-70 transition-opacity md:ml-16">
                      <div>{exp.startDate}</div>
                      <div className="opacity-60">→ {exp.endDate || 'Present'}</div>
                    </div>

                    {/* Content */}
                    <HUDCard className="flex-1 p-8 hover:-translate-y-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                        <h3 className="text-2xl font-bold group-hover:text-[#22d3ee] transition-colors">{exp.role}</h3>
                        <span className="font-mono text-[11px] tracking-[0.3em] uppercase font-black px-4 py-1.5"
                              style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)' }}>
                          {exp.company}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px' }}>
                          {exp.description}
                        </p>
                      )}
                    </HUDCard>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* ═══════════════════════════════════════════════
          05. ACHIEVEMENTS — Swipe reveal
      ═══════════════════════════════════════════════ */}
      {achievements.length > 0 && (
        <motion.section
          id="achievements"
          className="relative z-10 py-48 px-6 md:px-12"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="max-w-7xl mx-auto">
            <SectionHeader label="05 // Achievements" title="Mission Log" subtitle="Recognitions, wins, and certifications along the way" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((ach, i) => (
                <HUDCard key={i} className="p-8 hover:-translate-y-1">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-xl font-bold leading-tight">{ach.title}</h3>
                    {ach.year && (
                      <span className="shrink-0 font-mono text-[11px] tracking-[0.3em] uppercase font-black px-3 py-1"
                            style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.2)' }}>
                        {ach.year}
                      </span>
                    )}
                  </div>
                  {ach.description && (
                    <p className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px' }}>
                      {ach.description}
                    </p>
                  )}
                </HUDCard>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* ═══════════════════════════════════════════════
          06. RESUME SECTION — Swipe reveal
      ═══════════════════════════════════════════════ */}
      <motion.section 
        className="relative z-10 py-32 px-6 md:px-12"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto">
          <HUDCard className="p-12 text-center">
            <div className="font-mono text-[10px] tracking-[0.6em] uppercase text-[#8b5cf6] mb-4">Credentials</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Download Resume</h2>
            <p className="text-white/40 mb-10 max-w-md mx-auto">Full credentials, project history, and technical experience in one document.</p>
            <a href="/resume.pdf" download
               className="inline-flex items-center gap-4 px-12 py-5 font-mono text-[12px] tracking-[0.4em] uppercase font-black transition-all duration-300"
               style={{ background: '#22d3ee', color: '#000' }}
               onMouseEnter={e => { e.currentTarget.style.background = '#fff'; }}
               onMouseLeave={e => { e.currentTarget.style.background = '#22d3ee'; }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Download PDF Resume
            </a>
          </HUDCard>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════
          07. CONTACT SECTION — Swipe reveal
      ═══════════════════════════════════════════════ */}
      <motion.section 
        id="contact" 
        className="relative z-10 py-48 px-6 md:px-12"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader label="06 // Contact" title="Connect_Node" subtitle="Ready to collaborate? Open to opportunities." />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Contact Info */}
            <div className="space-y-8">
              <p className="text-xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Whether you have a project in mind, a question, or just want to connect — feel free to reach out. I respond within 24 hours.
              </p>

              <div className="space-y-5 pt-4">
                {email && (
                  <a href={`mailto:${email}`}
                     className="flex items-center gap-5 group p-5 border border-transparent hover:border-[#22d3ee]/20 transition-all duration-300">
                    <div className="w-10 h-10 border border-[#22d3ee]/20 flex items-center justify-center flex-shrink-0 group-hover:border-[#22d3ee]/60 transition-colors">
                      <svg className="w-4 h-4 text-[#22d3ee] opacity-60 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] tracking-widest uppercase opacity-30 mb-1">Email</div>
                      <div className="font-mono text-sm group-hover:text-[#22d3ee] transition-colors">{email}</div>
                    </div>
                  </a>
                )}
                {links.linkedin && (
                  <a href={links.linkedin} target="_blank" rel="noreferrer"
                     className="flex items-center gap-5 group p-5 border border-transparent hover:border-[#8b5cf6]/20 transition-all duration-300">
                    <div className="w-10 h-10 border border-[#8b5cf6]/20 flex items-center justify-center flex-shrink-0 group-hover:border-[#8b5cf6]/60 transition-colors">
                      <svg className="w-4 h-4 text-[#8b5cf6] opacity-60 group-hover:opacity-100" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] tracking-widest uppercase opacity-30 mb-1">LinkedIn</div>
                      <div className="font-mono text-sm group-hover:text-[#8b5cf6] transition-colors">View Profile ↗</div>
                    </div>
                  </a>
                )}
                {links.github && (
                  <a href={links.github} target="_blank" rel="noreferrer"
                     className="flex items-center gap-5 group p-5 border border-transparent hover:border-white/10 transition-all duration-300">
                    <div className="w-10 h-10 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-white/30 transition-colors">
                      <svg className="w-4 h-4 opacity-60 group-hover:opacity-100" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] tracking-widest uppercase opacity-30 mb-1">GitHub</div>
                      <div className="font-mono text-sm group-hover:text-white transition-colors">View Repositories ↗</div>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={onSubmit} className="space-y-6">
              {sent && (
                <div className="p-4 font-mono text-[11px] tracking-widest uppercase text-center"
                     style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', color: '#22d3ee' }}>
                  Transmission Sent Successfully ✓
                </div>
              )}
              <div>
                <label className="font-mono text-[10px] tracking-[0.4em] uppercase opacity-30 block mb-2">Name</label>
                <input name="name" value={form.name} onChange={onChange} required placeholder="Your Name"
                       className="w-full px-5 py-4 font-mono text-sm bg-transparent outline-none transition-all duration-300"
                       style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}
                       onFocus={e => { e.currentTarget.style.borderColor = 'rgba(34,211,238,0.4)'; }}
                       onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }} />
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-[0.4em] uppercase opacity-30 block mb-2">Email</label>
                <input name="email" type="email" value={form.email} onChange={onChange} required placeholder="your@email.com"
                       className="w-full px-5 py-4 font-mono text-sm bg-transparent outline-none transition-all duration-300"
                       style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}
                       onFocus={e => { e.currentTarget.style.borderColor = 'rgba(34,211,238,0.4)'; }}
                       onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }} />
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-[0.4em] uppercase opacity-30 block mb-2">Message</label>
                <textarea name="message" value={form.message} onChange={onChange} required rows={6} placeholder="Your message..."
                           className="w-full px-5 py-4 font-mono text-sm bg-transparent outline-none resize-none transition-all duration-300"
                           style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}
                           onFocus={e => { e.currentTarget.style.borderColor = 'rgba(34,211,238,0.4)'; }}
                           onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }} />
              </div>
              <button type="submit"
                      className="w-full py-5 font-mono text-[12px] tracking-[0.4em] uppercase font-black transition-all duration-300"
                      style={{ background: '#22d3ee', color: '#000' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#22d3ee'; }}>
                Send Transmission
              </button>
            </form>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════
          08. FOOTER
      ═══════════════════════════════════════════════ */}
      <footer className="relative z-10 py-20 px-6 md:px-12"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <NeonDot />
                <span className="font-mono text-[13px] tracking-[0.4em] uppercase font-bold">{name.split(' ')[0]}.dev</span>
              </div>
              <p className="text-white/30 text-sm leading-relaxed">{headline}</p>
            </div>
            {/* Nav Links */}
            <div>
              <div className="font-mono text-[10px] tracking-[0.5em] uppercase opacity-20 mb-6">Navigate</div>
              <div className="flex flex-col gap-3">
                {navLinks.map(l => (
                  <a key={l.href} href={l.href} className="font-mono text-[12px] tracking-widest opacity-40 hover:opacity-100 hover:text-[#22d3ee] transition-all">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
            {/* Social */}
            <div>
              <div className="font-mono text-[10px] tracking-[0.5em] uppercase opacity-20 mb-6">Connect</div>
              <div className="flex flex-col gap-3">
                {links.github && <a href={links.github} target="_blank" rel="noreferrer" className="font-mono text-[12px] tracking-widest opacity-40 hover:text-[#22d3ee] hover:opacity-100 transition-all">GitHub ↗</a>}
                {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" className="font-mono text-[12px] tracking-widest opacity-40 hover:text-[#8b5cf6] hover:opacity-100 transition-all">LinkedIn ↗</a>}
                {email && <a href={`mailto:${email}`} className="font-mono text-[12px] tracking-widest opacity-40 hover:text-white hover:opacity-100 transition-all">Email ↗</a>}
              </div>
            </div>
          </div>

          <GlowLine className="mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase opacity-20">
              © {new Date().getFullYear()} {name}. All Rights Reserved.
            </span>
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase opacity-20">
              Built with PortForge_Nebula_v3
            </span>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════
          GLOBAL STYLES & ANIMATIONS
      ═══════════════════════════════════════════════ */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes drift {
          from { background-position: 0 0; }
          to { background-position: 600px 600px; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }

        /* ── NEBULA TYPEWRITER ── */
        .nebula-type {
          overflow: hidden;
          white-space: nowrap;
          border-right: 2px solid #22d3ee;
          width: 0;
          animation: type-in 2.2s steps(30,end) 0.5s forwards, cursor-blink 0.8s step-end 2.7s infinite;
        }
        @keyframes type-in {
          from { width: 0; }
          to   { width: 100%; }
        }
        @keyframes cursor-blink {
          0%,100% { border-color: #22d3ee; }
          50%     { border-color: transparent; }
        }

        /* ── HUD DATA PULSE ── */
        .hud-pulse {
          animation: hud-glow 3s ease-in-out infinite;
        }
        @keyframes hud-glow {
          0%,100% { text-shadow: 0 0 8px rgba(34,211,238,0.4); }
          50%     { text-shadow: 0 0 24px rgba(34,211,238,1), 0 0 48px rgba(34,211,238,0.4); }
        }

        /* ── SCANLINE FLICKER ── */
        @keyframes scanline-sweep {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .scanline-sweep {
          position: fixed; top: 0; left: 0; right: 0;
          height: 120px;
          background: linear-gradient(transparent, rgba(34,211,238,0.04), transparent);
          animation: scanline-sweep 8s linear infinite;
          pointer-events: none; z-index: 4;
        }

        /* ── FLOAT ANIMATION for orbit dot ── */
        @keyframes orbit-dot {
          from { transform: rotate(0deg) translateX(128px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(128px) rotate(-360deg); }
        }

        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(34,211,238,0.3); color: #fff; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
};
