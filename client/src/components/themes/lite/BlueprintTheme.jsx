import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const BLUE = '#1a2a4a';
const LINE = '#3a5a8a';
const CYAN = '#7ec8e3';
const WHITE = '#e8f0f8';

const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.4, delay }}
  >
    {children}
  </motion.div>
);

const GridLines = () => (
  <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.12, zIndex: 0 }} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="bp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke={CYAN} strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#bp-grid)" />
  </svg>
);

const Block = ({ label, number, children }) => (
  <div style={{ border: `1px solid ${LINE}`, marginBottom: 28, position: 'relative' }}>
    <div style={{ borderBottom: `1px solid ${LINE}`, padding: '6px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0d1b30' }}>
      <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: CYAN }}>{label}</span>
      <span style={{ fontSize: 10, color: LINE, fontFamily: 'monospace' }}>{number}</span>
    </div>
    <div style={{ padding: '18px 14px' }}>{children}</div>
  </div>
);

export const BlueprintTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const font = "'Courier New', Courier, monospace";

  return (
    <div style={{ background: BLUE, color: WHITE, fontFamily: font, minHeight: '100vh', position: 'relative' }}>
      <GridLines />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: '48px 24px 80px' }}>
        <Reveal>
          <div style={{ borderBottom: `2px solid ${CYAN}`, paddingBottom: 20, marginBottom: 32 }}>
            <div style={{ fontSize: 10, color: CYAN, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
              PORTFOLIO v1.0 — REV A — {new Date().getFullYear()}
            </div>
            <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 400, margin: 0, color: '#fff', letterSpacing: '-0.01em' }}>{d.name}</h1>
            <div style={{ fontSize: 14, color: CYAN, marginTop: 6 }}>{d.headline}{d.location ? ` // ${d.location}` : ''}</div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <Block label="Abstract" number="SEC-01">
            <p style={{ fontSize: 14, lineHeight: 1.8, margin: 0, color: '#c8d8e8' }}>{d.bio}</p>
          </Block>
        </Reveal>

        <Reveal delay={0.1}>
          <Block label="Components / Skills" number="SEC-02">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {d.skills.map((s) => (
                <span key={s} style={{ fontSize: 12, border: `1px solid ${LINE}`, padding: '3px 10px', color: CYAN, letterSpacing: '0.05em' }}>
                  {s}
                </span>
              ))}
            </div>
          </Block>
        </Reveal>

        <Reveal delay={0.12}>
          <Block label="Assemblies / Projects" number="SEC-03">
            <div style={{ display: 'grid', gap: 16 }}>
              {d.projects.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.04}>
                  <a href={p.url} target="_blank" rel="noreferrer" style={{ display: 'block', textDecoration: 'none', color: 'inherit', borderLeft: `3px solid ${CYAN}`, paddingLeft: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{p.name}</span>
                      <span style={{ color: LINE, fontSize: 11 }}>{p.language} · ★{p.stars}</span>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#9ab8c8', lineHeight: 1.5 }}>{p.description}</p>
                  </a>
                </Reveal>
              ))}
            </div>
          </Block>
        </Reveal>

        {(d.experience.length > 0 || d.education.length > 0) && (
          <Reveal delay={0.14}>
            <Block label="Build History" number="SEC-04">
              <div style={{ display: 'grid', gap: 12 }}>
                {[...d.experience, ...d.education].map((item, i) => (
                  <div key={i} style={{ fontSize: 13, color: '#c8d8e8' }}>
                    <span style={{ color: CYAN }}>►</span>{' '}
                    <strong style={{ color: '#fff' }}>{item.role || item.degree}</strong>
                    {' — '}{item.company || item.institution}
                    <span style={{ color: LINE }}> [{item.startDate || item.year}{item.endDate ? `–${item.endDate}` : ''}]</span>
                  </div>
                ))}
              </div>
            </Block>
          </Reveal>
        )}

        {d.achievements.length > 0 && (
          <Reveal delay={0.16}>
            <Block label="Certifications" number="SEC-05">
              <div style={{ display: 'grid', gap: 10 }}>
                {d.achievements.map((a, i) => (
                  <div key={i} style={{ fontSize: 13, color: '#c8d8e8' }}>
                    <span style={{ color: CYAN }}>[CERT]</span> {a.title} <span style={{ color: LINE }}>{a.year}</span>
                  </div>
                ))}
              </div>
            </Block>
          </Reveal>
        )}

        <Reveal delay={0.18}>
          <Block label="Contact / Links" number="SEC-06">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
              {d.contacts.map((c) => (
                <a key={c.label} href={c.href} style={{ color: CYAN, fontSize: 13, textDecoration: 'none' }}>
                  {c.label.toUpperCase()}: {c.value}
                </a>
              ))}
            </div>
          </Block>
        </Reveal>
      </div>
    </div>
  );
};
