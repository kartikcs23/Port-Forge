import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════
   PIXEL EGYPT PORTFOLIO — Scroll-driven cinematic theme
   Palette: Gold #FFD54A · Cyan #4DEBFF · Dark #15100a
   Fonts:   Pixelify Sans · Press Start 2P
═══════════════════════════════════════════════════════════ */

const GOLD   = '#FFD54A';
const CYAN   = '#4DEBFF';
const DARK   = '#15100a';
const DARK2  = '#181208';
const DARK3  = '#1c1208';
const PIX    = "'Press Start 2P', monospace";
const BODY   = "'Pixelify Sans', monospace";

const ASSET  = '/assets/themes/egyptian';

/* ── Hall of Scrolls: language accent colors ── */
const LANG_COLORS = {
  Python: '#4DEBFF', TypeScript: '#FFD54A', JavaScript: '#ffe040',
  Dockerfile: '#b06aff', HCL: '#ff9040', Go: '#4DEBFF', Java: '#f08c3c',
  Rust: '#ff7043', 'C++': '#a06cff', 'C#': '#a06cff', Ruby: '#ff6b6b',
  PHP: '#9C7CFF', HTML: '#ff6b6b', CSS: '#4DEBFF', Shell: '#9CFFB0',
};
const langColor = (lang) => LANG_COLORS[lang] || GOLD;

const DEFAULT_SCROLLS = [
  { name: 'nile-data-platform', description: 'Real-time ingestion & analytics — Spark, Airflow, AWS S3, Redshift. Processes millions of events daily.', language: 'Python', stars: 142, repoUrl: '#' },
  { name: 'ml-fraud-detector', description: 'ML-powered fraud detection API. XGBoost + feature store + FastAPI serving layer. 96% precision.', language: 'Python', stars: 87, repoUrl: '#' },
  { name: 'react-data-dashboard', description: 'Interactive analytics dashboard with React, Recharts and a live WebSocket feed. Dark-mode pixel UI.', language: 'TypeScript', stars: 63, repoUrl: '#' },
  { name: 'docker-airflow-stack', description: 'Production-ready Dockerized Airflow 2.x — Celery executor, Redis, Postgres, example DAGs.', language: 'Dockerfile', stars: 55, repoUrl: '#' },
  { name: 'aws-data-lake', description: 'Terraform IaC for a serverless AWS data lake — Glue, Athena, S3 partitioning, Lake Formation.', language: 'HCL', stars: 38, repoUrl: '#' },
  { name: 'egyptian-portfolio', description: 'This portfolio — scroll-driven pixel-art RPG with a custom 3D canvas renderer.', language: 'JavaScript', stars: 24, repoUrl: '#' },
];

/* ── Math helpers ── */
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp  = (a, b, t) => a + (b - a) * t;
const ease  = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const seg   = (p, a, b) => clamp((p - a) / (b - a));
const snap  = (v, ps) => Math.round(v / ps) * ps;

/* ── Contact form hook ── */
const useContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent]   = useState(false);
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const onSubmit = e => {
    e.preventDefault(); setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', message: '' });
  };
  return { form, sent, onChange, onSubmit };
};

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export const EgyptianTheme = ({ rootUser, profile, repos = [] }) => {
  const name       = profile?.name       || rootUser?.name || 'Developer';
  const headline   = profile?.headline   || 'Computer Science · Data & AI';
  const bio        = profile?.bio        || 'Building pipelines, models and interfaces from raw data. Send word, and I shall answer.';
  const email      = profile?.email      || rootUser?.email || '';
  const skills     = (profile?.skills    || []).slice(0, 8);
  const experience = profile?.experience || [];
  const education  = profile?.education  || [];
  const links      = profile?.links      || {};
  const resumeUrl  = profile?.resumeUrl  || '/resume.pdf';
  const achievements = profile?.achievements || [];

  /* skills shown in orbiting crystals — pad/truncate to 8 */
  const crystalSkills = [...skills];
  while (crystalSkills.length < 8) crystalSkills.push(`Skill ${crystalSkills.length + 1}`);

  /* Guide speech texts derived from profile data */
  const guideButtons = [
    {
      key: 'edu', num: '1', label: 'Education', title: 'EDUCATION',
      text: education.length > 0
        ? `I study ${education[0].degree || education[0].field || 'Computer Science'} at ${education[0].institution}.`
        : 'Greetings, traveler. I pursue Computer Science, exploring the worlds of software, data and the ancient arts of AI.',
    },
    {
      key: 'exp', num: '2', label: 'Experience', title: 'EXPERIENCE',
      text: experience.length > 0
        ? `I have served as ${experience[0].role} at ${experience[0].company}${experience.length > 1 ? ` and ${experience.length - 1} more campaign${experience.length > 2 ? 's' : ''}` : ''}.`
        : 'I have ventured through internships, building pipelines that move rivers of information across the cloud.',
    },
    {
      key: 'prj', num: '3', label: 'Projects', title: 'PROJECTS',
      text: repos.length > 0
        ? `My scrolls hold ${repos.length} work${repos.length !== 1 ? 's' : ''}: ${repos.slice(0, 3).map(r => r.name).join(', ')} and more.`
        : 'My scrolls hold many works: data platforms, ML models and tools forged with Python and modern stacks.',
    },
    {
      key: 'cert', num: '4', label: 'Achievements', title: 'ACHIEVEMENTS',
      text: achievements.length > 0
        ? `The temple walls bear my marks: ${achievements.slice(0, 3).map(a => a.title).join('; ')}${achievements.length > 3 ? `, and ${achievements.length - 3} more` : ''}.`
        : 'The temple walls bear my marks: certifications in cloud architecture and the disciplined arts of the craft.',
    },
    {
      key: 'skl', num: '5', label: 'Skills', title: 'SKILLS',
      text: crystalSkills.slice(0, 5).join(', ') + (crystalSkills.length > 5 ? ` and ${crystalSkills.slice(5).join(', ')}` : '') + ' all flow through these hands.',
    },
  ];

  /* Treasury cards: top repos or defaults */
  const treasuryCards = repos.length >= 3
    ? repos.slice(0, 3).map((r, i) => ({
        tag: ['PROJECT', 'PROJECT', 'PROJECT'][i],
        title: r.name,
        desc: r.description || 'A relic recovered from the code temple.',
      }))
    : [
        { tag: 'PROJECT',        title: repos[0]?.name || 'Featured Project',  desc: repos[0]?.description || 'A major artifact from the code temple.' },
        { tag: 'COMPETITIONS',   title: 'Hackathon Finalist',                   desc: 'Prototypes built under pressure.' },
        { tag: 'CERTIFICATIONS', title: 'Cloud Certified',                      desc: 'Cloud architecture & containerization specializations.' },
      ];

  /* Hall of Scrolls: real repos or placeholders */
  const scrollRepos = (repos.length > 0 ? repos : DEFAULT_SCROLLS).slice(0, 6);

  /* Contact links */
  const contacts = [
    links.github   && { label: 'GITHUB',   sub: links.github.replace('https://', '').replace('http://', ''),   href: links.github },
    links.linkedin && { label: 'LINKEDIN', sub: links.linkedin.replace('https://', '').replace('http://', ''), href: links.linkedin },
    email          && { label: 'EMAIL',    sub: email,    href: `mailto:${email}` },
    resumeUrl      && { label: 'RESUME',   sub: 'download .pdf', href: resumeUrl },
  ].filter(Boolean);

  /* ── Ref / state ── */
  const heroCanvasRef   = useRef(null);
  const ambientCanvasRef = useRef(null);
  const rafRef          = useRef(null);
  const pyrImgRef       = useRef(null);
  const pyrReadyRef     = useRef(false);
  const particlesRef    = useRef({ sand: [], coins: [] });
  const crystalsRef     = useRef([]);
  const emitRef         = useRef(0);
  const t0Ref           = useRef(performance.now());
  const anubisFrameRef  = useRef('base');
  const mouthPhaseRef   = useRef(0);
  const blinkUntilRef   = useRef(0);
  const nextBlinkRef    = useRef(performance.now() + 3000);
  const anubisTimerRef  = useRef(null);
  const typerRef        = useRef(null);

  const [activeGuide,  setActiveGuide]  = useState(null);
  const [typed,        setTyped]        = useState('');
  const [speaking,     setSpeaking]     = useState(false);
  const [modal,        setModal]        = useState(null);
  const [soundOn,      setSoundOn]      = useState(false);
  const { form, sent, onChange, onSubmit } = useContactForm();

  /* ── Resize canvases ── */
  const resizeCanvases = useCallback(() => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    [heroCanvasRef, ambientCanvasRef].forEach(ref => {
      const c = ref.current; if (!c) return;
      const w = c.clientWidth, h = c.clientHeight;
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
      const ctx = c.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    });
  }, []);

  /* ── Init particles ── */
  const initParticles = useCallback(() => {
    const W = window.innerWidth, H = window.innerHeight;
    particlesRef.current.sand = Array.from({ length: 90 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: 0.15 + Math.random() * 0.5, vy: -0.1 - Math.random() * 0.3,
      s: Math.random() < 0.5 ? 2 : 3,
      a: 0.15 + Math.random() * 0.4,
      c: Math.random() < 0.3 ? CYAN : (Math.random() < 0.5 ? GOLD : '#fff'),
    }));
    particlesRef.current.coins = Array.from({ length: 8 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vy: 0.3 + Math.random() * 0.5, ph: Math.random() * 6.28,
      sp: 0.04 + Math.random() * 0.04, r: 6 + Math.random() * 5,
    }));
  }, []);

  /* ── Draw ambient particles ── */
  const drawAmbient = useCallback((time) => {
    const c = ambientCanvasRef.current; if (!c) return;
    const ctx = c.getContext('2d');
    const W = c.clientWidth, H = c.clientHeight;
    ctx.clearRect(0, 0, W, H);
    const { sand, coins } = particlesRef.current;
    for (const p of sand) {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -4) p.y = H + 4;
      if (p.x > W + 4) p.x = -4;
      ctx.globalAlpha = p.a * (0.6 + 0.4 * Math.sin(time * 2 + p.x));
      ctx.fillStyle = p.c;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
    }
    for (const co of coins) {
      co.y += co.vy; co.ph += co.sp;
      if (co.y > H + 12) { co.y = -12; co.x = Math.random() * W; }
      const w = Math.max(2, Math.abs(Math.cos(co.ph)) * co.r * 2);
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = GOLD;
      ctx.fillRect(Math.round(co.x - w / 2), Math.round(co.y - co.r), Math.round(w), Math.round(co.r * 2));
      ctx.fillStyle = '#c9961f';
      ctx.fillRect(Math.round(co.x - w / 2), Math.round(co.y - co.r), Math.max(2, Math.round(w * 0.3)), Math.round(co.r * 2));
    }
    ctx.globalAlpha = 1;
  }, []);

  /* ── Gem drawing ── */
  const drawGem = useCallback((ctx, gx, gy, r, PS, glow) => {
    if (r < PS) return;
    if (glow) {
      ctx.globalAlpha = 0.5;
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, r * 2.2);
      g.addColorStop(0, 'rgba(77,235,255,.7)'); g.addColorStop(1, 'rgba(77,235,255,0)');
      ctx.fillStyle = g; ctx.fillRect(gx - r * 2.2, gy - r * 2.2, r * 4.4, r * 4.4);
      ctx.globalAlpha = 1;
    }
    for (let dy = -r; dy <= r; dy += PS) {
      const rh = r * (1 - Math.abs(dy) / r);
      const y = snap(gy + dy, PS);
      for (let dx = -rh; dx <= rh; dx += PS) {
        ctx.fillStyle = dx < 0 ? '#9CF3FF' : '#27B6CC';
        ctx.fillRect(snap(gx + dx, PS), y, PS, PS);
      }
    }
    ctx.fillStyle = '#fff';
    ctx.fillRect(snap(gx - r * 0.3, PS), snap(gy - r * 0.3, PS), PS, PS);
  }, []);

  /* ── Gem glow ── */
  const drawGemGlow = useCallback((ctx, x, y, r, time) => {
    const pulse = 0.82 + 0.18 * Math.sin(time * 3);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.8 * pulse);
    g.addColorStop(0, 'rgba(150,247,255,0.85)');
    g.addColorStop(0.5, 'rgba(77,235,255,0.28)');
    g.addColorStop(1, 'rgba(77,235,255,0)');
    ctx.fillStyle = g; ctx.fillRect(x - r * 3.2, y - r * 3.2, r * 6.4, r * 6.4);
    const PS = Math.max(2, Math.round(r / 6));
    for (let dy = -r; dy <= r; dy += PS) {
      const rh = r * (1 - Math.abs(dy) / r);
      for (let dx = -rh; dx <= rh; dx += PS) {
        ctx.fillStyle = dx < 0 ? '#BFFAFF' : '#3FD4E6';
        ctx.fillRect(snap(x + dx, PS), snap(y + dy, PS), PS, PS);
      }
    }
    ctx.fillStyle = '#fff';
    ctx.fillRect(snap(x - r * 0.32, PS), snap(y - r * 0.32, PS), PS, PS);
  }, []);

  /* ── 3D pyramid face ── */
  const drawFace = useCallback((ctx, d, s, shade) => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const s0 = s[0], s1 = s[1], s2 = s[2], d0 = d[0], d1 = d[1], d2 = d[2];
    const sx1 = s1.x - s0.x, sy1 = s1.y - s0.y, sx2 = s2.x - s0.x, sy2 = s2.y - s0.y;
    const den = sx1 * sy2 - sx2 * sy1; if (Math.abs(den) < 1e-6) return;
    const dx1 = d1.x - d0.x, dx2 = d2.x - d0.x, dy1 = d1.y - d0.y, dy2 = d2.y - d0.y;
    const a = (dx1 * sy2 - dx2 * sy1) / den;
    const cc = (sx1 * dx2 - sx2 * dx1) / den;
    const e = d0.x - a * s0.x - cc * s0.y;
    const b = (dy1 * sy2 - dy2 * sy1) / den;
    const dd = (sx1 * dy2 - sx2 * dy1) / den;
    const ff = d0.y - b * s0.x - dd * s0.y;
    const pyr = pyrImgRef.current;
    if (!pyr) return;
    ctx.save();
    ctx.beginPath(); ctx.moveTo(d0.x, d0.y); ctx.lineTo(d1.x, d1.y); ctx.lineTo(d2.x, d2.y); ctx.closePath(); ctx.clip();
    ctx.setTransform(dpr * a, dpr * b, dpr * cc, dpr * dd, dpr * e, dpr * ff);
    ctx.drawImage(pyr, 0, 0);
    ctx.restore();
    if (shade > 0.012) {
      ctx.save();
      ctx.beginPath(); ctx.moveTo(d0.x, d0.y); ctx.lineTo(d1.x, d1.y); ctx.lineTo(d2.x, d2.y); ctx.closePath(); ctx.clip();
      ctx.fillStyle = `rgba(26,14,2,${shade})`;
      ctx.fillRect(0, 0, heroCanvasRef.current.clientWidth, heroCanvasRef.current.clientHeight);
      ctx.restore();
    }
  }, []);

  /* ── 3D pyramid ── */
  const drawPyramid3D = useCallback((ctx, cx, cyc, b, ph, ay, morph, time, gemAmt) => {
    const D = b * 2.9, f = D, tilt = -0.015;
    const rotY = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c }; };
    const rotX = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c }; };
    const proj = (p) => { const z = p.z + D; const sc = f / Math.max(1, z); return { x: cx + p.x * sc, y: cyc + p.y * sc, z: p.z }; };
    const R = pt => rotX(rotY(pt, ay), tilt);
    const apexT = R({ x: 0, y: -ph, z: 0 });
    const apexB = R({ x: 0, y: ph * morph, z: 0 });
    const bc = [
      { x: -b / 2, y: 0, z: -b / 2 }, { x: b / 2, y: 0, z: -b / 2 },
      { x: b / 2, y: 0, z: b / 2 }, { x: -b / 2, y: 0, z: b / 2 },
    ].map(R);
    const faces = [];
    for (let i = 0; i < 4; i++) faces.push({ v: [apexT, bc[i], bc[(i + 1) % 4]], top: true });
    if (morph > 0.01) for (let i = 0; i < 4; i++) faces.push({ v: [apexB, bc[(i + 1) % 4], bc[i]], top: false });
    const L = { x: -0.55, y: -0.4, z: -0.78 }, ll = Math.hypot(L.x, L.y, L.z);
    for (const F of faces) {
      F.p = F.v.map(proj);
      F.depth = (F.v[0].z + F.v[1].z + F.v[2].z) / 3;
      const e1 = { x: F.v[1].x - F.v[0].x, y: F.v[1].y - F.v[0].y, z: F.v[1].z - F.v[0].z };
      const e2 = { x: F.v[2].x - F.v[0].x, y: F.v[2].y - F.v[0].y, z: F.v[2].z - F.v[0].z };
      let n = { x: e1.y * e2.z - e1.z * e2.y, y: e1.z * e2.x - e1.x * e2.z, z: e1.x * e2.y - e1.y * e2.x };
      const nl = Math.hypot(n.x, n.y, n.z) || 1; n.x /= nl; n.y /= nl; n.z /= nl;
      F.facing = -n.z;
      F.bright = clamp(0.42 + 0.62 * ((n.x * L.x + n.y * L.y + n.z * L.z) / ll));
    }
    faces.sort((A, B) => B.depth - A.depth);
    const pyr = pyrImgRef.current;
    if (!pyr) return;
    const iw = pyr.width, ih = pyr.height;
    const sImg = [{ x: iw * 0.5, y: 0 }, { x: 0, y: ih }, { x: iw, y: ih }];
    if (morph < 0.985) {
      const bp = bc.map(proj);
      ctx.save();
      ctx.globalAlpha = clamp(1 - morph);
      ctx.beginPath(); ctx.moveTo(bp[0].x, bp[0].y);
      ctx.lineTo(bp[1].x, bp[1].y); ctx.lineTo(bp[2].x, bp[2].y); ctx.lineTo(bp[3].x, bp[3].y);
      ctx.closePath(); ctx.fillStyle = '#6f4f12'; ctx.fill();
      ctx.restore();
    }
    for (const F of faces) {
      if (F.facing <= 0) continue;
      drawFace(ctx, F.p, sImg, clamp(1 - F.bright));
    }
    if (gemAmt > 0) {
      let best = null;
      for (const F of faces) { if (F.top && F.facing > 0.04 && (!best || F.facing > best.facing)) best = F; }
      if (best) {
        const gx = (best.p[0].x + best.p[1].x + best.p[2].x) / 3;
        const gy = (best.p[0].y + best.p[1].y + best.p[2].y) / 3;
        ctx.globalAlpha = clamp(best.facing * 1.4) * gemAmt;
        drawGemGlow(ctx, gx, gy, b * 0.15, time);
        ctx.globalAlpha = 1;
      }
    }
  }, [drawFace, drawGemGlow]);

  /* ── Fallback structure (no texture) ── */
  const drawStructure = useCallback((ctx, cx, cy, S, H, morph, angle, PS, gemAmt) => {
    const wScale = 0.62 + 0.38 * Math.abs(Math.cos(angle));
    const seam = Math.sin(angle);
    const row = (yc, rh) => {
      rh *= wScale;
      const y = snap(yc, PS);
      if (rh < PS) { ctx.fillStyle = GOLD; ctx.fillRect(snap(cx, PS), y, PS, PS); return; }
      const sx = cx + seam * rh;
      for (let x = cx - rh; x <= cx + rh; x += PS) {
        const sxp = snap(x, PS);
        if (x < sx) ctx.fillStyle = GOLD; else ctx.fillStyle = '#B5831A';
        if (Math.abs(x - (cx - rh)) < PS * 1.1 || Math.abs(x - (cx + rh)) < PS * 1.1) ctx.fillStyle = '#7d5a12';
        ctx.fillRect(sxp, y, PS, PS);
      }
      ctx.fillStyle = '#FFF0B0'; ctx.fillRect(snap(sx, PS), y, PS, PS);
    };
    for (let dy = -H; dy <= 0; dy += PS) { const f = (dy + H) / H; row(cy + dy, S * f); }
    const bH = H * (0.28 + 0.72 * morph);
    for (let dy = PS; dy <= bH; dy += PS) { const f = 1 - morph * (dy / bH); row(cy + dy, S * f); }
    if (gemAmt > 0) {
      const pts = [[0, -0.35], [-0.4, 0.12], [0.4, 0.12], [0, 0.5 * morph]];
      for (const [px, py] of pts) drawGem(ctx, cx + px * S, cy + py * H, S * 0.2 * gemAmt, PS, false);
    }
  }, [drawGem]);

  /* ── Hero canvas draw ── */
  const drawHero = useCallback((ctx, p, time) => {
    const w = heroCanvasRef.current.clientWidth;
    const h = heroCanvasRef.current.clientHeight;
    const PS = Math.max(3, Math.round(Math.min(w, h) / 170));
    const moveE  = ease(seg(p, 0, 0.16));
    const cx     = lerp(w * 0.30, w * 0.50, moveE);
    const cy     = h * 0.50;
    const morph  = ease(seg(p, 0.30, 0.54));
    const grow   = ease(seg(p, 0.50, 0.70));
    const gemAmt = ease(seg(p, 0.50, 0.66));
    const emit   = ease(seg(p, 0.66, 0.92));
    emitRef.current = emit;
    const spin = p > 0.22 ? (p - 0.22) * Math.PI * 7 + time * 0.5 : time * 0.12;
    const base = Math.min(w, h);
    const S = base * 0.15 * lerp(1.25, 0.9, moveE) * lerp(1, 1.7, grow);
    const Hh = S * 1.45;

    if (gemAmt > 0) {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, S * 3.2);
      g.addColorStop(0, `rgba(255,213,74,${0.34 * gemAmt})`);
      g.addColorStop(0.5, `rgba(255,160,40,${0.14 * gemAmt})`);
      g.addColorStop(1, 'rgba(255,160,40,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    }

    if (pyrReadyRef.current) {
      const sizeMul = lerp(1.45, 0.66, moveE) * lerp(1, 1.12, grow);
      const bb = base * 0.38 * sizeMul;
      const ph = base * 0.32 * sizeMul;
      const cyc = cy + ph * 0.5 * (1 - morph);
      drawPyramid3D(ctx, cx, cyc, bb, ph, spin, morph, time, gemAmt);
    } else {
      drawStructure(ctx, cx, cy, S, Hh, morph, spin, PS, gemAmt);
    }

    /* orbiting crystals */
    const newCrystals = [];
    if (emit > 0) {
      const R = lerp(S * 0.9, base * 0.30, emit);
      for (let i = 0; i < 8; i++) {
        const ang = -Math.PI / 2 + i / 8 * Math.PI * 2 + time * 0.22;
        const x = cx + Math.cos(ang) * R, y = cy + Math.sin(ang) * R;
        newCrystals.push({ x, y });
        const steps = 14;
        for (let s = 1; s < steps; s++) {
          const t = s / steps;
          const lx = lerp(cx, x, t), ly = lerp(cy, y, t);
          const pulse = 0.3 + 0.5 * Math.sin(time * 4 - s * 0.5);
          ctx.globalAlpha = emit * pulse;
          ctx.fillStyle = CYAN;
          ctx.fillRect(snap(lx, PS), snap(ly, PS), PS, PS);
        }
        ctx.globalAlpha = 1;
        drawGem(ctx, x, y, S * 0.28 * emit, PS, true);
      }
    }
    crystalsRef.current = newCrystals;
  }, [drawPyramid3D, drawStructure, drawGem]);

  /* ── Main RAF loop ── */
  const loop = useCallback(() => {
    const now = performance.now();
    const time = (now - t0Ref.current) / 1000;
    const vh = window.innerHeight;
    const docH = document.documentElement.scrollHeight - vh;
    const sy = window.scrollY || 0;

    /* progress bar */
    const prog = document.getElementById('pe-prog');
    if (prog) prog.style.width = (clamp(sy / Math.max(1, docH)) * 100) + '%';

    /* ambient */
    drawAmbient(time);

    /* section 1 */
    const s1 = document.getElementById('pe-sec1');
    if (s1) {
      const r = s1.getBoundingClientRect();
      const p1 = clamp(-r.top / Math.max(1, r.height - vh));
      const visible = r.bottom > 0 && r.top < vh;
      const c = heroCanvasRef.current;
      if (c) {
        const ctx = c.getContext('2d');
        ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
        if (visible) drawHero(ctx, p1, time);
      }
      /* overlays */
      const titleFade = 1 - seg(p1, 0.08, 0.18);
      const titleEl = document.getElementById('pe-title');
      if (titleEl) { titleEl.style.opacity = titleFade; titleEl.style.transform = `translateY(-50%) translateX(${(1 - titleFade) * 40}px)`; }
      const hintEl = document.getElementById('pe-hint');
      if (hintEl) hintEl.style.opacity = 1 - seg(p1, 0.02, 0.08);
      const rib = ease(seg(p1, 0.16, 0.30));
      const ribOut = seg(p1, 0.60, 0.72);
      const ribO = rib * (1 - ribOut);
      const ribL = document.getElementById('pe-rib-l');
      if (ribL) { ribL.style.opacity = ribO; ribL.style.transform = `translate(${lerp(-110, 0, rib)}%,-50%)`; }
      const ribR = document.getElementById('pe-rib-r');
      if (ribR) { ribR.style.opacity = ribO; ribR.style.transform = `translate(${lerp(110, 0, rib)}%,-50%)`; }
      const skillHdr = document.getElementById('pe-skill-hdr');
      if (skillHdr) skillHdr.style.opacity = clamp((emitRef.current - 0.08) * 1.6);
      const cr = crystalsRef.current;
      for (let i = 0; i < 8; i++) {
        const el = document.getElementById('pe-crystal-' + i);
        if (!el) continue;
        if (cr[i] && emitRef.current > 0.05) {
          el.style.opacity = clamp((emitRef.current - 0.1) * 1.4);
          el.style.transform = `translate(calc(${cr[i].x}px - 50%), calc(${cr[i].y}px - 50%))`;
        } else {
          el.style.opacity = '0';
        }
      }
    }

    /* section 3 treasury */
    const s3 = document.getElementById('pe-sec3');
    if (s3) {
      const r3 = s3.getBoundingClientRect();
      const p3 = clamp(-r3.top / Math.max(1, r3.height - vh));
      const zoomE = ease(seg(p3, 0, 0.58));
      const corrEl = document.getElementById('pe-corridor');
      if (corrEl) { corrEl.style.transform = `scale(${lerp(1, 5.2, zoomE)})`; corrEl.style.opacity = 1 - seg(p3, 0.42, 0.65); }
      const vaultEl = document.getElementById('pe-vault');
      if (vaultEl) vaultEl.style.transform = `scale(${lerp(0.88, 1, ease(seg(p3, 0, 0.65)))})`;
      const hdr3 = document.getElementById('pe-sec3-hdr');
      if (hdr3) hdr3.style.opacity = seg(p3, 0.62, 0.76);
      [[0, 0.66], [1, 0.72], [2, 0.78]].forEach(([i, start]) => {
        const el = document.getElementById('pe-card-' + i); if (!el) return;
        const inO = ease(seg(p3, start, start + 0.10));
        const bob = inO > 0.05 ? Math.sin(time * 1.8 + i * 1.1) * 8 * (1 - seg(p3, 0.95, 1)) : 0;
        el.style.opacity = inO;
        el.style.transform = `translateY(${lerp(55, 0, inO) + bob}px)`;
      });
    }

    /* section 4 cat */
    const s4 = document.getElementById('pe-sec4');
    if (s4) {
      const r4 = s4.getBoundingClientRect();
      const p4 = clamp(-r4.top / Math.max(1, r4.height - vh));
      const e4 = ease(p4);
      const catEl = document.getElementById('pe-cat');
      if (catEl) {
        const scale = lerp(1.5, 0.62, e4);
        const tx = lerp(0, Math.min(window.innerWidth * 0.30, 360), e4);
        catEl.style.transform = `translate(calc(-50% + ${tx}px), -50%) scale(${scale})`;
      }
      const glow = lerp(0, 1, seg(p4, 0.2, 0.6));
      ['pe-cat-eye-l', 'pe-cat-eye-r'].forEach(id => {
        const ey = document.getElementById(id);
        if (ey) ey.style.boxShadow = `0 0 ${glow * 30}px rgba(77,235,255,${glow})`;
      });
      const infoEl = document.getElementById('pe-info');
      if (infoEl) {
        const io = seg(p4, 0.4, 0.75);
        infoEl.style.opacity = io;
        infoEl.style.transform = `translateY(-50%) translateX(${lerp(-30, 0, io)}px)`;
      }
    }

    rafRef.current = requestAnimationFrame(loop);
  }, [drawAmbient, drawHero]);

  /* ── Anubis sprite controller ── */
  useEffect(() => {
    anubisTimerRef.current = setInterval(() => {
      const now = performance.now();
      if (!speaking && now > nextBlinkRef.current) {
        blinkUntilRef.current = now + 130;
        nextBlinkRef.current = now + 3500 + Math.random() * 3000;
      }
      const blink = now < blinkUntilRef.current;
      let f = 'base';
      if (blink) { f = 'blink'; }
      else if (speaking) { mouthPhaseRef.current = (mouthPhaseRef.current + 1) % 4; f = ['talk', 'half', 'base', 'half'][mouthPhaseRef.current]; }
      if (f !== anubisFrameRef.current) {
        anubisFrameRef.current = f;
        const ids = { base: 'an-base', half: 'an-half', talk: 'an-talk', blink: 'an-blink' };
        for (const k in ids) { const el = document.getElementById(ids[k]); if (el) el.style.opacity = k === f ? '1' : '0'; }
      }
    }, 140);
    return () => clearInterval(anubisTimerRef.current);
  }, [speaking]);

  /* ── Mount: load pyramid texture, start RAF ── */
  useEffect(() => {
    resizeCanvases();
    initParticles();
    const pyr = new Image();
    pyr.onload = () => { pyrReadyRef.current = true; };
    pyr.src = `${ASSET}/pyramid-face.png`;
    pyrImgRef.current = pyr;
    t0Ref.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
    window.addEventListener('resize', resizeCanvases);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resizeCanvases);
      clearInterval(anubisTimerRef.current);
      clearInterval(typerRef.current);
    };
  }, [resizeCanvases, initParticles, loop]);

  /* ── Guide select + typewriter ── */
  const selectGuide = (btn) => {
    clearInterval(typerRef.current);
    setActiveGuide(btn.key); setTyped(''); setSpeaking(true);
    const full = btn.text; let i = 0;
    typerRef.current = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i >= full.length) { clearInterval(typerRef.current); setSpeaking(false); }
    }, 32);
  };

  /* ── Sound toggle ── */
  const toggleSound = () => {
    const a = document.getElementById('pe-audio');
    const on = !soundOn; setSoundOn(on);
    if (a) { if (on) { a.volume = 0.5; a.play().catch(() => {}); } else { a.pause(); } }
  };

  const activeBtn = guideButtons.find(b => b.key === activeGuide);

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */
  return (
    <div style={{ background: DARK, color: '#fff', fontFamily: BODY, minHeight: '100vh' }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&family=Press+Start+2P&display=swap');
        html { scroll-behavior: auto; }
        body { margin: 0; padding: 0; }
        * { box-sizing: border-box; }
        @keyframes peBlink   { 0%,90%,100%{ transform:scaleY(1);} 94%{ transform:scaleY(0.08);} }
        @keyframes peTorch   { 0%,100%{ transform:scaleY(1); opacity:1;} 45%{ transform:scaleY(1.18); opacity:.82;} 70%{ transform:scaleY(.92); opacity:.95;} }
        @keyframes peBreathe { 0%,100%{ transform:translateY(0);} 50%{ transform:translateY(-5px);} }
        @keyframes peCaret   { 0%,100%{ opacity:0;} 50%{ opacity:1;} }
        @keyframes peHint    { 0%,100%{ opacity:.35; transform:translateX(-50%) translateY(0);} 50%{ opacity:1; transform:translateX(-50%) translateY(7px);} }
        @keyframes peShine   { 0%{ background-position:-120% 0;} 100%{ background-position:220% 0;} }
        .pe-btn:hover { background: ${GOLD} !important; color: #1c1408 !important; transform: translate(-2px,-2px) !important; }
        .pe-btn:active { transform: translate(2px,2px) !important; box-shadow: 2px 2px 0 rgba(0,0,0,.5) !important; }
        .pe-sound-btn:hover { background: ${GOLD} !important; color: #1c1408 !important; }
        .pe-contact-btn:hover { background: ${GOLD} !important; color: #1c1408 !important; transform: translate(-2px,-2px) !important; }
        .pe-scroll-card { transition: transform .18s ease; }
        .pe-scroll-card:hover { transform: translateY(-5px); }
      `}</style>

      {/* ── Ambient canvas ── */}
      <canvas ref={ambientCanvasRef} style={{
        position: 'fixed', inset: 0, width: '100vw', height: '100vh',
        pointerEvents: 'none', zIndex: 60, imageRendering: 'pixelated',
      }} />

      {/* ── Progress bar ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: 6, zIndex: 70, background: 'rgba(0,0,0,.35)' }}>
        <div id="pe-prog" style={{ height: '100%', width: '0%', background: GOLD, boxShadow: `0 0 8px ${GOLD}`, transition: 'width .05s' }} />
      </div>

      {/* ── Sound toggle ── */}
      <button className="pe-sound-btn" onClick={toggleSound} style={{
        position: 'fixed', top: 16, right: 16, zIndex: 71,
        fontFamily: PIX, fontSize: 9, color: CYAN, background: DARK3,
        border: `3px solid ${GOLD}`, padding: '9px 11px', cursor: 'pointer',
        boxShadow: '4px 4px 0 rgba(0,0,0,.5)', imageRendering: 'pixelated',
      }}>
        {soundOn ? '♪ SOUND ON' : '♪ SOUND OFF'}
      </button>
      <audio id="pe-audio" loop preload="none" />

      {/* ════════════════════════════════════════════
          SECTION 1 — HERO TRANSFORMATION
      ════════════════════════════════════════════ */}
      <section id="pe-sec1" style={{
        position: 'relative', height: '620vh',
        background: 'linear-gradient(180deg,#241a0e 0%,#1a130b 45%,#120d07 100%)',
      }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden' }}>

          {/* horizon glow */}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: '18%', height: '40%',
            background: 'radial-gradient(ellipse 70% 100% at 50% 100%, rgba(255,213,74,.18), transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* dune silhouette */}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, height: '22%',
            background: 'linear-gradient(180deg,#0d0905,#070503)',
            clipPath: 'polygon(0 60%,12% 48%,28% 66%,46% 40%,62% 60%,80% 44%,100% 62%,100% 100%,0 100%)',
          }} />

          {/* Hero canvas */}
          <canvas ref={heroCanvasRef} style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', imageRendering: 'pixelated',
          }} />

          {/* Title overlay (right) */}
          <div id="pe-title" style={{
            position: 'absolute', right: '7%', top: '50%', transform: 'translateY(-50%)',
            textAlign: 'right', maxWidth: '46%',
          }}>
            <div style={{ fontFamily: PIX, fontSize: 11, color: CYAN, letterSpacing: 2, marginBottom: 18 }}>
              — THE TOMB OF —
            </div>
            <div style={{
              fontSize: 'clamp(36px,6vw,72px)', lineHeight: 0.95, fontWeight: 700,
              color: GOLD, textShadow: `5px 5px 0 #1a1006, 0 0 26px rgba(255,213,74,.35)`,
            }}>
              {name.toUpperCase()}
            </div>
            <div style={{ fontSize: 'clamp(16px,2vw,26px)', color: '#fff', marginTop: 14, textShadow: '3px 3px 0 #1a1006' }}>
              {headline}
            </div>
          </div>

          {/* Ribbons */}
          <div id="pe-rib-l" style={{ position: 'absolute', left: 0, top: '50%', transform: 'translate(-110%,-50%)', opacity: 0, willChange: 'transform' }}>
            <div style={{
              background: 'linear-gradient(180deg,#FFE07A,#E8B62E)', border: `4px solid #1a1006`, borderLeft: 'none',
              padding: '16px 34px 16px 22px', boxShadow: '6px 6px 0 rgba(0,0,0,.5)',
              clipPath: 'polygon(0 0,100% 0,88% 50%,100% 100%,0 100%)',
            }}>
              <span style={{ fontFamily: PIX, fontSize: 15, color: '#1a1006' }}>PORTFOLIO</span>
            </div>
          </div>
          <div id="pe-rib-r" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translate(110%,-50%)', opacity: 0, willChange: 'transform' }}>
            <div style={{
              background: 'linear-gradient(180deg,#FFE07A,#E8B62E)', border: `4px solid #1a1006`, borderRight: 'none',
              padding: '16px 22px 16px 34px', boxShadow: '6px 6px 0 rgba(0,0,0,.5)',
              clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%,12% 50%)',
            }}>
              <span style={{ fontFamily: PIX, fontSize: 15, color: '#1a1006' }}>JOURNEY</span>
            </div>
          </div>

          {/* Skills header (top-left) */}
          <div id="pe-skill-hdr" style={{ position: 'absolute', left: 54, top: 46, opacity: 0, pointerEvents: 'none' }}>
            <div style={{ fontFamily: PIX, fontSize: 11, color: CYAN, letterSpacing: 2 }}>ARSENAL OF THE TOMB</div>
            <div style={{ fontSize: 42, fontWeight: 700, color: GOLD, textShadow: `4px 4px 0 #1a1006`, marginTop: 12 }}>SKILLS</div>
            <div style={{ width: 120, height: 5, background: CYAN, marginTop: 12, boxShadow: `0 0 10px ${CYAN}` }} />
          </div>

          {/* Orbiting crystal labels */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {crystalSkills.map((sk, i) => (
              <div key={i} id={`pe-crystal-${i}`} style={{
                position: 'absolute', left: 0, top: 0, opacity: 0,
                willChange: 'transform,opacity',
              }}>
                <span style={{
                  display: 'inline-block', fontFamily: PIX, fontSize: 10, color: CYAN,
                  background: 'rgba(12,20,24,.9)', border: `2px solid ${CYAN}`,
                  padding: '6px 9px', whiteSpace: 'nowrap', boxShadow: `0 0 12px rgba(77,235,255,.5)`,
                }}>
                  {sk}
                </span>
              </div>
            ))}
          </div>

          {/* Scroll hint */}
          <div id="pe-hint" style={{
            position: 'absolute', left: '50%', bottom: 28,
            transform: 'translateX(-50%)', textAlign: 'center',
            animation: 'peHint 1.6s ease-in-out infinite',
          }}>
            <div style={{ fontFamily: PIX, fontSize: 10, color: '#fff', letterSpacing: 1 }}>SCROLL TO BEGIN</div>
            <div style={{ color: GOLD, fontSize: 20, marginTop: 6 }}>▾</div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 2 — EGYPTIAN GUIDE
      ════════════════════════════════════════════ */}
      <section id="pe-sec2" style={{
        position: 'relative', minHeight: '100vh', padding: '90px 6vw',
        background: DARK2,
        backgroundImage: 'repeating-linear-gradient(0deg,rgba(255,255,255,.035) 0 2px,transparent 2px 46px),repeating-linear-gradient(90deg,rgba(0,0,0,.4) 0 2px,transparent 2px 64px)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 46 }}>
          <div style={{ fontFamily: PIX, fontSize: 13, color: CYAN, letterSpacing: 2 }}>CHAPTER II</div>
          <div style={{ fontSize: 'clamp(28px,4vw,46px)', fontWeight: 700, color: GOLD, marginTop: 12, textShadow: `4px 4px 0 #0c0904` }}>
            THE GUIDE OF THE TEMPLE
          </div>
        </div>

        <div style={{ display: 'flex', gap: 48, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', maxWidth: 1200, margin: '0 auto' }}>

          {/* Character + speech */}
          <div style={{ position: 'relative', flex: '1 1 440px', minWidth: 340, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* Torches */}
            <div style={{
              position: 'absolute', left: -6, top: 30, width: 14, height: 42, background: GOLD,
              transformOrigin: 'bottom', animation: 'peTorch .5s ease-in-out infinite',
              clipPath: 'polygon(50% 0,100% 60%,75% 100%,25% 100%,0 60%)',
              boxShadow: '0 0 24px rgba(255,160,40,.8)',
            }} />
            <div style={{
              position: 'absolute', right: -6, top: 30, width: 14, height: 42, background: GOLD,
              transformOrigin: 'bottom', animation: 'peTorch .5s ease-in-out infinite .25s',
              clipPath: 'polygon(50% 0,100% 60%,75% 100%,25% 100%,0 60%)',
              boxShadow: '0 0 24px rgba(255,160,40,.8)',
            }} />

            {/* Speech bubble */}
            {activeGuide && (
              <div style={{
                position: 'relative', background: '#0e1418', border: `4px solid ${CYAN}`,
                padding: '20px 22px', maxWidth: 420, marginBottom: 26,
                boxShadow: '6px 6px 0 rgba(0,0,0,.5)', imageRendering: 'pixelated',
              }}>
                <div style={{ fontFamily: PIX, fontSize: 10, color: GOLD, marginBottom: 12 }}>
                  {activeBtn?.title}
                </div>
                <div style={{ fontSize: 21, lineHeight: 1.5, color: '#fff' }}>
                  {typed}
                  <span style={{
                    display: 'inline-block', width: 11, height: 20, background: CYAN,
                    verticalAlign: -3, animation: 'peCaret .7s step-end infinite',
                  }} />
                </div>
                {/* Triangle pointer */}
                <div style={{
                  position: 'absolute', left: '50%', bottom: -18, transform: 'translateX(-50%)',
                  width: 0, height: 0,
                  borderLeft: '14px solid transparent', borderRight: '14px solid transparent',
                  borderTop: `18px solid ${CYAN}`,
                }} />
              </div>
            )}

            {/* Anubis sprite stack */}
            <div style={{ position: 'relative', animation: 'peBreathe 3.6s ease-in-out infinite', filter: 'drop-shadow(0 0 32px rgba(255,213,74,.22))' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img id="an-base" src={`${ASSET}/rb-base.png`} alt="Anubis guide" style={{ display: 'block', height: 380, width: 'auto', imageRendering: 'pixelated', opacity: 1 }} />
                <img id="an-half"  src={`${ASSET}/rb-half.png`}  alt="" style={{ position: 'absolute', left: 0, top: 0, height: 380, width: 'auto', imageRendering: 'pixelated', opacity: 0 }} />
                <img id="an-talk"  src={`${ASSET}/rb-talk.png`}  alt="" style={{ position: 'absolute', left: 0, top: 0, height: 380, width: 'auto', imageRendering: 'pixelated', opacity: 0 }} />
                <img id="an-blink" src={`${ASSET}/rb-blink.png`} alt="" style={{ position: 'absolute', left: 0, top: 0, height: 380, width: 'auto', imageRendering: 'pixelated', opacity: 0 }} />
              </div>
            </div>
            <div style={{ fontFamily: PIX, fontSize: 10, color: GOLD, marginTop: 14 }}>
              ANUBIS · GUARDIAN OF THE TOMB
            </div>
          </div>

          {/* Navigation buttons */}
          <div style={{ flex: '1 1 360px', minWidth: 300, display: 'flex', flexDirection: 'column', gap: 18 }}>
            {guideButtons.map((btn) => (
              <button key={btn.key} className="pe-btn" onClick={() => selectGuide(btn)} style={{
                display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left',
                fontFamily: PIX, fontSize: 14, color: GOLD,
                background: DARK3, border: `4px solid ${GOLD}`,
                padding: '20px 22px', cursor: 'pointer',
                boxShadow: '6px 6px 0 rgba(0,0,0,.5)', imageRendering: 'pixelated',
                transition: 'transform .08s, background .08s',
              }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 30, height: 30, background: CYAN, color: '#0c1418',
                  clipPath: 'polygon(50% 0,100% 50%,50% 100%,0 50%)',
                  fontFamily: PIX, fontSize: 10,
                }}>{btn.num}</span>
                <span>{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 3 — TREASURY
      ════════════════════════════════════════════ */}
      <section id="pe-sec3" style={{ position: 'relative', height: '380vh' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden' }}>

          {/* Pedestal room (back) */}
          <img id="pe-vault" src={`${ASSET}/pedestal-room.png`} alt="" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center', transformOrigin: 'center',
            willChange: 'transform', imageRendering: 'pixelated',
          }} />

          {/* Corridor (front) */}
          <img id="pe-corridor" src={`${ASSET}/corridor.png`} alt="" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center', transformOrigin: 'center',
            willChange: 'transform,opacity', imageRendering: 'pixelated',
          }} />

          {/* Vignette */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 52% 52% at 50% 50%, transparent 18%, rgba(0,0,0,.58) 100%)',
          }} />

          {/* Header */}
          <div id="pe-sec3-hdr" style={{ position: 'absolute', top: 36, left: 0, right: 0, textAlign: 'center', opacity: 0, pointerEvents: 'none' }}>
            <div style={{ fontFamily: PIX, fontSize: 11, color: CYAN, letterSpacing: 2, textShadow: `0 0 14px ${CYAN}` }}>CHAPTER III</div>
            <div style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 700, color: GOLD, marginTop: 10, textShadow: `4px 4px 0 rgba(0,0,0,.85), 0 0 30px rgba(255,213,74,.4)` }}>
              TREASURY OF ACHIEVEMENTS
            </div>
          </div>

          {/* Floating cards */}
          <div style={{
            position: 'absolute', left: 0, right: 0, top: '28%',
            display: 'flex', gap: 24, justifyContent: 'center', alignItems: 'flex-start',
            padding: '0 60px', pointerEvents: 'none',
          }}>
            {treasuryCards.slice(0, 3).map((card, i) => (
              <div key={i} id={`pe-card-${i}`} style={{
                flex: '0 0 290px', opacity: 0, transform: 'translateY(55px)',
                willChange: 'opacity,transform', cursor: 'pointer', pointerEvents: 'auto',
              }} onClick={() => setModal(card)}>
                <div style={{
                  background: 'rgba(10,15,18,.93)', border: `3px solid ${GOLD}`,
                  padding: '22px 18px',
                  boxShadow: `0 0 26px rgba(255,213,74,.28), 6px 6px 0 rgba(0,0,0,.65)`,
                }}>
                  <div style={{
                    width: 18, height: 18, background: CYAN, transform: 'rotate(45deg)',
                    margin: '0 auto 14px', boxShadow: `0 0 18px rgba(77,235,255,.9)`,
                  }} />
                  <div style={{ fontFamily: PIX, fontSize: 9, color: CYAN, textAlign: 'center', marginBottom: 10 }}>
                    {card.tag}
                  </div>
                  <div style={{ fontSize: 21, fontWeight: 700, color: GOLD, textAlign: 'center', lineHeight: 1.2, textShadow: '2px 2px 0 #0a0500' }}>
                    {card.title}
                  </div>
                  <div style={{ fontSize: 15, color: '#e6dcc4', marginTop: 10, textAlign: 'center', lineHeight: 1.55 }}>
                    {card.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 3.5 — HALL OF SCROLLS (GitHub projects)
      ════════════════════════════════════════════ */}
      <section id="pe-sec-scrolls" style={{
        position: 'relative', minHeight: '100vh', padding: '90px 6vw 120px',
        background: '#0f0d08', overflow: 'hidden',
        backgroundImage: 'repeating-linear-gradient(0deg,rgba(255,213,74,.03) 0 2px,transparent 2px 58px),repeating-linear-gradient(90deg,rgba(77,235,255,.04) 0 2px,transparent 2px 76px)',
      }}>
        {/* Decorative background glyphs */}
        <div style={{ position: 'absolute', top: '6%', left: '4%', fontFamily: PIX, fontSize: 22, color: GOLD, opacity: 0.06, transform: 'rotate(-8deg)', pointerEvents: 'none' }}>⌘</div>
        <div style={{ position: 'absolute', top: '10%', right: '6%', fontFamily: PIX, fontSize: 26, color: CYAN, opacity: 0.06, transform: 'rotate(10deg)', pointerEvents: 'none' }}>⚙</div>
        <div style={{ position: 'absolute', bottom: '8%', left: '8%', fontFamily: PIX, fontSize: 24, color: CYAN, opacity: 0.05, transform: 'rotate(6deg)', pointerEvents: 'none' }}>⊕</div>
        <div style={{ position: 'absolute', bottom: '12%', right: '4%', fontFamily: PIX, fontSize: 20, color: GOLD, opacity: 0.06, transform: 'rotate(-12deg)', pointerEvents: 'none' }}>◈</div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 62, position: 'relative' }}>
          <div style={{ fontFamily: PIX, fontSize: 11, color: CYAN, letterSpacing: 2, textShadow: `0 0 14px ${CYAN}` }}>
            CHAPTER IV
          </div>
          <div style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: GOLD, marginTop: 12, textShadow: '4px 4px 0 #0a0700' }}>
            HALL OF SCROLLS
          </div>
          <div style={{ fontSize: 20, color: '#cfc4ad', marginTop: 12 }}>
            Sacred repositories unearthed from the digital tomb
          </div>
          <div style={{
            width: 160, height: 5, margin: '18px auto 0',
            background: `linear-gradient(90deg,transparent,${CYAN},transparent)`,
            boxShadow: `0 0 12px ${CYAN}`,
          }} />
        </div>

        {/* Cards grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))',
          gap: 28, maxWidth: 1200, margin: '0 auto', position: 'relative',
        }}>
          {scrollRepos.map((repo, i) => {
            const lc = langColor(repo.language);
            return (
              <motion.div
                key={repo._id || repo.name || i}
                className="pe-scroll-card"
                style={{ cursor: repo.repoUrl ? 'pointer' : 'default' }}
                initial={{ opacity: 0, y: 44 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.07 }}
                onClick={() => repo.repoUrl && repo.repoUrl !== '#' && window.open(repo.repoUrl, '_blank', 'noopener,noreferrer')}
              >
                <div style={{ height: 5, background: lc, boxShadow: `0 0 12px ${lc}` }} />
                <div style={{
                  background: '#0e1418', border: `3px solid ${GOLD}`, borderTop: 'none',
                  padding: '22px 20px 20px', boxShadow: '6px 6px 0 rgba(0,0,0,.6)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 11 }}>
                    <div style={{
                      width: 14, height: 14, background: CYAN, transform: 'rotate(45deg)',
                      flexShrink: 0, boxShadow: '0 0 10px rgba(77,235,255,.7)',
                    }} />
                    <span style={{ fontFamily: PIX, fontSize: 11, color: GOLD, lineHeight: 1.3 }}>
                      {repo.name}
                    </span>
                  </div>
                  <div style={{ fontFamily: BODY, fontSize: 17, color: '#e6dcc4', lineHeight: 1.55, marginBottom: 16, minHeight: 52 }}>
                    {repo.description || 'A scroll yet to be inscribed.'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    {repo.language && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: PIX, fontSize: 8, color: lc }}>
                        <span style={{ display: 'inline-block', width: 10, height: 10, background: lc, borderRadius: '50%' }} />
                        {repo.language}
                      </span>
                    )}
                    <span style={{ fontFamily: PIX, fontSize: 8, color: GOLD }}>
                      ★ {repo.stars || 0}
                    </span>
                    {repo.repoUrl && repo.repoUrl !== '#' && (
                      <span style={{
                        marginLeft: 'auto', fontFamily: PIX, fontSize: 8, color: CYAN,
                        borderBottom: `2px solid ${CYAN}`, paddingBottom: 2,
                      }}>
                        VIEW →
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 4 — BASTET CAT CONTACT
      ════════════════════════════════════════════ */}
      <section id="pe-sec4" style={{
        position: 'relative', height: '220vh',
        background: DARK,
        backgroundImage: 'repeating-linear-gradient(90deg,rgba(255,213,74,.05) 0 2px,transparent 2px 40px)',
      }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>

          {/* Mural stripes */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0 2px,transparent 2px 60px)',
          }} />

          {/* CSS Bastet cat face */}
          <div id="pe-cat" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%) scale(1.5)', willChange: 'transform' }}>
            <div style={{ position: 'relative', width: 300, height: 300 }}>
              {/* ears */}
              <div style={{ position: 'absolute', left: 6, top: -30, width: 90, height: 96, background: '#1c1c20', clipPath: 'polygon(0 100%,100% 100%,50% 0)' }} />
              <div style={{ position: 'absolute', right: 6, top: -30, width: 90, height: 96, background: '#1c1c20', clipPath: 'polygon(0 100%,100% 100%,50% 0)' }} />
              <div style={{ position: 'absolute', left: 28, top: -10, width: 44, height: 52, background: GOLD, clipPath: 'polygon(0 100%,100% 100%,50% 0)' }} />
              <div style={{ position: 'absolute', right: 28, top: -10, width: 44, height: 52, background: GOLD, clipPath: 'polygon(0 100%,100% 100%,50% 0)' }} />
              {/* head */}
              <div style={{ position: 'absolute', left: 0, top: 24, width: 300, height: 264, background: '#23232a' }} />
              <div style={{ position: 'absolute', left: 0, top: 24, width: 300, height: 14, background: '#15151a' }} />
              {/* gold markings */}
              <div style={{ position: 'absolute', left: 140, top: 38, width: 20, height: 70, background: GOLD }} />
              <div style={{ position: 'absolute', left: 60, top: 48, width: 12, height: 44, background: GOLD, transform: 'rotate(18deg)' }} />
              <div style={{ position: 'absolute', right: 60, top: 48, width: 12, height: 44, background: GOLD, transform: 'rotate(-18deg)' }} />
              {/* eyes */}
              <div id="pe-cat-eye-l" style={{
                position: 'absolute', left: 58, top: 128, width: 64, height: 46, background: CYAN,
                clipPath: 'polygon(50% 0,100% 50%,50% 100%,0 50%)',
                animation: 'peBlink 5s infinite',
              }}>
                <div style={{ position: 'absolute', left: '50%', top: 6, transform: 'translateX(-50%)', width: 12, height: 34, background: '#0a1316' }} />
              </div>
              <div id="pe-cat-eye-r" style={{
                position: 'absolute', right: 58, top: 128, width: 64, height: 46, background: CYAN,
                clipPath: 'polygon(50% 0,100% 50%,50% 100%,0 50%)',
                animation: 'peBlink 5s infinite .2s',
              }}>
                <div style={{ position: 'absolute', left: '50%', top: 6, transform: 'translateX(-50%)', width: 12, height: 34, background: '#0a1316' }} />
              </div>
              {/* nose */}
              <div style={{ position: 'absolute', left: '50%', top: 188, transform: 'translateX(-50%)', width: 26, height: 18, background: GOLD, clipPath: 'polygon(50% 100%,0 0,100% 0)' }} />
              {/* whiskers */}
              <div style={{ position: 'absolute', left: -30, top: 196, width: 64, height: 3, background: GOLD }} />
              <div style={{ position: 'absolute', left: -30, top: 212, width: 64, height: 3, background: GOLD }} />
              <div style={{ position: 'absolute', right: -30, top: 196, width: 64, height: 3, background: GOLD }} />
              <div style={{ position: 'absolute', right: -30, top: 212, width: 64, height: 3, background: GOLD }} />
            </div>
          </div>

          {/* Info panel */}
          <div id="pe-info" style={{
            position: 'absolute', left: '6vw', top: '50%',
            transform: 'translateY(-50%)', width: 'min(440px,42vw)',
            opacity: 0, willChange: 'opacity,transform',
          }}>
            <div style={{ fontFamily: PIX, fontSize: 12, color: CYAN, letterSpacing: 2 }}>CHAPTER V</div>
            <div style={{ fontSize: 'clamp(24px,3vw,40px)', fontWeight: 700, color: GOLD, margin: '10px 0 18px', textShadow: '4px 4px 0 #0c0904' }}>
              SEEK THE GUARDIAN
            </div>
            <div style={{ fontSize: 20, lineHeight: 1.55, color: '#e6dcc4' }}>
              {bio}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 26 }}>
              {contacts.map((c, i) => (
                <a key={i} href={c.href} target="_blank" rel="noreferrer" className="pe-contact-btn" style={{
                  display: 'flex', flexDirection: 'column', gap: 5, textDecoration: 'none',
                  fontFamily: PIX, color: GOLD, background: DARK3,
                  border: `3px solid ${GOLD}`, padding: '15px 16px',
                  boxShadow: '5px 5px 0 rgba(0,0,0,.5)',
                  transition: 'transform .08s, background .08s',
                }}>
                  <span style={{ fontSize: 12 }}>{c.label}</span>
                  <span style={{ fontSize: 8, opacity: 0.7 }}>{c.sub}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ MODAL ════════ */}
      {modal && (
        <div onClick={() => setModal(null)} style={{
          position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(8,5,2,.82)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div style={{
            position: 'relative', width: 'min(560px,92vw)',
            background: '#0e1418', border: `5px solid ${GOLD}`,
            padding: '34px 32px', boxShadow: '10px 10px 0 rgba(0,0,0,.6)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{
              position: 'absolute', top: -22, left: '50%', width: 38, height: 38,
              background: CYAN, transform: 'rotate(45deg) translateX(-50%)',
              boxShadow: `0 0 22px rgba(77,235,255,.8)`,
            }} />
            <div style={{ fontFamily: PIX, fontSize: 10, color: CYAN, marginBottom: 14, marginTop: 6 }}>{modal.tag}</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: GOLD, marginBottom: 16 }}>{modal.title}</div>
            <div style={{ fontSize: 20, lineHeight: 1.6, color: '#e6dcc4' }}>{modal.desc}</div>
            <button onClick={() => setModal(null)} className="pe-sound-btn" style={{
              marginTop: 26, fontFamily: PIX, fontSize: 10, color: DARK3,
              background: GOLD, border: 'none', padding: '14px 20px', cursor: 'pointer',
              boxShadow: '4px 4px 0 rgba(0,0,0,.5)',
            }}>CLOSE THE VAULT</button>
          </div>
        </div>
      )}
    </div>
  );
};
