import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Mail, GitBranch } from 'lucide-react';
import { ProjectVisual } from './ProjectVisual';

/* ═══════════════════════════════════════════════════════
   TOKYO THEME — Neon Cyberpunk Portfolio (Blue Edition)
   Palette: Deep slate #020617 | Electric Blue (Accent) |
            Cyan (Highlights) | Soft Blue (Secondary)
 ═══════════════════════════════════════════════════════ */

const ACCENT = 'hsl(221, 83%, 53%)'; // The user's Blue
const SECONDARY = 'hsl(217, 91%, 60%)';
const HIGHLIGHT = 'hsl(199, 89%, 48%)';
const VOID   = '#020617';
const VOID2  = '#0b1121';
const SANS   = '"DM Sans", system-ui, sans-serif';
const MONO   = '"JetBrains Mono", "Fira Code", monospace';

/* ── Skill helpers ── */
const FE = ['react','vue','angular','html','css','tailwind','typescript','javascript','next','svelte','redux'];
const BE = ['node','express','django','flask','python','java','mongodb','postgres','mysql','redis','graphql','jwt','prisma'];
const TL = ['git','docker','aws','gcp','linux','figma','postman','ci','vercel','netlify','vite','webpack'];

const categorize = (skills = []) => {
  const fe=[],be=[],tl=[],other=[];
  skills.forEach(s => {
    const l=s.toLowerCase();
    if(FE.some(k=>l.includes(k))) fe.push(s);
    else if(BE.some(k=>l.includes(k))) be.push(s);
    else if(TL.some(k=>l.includes(k))) tl.push(s);
    else other.push(s);
  });
  return { fe, be, tl:[...tl,...other] };
};

const getTechTags = (repos=[]) => {
  const s=new Set(['ALL']); repos.forEach(r=>{ if(r.language) s.add(r.language.toUpperCase()); }); return [...s];
};

const useForm = () => {
  const [form,setForm]=useState({name:'',email:'',message:''});
  const [sent,setSent]=useState(false);
  const onChange=e=>setForm(f=>({...f,[e.target.name]:e.target.value}));
  const onSubmit=e=>{e.preventDefault();setSent(true);setTimeout(()=>setSent(false),4000);setForm({name:'',email:'',message:''});};
  return {form,sent,onChange,onSubmit};
};

/* ── Sub-components ── */
const NeonTag = ({ children, color=HIGHLIGHT }) => (
  <span style={{ fontFamily:MONO, fontSize:10, fontWeight:700, letterSpacing:'0.4em', textTransform:'uppercase',
    padding:'4px 12px', border:`1px solid ${color}`, color, background: `${color}15`, backdropFilter:'blur(4px)' }}>
    {children}
  </span>
);

const GlowLine = ({ color=HIGHLIGHT, className='' }) => (
  <div className={className} style={{ height:1, background:`linear-gradient(90deg, transparent, ${color}60, transparent)` }} />
);

const NeonCard = ({ children, className='', style={}, color=HIGHLIGHT, onClick, layoutId }) => {
  const CardContainer = layoutId ? motion.div : 'div';
  return (
    <CardContainer
      layoutId={layoutId}
      onClick={onClick}
      className={`group relative transition-all duration-400 ${className}`}
      style={{ background:'rgba(255,255,255,0.03)', border:`1px solid rgba(255,255,255,0.1)`,
               backdropFilter:'blur(12px)', position:'relative', overflow:'hidden', ...style }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
           style={{ background:`radial-gradient(circle at 0 0, ${color}08, transparent 60%)` }} />
      {/* corner accents */}
      {['top-0 left-0 border-t border-l','top-0 right-0 border-t border-r','bottom-0 left-0 border-b border-l','bottom-0 right-0 border-b border-r'].map((c,i)=>(
        <div key={i} className={`absolute w-3 h-3 transition-all duration-500 ${c}`}
             style={{ borderColor:`${color}40` }} />
      ))}
      {children}
    </CardContainer>
  );
};

const SectionHead = ({ tag, title, sub, color=HIGHLIGHT }) => (
  <div style={{ marginBottom:72 }}>
    <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
      <div style={{ width:32, height:1, background:color }} />
      <NeonTag color={color}>{tag}</NeonTag>
    </div>
    <h2 style={{ fontFamily:SANS, fontSize:'clamp(2.5rem,5vw,5.5rem)', fontWeight:900,
      letterSpacing:'-0.04em', color:'#fff', lineHeight:0.9, marginBottom:20 }}>
      {title}
    </h2>
    {sub && <p style={{ fontFamily:MONO, fontSize:13, color:'rgba(255,255,255,0.6)', letterSpacing:'0.05em' }}>{sub}</p>}
    <GlowLine color={color} className="mt-8" />
  </div>
);

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT
 ═══════════════════════════════════════════════════════ */
export const TokyoTheme = ({ rootUser, profile, repos=[] }) => {
  const [filter,setFilter]=useState('ALL');
  const [menuOpen,setMenuOpen]=useState(false);
  const [scrollY,setScrollY]=useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const {form,sent,onChange,onSubmit}=useForm();

  const name      = profile?.name      || rootUser?.name   || 'Developer';
  const headline  = profile?.headline  || 'Full-Stack Developer';
  const bio       = profile?.bio       || 'Engineering pixel-perfect interfaces and bulletproof backends. Obsessed with performance, design, and clean code.';
  const intro     = profile?.intro     || bio;
  const email     = profile?.email     || rootUser?.email  || '';
  const location  = profile?.location  || '';
  const skills    = profile?.skills    || [];
  const experience= profile?.experience|| [];
  const education = profile?.education || [];
  const links     = profile?.links     || {};
  const avatar    = profile?.avatarUrl || profile?.avatar  || '';

  const cat   = categorize(skills);
  const tags  = getTechTags(repos);
  const shown = filter==='ALL' ? repos : repos.filter(r=>r.language?.toUpperCase()===filter);

  useEffect(()=>{ const fn=()=>setScrollY(window.scrollY); window.addEventListener('scroll',fn,{passive:true}); return()=>window.removeEventListener('scroll',fn); },[]);

  const navLinks=[
    {href:'#about',label:'About'},{href:'#projects',label:'Projects'},
    {href:'#skills',label:'Skills'},{href:'#experience',label:'Experience'},
    {href:'#contact',label:'Contact'},
  ];

  return (
    <div style={{ minHeight:'100vh', background:VOID, color:'#fff', fontFamily:SANS, overflowX:'hidden' }}>

      {/* ── BACKGROUNDS ── */}
      {/* City Street Overlay Asset */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }}>
        <img src="/assets/themes/tokyo_bg.png" alt=""
             style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.18,
                      transform: `scale(1.02) translateY(${scrollY * 0.012}px)`, transition: 'transform 0.1s linear' }} />
      </div>

      {/* Grid */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', opacity:0.04,
        backgroundImage:`linear-gradient(${HIGHLIGHT}80 1px,transparent 1px),linear-gradient(90deg,${HIGHLIGHT}80 1px,transparent 1px)`,
        backgroundSize:'60px 60px' }} />

      {/* Glow blobs */}
      <div style={{ position:'fixed', top:'-20%', left:'-10%', width:600, height:600, borderRadius:'50%',
        background:SECONDARY, opacity:0.1, filter:'blur(120px)', zIndex:0, pointerEvents:'none' }} />
      <div style={{ position:'fixed', bottom:'-20%', right:'-10%', width:700, height:700, borderRadius:'50%',
        background:ACCENT, opacity:0.08, filter:'blur(150px)', zIndex:0, pointerEvents:'none' }} />

      {/* SVG Shape Morphing: Digital Cyberpunk Polygon Matrix */}
      <div style={{ position:'fixed', left:'10%', bottom:'10%', pointerEvents:'none', zIndex:1, opacity:0.15 }}>
        <svg width="400" height="400" viewBox="0 0 100 100">
          <polygon points="50,15 90,35 90,75 50,95 10,75 10,35" fill="none" stroke={HIGHLIGHT} strokeWidth="0.5">
            <animate
              attributeName="points"
              dur="12s"
              repeatCount="indefinite"
              values="
                50,15 90,35 90,75 50,95 10,75 10,35;
                50,25 85,30 95,70 50,85 5,70 15,30;
                50,5 95,45 80,80 50,90 20,80 5,45;
                50,15 90,35 90,75 50,95 10,75 10,35
              "
            />
          </polygon>
        </svg>
      </div>

      {/* Scanlines */}
      <div style={{ position:'fixed', inset:0, zIndex:1, pointerEvents:'none', opacity:0.02,
        backgroundImage:'linear-gradient(transparent 50%,rgba(0,0,0,0.5) 50%)', backgroundSize:'100% 4px' }} />
      <div className="grid-scan" />

      {/* ── NAV ── */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:50, transition:'all 0.3s',
        background: scrollY>60 ? 'rgba(2,6,23,0.95)' : 'transparent',
        backdropFilter: scrollY>60 ? 'blur(24px)' : 'none',
        borderBottom: scrollY>60 ? `1px solid ${ACCENT}20` : 'none' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'18px 48px', display:'flex', alignItems:'center', justifyBetween:'space-between' }}>
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:10, height:10, background:ACCENT, clipPath:'polygon(50% 0%,100% 50%,50% 100%,0% 50%)',
              boxShadow:`0 0 16px ${ACCENT}` }} />
            <span style={{ fontFamily:MONO, fontSize:11, fontWeight:700, letterSpacing:'0.5em', textTransform:'uppercase' }}>
              {name.split(' ')[0]}<span style={{color:ACCENT}}>_</span>folio
            </span>
          </div>

          {/* Desktop links */}
          <div style={{ display:'flex', gap:40, alignItems:'center' }} className="hidden md:flex">
            {navLinks.map(l=>(
              <a key={l.href} href={l.href} style={{ fontFamily:MONO, fontSize:11, fontWeight:700, letterSpacing:'0.3em',
                textTransform:'uppercase', color:'rgba(255,255,255,0.45)', textDecoration:'none', transition:'color 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.color=ACCENT}
                onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.45)'}>
                {l.label}
              </a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button onClick={()=>setMenuOpen(!menuOpen)} className="md:hidden"
                  style={{ background:'none', border:`1px solid ${ACCENT}40`, padding:'8px 10px', cursor:'pointer', color:'#fff' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {menuOpen&&(
          <div style={{ background:VOID, borderTop:`1px solid ${ACCENT}20`, padding:'24px 48px' }}>
            {navLinks.map(l=>(
              <a key={l.href} href={l.href} onClick={()=>setMenuOpen(false)}
                 style={{ display:'block', fontFamily:MONO, fontSize:12, fontWeight:700, letterSpacing:'0.3em',
                   textTransform:'uppercase', color:'rgba(255,255,255,0.6)', textDecoration:'none', marginBottom:16 }}>
                {l.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{ position:'relative', zIndex:10, minHeight:'100vh', display:'flex',
        alignItems:'center', padding:'120px 48px 80px', maxWidth:1280, margin:'0 auto' }}>
        <div style={{ width:'100%' }}>
          {/* Eyebrow */}
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:32 }}>
            <div style={{ width:40, height:1, background:ACCENT }} />
            <NeonTag color={ACCENT}>{headline}</NeonTag>
          </div>

          {/* Name — glitch */}
          <h1 className="tokyo-glitch" data-text={name}
              style={{ fontFamily:SANS, fontWeight:900, letterSpacing:'-0.05em',
            fontSize:'clamp(4rem,13vw,11rem)', lineHeight:0.85, color:'#fff', marginBottom:40,
            textShadow:`0 0 60px ${ACCENT}20` }}>
            {name}
          </h1>

          {/* Bio */}
          <div style={{ maxWidth:640, borderLeft:`3px solid ${ACCENT}`, paddingLeft:32, marginBottom:56 }}>
            <p style={{ fontFamily:SANS, fontSize:'clamp(1rem,2vw,1.4rem)', lineHeight:1.6, color:'rgba(255,255,255,0.9)' }}>
              {bio}
            </p>
          </div>

          {/* CTAs */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:16, marginBottom:80 }}>
            <a href="#projects" className="neon-flicker"
               style={{ fontFamily:MONO, fontSize:12, fontWeight:700, letterSpacing:'0.35em',
              textTransform:'uppercase', padding:'16px 40px', background:ACCENT, color:'#fff', textDecoration:'none',
              boxShadow:`0 0 30px ${ACCENT}40`, transition:'all 0.3s', display:'flex', alignItems:'center', gap:10 }}
               onMouseEnter={e=>{ e.currentTarget.style.background=SECONDARY; e.currentTarget.style.boxShadow=`0 0 30px ${SECONDARY}50`; }}
               onMouseLeave={e=>{ e.currentTarget.style.background=ACCENT; e.currentTarget.style.boxShadow=`0 0 30px ${ACCENT}40`; }}>
              View Projects →
            </a>
            <a href="#contact" style={{ fontFamily:MONO, fontSize:12, fontWeight:700, letterSpacing:'0.35em',
              textTransform:'uppercase', padding:'16px 40px', border:`1px solid rgba(255,255,255,0.2)`,
              color:'#fff', textDecoration:'none', transition:'all 0.3s', background:'transparent' }}
               onMouseEnter={e=>{ e.currentTarget.style.borderColor=HIGHLIGHT; e.currentTarget.style.color=HIGHLIGHT; e.currentTarget.style.boxShadow=`0 0 20px ${HIGHLIGHT}40`; }}
               onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,0.2)'; e.currentTarget.style.color='#fff'; e.currentTarget.style.boxShadow='none'; }}>
              Contact Me
            </a>
          </div>

          {/* Stats */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:0, borderTop:`1px solid rgba(255,255,255,0.06)`, paddingTop:40 }}>
            {[{v:repos.length,l:'Projects',c:ACCENT},{v:skills.length,l:'Skills',c:SECONDARY},{v:experience.length,l:'Experience',c:HIGHLIGHT}].map((s,i)=>(
              <div key={s.l} style={{ paddingRight:48, marginRight:48, borderRight:i<2?'1px solid rgba(255,255,255,0.06)':'none' }}>
                <div style={{ fontFamily:SANS, fontSize:'clamp(2rem,4vw,3.5rem)', fontWeight:900, color:s.c,
                  textShadow:`0 0 30px ${s.c}40`, lineHeight:1 }}>{s.v}+</div>
                <div style={{ fontFamily:MONO, fontSize:10, letterSpacing:'0.4em', textTransform:'uppercase', opacity:0.5, marginTop:6 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT — Fast horizontal swipe reveal ── */}
      <motion.section 
        id="about" 
        style={{ position:'relative', zIndex:10, padding:'120px 48px', maxWidth:1280, margin:'0 auto' }}
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <SectionHead tag="01 // About" title="Who I Am" sub="Background & Philosophy" color={HIGHLIGHT} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64 }} className="grid-cols-1 md:grid-cols-2">
          <div>
            <p style={{ fontSize:18, lineHeight:1.8, color:'rgba(255,255,255,0.75)', marginBottom:32 }}>{intro}</p>
            {location&&(
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:32 }}>
                <span style={{ fontSize:'18px' }}>📍</span>
                <span style={{ fontFamily:MONO, fontSize:11, letterSpacing:'0.35em', textTransform:'uppercase', color:ACCENT }}>{location}</span>
              </div>
            )}
            {education.map((edu,i)=>(
              <NeonCard key={i} style={{ padding:24, marginBottom:16 }} color={SECONDARY}>
                <div style={{ fontFamily:MONO, fontSize:10, color:SECONDARY, letterSpacing:'0.4em', textTransform:'uppercase', marginBottom:8 }}>{edu.year}</div>
                <div style={{ fontWeight:700, fontSize:17 }}>{edu.degree}{edu.field?` · ${edu.field}`:''}</div>
                <div style={{ fontSize:13, opacity:0.6, marginTop:4 }}>{edu.institution}</div>
              </NeonCard>
            ))}
          </div>
          <div>
            <div style={{ fontFamily:MONO, fontSize:10, letterSpacing:'0.5em', textTransform:'uppercase', opacity:0.4, marginBottom:24 }}>Specializations</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
              {(skills.length>0?skills.slice(0,20):['React','Node.js','TypeScript','AWS','Docker']).map(s=>(
                <span key={s} style={{ fontFamily:MONO, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase',
                  padding:'8px 16px', border:`1px solid ${ACCENT}40`, color:ACCENT, background:`${ACCENT}08`,
                  cursor:'default', transition:'all 0.2s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.background=`${ACCENT}15`; e.currentTarget.style.boxShadow=`0 0 14px ${ACCENT}30`; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background=`${ACCENT}08`; e.currentTarget.style.boxShadow='none'; }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── PROJECTS — Fast horizontal swipe reveal & match cut zoom ── */}
      <motion.section 
        id="projects" 
        style={{ position:'relative', zIndex:10, padding:'120px 48px',
          background:'rgba(37,99,235,0.02)', borderTop:`1px solid rgba(255,255,255,0.04)`, borderBottom:`1px solid rgba(255,255,255,0.04)` }}
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <SectionHead tag="02 // Projects" title="Deployments" sub="Engineered Solutions (Click card to expand)" color={ACCENT} />

          {/* Filters */}
          {tags.length>1&&(
            <div style={{ display:'flex', flexWrap:'wrap', gap:12, marginBottom:48 }}>
              {tags.map(t=>(
                <button key={t} onClick={()=>setFilter(t)} style={{ fontFamily:MONO, fontSize:10, fontWeight:700,
                  letterSpacing:'0.25em', textTransform:'uppercase', padding:'10px 24px', cursor:'pointer',
                  border:`1px solid ${filter===t?ACCENT:'rgba(255,255,255,0.1)'}`,
                  color: filter===t?ACCENT:'rgba(255,255,255,0.5)',
                  background: filter===t?`${ACCENT}10`:'transparent', transition:'all 0.25s' }}>
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* Grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:32 }}>
            {shown.map(repo=>(
              <NeonCard 
                key={repo._id} 
                layoutId={`tokyo-project-${repo._id}`}
                onClick={() => setSelectedProject(repo)}
                style={{ padding:32, cursor:'pointer' }} 
                color={ACCENT}
              >
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
                  <NeonTag color={ACCENT}>{repo.language||'Code'}</NeonTag>
                  <div style={{ display:'flex', alignItems:'center', gap:8, fontFamily:MONO, fontSize:11, color:ACCENT }}>
                    ⭐ <span>{repo.stars||0}</span>
                  </div>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <ProjectVisual repo={repo} theme="tokyo" compact />
                </div>
                <h3 style={{ fontFamily:SANS, fontSize:22, fontWeight:900, letterSpacing:'-0.03em', marginBottom:12, color:'#fff' }}>
                  {repo.name}
                </h3>
                <p style={{ fontSize:14, lineHeight:1.7, color:'rgba(255,255,255,0.65)', marginBottom:32 }} className="line-clamp-4">
                  {repo.description||'A precision-engineered digital solution.'}
                </p>
                <div style={{ paddingTop:24, borderTop:'1px solid rgba(255,255,255,0.08)', display:'flex', justifyContent:'flex-end' }}>
                  <span style={{ fontFamily:MONO, fontSize:10, fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:ACCENT }}>
                    Expand →
                  </span>
                </div>
              </NeonCard>
            ))}
          </div>
        </div>
      </motion.section>

      {/* TOKYO GLITCH DETAILED PROJECT OVERLAY */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(12px)' }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              layoutId={`tokyo-project-${selectedProject._id}`}
              style={{ background: VOID2, maxWidth: 650, width: '100%', padding: 48, border: `1px solid ${ACCENT}`, boxShadow: `0 0 50px ${ACCENT}25`, position: 'relative' }}
              onClick={e => e.stopPropagation()}
            >
              {/* corner accents */}
              {['top-0 left-0 border-t border-l','top-0 right-0 border-t border-r','bottom-0 left-0 border-b border-l','bottom-0 right-0 border-b border-r'].map((c,i)=>(
                <div key={i} className={`absolute w-4 h-4 ${c}`} style={{ borderColor:`${ACCENT}80` }} />
              ))}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <NeonTag color={ACCENT}>{selectedProject.language || 'Code'}</NeonTag>
                <button 
                  onClick={() => setSelectedProject(null)}
                  style={{ background: 'none', border: `1px solid ${ACCENT}40`, fontFamily: MONO, fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '6px 16px', color: '#fff', cursor: 'pointer' }}
                >
                  Close [X]
                </button>
              </div>
              
              <h3 style={{ fontFamily: SANS, fontSize: 36, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', marginBottom: 20 }}>
                {selectedProject.name}
              </h3>
              
              <GlowLine color={ACCENT} className="my-6" />
              
              <p style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', marginBottom: 32 }}>
                {selectedProject.description || 'A precision-engineered digital solution.'}
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, padding: 24, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: 32 }}>
                <div>
                  <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.2em', opacity: 0.4 }}>STARS</span>
                  <div style={{ fontFamily: SANS, fontSize: 24, fontWeight: 900, color: HIGHLIGHT, marginTop: 4 }}>★ {selectedProject.stars || 0}</div>
                </div>
                <div>
                  <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.2em', opacity: 0.4 }}>FORKS</span>
                  <div style={{ fontFamily: SANS, fontSize: 24, fontWeight: 900, color: SECONDARY, marginTop: 4 }}>⑂ {selectedProject.forks || 0}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {selectedProject.repoUrl && (
                  <a 
                    href={selectedProject.repoUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ padding: '16px 36px', background: ACCENT, color: '#fff', fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', textDecoration: 'none', boxShadow: `0 0 20px ${ACCENT}40` }}
                  >
                    View Source ↗
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SKILLS ── */}
      <motion.section 
        id="skills" 
        style={{ position:'relative', zIndex:10, padding:'120px 48px', maxWidth:1280, margin:'0 auto' }}
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <SectionHead tag="03 // Skills" title="Tech Stack" sub="Core Capabilities" color={SECONDARY} />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:32 }}>
          {[
            { label:'Frontend', icon:'🜠', color:HIGHLIGHT, items:cat.fe.length>0?cat.fe:['React','Next.js','Tailwind'] },
            { label:'Backend', icon:'🖥️', color:SECONDARY, items:cat.be.length>0?cat.be:['Node.js','Express','MongoDB'] },
            { label:'Infrastructure', icon:'🔧', color:ACCENT, items:cat.tl.length>0?cat.tl:['Git','Docker','AWS'] },
          ].map(category=>(
            <NeonCard key={category.label} color={category.color}>
              <div style={{ padding:'24px', borderBottom:`1px solid rgba(255,255,255,0.08)`, display:'flex', alignItems:'center', gap:16 }}>
                <span style={{ fontSize:'28px' }}>{category.icon}</span>
                <span style={{ fontFamily:MONO, fontSize:12, fontWeight:700, letterSpacing:'0.4em', textTransform:'uppercase', color:category.color }}>{category.label}</span>
              </div>
              <div style={{ padding:32 }}>
                {category.items.map((sk,idx)=>(
                  <div key={sk} style={{ display:'flex', alignItems:'center', gap:16, marginBottom:18 }}>
                    <div style={{ width:4, height:4, borderRadius:'50%', background:category.color, opacity:0.6 }} />
                    <span style={{ fontFamily:MONO, fontSize:13, letterSpacing:'0.1em', color:'rgba(255,255,255,0.8)' }}>{sk}</span>
                    <div style={{ marginLeft:'auto', display:'flex', gap:4 }}>
                      {[0,1,2,3,4].map(j=>(
                        <div key={j} style={{ width:12, height:3, borderRadius:4,
                          background: j < (5-idx%2) ? category.color : 'rgba(255,255,255,0.1)',
                          boxShadow: j < (5-idx%2) ? `0 0 8px ${category.color}40` : 'none' }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </NeonCard>
          ))}
        </div>
      </motion.section>

      {/* ── EXPERIENCE ── */}
      {experience.length > 0 && (
        <motion.section 
          id="experience" 
          style={{ position:'relative', zIndex:10, padding:'120px 48px', background:VOID2 }}
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ maxWidth:1280, margin:'0 auto' }}>
            <SectionHead tag="04 // Experience" title="Mission Log" color={HIGHLIGHT} />
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {experience.map((exp,i)=>(
                <NeonCard key={i} style={{ padding:40 }} color={HIGHLIGHT}>
                  <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyBetween:'space-between', gap:24, marginBottom:20 }}>
                    <h3 style={{ fontFamily:SANS, fontSize:'clamp(1.5rem,3vw,2.2rem)', fontWeight:900, color:'#fff' }}>{exp.role}</h3>
                    <div style={{ display:'flex', alignItems:'center', gap:20 }}>
                      <span style={{ fontFamily:MONO, fontSize:11, fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase',
                        padding:'8px 20px', border:`1px solid ${ACCENT}`, color:ACCENT }}>{exp.company}</span>
                      <span style={{ fontFamily:MONO, fontSize:10, opacity:0.5, letterSpacing:'0.2em' }}>{exp.startDate} — {exp.endDate||'Present'}</span>
                    </div>
                  </div>
                  {exp.description && <p style={{ fontSize:15, lineHeight:1.8, color:'rgba(255,255,255,0.8)' }}>{exp.description}</p>}
                </NeonCard>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* ── CTA ── */}
      <motion.section 
        style={{ position:'relative', zIndex:10, padding:'80px 48px', maxWidth:1280, margin:'0 auto' }}
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <NeonCard style={{ padding:64, display:'flex', flexWrap:'wrap', alignItems:'center', justifyBetween:'space-between', gap:40 }} color={ACCENT}>
          <div>
            <div style={{ fontFamily:MONO, fontSize:11, letterSpacing:'0.5em', textTransform:'uppercase', color:ACCENT, marginBottom:12 }}>Credentials</div>
            <h2 style={{ fontFamily:SANS, fontSize:'clamp(2.5rem,4vw,3.5rem)', fontWeight:900, color:'#fff' }}>Download Resume</h2>
          </div>
          <a href="/resume.pdf" download style={{ fontFamily:MONO, fontSize:12, fontWeight:700, letterSpacing:'0.4em', textTransform:'uppercase',
            padding:'20px 48px', background:ACCENT, color:'#fff', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:12,
            boxShadow:`0 0 40px ${ACCENT}40` }}>
            <Download className="w-5 h-5" /> Get PDF
          </a>
        </NeonCard>
      </motion.section>

      {/* ── CONTACT ── */}
      <motion.section 
        id="contact" 
        style={{ position:'relative', zIndex:10, padding:'120px 48px', maxWidth:1280, margin:'0 auto' }}
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <SectionHead tag="05 // Contact" title="Open Channel" sub="Secure Transmission" color={HIGHLIGHT} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80 }} className="grid-cols-1 md:grid-cols-2">
          <div>
            <p style={{ fontSize:19, lineHeight:1.8, color:'rgba(255,255,255,0.7)', marginBottom:48 }}>
              Initiate a direct link for project inquiries, freelance opportunities, or technical consulting. 
            </p>
            {[
              email && { href:`mailto:${email}`, label:'Email', value:email, icon:<Mail className="w-5 h-5" />, c:ACCENT },
              links.linkedin && { href:links.linkedin, label:'LinkedIn', value:'Connect with me', icon:<Mail className="w-5 h-5" />, c:SECONDARY },
              links.github && { href:links.github, label:'GitHub', value:'View Repositories', icon:<GitBranch className="w-5 h-5" />, c:HIGHLIGHT },
            ].filter(Boolean).map(item=>(
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer"
                 style={{ display:'flex', alignItems:'center', gap:24, padding:'20px', marginBottom:12,
                   border:`1px solid transparent`, textDecoration:'none', transition:'all 0.3s' }}
                 onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${item.c}40`; e.currentTarget.style.background=`${item.c}08`; }}
                 onMouseLeave={e=>{ e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.background='transparent'; }}>
                <div style={{ color:item.c }}>{item.icon}</div>
                <div>
                  <div style={{ fontFamily:MONO, fontSize:10, letterSpacing:'0.4em', textTransform:'uppercase', opacity:0.4, marginBottom:4 }}>{item.label}</div>
                  <div style={{ fontFamily:MONO, fontSize:14, color:item.c }}>{item.value}</div>
                </div>
              </a>
            ))}
          </div>

          <form onSubmit={onSubmit}>
            {sent && (
              <div style={{ padding:'14px 20px', border:`1px solid ${ACCENT}`, background:`${ACCENT}15`,
                fontFamily:MONO, fontSize:12, letterSpacing:'0.25em', textTransform:'uppercase', color:ACCENT,
                marginBottom:24, textAlign:'center' }}>
                Transmission Complete ✓
              </div>
            )}
            <div style={{ marginBottom:24 }}>
              <label style={{ display:'block', fontFamily:MONO, fontSize:10, letterSpacing:'0.4em', textTransform:'uppercase', opacity:0.4, marginBottom:8 }}>Name</label>
              <input name="name" value={form.name} onChange={onChange} required placeholder="Your Name"
                     style={{ width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)',
                       padding:'16px 20px', outline:'none', color:'#fff', fontFamily:MONO, fontSize:14 }} />
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={{ display:'block', fontFamily:MONO, fontSize:10, letterSpacing:'0.4em', textTransform:'uppercase', opacity:0.4, marginBottom:8 }}>Email</label>
              <input name="email" type="email" value={form.email} onChange={onChange} required placeholder="your@email.com"
                     style={{ width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)',
                       padding:'16px 20px', outline:'none', color:'#fff', fontFamily:MONO, fontSize:14 }} />
            </div>
            <div style={{ marginBottom:32 }}>
              <label style={{ display:'block', fontFamily:MONO, fontSize:10, letterSpacing:'0.4em', textTransform:'uppercase', opacity:0.4, marginBottom:8 }}>Message</label>
              <textarea name="message" value={form.message} onChange={onChange} required rows={6} placeholder="Message context..."
                        style={{ width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)',
                          padding:'16px 20px', outline:'none', color:'#fff', resize:'none', fontFamily:MONO, fontSize:14 }} />
            </div>
            <button type="submit" style={{ width:'100%', padding:18, border:'none', background:ACCENT, color:'#fff',
              fontFamily:MONO, fontSize:12, fontWeight:700, letterSpacing:'0.4em', textTransform:'uppercase',
              boxShadow:`0 0 30px ${ACCENT}30`, cursor:'pointer', transition:'background 0.2s' }}
                    onMouseEnter={e=>e.currentTarget.style.background=SECONDARY}
                    onMouseLeave={e=>e.currentTarget.style.background=ACCENT}>
              Transmit Message
            </button>
          </form>
        </div>
      </motion.section>

      {/* ── FOOTER ── */}
      <footer style={{ background:VOID2, borderTop:`1px solid rgba(255,255,255,0.06)`, py:80, padding:'80px 48px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:48, marginBottom:64 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                <div style={{ width:8, height:8, background:ACCENT, clipPath:'polygon(50% 0%,100% 50%,50% 100%,0% 50%)' }} />
                <span style={{ fontFamily:MONO, fontSize:12, fontWeight:700, letterSpacing:'0.4em', textTransform:'uppercase' }}>{name.split(' ')[0]}_FOLIO</span>
              </div>
              <p style={{ fontSize:14, opacity:0.4, lineHeight:1.6 }}>{headline}</p>
            </div>
            <div>
              <div style={{ fontFamily:MONO, fontSize:10, letterSpacing:'0.5em', textTransform:'uppercase', opacity:0.3, marginBottom:20 }}>Navigate</div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {navLinks.map(l=>(
                  <a key={l.href} href={l.href} style={{ fontFamily:MONO, fontSize:13, opacity:0.4, textDecoration:'none', color:'#fff', transition:'all 0.2s' }}
                     onMouseEnter={e=>{ e.currentTarget.style.opacity='1'; e.currentTarget.style.color=ACCENT; }}
                     onMouseLeave={e=>{ e.currentTarget.style.opacity='0.4'; e.currentTarget.style.color='#fff'; }}>{l.label}</a>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily:MONO, fontSize:10, letterSpacing:'0.5em', textTransform:'uppercase', opacity:0.3, marginBottom:20 }}>Connect</div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {links.github && <a href={links.github} target="_blank" rel="noreferrer" style={{ fontFamily:MONO, fontSize:13, opacity:0.4, textDecoration:'none', color:'#fff', transition:'all 0.2s' }} onMouseEnter={e=>{ e.currentTarget.style.opacity='1'; e.currentTarget.style.color=ACCENT; }} onMouseLeave={e=>{ e.currentTarget.style.opacity='0.4'; e.currentTarget.style.color='#fff'; }}>GitHub ↗</a>}
                {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" style={{ fontFamily:MONO, fontSize:13, opacity:0.4, textDecoration:'none', color:'#fff', transition:'all 0.2s' }} onMouseEnter={e=>{ e.currentTarget.style.opacity='1'; e.currentTarget.style.color=ACCENT; }} onMouseLeave={e=>{ e.currentTarget.style.opacity='0.4'; e.currentTarget.style.color='#fff'; }}>LinkedIn ↗</a>}
              </div>
            </div>
          </div>
          <div style={{ height:1, background:'rgba(255,255,255,0.06)', marginBottom:32 }} />
          <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:16, opacity:0.25, fontSize:11, fontFamily:MONO }}>
            <span>© {new Date().getFullYear()} {name}. All Rights Reserved.</span>
            <span>Built with PortForge_Tokyo</span>
          </div>
        </div>
      </footer>

      <style>{`
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        ::selection { background: ${ACCENT}; color: #fff; }
        @media (max-width: 768px) { section { padding-left: 24px !important; padding-right: 24px !important; } }

        /* ── TOKYO GLITCH ── */
        .tokyo-glitch { position: relative; }
        .tokyo-glitch::before,
        .tokyo-glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: transparent;
        }
        .tokyo-glitch::before {
          color: ${ACCENT};
          animation: glitch-anim 2.5s infinite linear alternate-reverse;
          clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
        }
        .tokyo-glitch::after {
          color: ${HIGHLIGHT};
          animation: glitch-anim2 2.5s infinite linear alternate-reverse;
          clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
        }
        @keyframes glitch-anim {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        @keyframes glitch-anim2 {
          0% { transform: translate(0); }
          20% { transform: translate(2px, -2px); }
          40% { transform: translate(2px, 2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(-2px, 2px); }
          100% { transform: translate(0); }
        }
      `}</style>
    </div>
  );
};
