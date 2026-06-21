import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════
   ASCLEPIUS — Medical Portfolio Theme (v2)
   Palette: Ice #F0F7FF | Navy #0a1628 | Navy Deep #060d1f
            Teal #0891b2 | Green #10b981
═══════════════════════════════════════════════════ */

const NAVY       = '#0a1628';
const NAVY_DEEP  = '#060d1f';
const TEAL       = '#0891b2';
const GREEN      = '#10b981';
const ICE        = '#F0F7FF';
const SLATE      = '#64748b';
const SLATE_LT   = '#94a3b8';
const MID        = '#475569';
const BORDER     = '#e8edf4';
const SANS  = '"Inter", system-ui, sans-serif';
const SERIF = '"Playfair Display", Georgia, serif';
const MONO  = '"JetBrains Mono", monospace';

const EKG_D = 'M0,29 L110,29 C120,29 130,21 140,16 C150,11 156,22 165,29 L172,29 L174,36 L183,3 L188,49 L193,29 L204,29 C213,29 221,19 231,15 C241,11 247,22 256,29 L900,29';

const useForm = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onSubmit = (e) => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 4000); setForm({ name: '', email: '', message: '' }); };
  return { form, sent, onChange, onSubmit };
};

/* ── Scroll-reveal hook: fires once, fade + translateY(80px) → 0 ── */
const useInView = (threshold = 0.07) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.unobserve(el); }
    }, { threshold, rootMargin: '0px 0px -52px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

const Reveal = ({ children, delay = 0, threshold = 0.07, style, as: As = 'div' }) => {
  const [ref, inView] = useInView(threshold);
  return (
    <As ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(80px)',
      transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
      ...style,
    }}>
      {children}
    </As>
  );
};

const MedBadge = ({ children, color = TEAL }) => (
  <span style={{
    display: 'inline-block', padding: '6px 14px', borderRadius: 4,
    background: `${color}17`, border: `1px solid ${color}30`, color,
    fontFamily: MONO, fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
  }}>
    {children}
  </span>
);

const Card = ({ children, style = {}, onClick, layoutId, className }) => {
  const CardContainer = layoutId ? motion.div : 'div';
  return (
    <CardContainer
      layoutId={layoutId}
      onClick={onClick}
      className={className}
      style={{
        background: '#fff', border: `1.5px solid ${BORDER}`, borderRadius: 12,
        padding: 28, transition: 'transform .28s ease, box-shadow .28s ease, border-color .28s ease', ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 18px 44px rgba(8,145,178,0.14)`; e.currentTarget.style.borderColor = 'rgba(8,145,178,0.3)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {children}
    </CardContainer>
  );
};

const HR = ({ color = TEAL }) => (
  <div style={{ height: 1, background: `linear-gradient(90deg,${color},${color}40,transparent)`, margin: '48px 0' }} />
);

const SectionTitle = ({ label, title, sub, dark }) => (
  <div style={{ marginBottom: 56 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <div style={{ width: 24, height: 2, background: TEAL, borderRadius: 2 }} />
      <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: TEAL }}>{label}</span>
    </div>
    <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, color: dark ? '#fff' : NAVY, letterSpacing: '-0.022em', lineHeight: 1.1, marginBottom: sub ? 12 : 0 }}>{title}</h2>
    {sub && <p style={{ fontFamily: SANS, fontSize: 16, color: dark ? 'rgba(255,255,255,0.5)' : SLATE, maxWidth: 560 }}>{sub}</p>}
  </div>
);

const CrossIcon = ({ size = 20, color = TEAL }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="9" y="2" width="6" height="20" rx="1.5" fill={color} />
    <rect x="2" y="9" width="20" height="6" rx="1.5" fill={color} />
  </svg>
);

/* ── Default / placeholder content shown when profile data is missing ── */
const DEFAULT_SKILLS = {
  clinical: [{ name: 'Internal Medicine', level: 90 }, { name: 'Cardiology', level: 82 }, { name: 'Patient Care', level: 75 }, { name: 'Diagnostics', level: 88 }],
  research: [{ name: 'Clinical Research', level: 86 }, { name: 'Biostatistics', level: 71 }, { name: 'Pharmacology', level: 65 }, { name: 'Medical Ethics', level: 79 }],
  tools:    [{ name: 'EHR / EPIC', level: 92 }, { name: 'R / Python', level: 74 }, { name: 'REDCap', level: 68 }, { name: 'Medical Imaging', level: 80 }],
};

const RESEARCH_TAGS = ['Research', 'Clinical Trial', 'Review'];
const DEFAULT_RESEARCH_CARDS = [
  { id: 'r1', title: 'Outcomes in Early Intervention Protocols', year: '2024', tag: 'Research', journal: 'Journal of Clinical Medicine', citations: '42', abstract: 'A study examining early intervention protocols and their measurable impact on patient recovery timelines.', doi: '#' },
  { id: 'r2', title: 'Randomized Trial of a Novel Treatment Pathway', year: '2023', tag: 'Clinical Trial', journal: 'NEJM Evidence', citations: '67', abstract: 'A multi-center randomized controlled trial evaluating safety and efficacy of a new treatment pathway.', doi: '#' },
  { id: 'r3', title: 'Systematic Review of Diagnostic Accuracy', year: '2023', tag: 'Review', journal: 'The Lancet', citations: '29', abstract: 'A systematic review synthesizing diagnostic accuracy data across recent peer-reviewed literature.', doi: '#' },
  { id: 'r4', title: 'Biomarkers for Early Disease Detection', year: '2022', tag: 'Research', journal: 'JAMA Internal Medicine', citations: '54', abstract: 'Investigates candidate biomarkers for earlier, more reliable disease detection in at-risk populations.', doi: '#' },
  { id: 'r5', title: 'Long-Term Follow-Up Cohort Study', year: '2022', tag: 'Clinical Trial', journal: 'BMJ Open', citations: '18', abstract: 'A long-term cohort study tracking patient outcomes over a five-year follow-up period.', doi: '#' },
  { id: 'r6', title: 'Care Delivery Models in Resource-Limited Settings', year: '2021', tag: 'Review', journal: 'The Lancet Global Health', citations: '33', abstract: 'Reviews care delivery models and their adaptability to resource-limited clinical settings.', doi: '#' },
];

const DEFAULT_ACHIEVEMENTS = [
  { year: '2024', title: 'Board Certification — Internal Medicine', desc: 'Certified by the relevant national medical board following rigorous examination.' },
  { year: '2024', title: 'Research Grant Recipient', desc: 'Awarded a competitive grant to fund ongoing clinical research initiatives.' },
  { year: '2023', title: 'Keynote Speaker, Annual Medical Conference', desc: 'Invited to present original research findings to a national audience of peers.' },
  { year: '2023', title: 'Excellence in Patient Care Award', desc: 'Recognized by department leadership for sustained excellence in patient outcomes.' },
  { year: '2022', title: 'Fellowship in Clinical Research', desc: 'Completed a competitive fellowship program in clinical research methodology.' },
  { year: '2021', title: 'Dean’s Honor List', desc: 'Graduated with distinction, ranked among the top of the cohort.' },
];

const DEFAULT_TESTIMONIALS = [
  { quote: 'One of the most thorough and attentive physicians I have worked alongside — meticulous in research and deeply compassionate with patients.', name: 'Colleague, MD', role: 'Department Chief', color: TEAL },
  { quote: 'Their research has directly shaped how our team approaches early intervention. Rigorous, evidence-driven, and always patient-first.', name: 'Collaborator, PhD', role: 'Research Partner', color: GREEN },
];

export const MedicalTheme = ({ rootUser, profile, repos = [] }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const { form, sent, onChange, onSubmit } = useForm();

  const name       = profile?.name       || rootUser?.name   || 'Dr. Name';
  const headline   = profile?.headline   || 'Physician & Researcher';
  const bio        = profile?.bio        || 'Dedicated medical professional committed to advancing patient outcomes through evidence-based practice, cutting-edge research, and compassionate care.';
  const intro      = profile?.intro      || bio;
  const email      = profile?.email      || rootUser?.email  || '';
  const location   = profile?.location   || '';
  const skills     = profile?.skills     || [];
  const experience = profile?.experience || [];
  const education  = profile?.education  || [];
  const links      = profile?.links      || {};
  const resumeUrl  = profile?.resumeUrl  || '/resume.pdf';
  const avatar     = profile?.avatarUrl  || profile?.avatar  || '';

  /* Research cards: real repos or placeholders */
  const researchCards = repos.length > 0
    ? repos.map((r, i) => ({
        id: r._id || i, title: r.name, year: r.year || String(new Date().getFullYear()),
        tag: r.language || RESEARCH_TAGS[i % RESEARCH_TAGS.length],
        journal: r.language ? `${r.language} Research` : 'Independent Research',
        citations: String(r.stars || 0),
        abstract: r.description || 'A rigorous study contributing to evidence-based medical practice and clinical outcomes.',
        doi: r.repoUrl || '#',
      }))
    : DEFAULT_RESEARCH_CARDS;

  const tags = [...new Set(['All', ...researchCards.map((c) => c.tag).filter(Boolean)])];
  const shownCards = activeFilter === 'All' ? researchCards : researchCards.filter((c) => c.tag === activeFilter);

  /* Skills: categorize real skills into 3 columns with synthetic proficiency, or use demo data */
  let skillCols;
  if (skills.length >= 3) {
    const chunk = Math.ceil(skills.length / 3);
    const mk = (arr, base) => arr.map((s, i) => ({ name: s, level: Math.max(58, base - i * 6) }));
    skillCols = [
      { label: 'Clinical Skills',   color: TEAL,  items: mk(skills.slice(0, chunk), 92) },
      { label: 'Research',          color: GREEN, items: mk(skills.slice(chunk, chunk * 2), 88) },
      { label: 'Tools & Technology', color: '#fff', items: mk(skills.slice(chunk * 2), 84) },
    ];
  } else {
    skillCols = [
      { label: 'Clinical Skills',   color: TEAL,  items: DEFAULT_SKILLS.clinical },
      { label: 'Research',          color: GREEN, items: DEFAULT_SKILLS.research },
      { label: 'Tools & Technology', color: '#fff', items: DEFAULT_SKILLS.tools },
    ];
  }

  /* Stats */
  const stats = [
    { v: researchCards.length, l: 'Publications' },
    { v: skills.length || 12,  l: 'Specializations' },
    { v: experience.length || 3, l: 'Clinical Roles' },
    { v: education.length || 1, l: 'Degrees' },
  ];

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#research', label: 'Research' },
    { href: '#specializations', label: 'Skills' },
    { href: '#experience', label: 'Experience' },
    { href: '#achievements', label: 'Achievements' },
    { href: '#contact', label: 'Contact' },
  ];

  /* ── EKG draw-in: cubic ease-out over 2.5s, then pulse loop ── */
  const ekgPathRef = useRef(null);
  const ekgFrameRef = useRef(null);
  useEffect(() => {
    const path = ekgPathRef.current; if (!path) return;
    try {
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      const start = performance.now();
      const dur = 2500;
      const tick = (now) => {
        const t = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        path.style.strokeDashoffset = len * (1 - ease);
        if (t < 1) {
          ekgFrameRef.current = requestAnimationFrame(tick);
        } else {
          path.style.strokeDashoffset = 0;
          path.style.animation = 'ekg-pulse 4s ease-in-out infinite';
        }
      };
      ekgFrameRef.current = requestAnimationFrame(tick);
    } catch { /* getTotalLength unsupported in some renderers */ }
    return () => cancelAnimationFrame(ekgFrameRef.current);
  }, []);

  /* ── Molecular mesh canvas: 32 drifting nodes, connection lines < 155px ── */
  const meshCanvasRef = useRef(null);
  const meshFrameRef = useRef(null);
  useEffect(() => {
    const canvas = meshCanvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => {
      if (canvas.offsetWidth > 0) canvas.width = canvas.offsetWidth;
      if (canvas.offsetHeight > 0) canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const N = 32, MAX = 155;
    const nodes = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.4 + 0.7,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(8,145,178,${((1 - d / MAX) * 0.065).toFixed(4)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      nodes.forEach((n) => {
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(8,145,178,0.09)'; ctx.fill();
      });
      meshFrameRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(meshFrameRef.current); window.removeEventListener('resize', resize); };
  }, []);

  /* ── Skill bar fill: triggers once the Specializations section is in view ── */
  const [specRef, specInView] = useInView(0.22);

  /* ── Research detail modal (framer-motion layoutId = shared-element morph) ── */
  const openCard = useCallback((card) => setSelectedCard(card), []);
  const closeCard = useCallback(() => setSelectedCard(null), []);

  return (
    <div style={{ minHeight: '100vh', background: ICE, color: NAVY, fontFamily: SANS, overflowX: 'hidden' }}>

      {/* Shimmer accent bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 1001,
        background: `linear-gradient(90deg,${TEAL},${GREEN},${TEAL},${GREEN})`,
        backgroundSize: '400% 100%', animation: 'shimmer-sweep 5s linear infinite',
      }} />

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 3, left: 0, right: 0, zIndex: 1000, height: 68, transition: 'all .32s ease',
        background: scrollY > 60 ? 'rgba(255,255,255,0.88)' : 'transparent',
        backdropFilter: scrollY > 60 ? 'blur(18px) saturate(180%)' : 'none',
        borderBottom: scrollY > 60 ? '1px solid rgba(203,213,225,0.5)' : 'none',
        boxShadow: scrollY > 60 ? '0 2px 20px rgba(10,22,40,0.07)' : 'none',
      }}>
        <div style={{ maxWidth: 1240, height: '100%', margin: '0 auto', padding: '0 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CrossIcon size={18} color={TEAL} />
            <span style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 700, color: NAVY }}>
              {name.replace(/^Dr\.?\s*/i, 'Dr. ')}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="hidden md:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} style={{ fontFamily: SANS, fontSize: 14, fontWeight: 500, color: SLATE, textDecoration: 'none', transition: 'color .2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
                onMouseLeave={(e) => (e.currentTarget.style.color = SLATE)}>
                {l.label}
              </a>
            ))}
            <a href="#contact" style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, padding: '9px 20px', background: TEAL, color: '#fff', textDecoration: 'none', borderRadius: 7, transition: 'all .3s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = NAVY; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = TEAL; }}>
              Book Consultation
            </a>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden" style={{ background: 'none', border: `1px solid ${TEAL}40`, borderRadius: 8, padding: '8px 10px', cursor: 'pointer' }}>
            <div style={{ width: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  height: 1.5, background: NAVY, borderRadius: 2,
                  transform: menuOpen ? (i === 0 ? 'rotate(45deg) translateY(6px)' : i === 2 ? 'rotate(-45deg) translateY(-6px)' : 'none') : 'none',
                  opacity: menuOpen && i === 1 ? 0 : 1, transition: 'all .3s',
                }} />
              ))}
            </div>
          </button>
        </div>
        {menuOpen && (
          <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(18px)', borderTop: '1px solid rgba(203,213,225,0.5)', padding: '14px 36px' }}>
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{
                display: 'block', fontFamily: SANS, fontSize: 15, fontWeight: 500, color: SLATE,
                textDecoration: 'none', padding: '14px 0', borderBottom: '1px solid #f1f5f9',
              }}>{l.label}</a>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{ position: 'relative', minHeight: '100vh', paddingTop: 71, background: '#fff', display: 'flex', flexDirection: 'column' }}>
        <canvas ref={meshCanvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', alignItems: 'center', maxWidth: 1240, margin: '0 auto', width: '100%', padding: '80px 36px 52px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: avatar ? '1fr 340px' : '1fr', gap: 72, alignItems: 'center', width: '100%' }} className="grid-cols-1">
            <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: 'easeOut' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 26, flexWrap: 'wrap' }}>
                <MedBadge color={TEAL}>{headline}</MedBadge>
                {location && <MedBadge color={SLATE}>● {location}</MedBadge>}
              </div>

              <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(44px,5.8vw,78px)', fontWeight: 700, color: NAVY, lineHeight: 1.04, letterSpacing: '-0.025em', marginBottom: 8 }}>
                {name}
              </h1>

              <div style={{ height: 58, marginBottom: 26, overflow: 'visible', maxWidth: 580 }}>
                <svg viewBox="0 0 900 58" width="100%" height="58" preserveAspectRatio="none" style={{ display: 'block' }}>
                  <path ref={ekgPathRef} d={EKG_D} fill="none" stroke={TEAL} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <p style={{ fontFamily: SANS, fontSize: 17, fontWeight: 300, color: MID, lineHeight: 1.82, maxWidth: 530, marginBottom: 38 }}>
                {bio}
              </p>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <a href="#research" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: SANS, fontSize: 15, fontWeight: 600, color: '#fff', background: NAVY, borderRadius: 8, padding: '14px 28px', textDecoration: 'none', transition: 'all .3s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                  View Research →
                </a>
                <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: SANS, fontSize: 15, fontWeight: 600, color: TEAL, background: 'transparent', border: `1.5px solid ${TEAL}`, borderRadius: 8, padding: '14px 28px', textDecoration: 'none', transition: 'all .3s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `${TEAL}10`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                  Contact Me
                </a>
              </div>
            </motion.div>

            {avatar && (
              <div className="hidden lg:block">
                <div style={{ position: 'relative', width: 300, height: 375, borderRadius: 22, overflow: 'hidden', boxShadow: '0 32px 64px rgba(10,22,40,0.13), 0 0 0 1px rgba(10,22,40,0.05)' }}>
                  <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(10,22,40,0.9)',
                    backdropFilter: 'blur(12px)', borderRadius: 999, padding: '9px 20px', whiteSpace: 'nowrap',
                  }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN, animation: 'available-pulse 2.4s ease-out infinite' }} />
                    <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 500, color: '#fff', letterSpacing: '0.025em' }}>Available for Consultations</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ position: 'relative', zIndex: 1, borderTop: `1px solid ${BORDER}`, background: 'rgba(240,247,255,0.55)' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }} className="grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.l} style={{ padding: '32px 28px', textAlign: 'center', borderRight: i < stats.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                <div style={{ fontFamily: SERIF, fontSize: 46, fontWeight: 700, color: NAVY, lineHeight: 1 }}>{s.v}+</div>
                <div style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 500, color: SLATE, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 8 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ background: ICE, padding: '108px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 36px' }}>
          <Reveal><SectionTitle label="01 — About" title="The Physician Behind the Work" /></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 88 }} className="grid-cols-1 md:grid-cols-2">
            <Reveal delay={0.07}>
              <p style={{ fontSize: 17, fontWeight: 300, lineHeight: 1.88, color: MID, marginBottom: 24 }}>{intro}</p>
              {location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, fontFamily: SANS, fontSize: 14, color: SLATE }}>
                  <span>📍</span><span>{location}</span>
                </div>
              )}
              {email && (
                <a href={`mailto:${email}`} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: SANS, fontSize: 14, color: TEAL, textDecoration: 'none', marginBottom: 20 }}>
                  <span>✉️</span><span>{email}</span>
                </a>
              )}
              <a href={resumeUrl} download style={{
                display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: SANS, fontSize: 14, fontWeight: 600,
                color: TEAL, border: `1.5px solid ${TEAL}`, borderRadius: 7, padding: '12px 24px', textDecoration: 'none',
              }}>
                ↓ Download CV
              </a>
            </Reveal>
            <Reveal delay={0.14}>
              {education.length > 0 ? (
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 500, color: TEAL, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>Education</div>
                  {education.map((edu, i) => (
                    <div key={i} style={{ display: 'flex', gap: 18, marginBottom: 34 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#fff', boxShadow: '0 0 0 1px #d8e5f3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CrossIcon size={13} color={TEAL} />
                      </div>
                      <div>
                        {edu.year && <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 500, color: GREEN, letterSpacing: '0.07em', marginBottom: 4 }}>{edu.year}</div>}
                        <div style={{ fontFamily: SERIF, fontSize: 16.5, fontWeight: 600, color: NAVY, lineHeight: 1.3 }}>
                          {edu.degree}{edu.field ? ` — ${edu.field}` : ''}
                        </div>
                        <div style={{ fontFamily: SANS, fontSize: 14, color: SLATE, marginTop: 4 }}>{edu.institution}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontFamily: SANS, fontSize: 14, color: SLATE_LT }}>Education history will appear here once added.</div>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── RESEARCH ── */}
      <section id="research" style={{ background: '#fff', padding: '108px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 36px' }}>
          <Reveal style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginBottom: 56 }}>
            <SectionTitle label="02 — Research" title="Publications & Projects" sub="Evidence-based contributions to medical science" />
            {tags.length > 1 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {tags.map((t) => (
                  <button key={t} onClick={() => setActiveFilter(t)} style={{
                    fontFamily: SANS, fontSize: 13, fontWeight: 500, padding: '8px 22px', borderRadius: 999,
                    cursor: 'pointer', transition: 'all .25s', border: 'none',
                    background: activeFilter === t ? NAVY : '#f1f5f9',
                    color: activeFilter === t ? '#fff' : SLATE,
                  }}>
                    {t}
                  </button>
                ))}
              </div>
            )}
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {shownCards.map((card, i) => (
              <Reveal key={card.id} delay={(i % 6) * 0.07}>
                <Card layoutId={`research-${card.id}`} onClick={() => openCard(card)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <MedBadge color={TEAL}>{card.tag}</MedBadge>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: SLATE_LT }}>{card.year}</span>
                  </div>
                  <h3 style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 600, color: NAVY, lineHeight: 1.35, marginBottom: 10, flex: 1 }}>{card.title}</h3>
                  <p style={{ fontFamily: SANS, fontSize: 14, color: SLATE, lineHeight: 1.68, marginBottom: 20 }}>{card.abstract}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ fontFamily: SANS, fontSize: 13, color: SLATE }}>{card.journal}</span>
                    <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600, color: TEAL, display: 'flex', alignItems: 'center', gap: 4 }}>
                      {card.citations} citations →
                    </span>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Research detail modal — shared-element morph via layoutId */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(8,16,36,0.68)', backdropFilter: 'blur(5px)' }}
            onClick={closeCard}
          >
            <motion.div
              layoutId={`research-${selectedCard.id}`}
              transition={{ duration: 0.46, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ background: '#fff', maxWidth: 680, width: '100%', maxHeight: '88vh', overflowY: 'auto', borderRadius: 18, position: 'relative' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: '34px 38px 26px', borderBottom: '1px solid #f1f5f9', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <MedBadge color={TEAL}>{selectedCard.tag}</MedBadge>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: SLATE_LT }}>{selectedCard.year}</span>
                </div>
                <h3 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: NAVY, lineHeight: 1.3, paddingRight: 44 }}>{selectedCard.title}</h3>
                <button onClick={closeCard} style={{ position: 'absolute', top: 24, right: 24, width: 38, height: 38, borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer', fontSize: 16, color: NAVY }}>×</button>
              </div>
              <div style={{ padding: '30px 38px 40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 24, marginBottom: 24, borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 700, color: TEAL }}>{selectedCard.citations}</div>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: SLATE_LT, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Citations</div>
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: 16, fontWeight: 600, color: NAVY, textAlign: 'right' }}>{selectedCard.journal}</div>
                </div>
                <div style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 500, color: TEAL, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Abstract</div>
                <p style={{ fontFamily: SANS, fontSize: 16, fontWeight: 300, color: MID, lineHeight: 1.85, marginBottom: 32 }}>{selectedCard.abstract}</p>
                {selectedCard.doi && selectedCard.doi !== '#' && (
                  <a href={selectedCard.doi} target="_blank" rel="noreferrer" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: SANS, fontSize: 14, fontWeight: 600,
                    color: '#fff', background: TEAL, borderRadius: 7, padding: '14px 28px', textDecoration: 'none',
                  }}>
                    View Full Publication →
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SPECIALIZATIONS ── */}
      <section id="specializations" ref={specRef} style={{ background: NAVY, padding: '108px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 36px' }}>
          <Reveal><SectionTitle label="03 — Skills" title="Specializations" dark /></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 56 }} className="grid-cols-1 md:grid-cols-3">
            {skillCols.map((col, ci) => (
              <Reveal key={col.label} delay={ci * 0.07}>
                <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 500, color: TEAL, textTransform: 'uppercase', letterSpacing: '0.11em', borderBottom: 'rgba(255,255,255,0.09)', paddingBottom: 12, marginBottom: 26, borderBottomWidth: 1, borderBottomStyle: 'solid' }}>
                  {col.label}
                </div>
                {col.items.map((sk, i) => (
                  <div key={sk.name} style={{ marginBottom: 22 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontFamily: SANS, fontSize: 14, color: '#cbd5e1' }}>{sk.name}</span>
                      <span style={{ fontFamily: MONO, fontSize: 11, color: '#475569' }}>{sk.level}%</span>
                    </div>
                    <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2 }}>
                      <div style={{
                        height: '100%', borderRadius: 2, background: `linear-gradient(90deg,${TEAL},${GREEN})`,
                        width: specInView ? `${sk.level}%` : '0%',
                        transition: `width 1.15s cubic-bezier(0.25,0.46,0.45,0.94) ${(ci * col.items.length + i) * 0.08}s`,
                      }} />
                    </div>
                  </div>
                ))}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLINICAL EXPERIENCE ── */}
      <section id="experience" style={{ background: ICE, padding: '108px 0' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 36px' }}>
          <Reveal><SectionTitle label="04 — Experience" title="Clinical Experience" /></Reveal>
          <div style={{ position: 'relative' }}>
            {(experience.length > 0 ? experience : [
              { role: 'Attending Physician', company: 'General Hospital', startDate: '2022', endDate: null, description: 'Leading patient care across a busy clinical service while mentoring residents and contributing to ongoing research.' },
              { role: 'Resident Physician', company: 'University Medical Center', startDate: '2019', endDate: '2022', description: 'Completed residency training with rotations across internal medicine, emergency, and critical care.' },
              { role: 'Medical Intern', company: 'Teaching Hospital', startDate: '2018', endDate: '2019', description: 'First clinical year — built foundational skills across core medical and surgical rotations.' },
            ]).map((exp, i, arr) => (
              <Reveal key={i} delay={i * 0.07} style={{ display: 'flex', gap: 22, marginBottom: i < arr.length - 1 ? 52 : 0, position: 'relative' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                    <CrossIcon size={11} color={TEAL} />
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ position: 'absolute', left: 11, top: 28, bottom: -52, width: 1.5, background: `linear-gradient(rgba(8,145,178,0.35),transparent)` }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                    <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: NAVY }}>{exp.role}</h3>
                    <MedBadge color={TEAL}>{exp.startDate}{' — '}{exp.endDate || 'Present'}</MedBadge>
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 500, color: SLATE, marginBottom: 12 }}>{exp.company}</div>
                  {exp.description && <p style={{ fontFamily: SANS, fontSize: 15, fontWeight: 300, color: MID, lineHeight: 1.75 }}>{exp.description}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACHIEVEMENTS & RECOGNITION ── */}
      <section id="achievements" style={{ background: '#fff', padding: '108px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 36px' }}>
          <Reveal><SectionTitle label="05 — Recognition" title="Achievements & Recognition" /></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }} className="grid-cols-1 md:grid-cols-3">
            {DEFAULT_ACHIEVEMENTS.map((a, i) => (
              <Reveal key={a.title} delay={(i % 6) * 0.07} style={{ background: ICE, borderRadius: 12, padding: '28px 26px', border: 'rgba(8,145,178,0.1)', borderWidth: 1, borderStyle: 'solid' }}>
                <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 500, color: GREEN, letterSpacing: '0.06em', marginBottom: 12 }}>{a.year}</div>
                <h3 style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 600, color: NAVY, lineHeight: 1.35, marginBottom: 10 }}>{a.title}</h3>
                <p style={{ fontFamily: SANS, fontSize: 14, color: SLATE, lineHeight: 1.65 }}>{a.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" style={{ background: NAVY, padding: '108px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 36px' }}>
          <Reveal><SectionTitle label="06 — Voices" title="Testimonials" dark /></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 56 }} className="grid-cols-1 md:grid-cols-2">
            {DEFAULT_TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <div style={{ fontFamily: SERIF, fontSize: 88, lineHeight: 0.72, color: i === 0 ? 'rgba(8,145,178,0.28)' : 'rgba(16,185,129,0.22)', marginBottom: 22 }}>“</div>
                <blockquote style={{ fontFamily: SERIF, fontSize: 20, fontStyle: 'italic', color: 'rgba(255,255,255,0.87)', lineHeight: 1.65, marginBottom: 30 }}>{t.quote}</blockquote>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 2, height: 38, background: t.color }} />
                  <div>
                    <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: '#fff' }}>{t.name}</div>
                    <div style={{ fontFamily: SANS, fontSize: 13, color: SLATE }}>{t.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CV / RESUME CTA BAND ── */}
      <section id="cv" style={{ background: NAVY_DEEP, padding: '80px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 36px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
          <div>
            <h2 style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>Download CV / Resume</h2>
            <p style={{ fontFamily: SANS, fontSize: 16, fontWeight: 300, color: 'rgba(255,255,255,0.45)', maxWidth: 500 }}>Full credentials, publications, and clinical experience in one document.</p>
          </div>
          <a href={resumeUrl} download style={{
            display: 'inline-flex', alignItems: 'center', gap: 12, fontFamily: SANS, fontSize: 15, fontWeight: 600,
            color: NAVY, background: '#fff', borderRadius: 8, padding: '16px 32px', textDecoration: 'none',
          }}>
            ↓ Download CV
          </a>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ background: '#fff', padding: '108px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 36px' }}>
          <Reveal><SectionTitle label="07 — Contact" title="Get In Touch" sub="Available for consultations, collaborations & speaking engagements" /></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 88 }} className="grid-cols-1 md:grid-cols-2">
            <Reveal delay={0.07}>
              <p style={{ fontFamily: SANS, fontSize: 16, fontWeight: 300, color: MID, lineHeight: 1.82, marginBottom: 44 }}>
                Whether you're seeking a consultation, collaboration on research, or a keynote speaker — I'd love to connect.
              </p>
              {[
                email && { icon: '✉️', label: 'Email', value: email, href: `mailto:${email}` },
                links.linkedin && { icon: '🔗', label: 'LinkedIn', value: 'View Profile', href: links.linkedin },
                links.github && { icon: '📁', label: 'GitHub', value: 'View Publications', href: links.github },
              ].filter(Boolean).map((item) => (
                <a key={item.label} href={item.href} target={item.label !== 'Email' ? '_blank' : undefined} rel="noreferrer" style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '14px 4px', marginBottom: 4, textDecoration: 'none',
                }}>
                  <div style={{ width: 42, height: 42, borderRadius: 9, background: 'rgba(8,145,178,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: SLATE_LT, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontFamily: SANS, fontSize: 15, color: NAVY }}>{item.value}</div>
                  </div>
                </a>
              ))}
            </Reveal>

            <Reveal delay={0.14}>
              <form onSubmit={onSubmit}>
                {sent ? (
                  <div style={{ background: 'rgba(16,185,129,0.06)', border: '1.5px solid rgba(16,185,129,0.22)', borderRadius: 14, padding: '52px 40px', textAlign: 'center' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 24 }}>✓</div>
                    <h3 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, color: NAVY, marginBottom: 10 }}>Message Sent</h3>
                    <p style={{ fontFamily: SANS, fontSize: 15, color: SLATE }}>Thank you for reaching out — I'll respond as soon as possible.</p>
                  </div>
                ) : (
                  <>
                    {[{ name: 'name', label: 'Full Name', type: 'text', ph: 'Dr. Your Name' }, { name: 'email', label: 'Email Address', type: 'email', ph: 'doctor@hospital.com' }].map((f) => (
                      <div key={f.name} style={{ marginBottom: 22 }}>
                        <label style={{ display: 'block', fontFamily: SANS, fontSize: 12, fontWeight: 600, color: SLATE, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>{f.label}</label>
                        <input name={f.name} type={f.type} value={form[f.name]} onChange={onChange} required placeholder={f.ph} style={{
                          width: '100%', padding: '13px 16px', fontFamily: SANS, fontSize: 15, background: '#fff',
                          border: '1.5px solid #e2e8f0', borderRadius: 8, color: NAVY, outline: 'none', boxSizing: 'border-box', transition: 'border .2s',
                        }} onFocus={(e) => (e.currentTarget.style.borderColor = TEAL)} onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')} />
                      </div>
                    ))}
                    <div style={{ marginBottom: 28 }}>
                      <label style={{ display: 'block', fontFamily: SANS, fontSize: 12, fontWeight: 600, color: SLATE, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Message</label>
                      <textarea name="message" value={form.message} onChange={onChange} required rows={5} placeholder="Your message..." style={{
                        width: '100%', padding: '13px 16px', fontFamily: SANS, fontSize: 15, background: '#fff',
                        border: '1.5px solid #e2e8f0', borderRadius: 8, color: NAVY, outline: 'none', resize: 'vertical', minHeight: 128, boxSizing: 'border-box', transition: 'border .2s',
                      }} onFocus={(e) => (e.currentTarget.style.borderColor = TEAL)} onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')} />
                    </div>
                    <button type="submit" style={{
                      width: '100%', padding: '14px 32px', fontFamily: SANS, fontSize: 15, fontWeight: 600,
                      background: TEAL, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'background .3s',
                    }} onMouseEnter={(e) => { e.currentTarget.style.background = NAVY; }} onMouseLeave={(e) => { e.currentTarget.style.background = TEAL; }}>
                      Send Message →
                    </button>
                  </>
                )}
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: NAVY, color: '#fff', padding: '72px 0 36px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 36px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 72, borderBottom: 'rgba(255,255,255,0.07)', borderBottomWidth: 1, borderBottomStyle: 'solid', paddingBottom: 52, marginBottom: 28 }} className="grid-cols-1 md:grid-cols-3">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <CrossIcon size={16} color={TEAL} />
                <span style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 700 }}>{name}</span>
              </div>
              <p style={{ fontFamily: SANS, fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6, maxWidth: 280 }}>{headline}</p>
            </div>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: TEAL, marginBottom: 16 }}>Navigation</div>
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} style={{ display: 'block', fontFamily: SANS, fontSize: 14, color: 'rgba(255,255,255,0.52)', textDecoration: 'none', marginBottom: 10, transition: 'color .2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)} onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.52)')}>
                  {l.label}
                </a>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: TEAL, marginBottom: 16 }}>Connect</div>
              {email && <a href={`mailto:${email}`} style={{ display: 'block', fontFamily: SANS, fontSize: 14, color: 'rgba(255,255,255,0.52)', textDecoration: 'none', marginBottom: 10 }}>Email ↗</a>}
              {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" style={{ display: 'block', fontFamily: SANS, fontSize: 14, color: 'rgba(255,255,255,0.52)', textDecoration: 'none', marginBottom: 10 }}>LinkedIn ↗</a>}
              {links.github && <a href={links.github} target="_blank" rel="noreferrer" style={{ display: 'block', fontFamily: SANS, fontSize: 14, color: 'rgba(255,255,255,0.52)', textDecoration: 'none', marginBottom: 10 }}>GitHub ↗</a>}
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ fontFamily: SANS, fontSize: 13, color: 'rgba(255,255,255,0.24)' }}>© {new Date().getFullYear()} {name}. All Rights Reserved.</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: MONO, fontSize: 11, color: 'rgba(255,255,255,0.18)' }}>
              <CrossIcon size={12} color="rgba(255,255,255,0.18)" /> Asclepius Theme
            </span>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        ::selection { background: rgba(8,145,178,0.2); color: #0a1628; }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
        @media (max-width: 768px) {
          section > div { padding-left: 24px !important; padding-right: 24px !important; }
        }

        @keyframes shimmer-sweep {
          0%   { background-position: -400% center; }
          100% { background-position: 400% center; }
        }
        @keyframes ekg-pulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.32; }
        }
        @keyframes available-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.45); }
          60%      { box-shadow: 0 0 0 9px rgba(16,185,129,0); }
        }
      `}</style>
    </div>
  );
};
