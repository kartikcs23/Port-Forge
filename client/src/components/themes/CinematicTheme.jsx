import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════
   CINEMATIC THEME — A Cinematic Journey (Sakura → Neon Tokyo)
   Six pinned, scroll-scrubbed chapters: Spring Gate, Tokyo Drift
   Skills, Samurai Project Showcase, Achievement Ascension,
   Summer Festival, Neon Tokyo Contact.
 ═══════════════════════════════════════════════════════ */

const PINK = '#f472b6';
const CYAN = '#22d3ee';
const PURPLE = '#a855f7';
const SERIF = `'Shippori Mincho', serif`;
const SANS = `'Zen Kaku Gothic New', sans-serif`;
const ASSET = '/assets/themes/cinematic-jp';

const DRIFT_FRAME_COUNT = 40;
const DRAW_FRAME_COUNT = 12; // only the first 12 of 20 available frames are scrubbed
const END_FRAME_COUNT = 9;
const BLAST_FRAME_COUNT = 24;

const DEFAULT_SKILLS = ['React', 'Node.js', 'TypeScript', 'Python', 'Docker', 'AWS', 'PostgreSQL', 'Git'];
const SKILL_POS = [
  ['30%', '18%'], ['17%', '29%'], ['9%', '42%'], ['19%', '54%'],
  ['36%', '65%'], ['53%', '73%'], ['67%', '69%'], ['74%', '58%'],
];

const DEFAULT_PROJECTS = [
  { name: 'Pantry Guardian', description: 'Smart pantry tracker with expiry alerts.', language: 'React · Node · PostgreSQL', repoUrl: '#' },
  { name: 'Carbon-Aware Cloud Scheduler', description: 'Schedules workloads to greener regions and hours.', language: 'Python · AWS · Kubernetes', repoUrl: '#' },
  { name: 'Airflow Spark Medallion Pipeline', description: 'Bronze / Silver / Gold lakehouse pipeline.', language: 'Airflow · Spark · Delta Lake', repoUrl: '#' },
  { name: 'Photo Editor', description: 'Browser-based non-destructive photo editing.', language: 'React · WebGL · Canvas', repoUrl: '#' },
];

const DEFAULT_ACHIEVEMENTS = [
  { title: 'National Hackathon Winner', color: '#93c5fd', glow: '#3b82f6', bg: 'rgba(8,10,25,0.55)', border: 'rgba(147,197,253,0.4)' },
  { title: 'Open Source Contribution', color: '#fecaca', glow: '#ef4444', bg: 'rgba(25,8,10,0.55)', border: 'rgba(252,165,165,0.4)' },
];

const DEFAULT_HOBBIES = ['Gym', 'Reading', 'Photography', 'Anime', 'Gaming', 'Open Source', 'Travelling', 'Music', 'Thank You For Visiting'];
const FW_COLOR_SETS = [
  ['#f472b6', '#fff', '#a855f7'], ['#22d3ee', '#fff', '#a855f7'], ['#f472b6', '#22d3ee', '#fff'],
  ['#a855f7', '#fff', '#f472b6'], ['#ef4444', '#fff', '#f472b6'], ['#22d3ee', '#a855f7', '#fff'],
  ['#f472b6', '#a855f7', '#22d3ee'], ['#fff', '#22d3ee', '#f472b6'], ['#f472b6', '#22d3ee', '#a855f7', '#fff'],
];
const FW_POSITIONS = [
  ['20%', '20%'], ['70%', '16%'], ['35%', '30%'], ['82%', '32%'], ['15%', '38%'],
  ['55%', '14%'], ['28%', '44%'], ['65%', '40%'], ['50%', '22%'],
];

/* ── Firework burst — radial CSS particle explosion ── */
const FireworkBurst = ({ colors = ['#fff', CYAN, PINK, PURPLE] }) => {
  const n = 18;
  const particles = Array.from({ length: n }, (_, i) => {
    const ang = ((360 / n) * i + (i % 2 ? 6 : 0)).toFixed(1);
    const dist = 70 + ((i * 13) % 50);
    const color = colors[i % colors.length];
    const dur = (1.1 + (i % 5) * 0.12).toFixed(2);
    const delay = ((i % 7) * 0.07).toFixed(2);
    const size = 4 + (i % 3) * 2;
    return { i, ang, dist, color, dur, delay, size };
  });
  return (
    <div style={{ position: 'absolute', width: 10, height: 10, pointerEvents: 'none' }}>
      {particles.map((p) => (
        <div
          key={p.i}
          style={{
            position: 'absolute', top: '50%', left: '50%', width: p.size, height: p.size, borderRadius: '50%',
            background: p.color, boxShadow: `0 0 10px ${p.color}, 0 0 2px #fff`,
            '--ang': `${p.ang}deg`, '--dist': `${p.dist}px`,
            transform: 'translate(-50%,-50%)',
            animation: `fwParticle ${p.dur}s ease-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

const pad2 = (n) => String(n).padStart(2, '0');

export const CinematicTheme = ({ rootUser, profile, repos = [] }) => {
  const name = profile?.name || rootUser?.name || 'Haruki Sato';
  const headline = profile?.headline || 'Data Engineer · Full-Stack Developer';
  const bio = profile?.bio || 'A single scroll, like a single breath — spring to neon, beginning to end.';
  const intro = profile?.intro || bio;
  const email = profile?.email || rootUser?.email || '';
  const links = profile?.links || {};
  const resumeUrl = profile?.resumeUrl || '';
  const avatar = profile?.avatarUrl || profile?.avatar || '';

  const skills = (profile?.skills?.length ? profile.skills : DEFAULT_SKILLS).slice(0, 8);
  const achievements = profile?.achievements?.length
    ? profile.achievements.slice(0, 2).map((a, i) => ({ ...DEFAULT_ACHIEVEMENTS[i], title: a.title || a }))
    : DEFAULT_ACHIEVEMENTS;
  const hobbies = profile?.hobbies?.length ? profile.hobbies.slice(0, 9) : DEFAULT_HOBBIES;

  const projects = (repos.length ? repos : DEFAULT_PROJECTS).slice(0, 4);
  const projectsLeft = projects.slice(0, 2);
  const projectsRight = projects.slice(2, 4);

  const containerRef = useRef(null);
  const r = useRef({});
  const set = (key) => (el) => { r.current[key] = el; };

  /* ── Deterministic particle field generation (matches original design) ── */
  const petals = useMemo(() => Array.from({ length: 24 }, (_, i) => {
    const left = (i * 37) % 100;
    const size = 6 + (i % 5) * 2;
    const drift = (i % 2 ? 1 : -1) * (30 + (i * 7) % 60);
    const dur = 9 + (i % 6) * 1.4;
    const delay = (i * 0.6) % 12;
    const color = i % 3 === 0 ? '#ffffff' : (i % 3 === 1 ? '#ffc2dc' : '#ffd7e6');
    return { key: i, left, size, drift, dur, delay, color };
  }), []);

  const dust = useMemo(() => Array.from({ length: 20 }, (_, i) => {
    const left = (i * 47) % 100;
    const top = (i * 23) % 100;
    const dx = (i % 2 ? 1 : -1) * (10 + (i * 3) % 30);
    const dy = -20 - (i * 5) % 40;
    const size = 2 + (i % 3);
    const dur = 5 + (i % 5);
    return { key: i, left, top, dx, dy, size, dur, delay: i * 0.2 };
  }), []);

  const rain = useMemo(() => Array.from({ length: 40 }, (_, i) => {
    const left = (i * 53) % 100;
    const dur = 0.6 + (i % 5) * 0.15;
    const delay = (i * 0.13) % 3;
    const height = 18 + (i % 4) * 6;
    return { key: i, left, dur, delay, height };
  }), []);

  const lanterns = useMemo(() => Array.from({ length: 6 }, (_, i) => ({
    key: i, left: 10 + i * 15, delay: i * 0.3,
  })), []);

  const fireworkBursts = useMemo(() => hobbies.map((hobby, i) => ({
    key: i, hobby, colors: FW_COLOR_SETS[i % FW_COLOR_SETS.length],
    left: FW_POSITIONS[i % FW_POSITIONS.length][0], top: FW_POSITIONS[i % FW_POSITIONS.length][1],
  })), [hobbies]);

  /* ── GSAP scroll choreography ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Preload frame sequences
      const cache = {};
      const preload = (folder, count, ext, prefix = 'f') => {
        for (let i = 0; i < count; i++) {
          const src = `${ASSET}/${folder}/${prefix}${pad2(i)}.${ext}`;
          if (!cache[src]) { const im = new Image(); im.src = src; cache[src] = im; }
        }
      };
      preload('drift-frames', DRIFT_FRAME_COUNT, 'jpg');
      preload('samurai-draw-seq', 20, 'webp');
      preload('samurai-end-seq', END_FRAME_COUNT, 'webp');
      preload('ch3-blast-seq', BLAST_FRAME_COUNT, 'webp');

      // Progress rail
      const chapterIds = ['ch0', 'ch1', 'ch2', 'ch3', 'ch4', 'ch5'];
      chapterIds.forEach((id, i) => {
        ScrollTrigger.create({
          trigger: `#${id}`, start: 'top center', end: 'bottom center',
          onToggle: (self) => {
            const dot = r.current[`dot${i}`];
            if (dot) {
              dot.style.background = self.isActive ? PINK : '#ffffff55';
              dot.style.transform = self.isActive ? 'scale(1.6)' : 'scale(1)';
            }
          },
        });
      });

      // ===== CHAPTER 0 — Spring Gate =====
      const scrollTextWidth = (r.current.ch0ScrollText?.offsetWidth || 500) + 20;
      gsap.timeline({ scrollTrigger: { trigger: '#ch0', start: 'top top', end: 'bottom bottom', scrub: 0.6 } })
        .to(r.current.ch0TreeLeft, { x: '-110%', duration: 0.4, ease: 'none' }, 0)
        .to(r.current.ch0TreeRight, { x: '110%', duration: 0.4, ease: 'none' }, 0)
        .to([r.current.ch0TreeLeft, r.current.ch0TreeRight], { scale: 2.6, filter: 'blur(10px)', opacity: 0, duration: 0.85, ease: 'none' }, 0)
        .to(r.current.ch0Bg, { scale: 1.35, ease: 'none', duration: 1 }, 0)
        .to(r.current.ch0Title, { opacity: 0, y: -50, duration: 0.35 }, 0.05)
        .to(r.current.ch0ScrollHint, { opacity: 0, duration: 0.15 }, 0)
        .to(r.current.ch0Info, { opacity: 1, duration: 0.25 }, 0.45)
        .fromTo(r.current.ch0ScrollWrap, { width: '0px' }, { width: scrollTextWidth, duration: 0.2, ease: 'power2.out' }, 0.48)
        .to(r.current.ch0Info, { opacity: 0, duration: 0.15 }, 0.85)
        .to(r.current.ch0Petals, { opacity: 0.3, duration: 0.15 }, 0.85);

      // ===== CHAPTER 1 — Tokyo Drift Skills =====
      const driftImgEl = r.current.ch1Bg;
      ScrollTrigger.create({
        trigger: '#ch1', start: 'top top', end: 'bottom bottom', scrub: 0.6,
        onUpdate: (self) => {
          const idx = Math.min(DRIFT_FRAME_COUNT - 1, Math.floor(self.progress * DRIFT_FRAME_COUNT));
          const src = `${ASSET}/drift-frames/f${pad2(idx)}.jpg`;
          if (driftImgEl && driftImgEl.src.indexOf(src) === -1) driftImgEl.src = src;
        },
      });
      const tl1 = gsap.timeline({ scrollTrigger: { trigger: '#ch1', start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
      skills.forEach((_, i) => {
        const t = 0.16 + i * (0.82 / skills.length);
        tl1.to(r.current[`skill${i}`], { opacity: 1, y: 0, duration: 0.08 }, t);
      });

      // ===== CHAPTER 2 — Samurai Project Showcase =====
      const drawImgEl = r.current.ch2SamuraiStand;
      const endImgEl = r.current.ch2SamuraiSheath;
      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: '#ch2', start: 'top top', end: 'bottom bottom', scrub: 0.6,
          onUpdate: (self) => {
            const t = self.progress;
            if (t >= 0.05 && t <= 0.2) {
              const local = (t - 0.05) / 0.15;
              const idx = Math.max(0, Math.min(DRAW_FRAME_COUNT - 1, Math.floor(local * DRAW_FRAME_COUNT)));
              const src = `${ASSET}/samurai-draw-seq/f${pad2(idx)}.webp`;
              if (drawImgEl && drawImgEl.src.indexOf(src) === -1) drawImgEl.src = src;
            }
            if (t >= 0.22) {
              const local = Math.min(1, (t - 0.22) / 0.45);
              const idx = Math.max(0, Math.min(END_FRAME_COUNT - 1, Math.floor(local * END_FRAME_COUNT)));
              const src = `${ASSET}/samurai-end-seq/f${pad2(idx)}.webp`;
              if (endImgEl && endImgEl.src.indexOf(src) === -1) endImgEl.src = src;
            }
          },
        },
      });
      tl2.to(r.current.ch2SamuraiStand, { x: -10, duration: 0.05 }, 0.15)
        .to(r.current.ch2Flash, { opacity: 1, duration: 0.06 }, 0.2)
        .to(r.current.ch2Flash, { opacity: 0, duration: 0.1 }, 0.27)
        .set(r.current.ch2SamuraiStand, { opacity: 0 }, 0.22)
        .set(r.current.ch2SamuraiSheath, { opacity: 1 }, 0.22)
        .to(r.current.ch2PanelLeft, { clipPath: 'polygon(0 0,100% 0,82% 100%,0 100%)', duration: 0.01 }, 0.22)
        .to(r.current.ch2PanelRight, { clipPath: 'polygon(18% 0,100% 0,100% 100%,0 100%)', duration: 0.01 }, 0.22)
        .fromTo(r.current.ch2Slash, { opacity: 1 }, { opacity: 1, duration: 0.01 }, 0.23)
        .to(r.current.ch2SlashLine, { strokeDashoffset: -900, duration: 0.15 }, 0.23)
        .to(r.current.ch2Slash, { opacity: 0, duration: 0.15 }, 0.42)
        .to(r.current.ch2PanelLeft, { x: '-124%', y: 30, rotation: -4, duration: 0.2 }, 0.27)
        .to(r.current.ch2PanelRight, { x: '24%', y: -30, rotation: 4, duration: 0.2 }, 0.27);

      // ===== CHAPTER 3 — Achievement Ascension =====
      const blastImgEl = r.current.ch3BlastImg;
      ScrollTrigger.create({
        trigger: '#ch3', start: 'top top', end: 'bottom bottom', scrub: 0.6,
        onUpdate: (self) => {
          const t = Math.min(1, Math.max(0, (self.progress - 0.06) / 0.74));
          const idx = Math.max(0, Math.min(BLAST_FRAME_COUNT - 1, Math.floor(t * BLAST_FRAME_COUNT)));
          const src = `${ASSET}/ch3-blast-seq/f${pad2(idx)}.webp`;
          if (blastImgEl && blastImgEl.src.indexOf(src) === -1) blastImgEl.src = src;
        },
      });
      gsap.timeline({ scrollTrigger: { trigger: '#ch3', start: 'top top', end: 'bottom bottom', scrub: 0.6 } })
        .to(r.current.ch3AchvBlue, { opacity: 0, y: -10, duration: 0.05 }, 0.2)
        .to(r.current.ch3AchvRed, { opacity: 0, y: -10, duration: 0.05 }, 0.2)
        .to(r.current.ch3Achievement, { opacity: 1, duration: 0.1 }, 0.4)
        .to(r.current.ch3Achievement, { opacity: 0, duration: 0.08 }, 0.74)
        .to(r.current.ch3Fireworks, { opacity: 1, duration: 0.05 }, 0.78)
        .to(r.current.ch3BridgeFlash, { opacity: 1, duration: 0.1 }, 0.86)
        .to(r.current.ch3Lanterns, { opacity: 1, duration: 0.15 }, 0.9)
        .to(r.current.ch3Fireworks, { opacity: 0.4, duration: 0.15 }, 0.9);

      // ===== CHAPTER 4 — Summer Festival =====
      gsap.timeline({
        scrollTrigger: {
          trigger: '#ch4', start: 'top top', end: 'bottom bottom', scrub: 0.6,
          onUpdate: (self) => {
            if (r.current.ch3BridgeFlash) r.current.ch3BridgeFlash.style.opacity = Math.max(0, 1 - self.progress / 0.12);
          },
        },
      });
      const tl4 = gsap.timeline({ scrollTrigger: { trigger: '#ch4', start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
      fireworkBursts.forEach((_, i) => {
        const t = 0.05 + i * (0.9 / fireworkBursts.length);
        tl4.to(r.current[`fw${i}`], { opacity: 1, duration: 0.06 }, t)
          .to(r.current[`fwlabel${i}`], { opacity: 1, duration: 0.08 }, t + 0.02)
          .to(r.current[`fwlabel${i}`], { opacity: 0, duration: 0.08 }, t + 0.09)
          .to(r.current[`fw${i}`], { opacity: 0, duration: 0.08 }, t + 0.1);
      });

      // ===== CHAPTER 5 — Neon Tokyo =====
      gsap.to(r.current.ch5Train, { x: '160vw', duration: 6, repeat: -1, ease: 'none', delay: 1 });
      const v = r.current.ch5DanceVideo;
      if (v) {
        v.muted = true; v.volume = 0; v.loop = true;
        v.addEventListener('timeupdate', () => { if (v.currentTime < 0.6) v.currentTime = 0.6; });
        v.addEventListener('loadedmetadata', () => { v.currentTime = 0.6; });
        v.currentTime = 0.6;
        v.play().catch(() => {});
      }
      gsap.timeline({ scrollTrigger: { trigger: '#ch5', start: 'top top', end: 'bottom bottom', scrub: 0.6 } })
        .to(r.current.ch5Content, { scale: 0.94, duration: 1 }, 0.6);

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, containerRef.current);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', background: '#07070d', fontFamily: SANS, color: '#f5f5f7', overflowX: 'clip' }}>

      {/* Progress rail */}
      <div style={{ position: 'fixed', right: 18, top: '50%', transform: 'translateY(-50%)', zIndex: 500, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} ref={set(`dot${i}`)} style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffffff55', transition: 'background 0.4s, transform 0.4s' }} />
        ))}
      </div>

      {/* ============ CHAPTER 0 — SPRING GATE ============ */}
      <section id="ch0" style={{ position: 'relative', height: '230vh' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#bfe6f5' }}>
          <img ref={set('ch0Bg')} src={`${ASSET}/park-sky.png`} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom', transform: 'scale(1)' }} />
          <img src={`${ASSET}/cloud.png`} alt="" style={{ position: 'absolute', top: '10%', left: '6%', width: 220, opacity: 0.9, animation: 'cloudDrift 18s ease-in-out infinite alternate' }} />
          <img src={`${ASSET}/cloud.png`} alt="" style={{ position: 'absolute', top: '16%', left: '56%', width: 280, opacity: 0.85, animation: 'cloudDrift 24s ease-in-out infinite alternate-reverse' }} />
          <img src={`${ASSET}/cloud.png`} alt="" style={{ position: 'absolute', top: '6%', left: '76%', width: 170, opacity: 0.8, animation: 'cloudDrift 15s ease-in-out infinite alternate' }} />

          <svg style={{ position: 'absolute', top: '22%', left: 0, width: 36, height: 16, animation: 'birdFly 12s linear infinite 2s' }} viewBox="0 0 36 16"><path d="M2,10 Q9,0 18,9 Q27,0 34,10" stroke="#2b2b3a" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
          <svg style={{ position: 'absolute', top: '30%', left: 0, width: 28, height: 13, animation: 'birdFly 15s linear infinite 6s' }} viewBox="0 0 36 16"><path d="M2,10 Q9,0 18,9 Q27,0 34,10" stroke="#2b2b3a" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>

          <img ref={set('ch0TreeLeft')} src={`${ASSET}/sakura-tree.png`} alt="" style={{ position: 'absolute', left: '-10%', bottom: '-8%', height: '105%', width: 'auto', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.25))' }} />
          <div ref={set('ch0TreeRight')} style={{ position: 'absolute', right: '-10%', bottom: '-8%', height: '105%', width: 'auto' }}>
            <img src={`${ASSET}/sakura-tree.png`} alt="" style={{ height: '100%', width: 'auto', display: 'block', transform: 'scaleX(-1)', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.25))' }} />
          </div>

          <div ref={set('ch0Petals')} style={{ position: 'absolute', inset: 0 }}>
            {petals.map((p) => (
              <div key={p.key} style={{
                position: 'absolute', top: '-5%', left: `${p.left}%`, width: p.size, height: p.size,
                borderRadius: '50% 0 50% 50%', background: p.color, opacity: 0.85,
                '--drift': `${p.drift}px`, animation: `petalFall ${p.dur}s linear ${p.delay}s infinite`,
              }} />
            ))}
          </div>

          <div ref={set('ch0Title')} style={{ position: 'absolute', top: '44%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
            <div style={{ fontFamily: SERIF, fontSize: 'clamp(40px,7vw,90px)', fontWeight: 800, letterSpacing: '0.08em', color: '#2b2b3a', textShadow: '0 4px 30px rgba(255,255,255,0.6)' }}>{name}</div>
            <div style={{ marginTop: 14, fontSize: 'clamp(14px,1.6vw,20px)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'inline-block' }}>
              <span style={{ background: 'linear-gradient(180deg,transparent 55%,#ffe066a0 55%)', color: '#2b2b3a', padding: '0 4px' }}>{headline}</span>
            </div>
          </div>

          <div ref={set('ch0ScrollHint')} style={{ position: 'absolute', bottom: '6%', left: '50%', transform: 'translateX(-50%)', color: '#2b2b3a99', fontSize: 13, letterSpacing: '0.2em', textAlign: 'center' }}>
            <div>SCROLL TO BEGIN</div>
            <div style={{ fontSize: 20, marginTop: 6 }}>↓</div>
          </div>

          <div ref={set('ch0Info')} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-40%)', opacity: 0, textAlign: 'center', width: 'min(560px, 80vw)' }}>
            <div style={{ textAlign: 'center' }}>
              <div ref={set('ch0ScrollWrap')} style={{ position: 'relative', display: 'inline-block', overflow: 'hidden', width: 0, height: 'clamp(64px,7.5vw,92px)', verticalAlign: 'middle', background: 'linear-gradient(180deg,#f6ecd0ee,#efe0b8ee)', boxShadow: '0 6px 24px rgba(0,0,0,0.18)', borderRadius: 2 }}>
                <div style={{ position: 'absolute', left: 0, top: -8, bottom: -8, width: 12, background: 'linear-gradient(90deg,#5a3a20,#a06a3c 50%,#5a3a20)', borderRadius: 6, boxShadow: '2px 0 6px rgba(0,0,0,0.35)' }} />
                <div style={{ position: 'absolute', right: 0, top: -8, bottom: -8, width: 12, background: 'linear-gradient(270deg,#5a3a20,#a06a3c 50%,#5a3a20)', borderRadius: 6, boxShadow: '-2px 0 6px rgba(0,0,0,0.35)' }} />
                <div ref={set('ch0ScrollText')} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', whiteSpace: 'nowrap', padding: '0 42px' }}>
                  <span style={{ fontFamily: SERIF, fontSize: 'clamp(30px,4.4vw,50px)', fontWeight: 800, letterSpacing: '0.06em', color: '#2b2118', textTransform: 'uppercase' }}>A Cinematic Journey</span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 20, fontFamily: SERIF, fontSize: 'clamp(20px,2.2vw,28px)', color: '#3a3a48', lineHeight: 1.6, fontStyle: 'italic' }}>"{intro.length > 140 ? intro.slice(0, 140).trim() + '…' : intro}"</div>
          </div>
        </div>
      </section>

      {/* ============ CHAPTER 1 — TOKYO DRIFT SKILLS ============ */}
      <section id="ch1" style={{ position: 'relative', height: '400vh' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#0d0a14' }}>
          <img ref={set('ch1Bg')} src={`${ASSET}/drift-frames/f00.jpg`} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />

          {skills.map((s, i) => (
            <div key={s} ref={set(`skill${i}`)} style={{
              position: 'absolute', left: SKILL_POS[i % SKILL_POS.length][0], top: SKILL_POS[i % SKILL_POS.length][1],
              transform: 'translate(-50%,-50%) translateY(10px)', opacity: 0, padding: '10px 20px', borderRadius: 999,
              background: 'linear-gradient(135deg,rgba(20,18,37,0.85),rgba(35,20,50,0.85))', backdropFilter: 'blur(6px)',
              border: '1px solid rgba(244,114,182,0.4)', color: '#f5f0ff', fontWeight: 600, fontSize: 14, letterSpacing: '0.03em',
              boxShadow: '0 0 16px rgba(244,114,182,0.25), 0 4px 14px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
              whiteSpace: 'nowrap', userSelect: 'none',
            }}>{s}</div>
          ))}

          <div style={{ position: 'absolute', top: '8%', left: '6%', fontFamily: SERIF, fontSize: 'clamp(24px,3vw,40px)', color: '#fff', letterSpacing: '0.25em', textShadow: `0 0 20px ${PURPLE}` }}>SKILLS</div>
        </div>
      </section>

      {/* ============ CHAPTER 2 — SAMURAI PROJECT SHOWCASE ============ */}
      <section id="ch2" style={{ position: 'relative', height: '400vh' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#3a2418' }}>
          <img src={`${ASSET}/courtyard-bg.png`} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />

          <div ref={set('ch2Flash')} style={{ position: 'absolute', inset: 0, background: '#fff', opacity: 0, pointerEvents: 'none' }} />

          <svg ref={set('ch2Slash')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, pointerEvents: 'none' }} viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <line ref={set('ch2SlashLine')} x1="466" y1="950" x2="534" y2="50" stroke="#fff" strokeWidth="6" strokeDasharray="900" strokeDashoffset="900" style={{ filter: `drop-shadow(0 0 12px ${PURPLE})` }} />
          </svg>

          <img ref={set('ch2SamuraiStand')} src={`${ASSET}/samurai-draw-seq/f00.webp`} alt="" style={{ position: 'absolute', height: 328, width: 569, opacity: 1, zIndex: 20, filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.4))', left: '30%', top: '32%' }} />
          <img ref={set('ch2SamuraiSheath')} src={`${ASSET}/samurai-end-seq/f00.webp`} alt="" style={{ position: 'absolute', left: '-38px', height: '40%', width: 'auto', opacity: 0, zIndex: 20, filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.4))', top: '38%' }} />

          <div ref={set('ch2PanelLeft')} style={{ position: 'absolute', top: '16%', left: '50%', width: '38%', maxWidth: 420, transform: 'translateX(-100%)', opacity: 1, zIndex: 10, borderRadius: '14px 0 0 14px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.35)', clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)' }}>
            <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(18px) saturate(160%)', border: '1px solid rgba(255,255,255,0.22)', borderRight: 'none', padding: '22px 22px 22px 26px' }}>
              <div style={{ fontFamily: SERIF, fontSize: 'clamp(20px,2.2vw,28px)', color: '#fff', marginBottom: 16, textShadow: '0 0 20px #000' }}>PROJECTS</div>
              {projectsLeft.map((proj, i) => (
                <div key={proj._id || proj.name || i} style={{ background: 'rgba(10,8,20,0.55)', backdropFilter: 'blur(6px)', border: '1px solid rgba(244,114,182,0.35)', borderRadius: 10, padding: '16px 18px', marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 17, color: '#fff' }}>{proj.name}</div>
                  <div style={{ fontSize: 13, color: '#e4dcee', margin: '6px 0' }}>{proj.description}</div>
                  <div style={{ fontSize: 12, color: CYAN }}>{proj.language}</div>
                  <a href={proj.repoUrl || '#'} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: CYAN, textDecoration: 'none' }}>View repository →</a>
                </div>
              ))}
            </div>
          </div>

          <div ref={set('ch2PanelRight')} style={{ position: 'absolute', top: '16%', left: '50%', width: '38%', maxWidth: 420, transform: 'translateX(0%)', opacity: 1, zIndex: 10, borderRadius: '0 14px 14px 0', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.35)', clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)' }}>
            <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(18px) saturate(160%)', border: '1px solid rgba(255,255,255,0.22)', borderLeft: 'none', padding: '22px 26px 22px 22px' }}>
              <div style={{ height: 46 }} />
              {projectsRight.map((proj, i) => (
                <div key={proj._id || proj.name || i} style={{ background: 'rgba(10,8,20,0.55)', backdropFilter: 'blur(6px)', border: '1px solid rgba(34,211,238,0.35)', borderRadius: 10, padding: '16px 18px', marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 17, color: '#fff' }}>{proj.name}</div>
                  <div style={{ fontSize: 13, color: '#e4dcee', margin: '6px 0' }}>{proj.description}</div>
                  <div style={{ fontSize: 12, color: CYAN }}>{proj.language}</div>
                  <a href={proj.repoUrl || '#'} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: CYAN, textDecoration: 'none' }}>View repository →</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ CHAPTER 3 — ACHIEVEMENT ASCENSION ============ */}
      <section id="ch3" style={{ position: 'relative', height: '400vh' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#0a0614' }}>
          <img src={`${ASSET}/ch3-night-sky.jpg`} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0 }}>
            {dust.map((p) => (
              <div key={p.key} style={{
                position: 'absolute', left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, borderRadius: '50%',
                background: '#c9a3ff', '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, animation: `dustFloat ${p.dur}s ease-in-out ${p.delay}s infinite`,
              }} />
            ))}
          </div>

          <img ref={set('ch3BlastImg')} src={`${ASSET}/ch3-blast-seq/f00.webp`} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />

          <div ref={set('ch3AchvBlue')} style={{ position: 'absolute', top: '38%', left: '32%', transform: 'translate(-50%,-50%)', textAlign: 'center', opacity: 1, background: achievements[0].bg, backdropFilter: 'blur(4px)', borderRadius: 12, padding: '14px 20px', border: `1px solid ${achievements[0].border}` }}>
            <div style={{ fontSize: 12, letterSpacing: '0.25em', color: achievements[0].color, marginBottom: 6, fontWeight: 700 }}>ACHIEVEMENT 01</div>
            <div style={{ fontFamily: SERIF, fontSize: 'clamp(17px,1.9vw,24px)', color: '#fff', textShadow: `0 0 16px ${achievements[0].glow}, 0 2px 6px rgba(0,0,0,0.8)`, fontWeight: 600 }}>{achievements[0].title}</div>
          </div>
          <div ref={set('ch3AchvRed')} style={{ position: 'absolute', top: '38%', left: '68%', transform: 'translate(-50%,-50%)', textAlign: 'center', opacity: 1, background: achievements[1].bg, backdropFilter: 'blur(4px)', borderRadius: 12, padding: '14px 20px', border: `1px solid ${achievements[1].border}` }}>
            <div style={{ fontSize: 12, letterSpacing: '0.25em', color: achievements[1].color, marginBottom: 6, fontWeight: 700 }}>ACHIEVEMENT 02</div>
            <div style={{ fontFamily: SERIF, fontSize: 'clamp(17px,1.9vw,24px)', color: '#fff', textShadow: `0 0 16px ${achievements[1].glow}, 0 2px 6px rgba(0,0,0,0.8)`, fontWeight: 600 }}>{achievements[1].title}</div>
          </div>

          <div ref={set('ch3Fireworks')} style={{ position: 'absolute', top: '30%', left: '50%', opacity: 0 }}>
            <FireworkBurst colors={['#e2b8ff', PURPLE, '#fff', '#7c3aed']} />
          </div>

          <div ref={set('ch3Achievement')} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0, textAlign: 'center' }}>
            <div style={{ border: '2px solid #c9a3ff', borderRadius: 10, padding: '26px 40px', background: '#1a1024cc', boxShadow: `0 0 60px ${PURPLE}` }}>
              <div style={{ fontSize: 12, letterSpacing: '0.3em', color: '#c9a3ff', marginBottom: 10 }}>ULTIMATE ACHIEVEMENT</div>
              <div style={{ fontFamily: SERIF, fontSize: 'clamp(24px,3vw,38px)', color: '#fff' }}>{achievements[0].title}</div>
            </div>
          </div>

          <div ref={set('ch3Lanterns')} style={{ position: 'absolute', inset: 0, opacity: 0 }}>
            {lanterns.map((l) => (
              <div key={l.key} style={{
                position: 'absolute', bottom: 0, left: `${l.left}%`, width: 20, height: 26, borderRadius: '50% 50% 40% 40%',
                background: PINK, boxShadow: `0 0 14px ${PINK}`, animation: `lanternSway 3s ease-in-out ${l.delay}s infinite`,
              }} />
            ))}
          </div>
        </div>

        <div ref={set('ch3BridgeFlash')} style={{ position: 'fixed', inset: 0, background: `radial-gradient(circle,#fff 0%,#d8b4fe 35%,${PURPLE} 60%,transparent 100%)`, opacity: 0, pointerEvents: 'none', zIndex: 400 }} />
      </section>

      {/* ============ CHAPTER 4 — SUMMER FESTIVAL ============ */}
      <section id="ch4" style={{ position: 'relative', height: '350vh' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: 'linear-gradient(180deg,#0a0d24 0%,#141238 55%,#221a40 100%)' }}>
          <img src={`${ASSET}/ch4-scene.webp`} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom' }} />

          {fireworkBursts.map((fb, i) => (
            <React.Fragment key={fb.key}>
              <div ref={set(`fw${i}`)} style={{ position: 'absolute', top: fb.top, left: fb.left, opacity: 0 }}>
                <FireworkBurst colors={fb.colors} />
              </div>
              <div ref={set(`fwlabel${i}`)} style={{ position: 'absolute', top: `calc(${fb.top} + 60px)`, left: fb.left, transform: 'translate(-50%,-50%)', opacity: 0, fontFamily: SERIF, fontSize: 'clamp(18px,2vw,26px)', color: '#fff', textShadow: '0 0 16px #000', whiteSpace: 'nowrap' }}>{fb.hobby}</div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ============ CHAPTER 5 — NEON TOKYO ============ */}
      <section id="ch5" style={{ position: 'relative', height: '300vh' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: 'linear-gradient(180deg,#0a0a14 0%,#150e22 60%,#1c1228 100%)' }}>
          <div ref={set('ch5Content')}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '40%', background: 'linear-gradient(180deg,#0d0a18,#050308)' }} />
            <div style={{ position: 'absolute', bottom: '38%', left: 0, width: '100%', height: 2, background: `linear-gradient(90deg,${CYAN}00,${CYAN}88,${PINK}88,${PURPLE}00)`, opacity: 0.6 }} />

            <div style={{ position: 'absolute', bottom: '40%', left: '4%', width: 60, height: 130, background: '#1a1a24', border: '2px solid #333', borderRadius: 4 }}>
              <div style={{ position: 'absolute', top: 10, left: 6, right: 6, height: 60, background: CYAN, opacity: 0.5, boxShadow: `0 0 20px ${CYAN}` }} />
            </div>

            <div style={{ position: 'absolute', top: '14%', left: '14%', width: 110, height: 60, background: PINK, opacity: 0.85, borderRadius: 6, boxShadow: `0 0 30px ${PINK}`, animation: 'neonFlicker 5s infinite' }} />
            <div style={{ position: 'absolute', top: '26%', left: '30%', width: 80, height: 40, background: CYAN, opacity: 0.85, borderRadius: 6, boxShadow: `0 0 30px ${CYAN}`, animation: 'neonFlicker 6s infinite 1s' }} />
            <div style={{ position: 'absolute', top: '10%', right: '30%', width: 90, height: 50, background: PURPLE, opacity: 0.85, borderRadius: 6, boxShadow: `0 0 30px ${PURPLE}`, animation: 'neonFlicker 4s infinite 2s' }} />
            <div style={{ position: 'absolute', top: '20%', right: '12%', width: 70, height: 36, background: '#ef4444', opacity: 0.85, borderRadius: 6, boxShadow: '0 0 30px #ef4444', animation: 'neonFlicker 5.5s infinite 0.5s' }} />

            <div ref={set('ch5Train')} style={{ position: 'absolute', top: '6%', left: '-20%', width: '36%', height: '8%', background: '#2a2a38', borderBottom: '3px solid #444' }} />

            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', justifyContent: 'space-between', padding: '0 5% 6% 5%', gap: 24 }}>
              <div style={{ flex: '1 1 320px', maxWidth: 520, background: '#14101fcc', border: `1px solid ${PURPLE}55`, borderRadius: 14, padding: '36px 40px', backdropFilter: 'blur(6px)' }}>
                <div style={{ fontFamily: SERIF, fontSize: 'clamp(24px,2.6vw,34px)', color: '#fff', marginBottom: 10 }}>Let's Connect</div>
                <div style={{ fontSize: 14, color: '#c9c3d8', lineHeight: 1.6, marginBottom: 20 }}>{bio}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
                  <a href="#ch0" style={{ color: CYAN, textDecoration: 'none' }}>About Me</a>
                  {resumeUrl && <a href={resumeUrl} target="_blank" rel="noreferrer" style={{ color: CYAN, textDecoration: 'none' }}>Resume — Download</a>}
                  {links.github && <a href={links.github} target="_blank" rel="noreferrer" style={{ color: CYAN, textDecoration: 'none' }}>GitHub</a>}
                  {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" style={{ color: CYAN, textDecoration: 'none' }}>LinkedIn</a>}
                  {email && <a href={`mailto:${email}`} style={{ color: CYAN, textDecoration: 'none' }}>Email</a>}
                </div>
                <div style={{ marginTop: 20 }}>
                  <a href={email ? `mailto:${email}` : '#'} style={{ display: 'inline-block', padding: '12px 26px', borderRadius: 8, background: `linear-gradient(90deg,${PURPLE},${PINK})`, color: '#fff', fontWeight: 700, boxShadow: `0 0 24px ${PURPLE}66`, textDecoration: 'none' }}>Get In Touch</a>
                </div>
              </div>
              <div style={{ position: 'relative', flex: '0 0 auto', height: 428, width: 508, maxWidth: '90vw', overflow: 'hidden', borderRadius: 12, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}>
                <video ref={set('ch5DanceVideo')} src={`${ASSET}/ch5-dance.mp4`} autoPlay loop muted playsInline preload="auto" style={{ position: 'absolute', inset: 0, height: '100%', width: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
              </div>
            </div>

            <div style={{ position: 'absolute', top: '6%', left: '5%', fontFamily: SERIF, fontSize: 'clamp(16px,1.6vw,20px)', color: '#fff9', letterSpacing: '0.3em' }}>TOKYO // NIGHT</div>
          </div>

          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {rain.map((rp) => (
              <div key={rp.key} style={{
                position: 'absolute', top: '-10%', left: `${rp.left}%`, width: 1.5, height: rp.height,
                background: `linear-gradient(180deg,${CYAN}00,${CYAN}99)`, transform: 'rotate(12deg)',
                animation: `rainFall ${rp.dur}s linear ${rp.delay}s infinite`,
              }} />
            ))}
          </div>
        </div>
      </section>

      <style>{`
        html { scroll-behavior: smooth; }
        #ch0, #ch1, #ch2, #ch3, #ch4, #ch5 { box-sizing: border-box; }
        @keyframes petalFall {
          0% { transform: translate(0,-10vh) rotate(0deg); opacity:0; }
          8% { opacity:1; }
          100% { transform: translate(var(--drift,40px),110vh) rotate(360deg); opacity:0.15; }
        }
        @keyframes rainFall {
          0% { transform: translateY(-10vh); opacity:0.7; }
          100% { transform: translateY(110vh); opacity:0.15; }
        }
        @keyframes dustFloat {
          0%, 100% { transform: translate(0,0); opacity:0.25; }
          50% { transform: translate(var(--dx,20px),var(--dy,-30px)); opacity:0.8; }
        }
        @keyframes fwParticle {
          0% { transform: translate(-50%,-50%) rotate(var(--ang)) translateX(0) scale(1); opacity:1; }
          100% { transform: translate(-50%,-50%) rotate(var(--ang)) translateX(var(--dist)) scale(0.2); opacity:0; }
        }
        @keyframes cloudDrift {
          0% { transform: translateX(0); }
          100% { transform: translateX(60px); }
        }
        @keyframes birdFly {
          0% { transform: translate(-10vw,0); opacity:0; }
          10% { opacity:1; }
          90% { opacity:1; }
          100% { transform: translate(120vw,-6vh); opacity:0; }
        }
        @keyframes neonFlicker {
          0%, 100% { opacity:1; }
          45% { opacity:1; }
          47% { opacity:0.4; }
          49% { opacity:1; }
          72% { opacity:1; }
          73% { opacity:0.5; }
          75% { opacity:1; }
        }
        @keyframes lanternSway {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
      `}</style>
    </div>
  );
};
