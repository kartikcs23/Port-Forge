import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const RED = '#d81e05';
const INK = '#111111';

const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.45, delay }}
  >
    {children}
  </motion.div>
);

const Row = ({ index, label, children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', borderTop: `1px solid ${INK}`, padding: '28px 0' }}>
    <div>
      <div style={{ fontSize: 12, color: RED, fontWeight: 700 }}>{index}</div>
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666' }}>{label}</div>
    </div>
    <div>{children}</div>
  </div>
);

/**
 * Swiss — International Typographic Style: strict left-hand index column,
 * a single grotesque family carrying every weight change, red used only
 * as a rule and a single accent word. No cards, no shadows — grid lines
 * do the organizing.
 */
export const SwissTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const font = "'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif";

  return (
    <div style={{ background: '#fff', color: INK, fontFamily: font, minHeight: '100vh' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '64px 24px 100px' }}>
        <Reveal>
          <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', color: RED, marginBottom: 10 }}>Portfolio — 2026</div>
          <h1 style={{ fontSize: 'clamp(40px,7vw,84px)', fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.02em', margin: 0 }}>
            {d.name}
          </h1>
          <div style={{ fontSize: 18, marginTop: 12, color: '#333' }}>{d.headline}{d.location ? ` — ${d.location}` : ''}</div>
        </Reveal>

        <Row index="01" label="About">
          <Reveal><p style={{ fontSize: 17, lineHeight: 1.6, maxWidth: 560, margin: 0 }}>{d.bio}</p></Reveal>
        </Row>

        <Row index="02" label="Skills">
          <Reveal>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 24px' }}>
              {d.skills.map((s) => (
                <span key={s} style={{ fontSize: 15, fontWeight: 700 }}>{s}</span>
              ))}
            </div>
          </Reveal>
        </Row>

        <Row index="03" label="Projects">
          <div style={{ display: 'grid', gap: 24 }}>
            {d.projects.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <a href={p.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: `1px solid #ddd`, paddingBottom: 6 }}>
                    <span style={{ fontSize: 20, fontWeight: 700 }}>{p.name}</span>
                    <span style={{ fontSize: 12, color: RED, textTransform: 'uppercase' }}>{p.language}</span>
                  </div>
                  <p style={{ fontSize: 14, color: '#444', margin: '8px 0 0', lineHeight: 1.6 }}>{p.description}</p>
                </a>
              </Reveal>
            ))}
          </div>
        </Row>

        {(d.experience.length > 0 || d.education.length > 0) && (
          <Row index="04" label="Experience">
            <div style={{ display: 'grid', gap: 18 }}>
              {[...d.experience, ...d.education].map((item, i) => (
                <Reveal key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700 }}>{item.role || item.degree}</span>
                    <span style={{ color: '#666', fontSize: 13 }}>{item.startDate || item.year}{item.endDate ? `–${item.endDate}` : ''}</span>
                  </div>
                  <div style={{ fontSize: 14, color: '#555' }}>{item.company || item.institution}</div>
                </Reveal>
              ))}
            </div>
          </Row>
        )}

        {d.achievements.length > 0 && (
          <Row index="05" label="Achievements">
            <div style={{ display: 'grid', gap: 14 }}>
              {d.achievements.map((a, i) => (
                <Reveal key={i}>
                  <div style={{ fontWeight: 700 }}>{a.title} <span style={{ color: RED, fontWeight: 400, fontSize: 13 }}>{a.year}</span></div>
                </Reveal>
              ))}
            </div>
          </Row>
        )}

        <Row index="06" label="Contact">
          <Reveal>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 28px' }}>
              {d.contacts.map((c) => (
                <a key={c.label} href={c.href} style={{ fontSize: 15, fontWeight: 700, color: INK, textDecoration: 'underline', textDecorationColor: RED, textUnderlineOffset: 4 }}>
                  {c.value}
                </a>
              ))}
            </div>
          </Reveal>
        </Row>
      </div>
    </div>
  );
};
