import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const T = { bg: '#080c14', card: '#0f1623', border: '#1e2d45', accent: '#6366f1', accentLight: '#818cf8', green: '#10b981', amber: '#f59e0b', muted: '#4a6080', text: '#e2e8f0', dim: '#64748b' };

const Reveal = ({ children, delay = 0, left = true }) => (
  <motion.div initial={{ opacity: 0, x: left ? -24 : 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.45, delay }}>
    {children}
  </motion.div>
);

const TypeBadge = ({ type }) => {
  const map = { exp: ['💼', T.accent, 'Experience'], edu: ['🎓', T.green, 'Education'], award: ['🏆', T.amber, 'Achievement'], project: ['⚡', '#e879f9', 'Project'] };
  const [emoji, color, label] = map[type] || ['📌', T.muted, 'Event'];
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: color + '20', border: `1px solid ${color}44`, borderRadius: 99, padding: '3px 10px', fontSize: 10, fontWeight: 600, color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
      <span>{emoji}</span> {label}
    </div>
  );
};

export const TimelineTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const sans = "system-ui,-apple-system,'Segoe UI',sans-serif";

  return (
    <div style={{ background: T.bg, color: T.text, fontFamily: sans, minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ borderBottom: `1px solid ${T.border}`, background: `linear-gradient(135deg, ${T.card} 0%, #0a1020 100%)`, padding: '60px 24px 48px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.accent }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.accentLight }} />
              <div style={{ fontSize: 12, color: T.accentLight, textTransform: 'uppercase', letterSpacing: '0.2em', marginLeft: 4 }}>Timeline Portfolio</div>
            </div>
            <h1 style={{ fontSize: 'clamp(28px,5vw,56px)', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.025em', lineHeight: 1.05 }}>{d.name}</h1>
            <p style={{ fontSize: 17, color: T.dim, margin: '0 0 20px' }}>{d.headline}{d.location ? ` · ${d.location}` : ''}</p>
            <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.75, maxWidth: 580, margin: '0 0 28px' }}>{d.bio}</p>
            {/* Skills pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {d.skills.map((s) => (
                <span key={s} style={{ fontSize: 12, background: T.accent + '18', border: `1px solid ${T.accent}44`, borderRadius: 6, padding: '4px 12px', color: T.accentLight, fontWeight: 500 }}>{s}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ fontSize: 12, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>Journey</span>
          <div style={{ flex: 1, height: 1, background: T.border }} />
        </div>

        {/* Timeline */}
        {[...d.education.map(e => ({ type: 'edu', ...e })),
          ...d.experience.map(e => ({ type: 'exp', ...e })),
          ...d.achievements.map(a => ({ type: 'award', ...a }))
        ].map((item, i, arr) => (
          <div key={i} style={{ display: 'flex', gap: 0, marginBottom: i < arr.length - 1 ? 0 : 40 }}>
            {/* Spine */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 20, flexShrink: 0, width: 24 }}>
              <motion.div
                initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06, type: 'spring', stiffness: 300 }}
                style={{ width: 14, height: 14, borderRadius: '50%', background: item.type === 'award' ? T.amber : item.type === 'edu' ? T.green : T.accent, border: `3px solid ${T.bg}`, boxShadow: `0 0 0 2px ${item.type === 'award' ? T.amber : item.type === 'edu' ? T.green : T.accent}44`, zIndex: 1, flexShrink: 0, marginTop: 18 }}
              />
              {i < arr.length - 1 && (
                <div style={{ flex: 1, width: 2, background: `linear-gradient(to bottom, ${item.type === 'award' ? T.amber : item.type === 'edu' ? T.green : T.accent}66, transparent)`, minHeight: 40, marginTop: 4 }} />
              )}
            </div>

            {/* Card */}
            <Reveal delay={i * 0.06} left={i % 2 === 0}>
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: '18px 22px', marginBottom: 16, flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                  <TypeBadge type={item.type} />
                  <span style={{ fontSize: 12, color: T.dim }}>
                    {item.startDate || item.year}{item.endDate ? ` → ${item.endDate}` : ''}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, color: T.text, marginBottom: 4 }}>{item.role || item.degree || item.title}</div>
                {(item.company || item.institution) && (
                  <div style={{ fontSize: 13, color: item.type === 'edu' ? T.green : T.accent }}>{item.company || item.institution}</div>
                )}
              </div>
            </Reveal>
          </div>
        ))}

        <div style={{ fontSize: 12, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.2em', margin: '16px 0 32px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>Projects</span>
          <div style={{ flex: 1, height: 1, background: T.border }} />
        </div>

        {/* Projects — full width alternating */}
        {d.projects.map((p, i) => (
          <div key={p.id} style={{ display: 'flex', gap: 0, marginBottom: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 20, flexShrink: 0, width: 24 }}>
              <motion.div
                initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.07, type: 'spring', stiffness: 300 }}
                style={{ width: 14, height: 14, borderRadius: 3, background: '#e879f9', border: `3px solid ${T.bg}`, boxShadow: '0 0 0 2px #e879f944', zIndex: 1, flexShrink: 0, marginTop: 18 }}
              />
              {i < d.projects.length - 1 && (
                <div style={{ flex: 1, width: 2, background: 'linear-gradient(to bottom, #e879f966, transparent)', minHeight: 40, marginTop: 4 }} />
              )}
            </div>
            <Reveal delay={i * 0.07} left={i % 2 === 0}>
              <a href={p.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: 16, flex: 1 }}>
                <motion.div whileHover={{ borderColor: '#e879f944', y: -2 }} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: '18px 22px', transition: 'border-color 0.2s', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                    <TypeBadge type="project" />
                    <span style={{ fontSize: 12, color: T.dim }}>{p.language} · ★{p.stars}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: T.text, marginBottom: 6 }}>{p.name}</div>
                  <p style={{ fontSize: 13, color: T.dim, margin: 0, lineHeight: 1.6 }}>{p.description}</p>
                </motion.div>
              </a>
            </Reveal>
          </div>
        ))}

        {/* Contact */}
        <Reveal delay={0.2}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: '24px 28px', marginTop: 16 }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: T.muted, marginBottom: 16 }}>Get in touch</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 32px' }}>
              {d.contacts.map((c) => (
                <a key={c.label} href={c.href} style={{ color: T.accentLight, fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
                  {c.label}: <span style={{ color: T.text, fontWeight: 400 }}>{c.value}</span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
