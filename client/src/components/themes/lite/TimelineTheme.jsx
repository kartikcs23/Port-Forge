import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const ACCENT = '#6366f1';
const DARK = '#0f0f13';
const CARD = '#1a1a24';
const MUTED = '#6b7280';

const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.4, delay }}
  >
    {children}
  </motion.div>
);

const TimelineItem = ({ dot = ACCENT, children, delay = 0 }) => (
  <div style={{ display: 'flex', gap: 20, marginBottom: 28, position: 'relative' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: dot, border: `2px solid ${dot}`, marginTop: 4, zIndex: 1 }} />
      <div style={{ flex: 1, width: 2, background: `${dot}33`, minHeight: 20 }} />
    </div>
    <Reveal delay={delay}>
      <div style={{ paddingBottom: 8 }}>{children}</div>
    </Reveal>
  </div>
);

export const TimelineTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const sans = "system-ui, -apple-system, 'Segoe UI', sans-serif";

  const events = [
    ...d.education.map(e => ({ type: 'edu', ...e, sortKey: e.endDate || e.year || '9999' })),
    ...d.experience.map(e => ({ type: 'exp', ...e, sortKey: e.endDate || e.startDate || '9999' })),
    ...d.achievements.map(a => ({ type: 'award', ...a, sortKey: a.year || '9999' })),
    ...d.projects.map(p => ({ type: 'project', ...p, sortKey: '9998' })),
  ];

  return (
    <div style={{ background: DARK, color: '#e5e7eb', fontFamily: sans, minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 100px' }}>

        <Reveal>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 12, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 12 }}>Timeline Portfolio</div>
            <h1 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{d.name}</h1>
            <p style={{ fontSize: 16, color: MUTED, margin: '0 0 16px' }}>{d.headline}{d.location ? ` · ${d.location}` : ''}</p>
            <p style={{ fontSize: 15, color: '#9ca3af', lineHeight: 1.7, margin: 0, maxWidth: 560 }}>{d.bio}</p>
          </div>
        </Reveal>

        {/* Skills */}
        <Reveal delay={0.05}>
          <div style={{ marginBottom: 40, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {d.skills.map((s) => (
              <span key={s} style={{ fontSize: 12, background: `${ACCENT}22`, border: `1px solid ${ACCENT}44`, borderRadius: 6, padding: '4px 12px', color: '#a5b4fc' }}>{s}</span>
            ))}
          </div>
        </Reveal>

        <div style={{ fontSize: 11, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24 }}>Journey</div>

        {/* Education & Experience */}
        {[...d.education, ...d.experience].map((item, i) => (
          <TimelineItem key={i} delay={i * 0.04}>
            <div style={{ background: CARD, borderRadius: 12, padding: '16px 20px', border: `1px solid #2d2d3a` }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>{item.role || item.degree}</div>
              <div style={{ fontSize: 13, color: ACCENT, marginTop: 2 }}>{item.company || item.institution}</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{item.startDate || item.year}{item.endDate ? ` → ${item.endDate}` : ''}</div>
            </div>
          </TimelineItem>
        ))}

        {d.achievements.map((a, i) => (
          <TimelineItem key={`a${i}`} dot="#f59e0b" delay={i * 0.04}>
            <div style={{ background: CARD, borderRadius: 12, padding: '14px 18px', border: `1px solid #2d2d3a` }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#fcd34d' }}>🏆 {a.title}</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{a.year}</div>
            </div>
          </TimelineItem>
        ))}

        <div style={{ fontSize: 11, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.15em', margin: '8px 0 24px' }}>Projects</div>
        {d.projects.map((p, i) => (
          <TimelineItem key={p.id} dot="#10b981" delay={i * 0.04}>
            <a href={p.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div style={{ background: CARD, borderRadius: 12, padding: '16px 20px', border: `1px solid #2d2d3a`, cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#6ee7b7' }}>{p.name}</span>
                  <span style={{ fontSize: 11, color: MUTED }}>{p.language} · ★{p.stars}</span>
                </div>
                <p style={{ fontSize: 13, color: '#9ca3af', margin: '6px 0 0', lineHeight: 1.5 }}>{p.description}</p>
              </div>
            </a>
          </TimelineItem>
        ))}

        <Reveal delay={0.2}>
          <div style={{ background: CARD, borderRadius: 12, padding: '20px 24px', border: `1px solid #2d2d3a`, marginTop: 20 }}>
            <div style={{ fontSize: 11, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 14 }}>Get in Touch</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
              {d.contacts.map((c) => (
                <a key={c.label} href={c.href} style={{ color: '#a5b4fc', fontSize: 14, textDecoration: 'none' }}>{c.label}: {c.value}</a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
