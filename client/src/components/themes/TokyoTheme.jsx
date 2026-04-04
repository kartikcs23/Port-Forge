import React, { useState, useEffect } from 'react';

/* ═══════════════════════════════════════════════════════
   TOKYO THEME — Neon Cyberpunk Portfolio
   Palette: Deep void #08001a | Neon pink #ff006e |
            Electric purple #7b2fff | Cyan #00f5d4
═══════════════════════════════════════════════════════ */

const PINK   = '#ff006e';
const PURPLE = '#7b2fff';
const CYAN   = '#00f5d4';
const VOID   = '#08001a';
const VOID2  = '#0d0025';
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
const NeonTag = ({ children, color=CYAN }) => (
  <span style={{ fontFamily:MONO, fontSize:10, fontWeight:700, letterSpacing:'0.5em', textTransform:'uppercase',
    padding:'4px 12px', border:`1px solid ${color}40`, color, background:`${color}10` }}>
    {children}
  </span>
);

const GlowLine = ({ color=CYAN, className='' }) => (
  <div className={className} style={{ height:1, background:`linear-gradient(90deg, transparent, ${color}60, transparent)` }} />
);

const NeonCard = ({ children, className='', style={}, color=CYAN }) => (
  <div className={`group relative transition-all duration-400 ${className}`}
       style={{ background:'rgba(255,255,255,0.03)', border:`1px solid rgba(255,255,255,0.07)`,
                backdropFilter:'blur(12px)', position:'relative', overflow:'hidden', ...style }}>
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
         style={{ background:`radial-gradient(circle at 0 0, ${color}08, transparent 60%)` }} />
    {/* corner accents */}
    {['top-0 left-0 border-t border-l','top-0 right-0 border-t border-r','bottom-0 left-0 border-b border-l','bottom-0 right-0 border-b border-r'].map((c,i)=>(
      <div key={i} className={`absolute w-4 h-4 transition-all duration-500 ${c}`}
           style={{ borderColor:`${color}30` }} />
    ))}
    {children}
  </div>
);

const SectionHead = ({ tag, title, sub, color=CYAN }) => (
  <div style={{ marginBottom:72 }}>
    <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
      <div style={{ width:32, height:1, background:color }} />
      <NeonTag color={color}>{tag}</NeonTag>
    </div>
    <h2 style={{ fontFamily:SANS, fontSize:'clamp(2.5rem,5vw,5.5rem)', fontWeight:900,
      letterSpacing:'-0.04em', color:'#fff', lineHeight:0.9, marginBottom:16 }}>
      {title}
    </h2>
    {sub && <p style={{ fontFamily:MONO, fontSize:13, color:'rgba(255,255,255,0.35)', letterSpacing:'0.05em' }}>{sub}</p>}
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
      {/* Grid */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', opacity:0.06,
        backgroundImage:`linear-gradient(${CYAN}80 1px,transparent 1px),linear-gradient(90deg,${CYAN}80 1px,transparent 1px)`,
        backgroundSize:'60px 60px' }} />
      {/* Glow blobs */}
      <div style={{ position:'fixed', top:'-20%', left:'-10%', width:600, height:600, borderRadius:'50%',
        background:PURPLE, opacity:0.12, filter:'blur(120px)', zIndex:0, pointerEvents:'none' }} />
      <div style={{ position:'fixed', bottom:'-20%', right:'-10%', width:700, height:700, borderRadius:'50%',
        background:PINK, opacity:0.1, filter:'blur(150px)', zIndex:0, pointerEvents:'none' }} />
      {/* Scanlines */}
      <div style={{ position:'fixed', inset:0, zIndex:1, pointerEvents:'none', opacity:0.04,
        backgroundImage:'linear-gradient(transparent 50%,rgba(0,0,0,0.5) 50%)', backgroundSize:'100% 4px' }} />
      {/* Grid scan sweep */}
      <div className="grid-scan" />

      {/* ── NAV ── */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:50, transition:'all 0.3s',
        background: scrollY>60 ? 'rgba(8,0,26,0.9)' : 'transparent',
        backdropFilter: scrollY>60 ? 'blur(20px)' : 'none',
        borderBottom: scrollY>60 ? `1px solid rgba(255,0,110,0.15)` : 'none' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'18px 48px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:10, height:10, background:PINK, clipPath:'polygon(50% 0%,100% 50%,50% 100%,0% 50%)',
              boxShadow:`0 0 16px ${PINK}` }} />
            <span style={{ fontFamily:MONO, fontSize:11, fontWeight:700, letterSpacing:'0.5em', textTransform:'uppercase' }}>
              {name.split(' ')[0]}<span style={{color:PINK}}>_</span>folio
            </span>
          </div>

          {/* Desktop links */}
          <div style={{ display:'flex', gap:40, alignItems:'center' }} className="hidden md:flex">
            {navLinks.map(l=>(
              <a key={l.href} href={l.href} style={{ fontFamily:MONO, fontSize:11, fontWeight:700, letterSpacing:'0.3em',
                textTransform:'uppercase', color:'rgba(255,255,255,0.35)', textDecoration:'none', transition:'color 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.color=PINK}
                onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.35)'}>
                {l.label}
              </a>
            ))}
            <a href="#contact" style={{ fontFamily:MONO, fontSize:11, fontWeight:700, letterSpacing:'0.3em',
              textTransform:'uppercase', padding:'10px 24px', background:PINK, color:'#fff', textDecoration:'none',
              boxShadow:`0 0 20px ${PINK}50`, transition:'all 0.3s' }}
              onMouseEnter={e=>{ e.currentTarget.style.background=PURPLE; e.currentTarget.style.boxShadow=`0 0 20px ${PURPLE}50`; }}
              onMouseLeave={e=>{ e.currentTarget.style.background=PINK; e.currentTarget.style.boxShadow=`0 0 20px ${PINK}50`; }}>
              Hire Me
            </a>
          </div>

          {/* Mobile */}
          <button onClick={()=>setMenuOpen(!menuOpen)} className="md:hidden"
                  style={{ background:'none', border:`1px solid rgba(255,0,110,0.3)`, padding:'8px 10px', cursor:'pointer' }}>
            <div style={{ width:22, display:'flex', flexDirection:'column', gap:5 }}>
              {[0,1,2].map(i=><div key={i} style={{ height:1.5, background:'#fff', transition:'all 0.3s',
                transform: menuOpen?(i===0?'rotate(45deg) translateY(6.5px)':i===2?'rotate(-45deg) translateY(-6.5px)':'none'):'none',
                opacity: menuOpen&&i===1?0:1 }} />)}
            </div>
          </button>
        </div>

        {menuOpen&&(
          <div style={{ background:'rgba(8,0,26,0.97)', borderTop:`1px solid rgba(255,0,110,0.15)`, padding:'24px 48px' }}>
            {navLinks.map(l=>(
              <a key={l.href} href={l.href} onClick={()=>setMenuOpen(false)}
                 style={{ display:'block', fontFamily:MONO, fontSize:12, fontWeight:700, letterSpacing:'0.3em',
                   textTransform:'uppercase', color:'rgba(255,255,255,0.4)', textDecoration:'none', marginBottom:16 }}>
                {l.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ════════════════════════════════════
          01. HERO
      ════════════════════════════════════ */}
      <section id="hero" style={{ position:'relative', zIndex:10, minHeight:'100vh', display:'flex',
        alignItems:'center', padding:'120px 48px 80px', maxWidth:1280, margin:'0 auto' }}>
        <div style={{ width:'100%' }}>
          {/* Eyebrow */}
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:32 }}>
            <div style={{ width:40, height:1, background:PINK }} />
            <NeonTag color={PINK}>{headline}</NeonTag>
          </div>

          {/* Name — glitch */}
          <h1 className="tokyo-glitch" data-text={name}
              style={{ fontFamily:SANS, fontWeight:900, letterSpacing:'-0.05em',
            fontSize:'clamp(4rem,13vw,11rem)', lineHeight:0.85, color:'#fff', marginBottom:40,
            textShadow:`0 0 60px rgba(255,0,110,0.15), 3px 0 0 ${PINK}20, -3px 0 0 ${CYAN}20` }}>
            {name}
          </h1>

          {/* Bio */}
          <div style={{ maxWidth:640, borderLeft:`3px solid ${PURPLE}`, paddingLeft:32, marginBottom:56 }}>
            <p style={{ fontFamily:SANS, fontSize:'clamp(1rem,2vw,1.4rem)', lineHeight:1.6, color:'rgba(255,255,255,0.6)' }}>
              {bio}
            </p>
          </div>

          {/* CTAs */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:16, marginBottom:80 }}>
            <a href="#projects" className="neon-flicker"
               style={{ fontFamily:MONO, fontSize:12, fontWeight:700, letterSpacing:'0.35em',
              textTransform:'uppercase', padding:'16px 40px', background:PINK, color:'#fff', textDecoration:'none',
              boxShadow:`0 0 30px ${PINK}40`, transition:'all 0.3s' }}
              onMouseEnter={e=>{ e.currentTarget.style.background=PURPLE; e.currentTarget.style.boxShadow=`0 0 30px ${PURPLE}50`; }}
              onMouseLeave={e=>{ e.currentTarget.style.background=PINK; e.currentTarget.style.boxShadow=`0 0 30px ${PINK}40`; }}>
              View Projects
            </a>
            <a href="#contact" style={{ fontFamily:MONO, fontSize:12, fontWeight:700, letterSpacing:'0.35em',
              textTransform:'uppercase', padding:'16px 40px', border:`1px solid rgba(255,255,255,0.15)`,
              color:'rgba(255,255,255,0.7)', textDecoration:'none', transition:'all 0.3s', background:'transparent' }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=CYAN; e.currentTarget.style.color=CYAN; e.currentTarget.style.boxShadow=`0 0 20px ${CYAN}20`; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; e.currentTarget.style.color='rgba(255,255,255,0.7)'; e.currentTarget.style.boxShadow='none'; }}>
              Contact Me
            </a>
            {links.github&&(
              <a href={links.github} target="_blank" rel="noreferrer"
                 style={{ fontFamily:MONO, fontSize:12, fontWeight:700, letterSpacing:'0.35em', textTransform:'uppercase',
                   padding:'16px 40px', border:`1px solid ${PURPLE}40`, color:PURPLE, textDecoration:'none', transition:'all 0.3s' }}
                onMouseEnter={e=>{ e.currentTarget.style.boxShadow=`0 0 20px ${PURPLE}30`; e.currentTarget.style.borderColor=PURPLE; }}
                onMouseLeave={e=>{ e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor=`${PURPLE}40`; }}>
                GitHub ↗
              </a>
            )}
          </div>

          {/* Stats */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:0, borderTop:`1px solid rgba(255,255,255,0.06)`, paddingTop:40 }}>
            {[{v:repos.length,l:'Projects Built',c:PINK},{v:skills.length,l:'Skills',c:PURPLE},{v:experience.length,l:'Experiences',c:CYAN}].map((s,i)=>(
              <div key={s.l} style={{ paddingRight:48, marginRight:48, borderRight:i<2?'1px solid rgba(255,255,255,0.06)':'none' }}>
                <div style={{ fontFamily:SANS, fontSize:'clamp(2rem,4vw,3.5rem)', fontWeight:900, color:s.c,
                  textShadow:`0 0 30px ${s.c}50`, lineHeight:1 }}>{s.v}+</div>
                <div style={{ fontFamily:MONO, fontSize:10, letterSpacing:'0.4em', textTransform:'uppercase', opacity:0.35, marginTop:6 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Avatar orb */}
        {avatar && (
          <div style={{ position:'absolute', right:80, top:'50%', transform:'translateY(-50%)', display:'none' }} className="lg:block">
            <div style={{ width:280, height:280, borderRadius:'50%', overflow:'hidden', border:`2px solid ${PINK}30`,
              boxShadow:`0 0 60px ${PINK}20, 0 0 120px ${PURPLE}15` }}>
              <img src={avatar} alt={name} style={{ width:'100%', height:'100%', objectFit:'cover', filter:'saturate(0.8) contrast(1.1)' }} />
            </div>
          </div>
        )}
      </section>

      {/* ════════════════════════════════════
          02. ABOUT
      ════════════════════════════════════ */}
      <section id="about" style={{ position:'relative', zIndex:10, padding:'120px 48px', maxWidth:1280, margin:'0 auto' }}>
        <SectionHead tag="01 // About" title="Who I Am" sub="Background, mission & philosophy" color={CYAN} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64 }} className="grid-cols-1 md:grid-cols-2">
          <div>
            <p style={{ fontSize:19, lineHeight:1.8, color:'rgba(255,255,255,0.6)', marginBottom:32 }}>{intro}</p>
            {location&&(
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
                <div style={{ width:6, height:6, background:CYAN, borderRadius:'50%', boxShadow:`0 0 10px ${CYAN}` }} />
                <span style={{ fontFamily:MONO, fontSize:11, letterSpacing:'0.35em', textTransform:'uppercase', opacity:0.4 }}>{location}</span>
              </div>
            )}
            {education.map((edu,i)=>(
              <NeonCard key={i} style={{ padding:24, marginBottom:12 }} color={PURPLE}>
                <div style={{ fontFamily:MONO, fontSize:10, color:PURPLE, letterSpacing:'0.4em', textTransform:'uppercase', marginBottom:6 }}>{edu.year}</div>
                <div style={{ fontWeight:700, fontSize:17 }}>{edu.degree}{edu.field?` · ${edu.field}`:''}</div>
                <div style={{ fontSize:13, opacity:0.45, marginTop:4 }}>{edu.institution}</div>
              </NeonCard>
            ))}
          </div>
          <div>
            <div style={{ fontFamily:MONO, fontSize:10, letterSpacing:'0.5em', textTransform:'uppercase', opacity:0.25, marginBottom:20 }}>Specializations</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
              {(skills.length>0?skills.slice(0,16):['React','TypeScript','Node.js','MongoDB','Docker','AWS','Next.js','Python','GraphQL','Redis','PostgreSQL','Tailwind']).map(s=>(
                <span key={s} style={{ fontFamily:MONO, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase',
                  padding:'7px 16px', border:`1px solid rgba(255,0,110,0.25)`, color:PINK, background:`${PINK}06`,
                  cursor:'default', transition:'all 0.2s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.background=`${PINK}18`; e.currentTarget.style.boxShadow=`0 0 14px ${PINK}20`; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background=`${PINK}06`; e.currentTarget.style.boxShadow='none'; }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          03. PROJECTS
      ════════════════════════════════════ */}
      <section id="projects" style={{ position:'relative', zIndex:10, padding:'120px 48px',
        background:'rgba(255,0,110,0.02)', borderTop:`1px solid rgba(255,255,255,0.04)`, borderBottom:`1px solid rgba(255,255,255,0.04)` }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <SectionHead tag="02 // Projects" title="Deployments" sub="Precision-engineered solutions built to last" color={PINK} />

          {/* Filters */}
          {tags.length>1&&(
            <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:48 }}>
              {tags.map(t=>(
                <button key={t} onClick={()=>setFilter(t)} style={{ fontFamily:MONO, fontSize:11, fontWeight:700,
                  letterSpacing:'0.25em', textTransform:'uppercase', padding:'8px 22px', cursor:'pointer',
                  border:`1px solid ${filter===t?PINK:'rgba(255,255,255,0.1)'}`,
                  color: filter===t?PINK:'rgba(255,255,255,0.35)',
                  background: filter===t?`${PINK}10`:'transparent', transition:'all 0.25s',
                  boxShadow: filter===t?`0 0 14px ${PINK}20`:'none' }}>
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* Grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:24 }}>
            {shown.map(repo=>(
              <NeonCard key={repo._id} style={{ padding:32 }} color={PINK}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
                  <NeonTag color={PINK}>{repo.language||'Project'}</NeonTag>
                  <span style={{ fontFamily:MONO, fontSize:10, opacity:0.25 }}>★ {repo.stars||0}</span>
                </div>
                <h3 style={{ fontFamily:SANS, fontSize:24, fontWeight:900, letterSpacing:'-0.03em',
                  marginBottom:12, lineHeight:1.1, transition:'color 0.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.color=PINK}
                  onMouseLeave={e=>e.currentTarget.style.color='#fff'}>
                  {repo.name}
                </h3>
                <p style={{ fontSize:14, lineHeight:1.7, color:'rgba(255,255,255,0.45)', marginBottom:28 }}>
                  {repo.description||'A precision-engineered solution built for performance and scale.'}
                </p>
                <div style={{ paddingTop:20, borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'flex-end' }}>
                  {repo.repoUrl&&(
                    <a href={repo.repoUrl} target="_blank" rel="noreferrer"
                       style={{ fontFamily:MONO, fontSize:10, fontWeight:700, letterSpacing:'0.4em',
                         textTransform:'uppercase', color:PINK, textDecoration:'none', transition:'all 0.2s' }}
                       onMouseEnter={e=>{ e.currentTarget.style.textShadow=`0 0 12px ${PINK}`; }}
                       onMouseLeave={e=>{ e.currentTarget.style.textShadow='none'; }}>
                      GitHub ↗
                    </a>
                  )}
                </div>
              </NeonCard>
            ))}
          </div>

          {links.github&&(
            <div style={{ textAlign:'center', marginTop:56 }}>
              <a href={links.github} target="_blank" rel="noreferrer"
                 style={{ fontFamily:MONO, fontSize:11, fontWeight:700, letterSpacing:'0.35em', textTransform:'uppercase',
                   padding:'14px 40px', border:`1px solid rgba(255,255,255,0.1)`, color:'rgba(255,255,255,0.5)',
                   textDecoration:'none', display:'inline-block', transition:'all 0.3s' }}
                 onMouseEnter={e=>{ e.currentTarget.style.borderColor=PINK; e.currentTarget.style.color=PINK; e.currentTarget.style.boxShadow=`0 0 20px ${PINK}20`; }}
                 onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.color='rgba(255,255,255,0.5)'; e.currentTarget.style.boxShadow='none'; }}>
                All Repositories on GitHub ↗
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════
          04. SKILLS
      ════════════════════════════════════ */}
      <section id="skills" style={{ position:'relative', zIndex:10, padding:'120px 48px', maxWidth:1280, margin:'0 auto' }}>
        <SectionHead tag="03 // Skills" title="Tech Stack" sub="Full-spectrum engineering capabilities" color={PURPLE} />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
          {[
            { label:'Frontend', color:CYAN, items:cat.fe.length>0?cat.fe:['React','TypeScript','Next.js','Tailwind','HTML/CSS'] },
            { label:'Backend', color:PURPLE, items:cat.be.length>0?cat.be:['Node.js','Express','MongoDB','Python','GraphQL'] },
            { label:'Tools & Cloud', color:PINK, items:cat.tl.length>0?cat.tl:['Git','Docker','AWS','CI/CD','Linux'] },
          ].map(cat=>(
            <NeonCard key={cat.label} color={cat.color}>
              <div style={{ padding:'20px 24px', borderBottom:`1px solid rgba(255,255,255,0.06)`, display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:cat.color, boxShadow:`0 0 10px ${cat.color}` }} />
                <span style={{ fontFamily:MONO, fontSize:11, fontWeight:700, letterSpacing:'0.4em', textTransform:'uppercase', color:cat.color }}>{cat.label}</span>
              </div>
              <div style={{ padding:24 }}>
                {cat.items.map((sk,i)=>(
                  <div key={sk} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14, cursor:'default' }}>
                    <div style={{ width:4, height:4, borderRadius:'50%', background:cat.color, opacity:0.5 }} />
                    <span style={{ fontFamily:MONO, fontSize:12, letterSpacing:'0.15em', color:'rgba(255,255,255,0.65)' }}>{sk}</span>
                    <div style={{ marginLeft:'auto', display:'flex', gap:3 }}>
                      {Array.from({length:5}).map((_,j)=>(
                        <div key={j} style={{ width:10, height:3, borderRadius:2,
                          background: j<Math.max(3,5-i) ? cat.color : 'rgba(255,255,255,0.08)',
                          boxShadow: j<Math.max(3,5-i) ? `0 0 6px ${cat.color}50` : 'none' }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </NeonCard>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════
          05. EXPERIENCE
      ════════════════════════════════════ */}
      {experience.length>0&&(
        <section id="experience" style={{ position:'relative', zIndex:10, padding:'120px 48px',
          background:VOID2, borderTop:`1px solid rgba(255,255,255,0.04)`, borderBottom:`1px solid rgba(255,255,255,0.04)` }}>
          <div style={{ maxWidth:1280, margin:'0 auto' }}>
            <SectionHead tag="04 // Experience" title="Mission Log" color={CYAN} />
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              {experience.map((exp,i)=>(
                <NeonCard key={i} style={{ padding:40, marginBottom:4 }} color={CYAN}>
                  <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:16, marginBottom:20 }}>
                    <h3 style={{ fontFamily:SANS, fontSize:'clamp(1.5rem,3vw,2.2rem)', fontWeight:900, letterSpacing:'-0.03em' }}>{exp.role}</h3>
                    <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                      <span style={{ fontFamily:MONO, fontSize:11, fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase',
                        padding:'6px 18px', border:`1px solid ${PINK}40`, color:PINK }}>{exp.company}</span>
                      <span style={{ fontFamily:MONO, fontSize:10, opacity:0.3, letterSpacing:'0.25em' }}>
                        {exp.startDate} → {exp.endDate||'Now'}
                      </span>
                    </div>
                  </div>
                  {exp.description&&<p style={{ fontSize:15, lineHeight:1.7, color:'rgba(255,255,255,0.5)' }}>{exp.description}</p>}
                </NeonCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Resume */}
      <section style={{ position:'relative', zIndex:10, padding:'80px 48px', maxWidth:1280, margin:'0 auto' }}>
        <NeonCard style={{ padding:48, display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:32 }} color={PINK}>
          <div>
            <div style={{ fontFamily:MONO, fontSize:10, letterSpacing:'0.55em', textTransform:'uppercase', color:PINK, marginBottom:8 }}>Credentials</div>
            <h2 style={{ fontFamily:SANS, fontSize:'clamp(2rem,4vw,3.5rem)', fontWeight:900, letterSpacing:'-0.04em' }}>Download Resume</h2>
          </div>
          <a href="/resume.pdf" download style={{ fontFamily:MONO, fontSize:11, fontWeight:700, letterSpacing:'0.4em', textTransform:'uppercase',
            padding:'18px 48px', background:PINK, color:'#fff', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:12,
            boxShadow:`0 0 30px ${PINK}40`, transition:'all 0.3s' }}
            onMouseEnter={e=>{ e.currentTarget.style.background=PURPLE; e.currentTarget.style.boxShadow=`0 0 30px ${PURPLE}50`; }}
            onMouseLeave={e=>{ e.currentTarget.style.background=PINK; e.currentTarget.style.boxShadow=`0 0 30px ${PINK}40`; }}>
            ↓ Get PDF
          </a>
        </NeonCard>
      </section>

      {/* ════════════════════════════════════
          06. CONTACT
      ════════════════════════════════════ */}
      <section id="contact" style={{ position:'relative', zIndex:10, padding:'120px 48px', maxWidth:1280, margin:'0 auto' }}>
        <SectionHead tag="06 // Contact" title="Open Channel" sub="Available for freelance & full-time roles" color={PINK} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64 }} className="grid-cols-1 md:grid-cols-2">
          {/* Info */}
          <div>
            <p style={{ fontSize:18, lineHeight:1.8, color:'rgba(255,255,255,0.5)', marginBottom:40 }}>
              Got an idea? Let's build something that matters. I respond fast — usually within 24 hours.
            </p>
            {[
              email&&{ href:`mailto:${email}`, label:'Email', value:email, c:CYAN },
              links.linkedin&&{ href:links.linkedin, label:'LinkedIn', value:'View Profile ↗', c:PURPLE },
              links.github&&{ href:links.github, label:'GitHub', value:'View Repos ↗', c:PINK },
            ].filter(Boolean).map(item=>(
              <a key={item.label} href={item.href} target={item.label!=='Email'?'_blank':undefined} rel="noreferrer"
                 style={{ display:'flex', alignItems:'center', gap:20, padding:'16px 20px', marginBottom:8,
                   border:`1px solid transparent`, textDecoration:'none', transition:'all 0.3s' }}
                 onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${item.c}30`; e.currentTarget.style.background=`${item.c}06`; }}
                 onMouseLeave={e=>{ e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.background='transparent'; }}>
                <div style={{ width:42, height:42, border:`1px solid ${item.c}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:item.c, boxShadow:`0 0 10px ${item.c}` }} />
                </div>
                <div>
                  <div style={{ fontFamily:MONO, fontSize:9, letterSpacing:'0.5em', textTransform:'uppercase', opacity:0.3, marginBottom:2 }}>{item.label}</div>
                  <div style={{ fontFamily:MONO, fontSize:13, color:item.c }}>{item.value}</div>
                </div>
              </a>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={onSubmit}>
            {sent&&(
              <div style={{ padding:'12px 20px', marginBottom:20, fontFamily:MONO, fontSize:11, fontWeight:700,
                letterSpacing:'0.35em', textTransform:'uppercase', textAlign:'center', color:CYAN,
                border:`1px solid ${CYAN}40`, background:`${CYAN}08` }}>
                Signal Received ✓
              </div>
            )}
            {[{name:'name',label:'Name',type:'text',ph:'Your Name'},{name:'email',label:'Email',type:'email',ph:'you@domain.com'}].map(f=>(
              <div key={f.name} style={{ marginBottom:20 }}>
                <label style={{ display:'block', fontFamily:MONO, fontSize:9, fontWeight:700, letterSpacing:'0.5em',
                  textTransform:'uppercase', opacity:0.3, marginBottom:8 }}>{f.label}</label>
                <input name={f.name} type={f.type} value={form[f.name]} onChange={onChange} required placeholder={f.ph}
                       style={{ width:'100%', padding:'14px 18px', fontFamily:MONO, fontSize:13, background:'transparent',
                         border:`1px solid rgba(255,255,255,0.1)`, color:'rgba(255,255,255,0.8)', outline:'none',
                         transition:'border-color 0.2s', boxSizing:'border-box' }}
                       onFocus={e=>e.currentTarget.style.borderColor=PINK}
                       onBlur={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'} />
              </div>
            ))}
            <div style={{ marginBottom:28 }}>
              <label style={{ display:'block', fontFamily:MONO, fontSize:9, fontWeight:700, letterSpacing:'0.5em',
                textTransform:'uppercase', opacity:0.3, marginBottom:8 }}>Message</label>
              <textarea name="message" value={form.message} onChange={onChange} required rows={6} placeholder="Your message..."
                        style={{ width:'100%', padding:'14px 18px', fontFamily:MONO, fontSize:13, background:'transparent',
                          border:`1px solid rgba(255,255,255,0.1)`, color:'rgba(255,255,255,0.8)', outline:'none',
                          resize:'none', transition:'border-color 0.2s', boxSizing:'border-box' }}
                        onFocus={e=>e.currentTarget.style.borderColor=PINK}
                        onBlur={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'} />
            </div>
            <button type="submit" style={{ width:'100%', padding:'16px', fontFamily:MONO, fontSize:12, fontWeight:700,
              letterSpacing:'0.4em', textTransform:'uppercase', background:PINK, color:'#fff', border:'none',
              cursor:'pointer', boxShadow:`0 0 30px ${PINK}40`, transition:'all 0.3s' }}
              onMouseEnter={e=>{ e.currentTarget.style.background=PURPLE; e.currentTarget.style.boxShadow=`0 0 30px ${PURPLE}50`; }}
              onMouseLeave={e=>{ e.currentTarget.style.background=PINK; e.currentTarget.style.boxShadow=`0 0 30px ${PINK}40`; }}>
              Send Signal →
            </button>
          </form>
        </div>
      </section>

      {/* ════════════════════════════════════
          FOOTER
      ════════════════════════════════════ */}
      <footer style={{ position:'relative', zIndex:10, padding:'64px 48px', borderTop:`1px solid rgba(255,255,255,0.05)`, background:VOID2 }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:48, marginBottom:48 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                <div style={{ width:8, height:8, background:PINK, clipPath:'polygon(50% 0%,100% 50%,50% 100%,0% 50%)', boxShadow:`0 0 10px ${PINK}` }} />
                <span style={{ fontFamily:MONO, fontSize:12, fontWeight:700, letterSpacing:'0.4em', textTransform:'uppercase' }}>{name.split(' ')[0]}_folio</span>
              </div>
              <p style={{ fontSize:13, opacity:0.3, lineHeight:1.6 }}>{headline}</p>
            </div>
            <div>
              <div style={{ fontFamily:MONO, fontSize:9, letterSpacing:'0.5em', textTransform:'uppercase', opacity:0.2, marginBottom:16 }}>Navigate</div>
              {navLinks.map(l=>(
                <a key={l.href} href={l.href} style={{ display:'block', fontFamily:MONO, fontSize:12, opacity:0.35,
                  textDecoration:'none', color:'#fff', marginBottom:10, letterSpacing:'0.2em', transition:'all 0.2s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.opacity='1'; e.currentTarget.style.color=PINK; }}
                  onMouseLeave={e=>{ e.currentTarget.style.opacity='0.35'; e.currentTarget.style.color='#fff'; }}>
                  {l.label}
                </a>
              ))}
            </div>
            <div>
              <div style={{ fontFamily:MONO, fontSize:9, letterSpacing:'0.5em', textTransform:'uppercase', opacity:0.2, marginBottom:16 }}>Connect</div>
              {links.github&&<a href={links.github} target="_blank" rel="noreferrer" style={{ display:'block', fontFamily:MONO, fontSize:12, opacity:0.35, textDecoration:'none', color:'#fff', marginBottom:10, transition:'all 0.2s' }} onMouseEnter={e=>{ e.currentTarget.style.opacity='1'; e.currentTarget.style.color=PINK; }} onMouseLeave={e=>{ e.currentTarget.style.opacity='0.35'; e.currentTarget.style.color='#fff'; }}>GitHub ↗</a>}
              {links.linkedin&&<a href={links.linkedin} target="_blank" rel="noreferrer" style={{ display:'block', fontFamily:MONO, fontSize:12, opacity:0.35, textDecoration:'none', color:'#fff', marginBottom:10, transition:'all 0.2s' }} onMouseEnter={e=>{ e.currentTarget.style.opacity='1'; e.currentTarget.style.color=PURPLE; }} onMouseLeave={e=>{ e.currentTarget.style.opacity='0.35'; e.currentTarget.style.color='#fff'; }}>LinkedIn ↗</a>}
              {email&&<a href={`mailto:${email}`} style={{ display:'block', fontFamily:MONO, fontSize:12, opacity:0.35, textDecoration:'none', color:'#fff', marginBottom:10, transition:'all 0.2s' }} onMouseEnter={e=>{ e.currentTarget.style.opacity='1'; e.currentTarget.style.color=CYAN; }} onMouseLeave={e=>{ e.currentTarget.style.opacity='0.35'; e.currentTarget.style.color='#fff'; }}>Email ↗</a>}
            </div>
          </div>
          <GlowLine color={PURPLE} className="mb-8" />
          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', gap:12 }}>
            <span style={{ fontFamily:MONO, fontSize:10, opacity:0.2, letterSpacing:'0.3em', textTransform:'uppercase' }}>© {new Date().getFullYear()} {name}</span>
            <span style={{ fontFamily:MONO, fontSize:10, opacity:0.2, letterSpacing:'0.3em', textTransform:'uppercase' }}>PortForge_Tokyo_v1</span>
          </div>
        </div>
      </footer>

      <style>{`
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        ::selection { background: rgba(255,0,110,0.4); color: #fff; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
        @media (max-width: 768px) { section { padding-left: 24px !important; padding-right: 24px !important; } }

        /* ── TOKYO RGB GLITCH on hero name ── */
        .tokyo-glitch {
          position: relative;
          display: inline-block;
        }
        .tokyo-glitch::before,
        .tokyo-glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          background: transparent;
        }
        .tokyo-glitch::before {
          color: #ff006e;
          clip-path: polygon(0 20%, 100% 20%, 100% 50%, 0 50%);
          animation: rgb-split-1 4s infinite;
        }
        .tokyo-glitch::after {
          color: #00f5d4;
          clip-path: polygon(0 55%, 100% 55%, 100% 80%, 0 80%);
          animation: rgb-split-2 4.3s infinite;
        }
        @keyframes rgb-split-1 {
          0%,88%   { transform: none; opacity: 0; }
          89%      { transform: translateX(-6px); opacity: 0.9; }
          90%      { transform: translateX(6px) skewX(-5deg); opacity: 0.9; }
          91%      { transform: translateX(-3px); opacity: 0.7; }
          92%,100% { transform: none; opacity: 0; }
        }
        @keyframes rgb-split-2 {
          0%,84%   { transform: none; opacity: 0; }
          85%      { transform: translateX(8px); opacity: 0.9; }
          86%      { transform: translateX(-6px) skewX(4deg); opacity: 0.9; }
          87%      { transform: translateX(3px); opacity: 0.7; }
          88%,100% { transform: none; opacity: 0; }
        }

        /* ── NEON FLICKER on pink elements ── */
        .neon-flicker {
          animation: flicker 6s linear infinite;
        }
        @keyframes flicker {
          0%,19%,21%,23%,25%,54%,56%,100% {
            box-shadow: 0 0 20px rgba(255,0,110,0.4), 0 0 60px rgba(255,0,110,0.2);
          }
          20%,22%,24%,55% {
            box-shadow: none;
          }
        }

        /* ── GRID SCAN SWEEP ── */
        @keyframes grid-scan {
          0%   { transform: translateY(-100vh); opacity: 0.6; }
          100% { transform: translateY(100vh); opacity: 0.6; }
        }
        .grid-scan {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, rgba(0,245,212,0.4), transparent);
          animation: grid-scan 10s linear infinite;
          pointer-events: none;
          z-index: 6;
        }

        /* ── NEON BORDER PULSE ── */
        @keyframes border-pulse {
          0%,100% { border-color: rgba(255,0,110,0.2); }
          50%     { border-color: rgba(255,0,110,0.7); box-shadow: 0 0 16px rgba(255,0,110,0.2); }
        }
      `}</style>
    </div>
  );
};
