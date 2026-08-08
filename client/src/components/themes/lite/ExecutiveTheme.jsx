import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const NAVY = '#0a1628';
const GOLD = '#c9a84c';
const LIGHT_GOLD = '#e8c97e';
const CARD = '#0f2040';
const MUTED = '#7a9bb5';

const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

const Divider = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0' }}>
    <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${GOLD}66)` }} />
    <div style={{ width: 6, height: 6, background: GOLD, transform: 'rotate(45deg)' }} />
    <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${GOLD}66)` }} />
  </div>
);

export const ExecutiveTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const serif = "'Georgia', 'Times New Roman', serif";
  const sans = "system-ui, -apple-system, 'Segoe UI', sans-serif";

  return (
    <div style={{ background: NAVY, color: '#e8f0f8', fontFamily: sans, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, #0a1628 0%, #0f2040 60%, #152a50 100%)`, borderBottom: `1px solid ${GOLD}44`, padding: '64px 24px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, marginBottom: 18, fontFamily: serif }}>Portfolio</div>
            {d.avatar && (
              <img src={d.avatar} alt={d.name} style={{ width: 90, height: 90, borderRadius: '50%', border: `3px solid ${GOLD}`, marginBottom: 20, objectFit: 'cover', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
            )}
            <h1 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 300, margin: '0 0 10px', fontFamily: serif, letterSpacing: '0.05em', color: '#fff' }}>{d.name}</h1>
            <div style={{ fontSize: 14, color: GOLD, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{d.headline}{d.location ? ` · ${d.location}` : ''}</div>
          </motion.div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px 80px' }}>

        <Reveal>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: '#b8cfe0', textAlign: 'center', maxWidth: 620, margin: '0 auto', fontFamily: serif, fontStyle: 'italic' }}>{d.bio}</p>
        </Reveal>

        <Divider />

        <Reveal delay={0.05}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: GOLD, marginBottom: 18, textAlign: 'center' }}>Core Competencies</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
              {d.skills.map((s) => (
                <span key={s} style={{ fontSize: 13, border: `1px solid ${GOLD}66`, padding: '6px 18px', color: LIGHT_GOLD, letterSpacing: '0.05em' }}>{s}</span>
              ))}
            </div>
          </div>
        </Reveal>

        <Divider />

        <Reveal delay={0.08}>
          <div style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: GOLD, marginBottom: 20, textAlign: 'center' }}>Selected Works</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
            {d.projects.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <a href={p.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                  <div style={{ background: CARD, border: `1px solid ${GOLD}33`, padding: '24px 22px', height: '100%', boxSizing: 'border-box', transition: 'border-color 0.2s', cursor: 'pointer' }}>
                    <div style={{ fontSize: 10, color: GOLD, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>{p.language} · ★ {p.stars}</div>
                    <div style={{ fontWeight: 600, fontSize: 16, color: '#fff', marginBottom: 10, fontFamily: serif }}>{p.name}</div>
                    <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, margin: 0 }}>{p.description}</p>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <Divider />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {(d.experience.length > 0 || d.education.length > 0) && (
            <Reveal delay={0.1}>
              <div style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>Experience</div>
              {[...d.experience, ...d.education].map((item, i) => (
                <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < d.experience.length + d.education.length - 1 ? `1px solid ${GOLD}22` : 'none' }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#e8f0f8', fontFamily: serif }}>{item.role || item.degree}</div>
                  <div style={{ fontSize: 13, color: GOLD, marginTop: 2 }}>{item.company || item.institution}</div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{item.startDate || item.year}{item.endDate ? `–${item.endDate}` : ''}</div>
                </div>
              ))}
            </Reveal>
          )}
          <Reveal delay={0.12}>
            {d.achievements.length > 0 && (
              <>
                <div style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: GOLD, marginBottom: 16 }}>Honours</div>
                {d.achievements.map((a, i) => (
                  <div key={i} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: i < d.achievements.length - 1 ? `1px solid ${GOLD}22` : 'none' }}>
                    <div style={{ fontSize: 14, color: '#e8f0f8', fontFamily: serif }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: GOLD }}>{a.year}</div>
                  </div>
                ))}
              </>
            )}
            <div style={{ marginTop: d.achievements.length ? 24 : 0 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: GOLD, marginBottom: 14 }}>Contact</div>
              {d.contacts.map((c) => (
                <a key={c.label} href={c.href} style={{ display: 'block', color: LIGHT_GOLD, fontSize: 13, marginBottom: 8, textDecoration: 'none' }}>
                  {c.label}: <span style={{ color: '#b8cfe0' }}>{c.value}</span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};
