import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const KRAFT = '#c8a87a';
const DARK = '#2a1f0e';
const INK = '#3d2b0e';
const STAMP = '#8b3a1a';

const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.45, delay }}
  >
    {children}
  </motion.div>
);

const Stamp = ({ children, rotate = -2 }) => (
  <div style={{
    display: 'inline-block',
    border: `3px solid ${STAMP}`,
    padding: '4px 12px',
    transform: `rotate(${rotate}deg)`,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: STAMP,
    opacity: 0.85,
  }}>
    {children}
  </div>
);

export const LetterpressTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const serif = "'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif";

  return (
    <div style={{ background: '#d4b896', color: INK, fontFamily: serif, minHeight: '100vh' }}>
      {/* Texture overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'4\' height=\'4\'%3E%3Crect width=\'4\' height=\'4\' fill=\'%23c4a47c\'/%3E%3Ccircle cx=\'1\' cy=\'1\' r=\'0.5\' fill=\'%23bf9f76\' opacity=\'0.5\'/%3E%3C/svg%3E")',
        opacity: 0.5,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 740, margin: '0 auto', padding: '64px 28px 100px' }}>

        <Reveal>
          <div style={{ borderBottom: `4px solid ${INK}`, paddingBottom: 28, marginBottom: 36, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, right: 0 }}>
              <Stamp rotate={3}>Portfolio</Stamp>
            </div>
            <div style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#6b4c1e', marginBottom: 14 }}>Curriculum Vitae</div>
            <h1 style={{ fontSize: 'clamp(32px,6vw,60px)', fontWeight: 400, margin: 0, letterSpacing: '-0.01em', lineHeight: 0.95 }}>{d.name}</h1>
            <p style={{ fontSize: 16, fontStyle: 'italic', color: '#5a3e1c', marginTop: 10, marginBottom: 0 }}>{d.headline}{d.location ? `, ${d.location}` : ''}</p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div style={{ marginBottom: 32, paddingBottom: 28, borderBottom: `1px solid ${KRAFT}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b4c1e', marginBottom: 10 }}>Introduction</div>
            <p style={{ fontSize: 16, lineHeight: 1.85, margin: 0, textAlign: 'justify', textIndent: '2em' }}>{d.bio}</p>
          </div>
        </Reveal>

        <Reveal delay={0.07}>
          <div style={{ marginBottom: 32, paddingBottom: 28, borderBottom: `1px solid ${KRAFT}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b4c1e', marginBottom: 12 }}>Disciplines</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 0' }}>
              {d.skills.map((s, i) => (
                <React.Fragment key={s}>
                  <span style={{ fontSize: 15 }}>{s}</span>
                  {i < d.skills.length - 1 && <span style={{ margin: '0 10px', color: KRAFT }}>·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </Reveal>

        <div style={{ marginBottom: 32, paddingBottom: 28, borderBottom: `1px solid ${KRAFT}` }}>
          <Reveal><div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b4c1e', marginBottom: 16 }}>Works</div></Reveal>
          {d.projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.04}>
              <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 14, marginBottom: 20 }}>
                <div style={{ fontSize: 18, fontStyle: 'italic', color: STAMP, lineHeight: 1.4 }}>{String(i + 1).padStart(2, '0')}.</div>
                <div>
                  <a href={p.url} target="_blank" rel="noreferrer" style={{ fontWeight: 700, fontSize: 16, color: INK, textDecoration: 'none' }}>{p.name}</a>
                  <span style={{ fontStyle: 'italic', fontSize: 13, color: '#6b4c1e', marginLeft: 8 }}>{p.language}</span>
                  <p style={{ fontSize: 14, lineHeight: 1.65, margin: '4px 0 0', color: '#4a3010' }}>{p.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {(d.experience.length > 0 || d.education.length > 0) && (
          <Reveal delay={0.14}>
            <div style={{ marginBottom: 32, paddingBottom: 28, borderBottom: `1px solid ${KRAFT}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b4c1e', marginBottom: 14 }}>Positions &amp; Education</div>
              {[...d.experience, ...d.education].map((item, i) => (
                <div key={i} style={{ marginBottom: 14, fontStyle: i % 2 === 0 ? 'normal' : 'italic' }}>
                  <strong style={{ fontSize: 15 }}>{item.role || item.degree}</strong>
                  <span style={{ fontSize: 14, color: '#6b4c1e' }}> — {item.company || item.institution}</span>
                  <span style={{ fontSize: 12, color: '#8a6640', marginLeft: 8 }}>({item.startDate || item.year}{item.endDate ? `–${item.endDate}` : ''})</span>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal delay={0.16}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b4c1e', marginBottom: 10 }}>Correspondence</div>
              {d.contacts.map((c) => (
                <a key={c.label} href={c.href} style={{ display: 'block', fontSize: 14, color: INK, marginBottom: 6, textDecoration: 'underline', textDecorationColor: KRAFT }}>
                  {c.value}
                </a>
              ))}
            </div>
            <Stamp rotate={-3}>Open to Hire</Stamp>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
