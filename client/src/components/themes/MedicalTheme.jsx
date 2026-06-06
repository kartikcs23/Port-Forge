import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectVisual } from './ProjectVisual';

/* ═══════════════════════════════════════════════════
   ASCLEPIUS — Medical Portfolio Theme
   Palette: Ice #F0F7FF | Navy #0a1628 | Teal #0891b2
            Green #10b981 | White #fff
═══════════════════════════════════════════════════ */

const NAVY  = '#0a1628';
const TEAL  = '#0891b2';
const GREEN = '#10b981';
const ICE   = '#F0F7FF';
const SLATE = '#64748b';
const SANS  = '"Inter", system-ui, sans-serif';
const SERIF = '"Playfair Display", Georgia, serif';
const MONO  = '"JetBrains Mono", monospace';

const useForm = () => {
  const [form, setForm] = useState({ name:'', email:'', message:'' });
  const [sent, setSent] = useState(false);
  const onChange = e => setForm(f => ({...f, [e.target.name]: e.target.value}));
  const onSubmit = e => { e.preventDefault(); setSent(true); setTimeout(()=>setSent(false),4000); setForm({name:'',email:'',message:''}); };
  return { form, sent, onChange, onSubmit };
};

const MedBadge = ({ children, color=TEAL }) => (
  <span style={{ display:'inline-block', padding:'4px 14px', borderRadius:999,
    background:`${color}12`, border:`1px solid ${color}30`, color,
    fontFamily:SANS, fontSize:12, fontWeight:600, letterSpacing:'0.02em' }}>
    {children}
  </span>
);

const Card = ({ children, style={}, onClick, layoutId }) => {
  const CardContainer = layoutId ? motion.div : 'div';
  return (
    <CardContainer
      layoutId={layoutId}
      onClick={onClick}
      style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:16,
        boxShadow:'0 4px 24px rgba(10,22,40,0.06)', padding:32,
        transition:'all 0.3s', ...style }}
      onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 12px 40px rgba(8,145,178,0.12)'; e.currentTarget.style.borderColor=TEAL; e.currentTarget.style.transform='translateY(-4px)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.boxShadow='0 4px 24px rgba(10,22,40,0.06)'; e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.transform='translateY(0)'; }}
    >
      {children}
    </CardContainer>
  );
};

const HR = ({ color=TEAL }) => (
  <div style={{ height:1, background:`linear-gradient(90deg,${color},${color}40,transparent)`, margin:'48px 0' }} />
);

const SectionTitle = ({ label, title, sub }) => (
  <div style={{ marginBottom:56 }}>
    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
      <div style={{ width:24, height:2, background:TEAL, borderRadius:2 }} />
      <span style={{ fontFamily:MONO, fontSize:11, fontWeight:700, letterSpacing:'0.45em', textTransform:'uppercase', color:TEAL }}>{label}</span>
    </div>
    <h2 style={{ fontFamily:SERIF, fontSize:'clamp(2rem,4vw,3.5rem)', fontWeight:700, color:NAVY, letterSpacing:'-0.02em', lineHeight:1, marginBottom:12 }}>{title}</h2>
    {sub && <p style={{ fontFamily:SANS, fontSize:16, color:SLATE, maxWidth:560 }}>{sub}</p>}
  </div>
);

const CrossIcon = ({ size=20, color=TEAL }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="9" y="2" width="6" height="20" rx="2" fill={color} />
    <rect x="2" y="9" width="20" height="6" rx="2" fill={color} />
  </svg>
);

export const MedicalTheme = ({ rootUser, profile, repos=[] }) => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
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
  const avatar     = profile?.avatarUrl  || profile?.avatar  || '';

  const langs = [...new Set(['ALL', ...repos.map(r => r.language).filter(Boolean).map(l => l.toUpperCase())])];
  const shown = activeFilter === 'ALL' ? repos : repos.filter(r => r.language?.toUpperCase() === activeFilter);

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navLinks = [
    { href:'#about', label:'About' },
    { href:'#research', label:'Research' },
    { href:'#specializations', label:'Skills' },
    { href:'#experience', label:'Experience' },
    { href:'#contact', label:'Contact' },
  ];

  const defaultSkills = ['Internal Medicine','Cardiology','Patient Care','Clinical Research','Pharmacology','Medical Ethics','Diagnostics','Emergency Medicine','Surgery','Pediatrics','Radiology','Neurology'];

  return (
    <div style={{ minHeight:'100vh', background:ICE, color:NAVY, fontFamily:SANS, overflowX:'hidden' }}>

      {/* ── BACKGROUNDS ── */}
      {/* Medical Biology Grid Background */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }}>
        <img src="/assets/themes/medical_bg.png" alt=""
             style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.35,
                      transform: `scale(1.02) translateY(${scrollY * 0.012}px)`, transition: 'transform 0.1s linear' }} />
      </div>

      {/* SVG Shape Morphing: Molecular Network Node Mesh */}
      <div style={{ position:'fixed', right:'5%', top:'20%', pointerEvents:'none', zIndex:1, opacity:0.18 }}>
        <svg width="400" height="400" viewBox="0 0 200 200">
          <g stroke={TEAL} strokeWidth="1">
            <line x1="40" y1="40" x2="100" y2="100">
              <animate attributeName="x1" dur="15s" repeatCount="indefinite" values="40;50;30;40" />
              <animate attributeName="y1" dur="15s" repeatCount="indefinite" values="40;30;50;40" />
            </line>
            <line x1="160" y1="40" x2="100" y2="100">
              <animate attributeName="x1" dur="15s" repeatCount="indefinite" values="160;150;170;160" />
              <animate attributeName="y1" dur="15s" repeatCount="indefinite" values="40;50;30;40" />
            </line>
            <line x1="100" y1="160" x2="100" y2="100">
              <animate attributeName="y1" dur="15s" repeatCount="indefinite" values="160;170;150;160" />
            </line>
          </g>
          <circle cx="40" cy="40" r="6" fill={TEAL}>
            <animate attributeName="cx" dur="15s" repeatCount="indefinite" values="40;50;30;40" />
            <animate attributeName="cy" dur="15s" repeatCount="indefinite" values="40;30;50;40" />
          </circle>
          <circle cx="160" cy="40" r="6" fill={GREEN}>
            <animate attributeName="cx" dur="15s" repeatCount="indefinite" values="160;150;170;160" />
            <animate attributeName="cy" dur="15s" repeatCount="indefinite" values="40;50;30;40" />
          </circle>
          <circle cx="100" cy="160" r="8" fill={TEAL}>
            <animate attributeName="cy" dur="15s" repeatCount="indefinite" values="160;170;150;160" />
          </circle>
          <circle cx="100" cy="100" r="10" fill={NAVY} />
        </svg>
      </div>

      {/* Top accent line */}
      <div style={{ position:'fixed', top:0, left:0, right:0, height:3,
        background:`linear-gradient(90deg,${TEAL},${GREEN},${TEAL})`,
        backgroundSize:'200% 100%', zIndex:100,
        animation:'shimmer-bar 4s linear infinite' }} />

      {/* ── NAV ── */}
      <nav style={{ position:'fixed', top:3, left:0, right:0, zIndex:50, transition:'all 0.3s',
        background: scrollY>60 ? 'rgba(240,247,255,0.95)' : 'transparent',
        backdropFilter: scrollY>60 ? 'blur(20px)' : 'none',
        borderBottom: scrollY>60 ? '1px solid rgba(8,145,178,0.1)' : 'none' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'16px 48px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <CrossIcon size={18} color={TEAL} />
            <span style={{ fontFamily:SERIF, fontSize:17, fontWeight:700, color:NAVY }}>
              {name.replace(/^Dr\.?\s*/i,'Dr. ')}
            </span>
          </div>
          <div style={{ display:'flex', gap:36, alignItems:'center' }} className="hidden md:flex">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} style={{ fontFamily:SANS, fontSize:13, fontWeight:500,
                color:SLATE, textDecoration:'none', transition:'color 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.color=TEAL}
                onMouseLeave={e=>e.currentTarget.style.color=SLATE}>
                {l.label}
              </a>
            ))}
            <a href="#contact" style={{ fontFamily:SANS, fontSize:13, fontWeight:600,
              padding:'10px 24px', background:TEAL, color:'#fff', textDecoration:'none',
              borderRadius:8, boxShadow:`0 4px 16px ${TEAL}40`, transition:'all 0.3s' }}
              onMouseEnter={e=>{ e.currentTarget.style.background=NAVY; }}
              onMouseLeave={e=>{ e.currentTarget.style.background=TEAL; }}>
              Book Consultation
            </a>
          </div>
          <button onClick={()=>setMenuOpen(!menuOpen)} className="md:hidden"
                  style={{ background:'none', border:`1px solid ${TEAL}40`, borderRadius:8, padding:'8px 10px', cursor:'pointer' }}>
            <div style={{ width:20, display:'flex', flexDirection:'column', gap:4 }}>
              {[0,1,2].map(i=><div key={i} style={{ height:2, background:NAVY, borderRadius:2,
                transform: menuOpen?(i===0?'rotate(45deg) translateY(6px)':i===2?'rotate(-45deg) translateY(-6px)':'none'):'none',
                opacity: menuOpen&&i===1?0:1, transition:'all 0.3s' }} />)}
            </div>
          </button>
        </div>
        {menuOpen && (
          <div style={{ background:'rgba(240,247,255,0.98)', borderTop:'1px solid rgba(8,145,178,0.1)', padding:'20px 48px' }}>
            {navLinks.map(l=>(
              <a key={l.href} href={l.href} onClick={()=>setMenuOpen(false)}
                 style={{ display:'block', fontFamily:SANS, fontSize:14, fontWeight:500,
                   color:SLATE, textDecoration:'none', marginBottom:14 }}>
                {l.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{ position:'relative', zIndex:10, minHeight:'100vh',
        display:'flex', alignItems:'center', padding:'120px 48px 80px', maxWidth:1200, margin:'0 auto' }}>
        <div style={{ width:'100%' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:80, alignItems:'center' }} className="grid-cols-1">

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              {/* Credential badge */}
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28 }}>
                <CrossIcon size={14} color={TEAL} />
                <MedBadge color={TEAL}>{headline}</MedBadge>
                {location && <MedBadge color={GREEN}>📍 {location}</MedBadge>}
              </div>

              {/* Name */}
              <h1 style={{ fontFamily:SERIF, fontSize:'clamp(3rem,8vw,7rem)', fontWeight:700,
                color:NAVY, lineHeight:0.9, letterSpacing:'-0.03em', marginBottom:32 }}>
                {name}
              </h1>

              {/* EKG line */}
              <div style={{ marginBottom:32, overflow:'hidden', height:48 }}>
                <svg viewBox="0 0 700 48" preserveAspectRatio="none" style={{ width:'100%', height:48 }}>
                  <polyline className="ekg-line"
                    points="0,24 60,24 80,24 90,4 100,44 110,8 120,36 130,24 200,24 260,24 280,24 290,8 300,40 310,10 320,34 330,24 400,24 460,24 480,24 490,8 500,40 510,10 520,34 530,24 700,24"
                    fill="none" stroke={TEAL} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Bio */}
              <p style={{ fontFamily:SANS, fontSize:'clamp(1rem,1.8vw,1.2rem)', color:SLATE,
                lineHeight:1.8, maxWidth:580, marginBottom:48 }}>
                {bio}
              </p>

              {/* CTAs */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:16, marginBottom:64 }}>
                <a href="#research" style={{ fontFamily:SANS, fontSize:14, fontWeight:600,
                  padding:'16px 36px', background:TEAL, color:'#fff', textDecoration:'none',
                  borderRadius:10, boxShadow:`0 8px 24px ${TEAL}40`, transition:'all 0.3s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 12px 32px ${TEAL}50`; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=`0 8px 24px ${TEAL}40`; }}>
                  View Research
                </a>
                <a href="#contact" style={{ fontFamily:SANS, fontSize:14, fontWeight:600,
                  padding:'16px 36px', background:'transparent', color:NAVY, textDecoration:'none',
                  borderRadius:10, border:`2px solid ${NAVY}20`, transition:'all 0.3s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor=TEAL; e.currentTarget.style.color=TEAL; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor=`${NAVY}20`; e.currentTarget.style.color=NAVY; }}>
                  Contact Me
                </a>
              </div>

              {/* Stats */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:0, paddingTop:32,
                borderTop:`1px solid rgba(10,22,40,0.08)` }}>
                {[
                  { v:repos.length,      l:'Publications',    c:TEAL  },
                  { v:skills.length,     l:'Specializations', c:GREEN },
                  { v:experience.length, l:'Clinical Roles',  c:NAVY  },
                  { v:education.length,  l:'Degrees',         c:SLATE },
                ].map((s,i) => (
                  <div key={s.l} style={{ paddingRight:40, marginRight:40,
                    borderRight:i<3?`1px solid rgba(10,22,40,0.08)`:'none' }}>
                    <div style={{ fontFamily:SERIF, fontSize:'2.5rem', fontWeight:700, color:s.c, lineHeight:1 }}>{s.v}+</div>
                    <div style={{ fontFamily:SANS, fontSize:11, color:SLATE, letterSpacing:'0.05em', textTransform:'uppercase', marginTop:4 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Avatar */}
            {avatar && (
              <div style={{ flexShrink:0 }} className="hidden lg:block">
                <div style={{ position:'relative' }}>
                  <div style={{ width:280, height:320, borderRadius:24, overflow:'hidden',
                    border:`3px solid ${TEAL}30`, boxShadow:`0 24px 64px rgba(8,145,178,0.2)` }}>
                    <img src={avatar} alt={name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </div>
                  <div style={{ position:'absolute', bottom:-16, right:-16, background:'#fff',
                    borderRadius:12, padding:'12px 18px', boxShadow:'0 8px 24px rgba(10,22,40,0.12)',
                    border:`1px solid ${TEAL}20` }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <CrossIcon size={16} color={GREEN} />
                      <span style={{ fontFamily:SANS, fontSize:12, fontWeight:600, color:GREEN }}>Available</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── ABOUT — Clean vertical swipe entry ── */}
      <motion.section 
        id="about" 
        style={{ position:'relative', zIndex:10, padding:'100px 48px',
          background:'#fff', borderTop:'1px solid rgba(8,145,178,0.08)', borderBottom:'1px solid rgba(8,145,178,0.08)' }}
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <SectionTitle label="01 // Profile" title="About Me" sub="Background, philosophy & mission" />
          <div style={{ display:'grid', gridTemplateColumns:'1.2fr 0.8fr', gap:64 }} className="grid-cols-1 md:grid-cols-2">
            <div>
              <p style={{ fontSize:17, lineHeight:1.9, color:SLATE, marginBottom:32 }}>{intro}</p>
              {location && (
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20, fontFamily:SANS, fontSize:14, color:SLATE }}>
                  <span>📍</span><span>{location}</span>
                </div>
              )}
              {email && (
                <a href={`mailto:${email}`} style={{ display:'flex', alignItems:'center', gap:10,
                  fontFamily:SANS, fontSize:14, color:TEAL, textDecoration:'none', marginBottom:10 }}>
                  <span>✉️</span><span>{email}</span>
                </a>
              )}
            </div>
            <div>
              {education.length > 0 && (
                <div>
                  <div style={{ fontFamily:MONO, fontSize:10, color:TEAL, letterSpacing:'0.5em', textTransform:'uppercase', marginBottom:20 }}>Education</div>
                  {education.map((edu, i) => (
                    <div key={i} style={{ display:'flex', gap:16, marginBottom:24, paddingBottom:24,
                      borderBottom:i<education.length-1?'1px solid #f1f5f9':'none' }}>
                      <div style={{ width:40, height:40, borderRadius:10, background:`${TEAL}12`,
                        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <CrossIcon size={16} color={TEAL} />
                      </div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:15, color:NAVY, marginBottom:4 }}>
                          {edu.degree}{edu.field ? ` — ${edu.field}` : ''}
                        </div>
                        <div style={{ fontSize:13, color:SLATE }}>{edu.institution}</div>
                        {edu.year && <div style={{ fontSize:11, color:TEAL, fontFamily:MONO, marginTop:4 }}>{edu.year}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── RESEARCH / PROJECTS — Vertical swipe & Zoom Match Cut ── */}
      <motion.section 
        id="research" 
        style={{ position:'relative', zIndex:10, padding:'100px 48px', maxWidth:1200, margin:'0 auto' }}
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <SectionTitle label="02 // Research" title="Publications & Projects" sub="Evidence-based contributions to medical science (Click card to expand)" />

        {langs.length > 1 && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:40 }}>
            {langs.map(t => (
              <button key={t} onClick={() => setActiveFilter(t)}
                      style={{ fontFamily:SANS, fontSize:12, fontWeight:600, letterSpacing:'0.05em',
                        padding:'7px 20px', borderRadius:999, cursor:'pointer', transition:'all 0.25s',
                        background: activeFilter===t ? TEAL : '#fff',
                        color: activeFilter===t ? '#fff' : SLATE,
                        border: `1px solid ${activeFilter===t ? TEAL : '#e2e8f0'}`,
                        boxShadow: activeFilter===t ? `0 4px 12px ${TEAL}30` : 'none' }}>
                {t}
              </button>
            ))}
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px, 1fr))', gap:24 }}>
          {shown.map(repo => (
            <Card 
              key={repo._id}
              layoutId={`medical-project-${repo._id}`}
              onClick={() => setSelectedProject(repo)}
              style={{ cursor:'pointer' }}
            >
              <div style={{ marginBottom: 24 }}>
                <ProjectVisual repo={repo} theme="medical" compact />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                <MedBadge color={TEAL}>{repo.language || 'Research'}</MedBadge>
                <span style={{ fontFamily:MONO, fontSize:11, color:SLATE }}>★ {repo.stars||0}</span>
              </div>
              <h3 style={{ fontFamily:SERIF, fontSize:20, fontWeight:700, color:NAVY,
                marginBottom:10, lineHeight:1.3 }}>{repo.name}</h3>
              <p style={{ fontFamily:SANS, fontSize:14, lineHeight:1.7, color:SLATE, marginBottom:20 }} className="line-clamp-3">
                {repo.description || 'A rigorous study contributing to evidence-based medical practice and clinical outcomes.'}
              </p>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                paddingTop:16, borderTop:'1px solid #f1f5f9' }}>
                <span style={{ fontFamily:SANS, fontSize:12, fontWeight:600, color:TEAL }}>
                  Read Details →
                </span>
              </div>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* MEDICAL DETAILS ZOOM OVERLAY */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(10,22,40,0.6)', backdropFilter: 'blur(10px)' }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              layoutId={`medical-project-${selectedProject._id}`}
              style={{ background: '#fff', maxWidth: 650, width: '100%', padding: 48, borderRadius: 20, border: `1px solid #e2e8f0`, boxShadow: '0 30px 90px rgba(10,22,40,0.2)', position: 'relative' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <MedBadge color={TEAL}>{selectedProject.language || 'Research'}</MedBadge>
                <button 
                  onClick={() => setSelectedProject(null)}
                  style={{ background: 'none', border: `1px solid ${TEAL}40`, borderRadius: 8, fontFamily: SANS, fontSize: 11, fontWeight: 600, padding: '6px 16px', color: TEAL, cursor: 'pointer' }}
                >
                  Close [X]
                </button>
              </div>
              
              <h3 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 700, color: NAVY, marginBottom: 20, lineHeight: 1.2 }}>
                {selectedProject.name}
              </h3>
              
              <HR />
              
              <p style={{ fontFamily: SANS, fontSize: 16, lineHeight: 1.8, color: SLATE, marginBottom: 32 }}>
                {selectedProject.description || 'A rigorous study contributing to evidence-based medical practice and clinical outcomes.'}
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, padding: 24, background: ICE, borderRadius: 12, marginBottom: 32 }}>
                <div>
                  <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', color: SLATE }}>STARS</span>
                  <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 700, color: TEAL, marginTop: 4 }}>★ {selectedProject.stars || 0}</div>
                </div>
                <div>
                  <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', color: SLATE }}>FORKS</span>
                  <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 700, color: GREEN, marginTop: 4 }}>⑂ {selectedProject.forks || 0}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {selectedProject.repoUrl && (
                  <a 
                    href={selectedProject.repoUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ padding: '16px 36px', background: TEAL, color: '#fff', fontFamily: SANS, fontSize: 13, fontWeight: 600, borderRadius: 10, textDecoration: 'none', boxShadow: `0 8px 20px ${TEAL}30` }}
                  >
                    View Publication Source ↗
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SPECIALIZATIONS — Vertical swipe reveal ── */}
      <motion.section 
        id="specializations" 
        style={{ position:'relative', zIndex:10, padding:'100px 48px',
          background:'#fff', borderTop:'1px solid rgba(8,145,178,0.08)', borderBottom:'1px solid rgba(8,145,178,0.08)' }}
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <SectionTitle label="03 // Skills" title="Specializations" sub="Clinical expertise & technical competencies" />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }} className="grid-cols-1 md:grid-cols-3">
            {[
              { label:'Clinical Skills', icon:'🩺', color:TEAL,   items: (skills.length>0 ? skills.slice(0, Math.ceil(skills.length/3)) : defaultSkills.slice(0,4)) },
              { label:'Research',        icon:'🔬', color:GREEN,  items: (skills.length>0 ? skills.slice(Math.ceil(skills.length/3), Math.ceil(2*skills.length/3)) : defaultSkills.slice(4,8)) },
              { label:'Tools & Tech',    icon:'💊', color:NAVY,   items: (skills.length>0 ? skills.slice(Math.ceil(2*skills.length/3)) : defaultSkills.slice(8,12)) },
            ].map(cat => (
              <Card key={cat.label} style={{ padding:0, overflow:'hidden' }}>
                <div style={{ padding:'20px 24px', background:`${cat.color}08`,
                  borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:20 }}>{cat.icon}</span>
                  <span style={{ fontFamily:SANS, fontWeight:700, fontSize:14, color:cat.color }}>{cat.label}</span>
                </div>
                <div style={{ padding:24 }}>
                  {cat.items.map((sk, i) => (
                    <div key={sk} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:cat.color, flexShrink:0 }} />
                      <span style={{ fontFamily:SANS, fontSize:14, color:NAVY, flex:1 }}>{sk}</span>
                      <div style={{ display:'flex', gap:2 }}>
                        {Array.from({length:5}).map((_,j) => (
                          <div key={j} style={{ width:12, height:4, borderRadius:2,
                            background: j < Math.max(3, 5-i) ? cat.color : '#e2e8f0' }} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── EXPERIENCE — Vertical swipe reveal ── */}
      {experience.length > 0 && (
        <motion.section 
          id="experience" 
          style={{ position:'relative', zIndex:10, padding:'100px 48px', maxWidth:1200, margin:'0 auto' }}
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <SectionTitle label="04 // Experience" title="Clinical Experience" sub="Professional journey in medicine" />
          <div style={{ position:'relative', paddingLeft:32 }}>
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:2,
              background:`linear-gradient(${TEAL},${GREEN})`, borderRadius:2 }} />
            {experience.map((exp, i) => (
              <div key={i} style={{ position:'relative', marginBottom:48 }}>
                <div style={{ position:'absolute', left:-42, top:6, width:20, height:20,
                  borderRadius:'50%', background:'#fff', border:`3px solid ${TEAL}`,
                  boxShadow:`0 0 0 4px ${TEAL}20` }}>
                  <div style={{ position:'absolute', inset:3, borderRadius:'50%', background:TEAL }} />
                </div>
                <Card style={{ marginLeft:24 }}>
                  <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', gap:12, marginBottom:12 }}>
                    <div>
                      <h3 style={{ fontFamily:SERIF, fontSize:22, fontWeight:700, color:NAVY, marginBottom:4 }}>{exp.role}</h3>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <CrossIcon size={12} color={GREEN} />
                        <span style={{ fontFamily:SANS, fontSize:13, fontWeight:600, color:GREEN }}>{exp.company}</span>
                      </div>
                    </div>
                    <MedBadge color={TEAL}>{exp.startDate} — {exp.endDate || 'Present'}</MedBadge>
                  </div>
                  {exp.description && (
                    <p style={{ fontFamily:SANS, fontSize:14, lineHeight:1.7, color:SLATE }}>{exp.description}</p>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── CTA — Vertical swipe reveal ── */}
      <motion.section 
        style={{ position:'relative', zIndex:10, padding:'60px 48px',
          background:`linear-gradient(135deg,${NAVY},#132040)` }}
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', flexWrap:'wrap',
          alignItems:'center', justifyContent:'space-between', gap:32 }}>
          <div>
            <div style={{ fontFamily:MONO, fontSize:11, color:TEAL, letterSpacing:'0.4em', textTransform:'uppercase', marginBottom:8 }}>Credentials</div>
            <h2 style={{ fontFamily:SERIF, fontSize:'clamp(1.8rem,4vw,3rem)', fontWeight:700, color:'#fff' }}>Download CV / Resume</h2>
          </div>
          <a href="/resume.pdf" download
             style={{ fontFamily:SANS, fontSize:14, fontWeight:600, padding:'18px 48px',
               background:TEAL, color:'#fff', textDecoration:'none', borderRadius:10,
               boxShadow:`0 8px 24px ${TEAL}50`, transition:'all 0.3s', display:'flex', alignItems:'center', gap:12 }}
             onMouseEnter={e=>{ e.currentTarget.style.background=GREEN; e.currentTarget.style.boxShadow=`0 8px 24px ${GREEN}50`; }}
             onMouseLeave={e=>{ e.currentTarget.style.background=TEAL; e.currentTarget.style.boxShadow=`0 8px 24px ${TEAL}50`; }}>
            ↓ Download PDF
          </a>
        </div>
      </motion.section>

      {/* ── CONTACT — Vertical swipe reveal ── */}
      <motion.section 
        id="contact" 
        style={{ position:'relative', zIndex:10, padding:'100px 48px',
          background:'#fff', borderTop:'1px solid rgba(8,145,178,0.08)' }}
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <SectionTitle label="06 // Contact" title="Get In Touch" sub="Available for consultations, collaborations & speaking engagements" />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:64 }} className="grid-cols-1 md:grid-cols-2">
            <div>
              <p style={{ fontSize:17, lineHeight:1.9, color:SLATE, marginBottom:40 }}>
                Whether you're seeking a consultation, collaboration on research, or a keynote speaker — I'd love to connect.
              </p>
              {[
                email && { icon:'✉️', label:'Email', value:email, href:`mailto:${email}`, c:TEAL },
                links.linkedin && { icon:'🔗', label:'LinkedIn', value:'View Profile', href:links.linkedin, c:NAVY },
                links.github && { icon:'📁', label:'GitHub', value:'View Publications', href:links.github, c:GREEN },
              ].filter(Boolean).map(item => (
                <a key={item.label} href={item.href} target={item.label!=='Email'?'_blank':undefined} rel="noreferrer"
                   style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 20px',
                     marginBottom:8, borderRadius:12, border:'1px solid transparent',
                     textDecoration:'none', transition:'all 0.3s' }}
                   onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${item.c}30`; e.currentTarget.style.background=`${item.c}06`; }}
                   onMouseLeave={e=>{ e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.background='transparent'; }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:`${item.c}10`,
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily:SANS, fontSize:11, color:SLATE, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:2 }}>{item.label}</div>
                    <div style={{ fontFamily:SANS, fontSize:14, fontWeight:600, color:item.c }}>{item.value}</div>
                  </div>
                </a>
              ))}
            </div>

            <form onSubmit={onSubmit}>
              {sent && (
                <div style={{ padding:'12px 20px', marginBottom:20, borderRadius:10, fontFamily:SANS,
                  fontSize:13, fontWeight:600, textAlign:'center', color:GREEN,
                  border:`1px solid ${GREEN}40`, background:`${GREEN}08` }}>
                  Message sent successfully ✓
                </div>
              )}
              {[{name:'name',label:'Full Name',type:'text',ph:'Dr. Your Name'},{name:'email',label:'Email Address',type:'email',ph:'doctor@hospital.com'}].map(f=>(
                <div key={f.name} style={{ marginBottom:20 }}>
                  <label style={{ display:'block', fontFamily:SANS, fontSize:11, fontWeight:600,
                    color:SLATE, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:8 }}>{f.label}</label>
                  <input name={f.name} type={f.type} value={form[f.name]} onChange={onChange} required placeholder={f.ph}
                         style={{ width:'100%', padding:'14px 18px', fontFamily:SANS, fontSize:14,
                           background:ICE, border:`1.5px solid #e2e8f0`, borderRadius:10,
                           color:NAVY, outline:'none', transition:'border 0.2s', boxSizing:'border-box' }}
                         onFocus={e=>e.currentTarget.style.borderColor=TEAL}
                         onBlur={e=>e.currentTarget.style.borderColor='#e2e8f0'} />
                </div>
              ))}
              <div style={{ marginBottom:28 }}>
                <label style={{ display:'block', fontFamily:SANS, fontSize:11, fontWeight:600,
                  color:SLATE, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:8 }}>Message</label>
                <textarea name="message" value={form.message} onChange={onChange} required rows={6} placeholder="Your message..."
                          style={{ width:'100%', padding:'14px 18px', fontFamily:SANS, fontSize:14,
                            background:ICE, border:`1.5px solid #e2e8f0`, borderRadius:10,
                            color:NAVY, outline:'none', resize:'none', transition:'border 0.2s', boxSizing:'border-box' }}
                          onFocus={e=>e.currentTarget.style.borderColor=TEAL}
                          onBlur={e=>e.currentTarget.style.borderColor='#e2e8f0'} />
              </div>
              <button type="submit" style={{ width:'100%', padding:'16px', fontFamily:SANS, fontSize:14,
                fontWeight:600, background:TEAL, color:'#fff', border:'none', borderRadius:10,
                cursor:'pointer', boxShadow:`0 8px 24px ${TEAL}40`, transition:'all 0.3s' }}
                onMouseEnter={e=>{ e.currentTarget.style.background=NAVY; }}
                onMouseLeave={e=>{ e.currentTarget.style.background=TEAL; }}>
                Send Message →
              </button>
            </form>
          </div>
        </div>
      </motion.section>

      {/* ── FOOTER ── */}
      <footer style={{ position:'relative', zIndex:10, background:NAVY, color:'#fff', padding:'56px 48px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:48, marginBottom:48 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                <CrossIcon size={16} color={TEAL} />
                <span style={{ fontFamily:SERIF, fontSize:16, fontWeight:700 }}>{name}</span>
              </div>
              <p style={{ fontFamily:SANS, fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:1.6 }}>{headline}</p>
            </div>
            <div>
              <div style={{ fontFamily:MONO, fontSize:9, letterSpacing:'0.5em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginBottom:16 }}>Navigate</div>
              {navLinks.map(l => (
                <a key={l.href} href={l.href} style={{ display:'block', fontFamily:SANS, fontSize:13,
                  color:'rgba(255,255,255,0.4)', textDecoration:'none', marginBottom:10, transition:'color 0.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.color=TEAL}
                  onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.4)'}>{l.label}</a>
              ))}
            </div>
            <div>
              <div style={{ fontFamily:MONO, fontSize:9, letterSpacing:'0.5em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginBottom:16 }}>Connect</div>
              {links.github&&<a href={links.github} target="_blank" rel="noreferrer" style={{ display:'block', fontFamily:SANS, fontSize:13, color:'rgba(255,255,255,0.4)', textDecoration:'none', marginBottom:10, transition:'color 0.2s' }} onMouseEnter={e=>e.currentTarget.style.color=TEAL} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.4)'}>GitHub ↗</a>}
              {links.linkedin&&<a href={links.linkedin} target="_blank" rel="noreferrer" style={{ display:'block', fontFamily:SANS, fontSize:13, color:'rgba(255,255,255,0.4)', textDecoration:'none', marginBottom:10, transition:'color 0.2s' }} onMouseEnter={e=>e.currentTarget.style.color=GREEN} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.4)'}>LinkedIn ↗</a>}
            </div>
          </div>
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:24,
            display:'flex', flexWrap:'wrap', justifyContent:'space-between', gap:12 }}>
            <span style={{ fontFamily:SANS, fontSize:12, color:'rgba(255,255,255,0.25)' }}>
              © {new Date().getFullYear()} {name}. All Rights Reserved.
            </span>
            <span style={{ fontFamily:SANS, fontSize:12, color:'rgba(255,255,255,0.25)' }}>
              PortForge · Asclepius Theme
            </span>
          </div>
        </div>
      </footer>

      <style>{`
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        ::selection { background: rgba(8,145,178,0.2); color: #0a1628; }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
        @media (max-width: 768px) {
          section { padding-left: 24px !important; padding-right: 24px !important; }
        }

        /* ── Shimmer accent bar ── */
        @keyframes shimmer-bar {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── EKG heartbeat line ── */
        .ekg-line {
          stroke-dasharray: 1200;
          stroke-dashoffset: 1200;
          animation: ekg-draw 2.5s ease forwards, ekg-pulse 4s ease-in-out 2.5s infinite;
        }
        @keyframes ekg-draw {
          from { stroke-dashoffset: 1200; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes ekg-pulse {
          0%,100% { opacity: 1; }
          50%     { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};
