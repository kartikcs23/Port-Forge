import React, { useState, useEffect, useRef, useCallback, useId } from 'react';

/* ═══════════════════════════════════════════════════════════
   PROFESSIONAL / CSE STUDENT PORTFOLIO
   Monochrome brutalist editorial — warm vermillion accent
   Fonts: Space Grotesk · Space Mono · VT323
═══════════════════════════════════════════════════════════ */

const DARK      = '#0a0a0a';
const LIGHT     = '#f4f1ec';
const CREAM     = '#ece8e1';
const TEXTDARK  = '#0d0d0d';
const ACCENT    = 'oklch(0.52 0.21 24)';
const ACCENT_N  = 'oklch(0.56 0.21 24)';
const ACCENT_B  = 'oklch(0.65 0.18 24)';
const ACCENT_LK = 'oklch(0.62 0.18 24)';
const ACCENT_LB = 'oklch(0.42 0.20 24)';
const ACCENT_RB = 'oklch(0.48 0.20 24)';
const SANS  = "'Space Grotesk', sans-serif";
const MONO  = "'Space Mono', monospace";
const PIXEL = "'VT323', monospace";

/* ── Default / placeholder content (shown when profile data is missing) ── */
const DEFAULT_LANGS    = [{ name: 'Python', lvl: 'Advanced' }, { name: 'JavaScript', lvl: 'Advanced' }, { name: 'C++', lvl: 'Proficient' }, { name: 'Java', lvl: 'Intermediate' }, { name: 'SQL', lvl: 'Intermediate' }];
const DEFAULT_FWKS      = [{ name: 'React', lvl: 'Advanced' }, { name: 'Node.js', lvl: 'Advanced' }, { name: 'Express', lvl: 'Proficient' }, { name: 'FastAPI', lvl: 'Intermediate' }, { name: 'Tailwind CSS', lvl: 'Proficient' }];
const DEFAULT_TOOLS     = [{ name: 'Git / GitHub', lvl: 'Advanced' }, { name: 'VS Code', lvl: 'Advanced' }, { name: 'Docker', lvl: 'Learning' }, { name: 'Linux', lvl: 'Proficient' }, { name: 'Postman', lvl: 'Proficient' }];
const DEFAULT_CONCEPTS  = [{ name: 'Data Structures', lvl: '★★★★★' }, { name: 'Algorithms', lvl: '★★★★★' }, { name: 'OS', lvl: '★★★★☆' }, { name: 'DBMS', lvl: '★★★★☆' }, { name: 'Networking', lvl: '★★★☆☆' }];

const DEFAULT_PROJECTS = [
  { name: 'Featured Project', description: 'A full-stack web app solving a real problem. Built with real users in the wild.', language: null, tags: ['React', 'Node.js', 'MongoDB'], repoUrl: null },
  { name: 'Automation Tool', description: 'A CLI tool, API or ML model automating a repetitive task. Improved a key metric in production.', language: null, tags: ['Python', 'FastAPI', 'PostgreSQL'], repoUrl: null },
  { name: 'Systems Project', description: 'A competitive programming library or systems project with a core feature at scale.', language: null, tags: ['C++', 'STL', 'Algorithms'], repoUrl: null },
];

const DEFAULT_TIMELINE = [
  { date: '2022 — Present', title: 'B.Tech — Computer Science & Engineering', org: 'Your University · CGPA: 8.5 / 10', desc: 'Core coursework covering Data Structures & Algorithms, Operating Systems, DBMS, Computer Networks and Software Engineering. Active in coding club and tech fests.', tags: ['DSA', 'OS', 'DBMS', 'Networks', 'SE'] },
  { date: 'Summer 2024', title: 'Software Development Intern', org: 'Company Name · Remote', desc: 'Describe your role, what you built, tech used, and quantifiable impact — e.g. "Reduced API response time by 40% implementing Redis caching across 3 services."', tags: ['React', 'Node.js', 'Redis'] },
  { date: '2023 — 2024', title: 'Research / Major Project', org: 'Lab or Project Name · University', desc: 'Describe research work, a major course project or independent study. What was the problem, your approach, and the outcome?', tags: [] },
];

const DEFAULT_ACHIEVEMENTS = [
  { year: '2024', title: 'Hackathon Winner', desc: '1st place at a hackathon — built a project in 24 hours with a team of 3.' },
  { year: '2024', title: 'LeetCode Knight', desc: 'Solved 500+ problems · Max contest rating in the top tier · Knight badge achieved.' },
  { year: '2023', title: 'Best Project Award', desc: 'Top project in a course or competition. Recognized by a faculty panel.' },
  { year: '2023', title: 'Merit Scholarship', desc: 'Academic excellence — top of the batch for two consecutive semesters.' },
  { year: '2024', title: 'Open Source Contributor', desc: 'Merged pull requests to an open-source project impacting real users worldwide.' },
  { year: '2022', title: 'Coding Contest', desc: 'Ranked near the top at a coding contest — university qualifier for the nationals.' },
];

/* ── Scroll-reveal wrapper (IntersectionObserver, fires once) ── */
const Reveal = ({ children, delay = 0, style }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); }
    }, { threshold: 0.07 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(48px)',
      transition: `opacity .88s cubic-bezier(.16,1,.3,1) ${delay}s, transform .88s cubic-bezier(.16,1,.3,1) ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
};

const Tag = ({ children, dark }) => (
  <span style={{
    fontFamily: MONO, fontSize: 9, padding: '4px 10px',
    border: `1px solid ${dark ? 'rgba(236,232,225,.11)' : 'rgba(13,13,13,.18)'}`,
    color: dark ? 'rgba(236,232,225,.36)' : 'rgba(13,13,13,.36)',
    letterSpacing: '.06em', textTransform: 'uppercase',
  }}>{children}</span>
);

export const ProfessionalTheme = ({ rootUser, profile, repos = [] }) => {
  const name      = profile?.name      || rootUser?.name || 'Your Name';
  const headline  = profile?.headline  || 'CSE Student · Open to Internships';
  const bio       = profile?.bio       || 'Building elegant solutions to hard problems. Focused on full-stack development, DSA & systems.';
  const email     = profile?.email     || rootUser?.email || profile?.links?.email || '';
  const links     = profile?.links     || {};
  const resumeUrl = profile?.resumeUrl || '/resume.pdf';

  /* Hero name split: all words but last (outline) / last word (solid) */
  const nameWords = name.toUpperCase().split(' ').filter(Boolean);
  const nameLast  = nameWords.length > 1 ? nameWords.pop() : '';
  const nameFirst = nameWords.join(' ') || name.toUpperCase();

  /* Stats row */
  const stats = [
    { value: profile?.leetcode || '500+', label: 'LeetCode' },
    { value: profile?.cgpa     || '8.5',  label: 'CGPA' },
    { value: repos.length > 0 ? `${repos.length}+` : '10+', label: 'Projects' },
  ];

  /* Skills: categorize real skills into 4 columns, or fall back to demo data */
  const skills = profile?.skills || [];
  let skillCols;
  if (skills.length >= 4) {
    const chunk = Math.ceil(skills.length / 4);
    const mk = (arr) => arr.map((s) => ({ name: s, lvl: 'Proficient' }));
    skillCols = [
      { label: 'Languages',  rows: mk(skills.slice(0, chunk)) },
      { label: 'Frameworks', rows: mk(skills.slice(chunk, chunk * 2)) },
      { label: 'Tools',      rows: mk(skills.slice(chunk * 2, chunk * 3)) },
      { label: 'CS Core',    rows: mk(skills.slice(chunk * 3)) },
    ];
  } else {
    skillCols = [
      { label: 'Languages',  rows: DEFAULT_LANGS },
      { label: 'Frameworks', rows: DEFAULT_FWKS },
      { label: 'Tools',      rows: DEFAULT_TOOLS },
      { label: 'CS Core',    rows: DEFAULT_CONCEPTS },
    ];
  }

  /* Projects: real repos (up to 3) or placeholders */
  const projects = repos.length > 0
    ? repos.slice(0, 3).map((r) => ({
        name: r.name, description: r.description || 'A project worth a closer look.',
        tags: [r.language].filter(Boolean), repoUrl: r.repoUrl,
      }))
    : DEFAULT_PROJECTS;

  /* Timeline: merge education + experience, or fall back to demo entries */
  const eduEntries = (profile?.education || []).map((e) => ({
    date: e.year || '', title: e.degree || e.field || 'Education',
    org: e.institution || '', desc: e.description || 'Core coursework and academic milestones.', tags: [],
  }));
  const expEntries = (profile?.experience || []).map((e) => ({
    date: e.startDate ? `${e.startDate} — ${e.endDate || 'Present'}` : '',
    title: e.role || 'Experience', org: e.company || '', desc: e.description || '', tags: [],
  }));
  const timeline = [...eduEntries, ...expEntries];
  const timelineFinal = timeline.length > 0 ? timeline : DEFAULT_TIMELINE;

  /* Contact links: only render what exists */
  const social = [
    links.github   && { label: 'GitHub',   href: links.github },
    links.linkedin && { label: 'LinkedIn', href: links.linkedin },
    links.twitter  && { label: 'Twitter/X', href: links.twitter },
    resumeUrl      && { label: 'Resume ↓', href: resumeUrl },
  ].filter(Boolean);

  /* ── refs ── */
  const heroCanvasRef   = useRef(null);
  const heroCtxRef      = useRef(null);
  const heroIdxRef      = useRef(0);
  const heroIntervalRef = useRef(null);
  const grainSeedRef    = useRef(1);
  const grainIntervalRef = useRef(null);
  const grainFilterRef  = useRef(null);
  const ribbonPathRef   = useRef(null);
  const workSectionRef  = useRef(null);
  const workTopRef      = useRef(0);
  const leftCardRef     = useRef(null);
  const rightCardRef    = useRef(null);
  const bgGlyphRef      = useRef(null);
  const leftOffRef      = useRef(0);
  const rightOffRef     = useRef(0);
  const tiltLRef        = useRef({ x: 0, y: 0 });
  const tiltRRef        = useRef({ x: 0, y: 0 });
  const rafRef          = useRef(null);

  const grainId  = useId();
  const ribbonId = useId();

  /* ── Hero canvas drawing: 7 abstract frames, hard-cut every 270ms ── */
  const drawHero = useCallback((idx) => {
    const ctx = heroCtxRef.current, c = heroCanvasRef.current;
    if (!ctx || !c) return;
    const w = c.width, h = c.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = DARK; ctx.fillRect(0, 0, w, h);
    switch (idx % 7) {
      case 0: {
        ctx.fillStyle = 'rgba(236,232,225,0.055)';
        for (let x = 40; x < w; x += 52) for (let y = 40; y < h; y += 52) { ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill(); }
        break;
      }
      case 1: {
        ctx.strokeStyle = 'rgba(236,232,225,0.042)'; ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 64) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
        for (let y = 0; y < h; y += 64) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
        break;
      }
      case 2: {
        ctx.fillStyle = 'rgba(197,48,42,0.15)';
        for (let i = 0; i < 60; i++) { ctx.beginPath(); ctx.arc(Math.random() * w, Math.random() * h, 2.5, 0, Math.PI * 2); ctx.fill(); }
        break;
      }
      case 3: {
        ctx.fillStyle = 'rgba(236,232,225,0.022)';
        for (let y = 0; y < h; y += 5) ctx.fillRect(0, y, w, 2);
        break;
      }
      case 4: {
        ctx.strokeStyle = 'rgba(236,232,225,0.038)'; ctx.lineWidth = 1;
        for (let x = -h; x < w + h; x += 52) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + h, h); ctx.stroke(); }
        break;
      }
      case 5: {
        ctx.fillStyle = '#0c0b09'; ctx.fillRect(0, 0, w, h);
        const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.55);
        g.addColorStop(0, 'rgba(180,60,30,0.08)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
        break;
      }
      case 6: {
        ctx.fillStyle = '#080808'; ctx.fillRect(0, 0, w, h);
        break;
      }
      default: break;
    }
  }, []);

  const resizeHero = useCallback(() => {
    const c = heroCanvasRef.current; if (!c) return;
    c.width = c.clientWidth; c.height = c.clientHeight;
    heroCtxRef.current = c.getContext('2d');
    drawHero(heroIdxRef.current);
  }, [drawHero]);

  useEffect(() => {
    resizeHero();
    heroIntervalRef.current = setInterval(() => {
      heroIdxRef.current = (heroIdxRef.current + 1) % 7;
      drawHero(heroIdxRef.current);
    }, 270);

    grainIntervalRef.current = setInterval(() => {
      grainSeedRef.current = (grainSeedRef.current + 1) % 200;
      if (grainFilterRef.current) grainFilterRef.current.setAttribute('seed', String(grainSeedRef.current));
    }, 55);

    window.addEventListener('resize', resizeHero);

    const onScroll = () => {
      const sy = window.scrollY || 0;
      const offset = Math.max(-28, -sy * 0.022);
      if (ribbonPathRef.current) ribbonPathRef.current.setAttribute('startOffset', `${offset}%`);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const topTimer = setTimeout(() => {
      const el = workSectionRef.current;
      if (el) workTopRef.current = el.getBoundingClientRect().top + window.scrollY;
    }, 300);

    const tick = () => {
      const rel = Math.max(0, (window.scrollY || 0) - workTopRef.current + window.innerHeight * 0.55);
      const target = rel * 0.11;
      leftOffRef.current  += (-target - leftOffRef.current)  * 0.065;
      rightOffRef.current += (target - rightOffRef.current) * 0.065;
      const l = leftCardRef.current, r = rightCardRef.current, bg = bgGlyphRef.current;
      if (l) {
        const scaleL = Math.max(0.9, 1 - Math.abs(leftOffRef.current) * 0.0006);
        l.style.transform = `perspective(900px) translateY(${leftOffRef.current}px) rotateY(${tiltLRef.current.x}deg) rotateX(${tiltLRef.current.y}deg) scale(${scaleL})`;
      }
      if (r) {
        const scaleR = Math.max(0.9, 1 - Math.abs(rightOffRef.current) * 0.0006);
        r.style.transform = `perspective(900px) translateY(${rightOffRef.current}px) rotateY(${tiltRRef.current.x}deg) rotateX(${tiltRRef.current.y}deg) scale(${scaleR})`;
      }
      if (bg) bg.style.transform = `translate(-50%, calc(-50% + ${rightOffRef.current * 0.3}px))`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const bindTilt = (el, tiltRef) => {
      if (!el) return () => {};
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        tiltRef.current = { x: dx * 6, y: -dy * 4 };
      };
      const onLeave = () => { tiltRef.current = { x: 0, y: 0 }; };
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
    };
    const unbindL = bindTilt(leftCardRef.current, tiltLRef);
    const unbindR = bindTilt(rightCardRef.current, tiltRRef);

    return () => {
      clearInterval(heroIntervalRef.current);
      clearInterval(grainIntervalRef.current);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(topTimer);
      window.removeEventListener('resize', resizeHero);
      window.removeEventListener('scroll', onScroll);
      unbindL(); unbindR();
    };
  }, [resizeHero, drawHero]);

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */
  return (
    <div style={{ background: DARK, color: CREAM, fontFamily: SANS, overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&family=VT323&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        @keyframes profBlink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes profFloatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        .prof-ot-c { color: transparent; -webkit-text-stroke: 1.5px ${CREAM}; }
        .prof-ot-d { color: transparent; -webkit-text-stroke: 2px ${TEXTDARK}; }
        .prof-nav a:hover { opacity: .55; transition: opacity .15s; }
        .prof-glink:hover { opacity: .7; transition: opacity .2s; }
        .prof-card { transition: border-color .3s; }
        .prof-card:hover { border-color: rgba(236,232,225,.22) !important; }
        ::selection { background: rgba(197,48,42,.25); }
      `}</style>

      {/* Film grain */}
      <svg style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 900, opacity: 0.055 }} aria-hidden="true">
        <filter id={grainId} x="0" y="0" width="100%" height="100%">
          <feTurbulence ref={grainFilterRef} type="fractalNoise" baseFrequency="0.78" numOctaves="4" stitchTiles="stitch" seed="1" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${grainId})`} />
      </svg>

      {/* Nav */}
      <nav className="prof-nav" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 800,
        padding: '22px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        mixBlendMode: 'difference',
      }}>
        <span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: '.15em', color: '#fff', fontWeight: 700 }}>PORT.FOLIO</span>
        <div style={{ display: 'flex', gap: 36 }}>
          {[['#skills', 'Skills'], ['#work', 'Work'], ['#experience', 'Exp.'], ['#achievements', 'Wins'], ['#contact', 'Contact']].map(([href, label]) => (
            <a key={href} href={href} style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.14em', color: '#fff', textDecoration: 'none', textTransform: 'uppercase' }}>{label}</a>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative', height: '100vh', overflow: 'hidden', background: DARK,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 48px 72px',
      }}>
        <canvas ref={heroCanvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', zIndex: 0 }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 90% 85% at 50% 50%, transparent 30%, rgba(0,0,0,.7) 100%)',
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: ACCENT_B, display: 'inline-block', animation: 'profBlink 2.5s infinite' }} />
            <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.2em', color: ACCENT_B, textTransform: 'uppercase' }}>{headline}</span>
          </div>
          {nameLast ? (
            <>
              <h1 className="prof-ot-c" style={{ fontSize: 'clamp(62px,10.5vw,162px)', fontWeight: 700, lineHeight: 0.87, letterSpacing: '-.03em', textTransform: 'uppercase' }}>{nameFirst}</h1>
              <h1 style={{ fontSize: 'clamp(62px,10.5vw,162px)', fontWeight: 700, lineHeight: 0.87, letterSpacing: '-.03em', textTransform: 'uppercase', color: CREAM }}>{nameLast}</h1>
            </>
          ) : (
            <h1 style={{ fontSize: 'clamp(62px,10.5vw,162px)', fontWeight: 700, lineHeight: 0.87, letterSpacing: '-.03em', textTransform: 'uppercase', color: CREAM }}>{nameFirst}</h1>
          )}
          <div style={{ marginTop: 44, display: 'flex', gap: 64, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <p style={{ fontFamily: MONO, fontSize: 13, color: 'rgba(236,232,225,.5)', maxWidth: 380, lineHeight: 1.85 }}>{bio}</p>
            <div style={{ display: 'flex', gap: 44, marginLeft: 'auto' }}>
              {stats.map((s) => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: PIXEL, fontSize: 54, color: ACCENT_N, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '.14em', color: 'rgba(236,232,225,.3)', marginTop: 4, textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{
          position: 'absolute', bottom: 36, right: 48, zIndex: 2, display: 'flex',
          flexDirection: 'column', alignItems: 'center', gap: 10, animation: 'profFloatY 2.8s ease-in-out infinite',
        }}>
          <div style={{ width: 1, height: 54, background: 'linear-gradient(to bottom, transparent, rgba(236,232,225,.28))' }} />
          <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '.2em', color: 'rgba(236,232,225,.28)', writingMode: 'vertical-rl' }}>SCROLL</span>
        </div>
      </section>

      {/* ── SVG RIBBON ── */}
      <div style={{ background: DARK, overflow: 'hidden', height: 58, borderTop: '1px solid rgba(236,232,225,.05)', borderBottom: '1px solid rgba(236,232,225,.05)' }}>
        <svg viewBox="0 0 2880 58" width="200%" height="58" preserveAspectRatio="none">
          <defs>
            <path id={ribbonId} d="M0,29 C160,8 320,50 480,29 C640,8 800,50 960,29 C1120,8 1280,50 1440,29 C1600,8 1760,50 1920,29 C2080,8 2240,50 2400,29 C2560,8 2720,50 2880,29" />
          </defs>
          <text fontFamily={MONO} fontSize="10" letterSpacing="7" fill={ACCENT_RB}>
            <textPath ref={ribbonPathRef} href={`#${ribbonId}`} startOffset="0%">
              CSE STUDENT · FULL STACK DEV · DSA · OPEN SOURCE · HACKATHON BUILDER · PROBLEM SOLVER · SYSTEMS THINKER · CSE STUDENT · FULL STACK DEV · DSA · OPEN SOURCE · HACKATHON BUILDER · PROBLEM SOLVER · SYSTEMS THINKER · CSE STUDENT ·
            </textPath>
          </text>
        </svg>
      </div>

      {/* ── SKILLS ── */}
      <section id="skills" style={{ background: LIGHT, color: TEXTDARK, padding: '100px 48px 120px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <Reveal style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 72, flexWrap: 'wrap', gap: 24 }}>
            <div>
              <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.22em', color: ACCENT, display: 'block', marginBottom: 14 }}>01 / SKILLS</span>
              <h2 style={{ fontSize: 'clamp(44px,6.5vw,96px)', fontWeight: 700, lineHeight: 0.92, letterSpacing: '-.03em', textTransform: 'uppercase', color: TEXTDARK }}>Technical<br />Arsenal</h2>
            </div>
            <p style={{ fontFamily: MONO, fontSize: 12, color: 'rgba(13,13,13,.46)', maxWidth: 320, lineHeight: 1.85 }}>A growing stack refined through coursework, personal projects &amp; relentless curiosity.</p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', border: '1px solid rgba(13,13,13,.12)' }}>
            {skillCols.map((col, ci) => (
              <Reveal key={col.label} delay={(ci + 1) * 0.12} style={{ padding: '32px 26px', borderRight: ci < 3 ? '1px solid rgba(13,13,13,.12)' : 'none' }}>
                <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '.22em', color: ACCENT, marginBottom: 28, textTransform: 'uppercase' }}>{col.label}</div>
                {col.rows.map((sk) => (
                  <div key={sk.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid rgba(13,13,13,.07)' }}>
                    <span style={{ fontSize: 15, fontWeight: 500, color: TEXTDARK }}>{sk.name}</span>
                    <span style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(13,13,13,.36)', letterSpacing: '.06em' }}>{sk.lvl}</span>
                  </div>
                ))}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="work" ref={workSectionRef} style={{ background: DARK, padding: '100px 48px 220px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <Reveal style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 80, flexWrap: 'wrap', gap: 24 }}>
            <div>
              <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.22em', color: ACCENT, display: 'block', marginBottom: 14 }}>02 / SELECTED WORK</span>
              <h2 className="prof-ot-c" style={{ fontSize: 'clamp(44px,6.5vw,96px)', fontWeight: 700, lineHeight: 0.92, letterSpacing: '-.03em', textTransform: 'uppercase' }}>Projects</h2>
              <h2 style={{ fontSize: 'clamp(44px,6.5vw,96px)', fontWeight: 700, lineHeight: 0.92, letterSpacing: '-.03em', textTransform: 'uppercase', color: CREAM }}>&amp; Repos</h2>
            </div>
            {links.github && (
              <a href={links.github} target="_blank" rel="noreferrer" className="prof-glink" style={{
                fontFamily: MONO, fontSize: 10, letterSpacing: '.14em', color: 'rgba(236,232,225,.38)',
                textDecoration: 'none', border: '1px solid rgba(236,232,225,.13)', padding: '14px 28px',
                alignSelf: 'flex-end', textTransform: 'uppercase',
              }}>GitHub Profile →</a>
            )}
          </Reveal>

          <div ref={bgGlyphRef} style={{
            position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%,-50%)',
            fontFamily: PIXEL, fontSize: 'clamp(280px,38vw,520px)', color: 'rgba(236,232,225,.016)',
            lineHeight: 1, pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap', willChange: 'transform',
          }}>WORK</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, alignItems: 'start', position: 'relative', zIndex: 1 }}>
            {projects.slice(0, 3).map((p, i) => {
              const card = (
                <div className="prof-card" style={{ background: '#111', border: '1px solid rgba(236,232,225,.07)', overflow: 'hidden' }}>
                  <div style={{ aspectRatio: '4/3', background: '#141414', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <div style={{ textAlign: 'center', padding: 24 }}>
                      <div style={{ fontFamily: PIXEL, fontSize: 22, color: 'rgba(236,232,225,.1)', letterSpacing: '.2em' }}>PROJECT_{String(i + 1).padStart(2, '0')}</div>
                      <div style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(236,232,225,.07)', marginTop: 8, letterSpacing: '.1em' }}>SCREENSHOT / DEMO GIF</div>
                    </div>
                    <span style={{ position: 'absolute', top: 14, left: 16, fontFamily: PIXEL, fontSize: 24, color: ACCENT }}>{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div style={{ padding: 28 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 600, color: CREAM, letterSpacing: '-.01em', marginBottom: 8 }}>{p.name}</h3>
                    <p style={{ fontFamily: MONO, fontSize: 11, color: 'rgba(236,232,225,.38)', marginBottom: 20, lineHeight: 1.75 }}>{p.description}</p>
                    {p.tags?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
                        {p.tags.map((t) => <Tag key={t} dark>{t}</Tag>)}
                      </div>
                    )}
                    {p.repoUrl && (
                      <a href={p.repoUrl} target="_blank" rel="noreferrer" className="prof-glink" style={{
                        fontFamily: MONO, fontSize: 10, color: ACCENT_LK, letterSpacing: '.1em', textDecoration: 'none',
                        borderBottom: `1px solid ${ACCENT_LB}`, paddingBottom: 2, display: 'inline-block',
                      }}>VIEW ON GITHUB →</a>
                    )}
                  </div>
                </div>
              );
              if (i === 0) return <div key={p.name + i} ref={leftCardRef} style={{ willChange: 'transform', transformStyle: 'preserve-3d' }}>{card}</div>;
              if (i === 2) return <div key={p.name + i} ref={rightCardRef} style={{ willChange: 'transform', transformStyle: 'preserve-3d' }}>{card}</div>;
              return <div key={p.name + i} style={{ marginTop: 80 }}>{card}</div>;
            })}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE & EDUCATION ── */}
      <section id="experience" style={{ background: LIGHT, color: TEXTDARK }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{
            position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', padding: '80px 56px 80px 48px', borderRight: '1px solid rgba(13,13,13,.1)',
          }}>
            <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.22em', color: ACCENT, display: 'block', marginBottom: 16 }}>03 / EXPERIENCE</span>
            <h2 style={{ fontSize: 'clamp(36px,4.5vw,64px)', fontWeight: 700, lineHeight: 0.95, letterSpacing: '-.03em', textTransform: 'uppercase', color: TEXTDARK }}>My<br />Journey<br />So Far</h2>
            <div style={{ width: 40, height: 2, background: ACCENT, marginTop: 36 }} />
            <p style={{ marginTop: 22, fontFamily: MONO, fontSize: 12, color: 'rgba(13,13,13,.4)', lineHeight: 1.9, maxWidth: 300 }}>From 'Hello World' to production deployments — every line of code has been a step forward.</p>
          </div>
          <div style={{ padding: '80px 48px 80px 56px' }}>
            {timelineFinal.map((entry, i) => (
              <Reveal key={i} delay={i * 0.12} style={{
                paddingBottom: 72, marginBottom: i < timelineFinal.length - 1 ? 72 : 0,
                borderBottom: i < timelineFinal.length - 1 ? '1px solid rgba(13,13,13,.1)' : 'none',
              }}>
                {entry.date && <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '.18em', color: ACCENT, marginBottom: 14, textTransform: 'uppercase' }}>{entry.date}</div>}
                <h3 style={{ fontSize: 22, fontWeight: 600, color: TEXTDARK, letterSpacing: '-.01em', marginBottom: 6 }}>{entry.title}</h3>
                {entry.org && <div style={{ fontFamily: MONO, fontSize: 12, color: 'rgba(13,13,13,.4)', marginBottom: 20 }}>{entry.org}</div>}
                {entry.desc && <p style={{ fontSize: 15, color: 'rgba(13,13,13,.6)', lineHeight: 1.75 }}>{entry.desc}</p>}
                {entry.tags?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
                    {entry.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACHIEVEMENTS ── */}
      <section id="achievements" style={{ background: DARK, color: CREAM, padding: '100px 48px 120px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <Reveal style={{ marginBottom: 72 }}>
            <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.22em', color: ACCENT, display: 'block', marginBottom: 14 }}>04 / ACHIEVEMENTS</span>
            <h2 style={{ fontSize: 'clamp(44px,6.5vw,96px)', fontWeight: 700, lineHeight: 0.92, letterSpacing: '-.03em', textTransform: 'uppercase', color: CREAM }}>Milestones</h2>
            <h2 className="prof-ot-c" style={{ fontSize: 'clamp(44px,6.5vw,96px)', fontWeight: 700, lineHeight: 0.92, letterSpacing: '-.03em', textTransform: 'uppercase' }}>&amp; Wins</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'rgba(236,232,225,.07)' }}>
            {DEFAULT_ACHIEVEMENTS.map((a, i) => (
              <Reveal key={a.title} delay={(i % 3) * 0.12} style={{ padding: '36px 32px', background: DARK, position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '.18em', color: ACCENT, marginBottom: 14, textTransform: 'uppercase' }}>{a.year}</div>
                <h3 style={{ fontSize: 19, fontWeight: 600, color: CREAM, letterSpacing: '-.01em', marginBottom: 10, lineHeight: 1.3 }}>{a.title}</h3>
                <p style={{ fontFamily: MONO, fontSize: 11, color: 'rgba(236,232,225,.35)', lineHeight: 1.75 }}>{a.desc}</p>
                <div style={{ position: 'absolute', bottom: -6, right: 14, fontFamily: PIXEL, fontSize: 96, color: 'rgba(236,232,225,.025)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ background: LIGHT, color: TEXTDARK, padding: '100px 48px 80px', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', width: '100%' }}>
          <Reveal><span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.22em', color: ACCENT, display: 'block', marginBottom: 20 }}>05 / CONTACT</span></Reveal>
          <Reveal delay={0.12}>
            <h2 style={{ fontSize: 'clamp(54px,9vw,136px)', fontWeight: 700, lineHeight: 0.88, letterSpacing: '-.03em', textTransform: 'uppercase', color: TEXTDARK }}>Let's</h2>
            <h2 className="prof-ot-d" style={{ fontSize: 'clamp(54px,9vw,136px)', fontWeight: 700, lineHeight: 0.88, letterSpacing: '-.03em', textTransform: 'uppercase', marginBottom: 60 }}>Connect.</h2>
          </Reveal>
          <Reveal delay={0.24} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 40, paddingTop: 48, borderTop: '1px solid rgba(13,13,13,.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {email && (
                <a href={`mailto:${email}`} style={{ fontSize: 20, fontWeight: 500, color: TEXTDARK, textDecoration: 'none', letterSpacing: '-.01em', borderBottom: '1px solid rgba(13,13,13,.25)', paddingBottom: 4, display: 'inline-block' }}>{email}</a>
              )}
              {social.length > 0 && (
                <div style={{ display: 'flex', gap: 28, marginTop: 8, flexWrap: 'wrap' }}>
                  {social.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="prof-glink" style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.14em', color: 'rgba(13,13,13,.4)', textDecoration: 'none', textTransform: 'uppercase' }}>{s.label}</a>
                  ))}
                </div>
              )}
            </div>
            {email && (
              <a href={`mailto:${email}`} style={{ background: TEXTDARK, color: LIGHT, fontFamily: MONO, fontSize: 11, letterSpacing: '.15em', textDecoration: 'none', padding: '18px 44px', textTransform: 'uppercase', display: 'inline-block' }}>SAY HELLO →</a>
            )}
          </Reveal>
          <Reveal delay={0.36} style={{ marginTop: 80, paddingTop: 28, borderTop: '1px solid rgba(13,13,13,.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <span style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(13,13,13,.3)', letterSpacing: '.07em' }}>{name.toUpperCase()} · CSE STUDENT · {new Date().getFullYear()}</span>
            <span style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(13,13,13,.3)', letterSpacing: '.07em' }}>BUILT WITH ♥ &amp; COUNTLESS COMMITS</span>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
