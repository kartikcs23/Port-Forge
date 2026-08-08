import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const INDIGO = '#4f46e5';
const LIGHT_INDIGO = '#818cf8';
const BG = '#f8f9ff';
const FOLD = '#e8eaff';

const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, rotateX: 12, y: 20 }}
    whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.5, delay }}
    style={{ transformPerspective: 800 }}
  >
    {children}
  </motion.div>
);

const FoldDecor = ({ top = true }) => (
  <svg viewBox="0 0 200 20" style={{ width: '100%', display: 'block' }} preserveAspectRatio="none">
    <polygon points={top ? "0,20 100,0 200,20" : "0,0 100,20 200,0"} fill={FOLD} />
  </svg>
);

const Panel = ({ accent = false, children }) => (
  <div style={{
    background: accent ? INDIGO : '#fff',
    color: accent ? '#fff' : '#1e1b4b',
    borderRadius: 2,
    padding: '28px 28px',
    boxShadow: accent ? `0 8px 32px ${INDIGO}44` : '0 2px 16px rgba(79,70,229,0.08)',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Fold corner */}
    <div style={{
      position: 'absolute', top: 0, right: 0,
      borderStyle: 'solid',
      borderWidth: '0 28px 28px 0',
      borderColor: `transparent ${accent ? 'rgba(255,255,255,0.2)' : FOLD} transparent transparent`,
    }} />
    {children}
  </div>
);

export const OrigamiTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const sans = "'Nunito', system-ui, -apple-system, sans-serif";

  return (
    <div style={{ background: BG, fontFamily: sans, minHeight: '100vh', color: '#1e1b4b' }}>

      {/* Hero fold */}
      <div style={{ background: INDIGO, padding: '60px 24px 0', textAlign: 'center', color: '#fff' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 16 }}>Portfolio</div>
            <h1 style={{ fontSize: 'clamp(32px,6vw,60px)', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.02em', lineHeight: 1.0 }}>{d.name}</h1>
            <p style={{ fontSize: 17, opacity: 0.85, margin: '0 0 32px' }}>{d.headline}{d.location ? ` · ${d.location}` : ''}</p>
          </motion.div>
        </div>
        <FoldDecor top={false} />
      </div>

      <div style={{ maxWidth: 820, margin: '-2px auto 0', padding: '32px 20px 80px' }}>

        <Reveal>
          <Panel style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: INDIGO, marginBottom: 10 }}>About</div>
            <p style={{ fontSize: 16, lineHeight: 1.75, margin: 0, color: '#374151' }}>{d.bio}</p>
          </Panel>
        </Reveal>

        <div style={{ height: 20 }} />

        <Reveal delay={0.05}>
          <Panel accent>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.75, marginBottom: 14 }}>Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {d.skills.map((s) => (
                <span key={s} style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 99, padding: '5px 14px', fontSize: 13 }}>{s}</span>
              ))}
            </div>
          </Panel>
        </Reveal>

        <div style={{ height: 20 }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
          {d.projects.map((p, i) => (
            <Reveal key={p.id} delay={0.08 + i * 0.04}>
              <a href={p.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                <div style={{
                  background: '#fff',
                  borderRadius: 2,
                  padding: '20px 22px',
                  height: '100%',
                  boxSizing: 'border-box',
                  boxShadow: '0 2px 16px rgba(79,70,229,0.08)',
                  borderTop: `3px solid ${LIGHT_INDIGO}`,
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, borderStyle: 'solid', borderWidth: '0 18px 18px 0', borderColor: `transparent ${FOLD} transparent transparent` }} />
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#1e1b4b', marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: LIGHT_INDIGO, marginBottom: 8 }}>{p.language} · ★{p.stars}</div>
                  <p style={{ fontSize: 13, color: '#555', lineHeight: 1.5, margin: 0 }}>{p.description}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {(d.experience.length > 0 || d.education.length > 0) && (
            <Reveal delay={0.14}>
              <Panel>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: INDIGO, marginBottom: 14 }}>Experience</div>
                {[...d.experience, ...d.education].map((item, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1e1b4b' }}>{item.role || item.degree}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>{item.company || item.institution}</div>
                    <div style={{ fontSize: 11, color: LIGHT_INDIGO }}>{item.startDate || item.year}{item.endDate ? `–${item.endDate}` : ''}</div>
                  </div>
                ))}
                {d.achievements.length > 0 && (
                  <>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: INDIGO, margin: '14px 0 10px' }}>Achievements</div>
                    {d.achievements.map((a, i) => (
                      <div key={i} style={{ fontSize: 13, marginBottom: 8, color: '#374151' }}>
                        <strong>{a.title}</strong> <span style={{ color: LIGHT_INDIGO, fontSize: 11 }}>{a.year}</span>
                      </div>
                    ))}
                  </>
                )}
              </Panel>
            </Reveal>
          )}
          <Reveal delay={0.16}>
            <Panel accent>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.75, marginBottom: 14 }}>Contact</div>
              {d.contacts.map((c) => (
                <a key={c.label} href={c.href} style={{ display: 'block', color: '#fff', fontSize: 14, marginBottom: 10, textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.4)', textUnderlineOffset: 4 }}>
                  {c.label}: {c.value}
                </a>
              ))}
            </Panel>
          </Reveal>
        </div>
      </div>
    </div>
  );
};
