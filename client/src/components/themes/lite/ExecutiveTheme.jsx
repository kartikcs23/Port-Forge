import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const E = { navy: '#06111f', mid: '#0d1f35', card: '#102035', gold: '#c9a84c', goldLight: '#e8c97e', goldDim: '#8a7035', muted: '#6a8aaa', text: '#d8e8f0', white: '#f0f8ff' };

const Reveal = ({ children, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55, delay }}>{children}</motion.div>
);

const GoldRule = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 0, margin: '28px 0' }}>
    <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${E.goldDim})` }} />
    <div style={{ padding: '0 12px', display: 'flex', gap: 4 }}>
      <div style={{ width: 4, height: 4, background: E.gold, transform: 'rotate(45deg)' }} />
      <div style={{ width: 6, height: 6, background: E.gold, transform: 'rotate(45deg)' }} />
      <div style={{ width: 4, height: 4, background: E.gold, transform: 'rotate(45deg)' }} />
    </div>
    <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${E.goldDim})` }} />
  </div>
);

const Monogram = ({ name }) => {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto' }}>
      <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <circle cx="50" cy="50" r="48" fill="none" stroke={E.goldDim} strokeWidth="1" />
        <circle cx="50" cy="50" r="42" fill="none" stroke={E.gold} strokeWidth="0.5" strokeDasharray="4 4" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
          const rad = a * Math.PI / 180;
          const x = 50 + 45 * Math.cos(rad);
          const y = 50 + 45 * Math.sin(rad);
          return <circle key={a} cx={x} cy={y} r="1.5" fill={E.gold} />;
        })}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Georgia', serif", fontSize: 28, fontWeight: 400, color: E.gold, letterSpacing: '0.1em' }}>
        {initials}
      </div>
    </div>
  );
};

export const ExecutiveTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const serif = "'Georgia','Times New Roman',serif";
  const sans = "system-ui,-apple-system,'Segoe UI',sans-serif";

  return (
    <div style={{ background: E.navy, color: E.text, fontFamily: sans, minHeight: '100vh' }}>

      {/* Gold top stripe */}
      <div style={{ height: 3, background: `linear-gradient(to right, transparent, ${E.gold}, ${E.gold}, transparent)` }} />

      {/* Letterhead hero */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '56px 40px 0' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 32, alignItems: 'center', marginBottom: 40 }}>
            {/* Left — contact */}
            <div style={{ fontSize: 12, color: E.muted, lineHeight: 2, textAlign: 'right' }}>
              {d.contacts.slice(0, 2).map((c) => (
                <a key={c.label} href={c.href} style={{ display: 'block', color: E.muted, textDecoration: 'none' }}>
                  <span style={{ color: E.goldDim, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.label}: </span>
                  {c.value}
                </a>
              ))}
            </div>

            {/* Center — monogram */}
            <div style={{ textAlign: 'center' }}>
              <Monogram name={d.name} />
              <div style={{ marginTop: 12, height: 1, background: E.goldDim, width: 120, margin: '12px auto 0' }} />
            </div>

            {/* Right — contact */}
            <div style={{ fontSize: 12, color: E.muted, lineHeight: 2 }}>
              {d.contacts.slice(2).map((c) => (
                <a key={c.label} href={c.href} style={{ display: 'block', color: E.muted, textDecoration: 'none' }}>
                  <span style={{ color: E.goldDim, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.label}: </span>
                  {c.value}
                </a>
              ))}
              {d.location && (
                <div><span style={{ color: E.goldDim, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Location: </span>{d.location}</div>
              )}
            </div>
          </div>

          {/* Name & title */}
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <h1 style={{ fontFamily: serif, fontSize: 'clamp(32px,5vw,56px)', fontWeight: 400, margin: 0, letterSpacing: '0.12em', color: E.white, textTransform: 'uppercase' }}>{d.name}</h1>
            <div style={{ fontFamily: sans, fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', color: E.gold, marginTop: 10 }}>{d.headline}</div>
          </div>
        </motion.div>

        <GoldRule />

        {/* Executive summary */}
        <Reveal delay={0.05}>
          <div style={{ maxWidth: 680, margin: '0 auto 0', textAlign: 'center' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: E.gold, marginBottom: 16 }}>Executive Summary</div>
            <p style={{ fontFamily: serif, fontSize: 17, lineHeight: 1.85, color: E.text, fontStyle: 'italic', margin: 0 }}>{d.bio}</p>
          </div>
        </Reveal>

        <GoldRule />

        {/* Competencies */}
        <Reveal delay={0.08}>
          <div style={{ marginBottom: 0 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: E.gold, marginBottom: 20, textAlign: 'center' }}>Core Competencies</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
              {d.skills.map((s) => (
                <div key={s} style={{ border: `1px solid ${E.goldDim}`, padding: '8px 20px', fontSize: 12, color: E.goldLight, letterSpacing: '0.08em', position: 'relative' }}>
                  {/* Corner accents */}
                  <span style={{ position: 'absolute', top: -2, left: -2, width: 6, height: 6, borderTop: `1px solid ${E.gold}`, borderLeft: `1px solid ${E.gold}` }} />
                  <span style={{ position: 'absolute', top: -2, right: -2, width: 6, height: 6, borderTop: `1px solid ${E.gold}`, borderRight: `1px solid ${E.gold}` }} />
                  <span style={{ position: 'absolute', bottom: -2, left: -2, width: 6, height: 6, borderBottom: `1px solid ${E.gold}`, borderLeft: `1px solid ${E.gold}` }} />
                  <span style={{ position: 'absolute', bottom: -2, right: -2, width: 6, height: 6, borderBottom: `1px solid ${E.gold}`, borderRight: `1px solid ${E.gold}` }} />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <GoldRule />

        {/* Selected Works */}
        <Reveal delay={0.1}>
          <div style={{ marginBottom: 0 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: E.gold, marginBottom: 24, textAlign: 'center' }}>Selected Works</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {d.projects.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                  <a href={p.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={{ background: E.card, border: `1px solid ${E.goldDim}44`, padding: '22px 20px', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent, ${E.gold}88, transparent)` }} />
                      <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: E.gold, marginBottom: 10 }}>{p.language || 'Project'} · ★ {p.stars}</div>
                      <div style={{ fontFamily: serif, fontSize: 18, color: E.white, marginBottom: 10, fontWeight: 400 }}>{p.name}</div>
                      <p style={{ fontSize: 13, color: E.muted, lineHeight: 1.65, margin: 0 }}>{p.description}</p>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        <GoldRule />

        {/* Experience + Achievements */}
        <div style={{ display: 'grid', gridTemplateColumns: d.achievements.length > 0 ? '3fr 2fr' : '1fr', gap: 48, paddingBottom: 60 }}>
          {(d.experience.length > 0 || d.education.length > 0) && (
            <Reveal delay={0.12}>
              <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: E.gold, marginBottom: 20 }}>Professional History</div>
              {[...d.experience, ...d.education].map((item, i, arr) => (
                <div key={i} style={{ paddingBottom: 20, marginBottom: 20, borderBottom: i < arr.length - 1 ? `1px solid ${E.goldDim}33` : 'none' }}>
                  <div style={{ fontFamily: serif, fontSize: 17, color: E.white, marginBottom: 4 }}>{item.role || item.degree}</div>
                  <div style={{ fontSize: 13, color: E.gold, marginBottom: 4 }}>{item.company || item.institution}</div>
                  <div style={{ fontSize: 11, color: E.muted }}>{item.startDate || item.year}{item.endDate ? ` – ${item.endDate}` : ''}</div>
                </div>
              ))}
            </Reveal>
          )}
          {d.achievements.length > 0 && (
            <Reveal delay={0.14}>
              <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: E.gold, marginBottom: 20 }}>Honours</div>
              {d.achievements.map((a, i, arr) => (
                <div key={i} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: i < arr.length - 1 ? `1px solid ${E.goldDim}33` : 'none' }}>
                  <div style={{ fontFamily: serif, fontSize: 15, color: E.white, marginBottom: 2 }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: E.gold }}>{a.year}</div>
                </div>
              ))}
            </Reveal>
          )}
        </div>
      </div>

      {/* Gold bottom stripe */}
      <div style={{ height: 3, background: `linear-gradient(to right, transparent, ${E.gold}, ${E.gold}, transparent)` }} />
    </div>
  );
};
