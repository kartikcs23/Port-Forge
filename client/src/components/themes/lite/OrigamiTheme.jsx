import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const O = { bg: '#f7f5f0', paper: '#fff', ink: '#1a1a1a', muted: '#8a8070', accent: '#d4602a', fold: '#e8e0d0', shadow: 'rgba(0,0,0,0.12)', light: '#faf8f3' };
const sans = "'Helvetica Neue',Helvetica,Arial,sans-serif";

const Reveal = ({ children, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>
);

/* Flat-fold triangle divider */
const FoldDivider = ({ color = O.fold, flip = false }) => (
  <svg viewBox="0 0 800 48" preserveAspectRatio="none" style={{ width: '100%', display: 'block', transform: flip ? 'scaleY(-1)' : 'none', marginBottom: flip ? 0 : -1 }}>
    <polygon points="0,0 800,0 400,48" fill={color} />
  </svg>
);

/* Paper crane SVG — the signature origami figure */
const PaperCrane = ({ size = 80, color = O.accent }) => (
  <svg viewBox="0 0 100 80" width={size} height={size * 0.8} style={{ display: 'block' }}>
    {/* Simplified crane silhouette using triangular facets */}
    <polygon points="50,10 70,40 50,35" fill={color} opacity="0.9" />
    <polygon points="50,10 30,40 50,35" fill={color} opacity="0.7" />
    <polygon points="50,35 70,40 60,60" fill={color} opacity="0.8" />
    <polygon points="50,35 30,40 40,60" fill={color} opacity="0.6" />
    {/* Wings */}
    <polygon points="50,30 80,20 70,40" fill={color} opacity="0.5" />
    <polygon points="50,30 20,20 30,40" fill={color} opacity="0.4" />
    {/* Tail */}
    <polygon points="60,60 50,35 70,75" fill={color} opacity="0.75" />
    {/* Head */}
    <polygon points="30,40 15,30 25,50" fill={color} opacity="0.85" />
  </svg>
);

/* Faceted card: polygon clip + fold shadow line */
const FacetCard = ({ children, rotate = 0, style = {} }) => (
  <motion.div
    whileHover={{ y: -4, boxShadow: `6px 8px 24px ${O.shadow}` }}
    transition={{ duration: 0.22 }}
    style={{
      background: O.paper,
      boxShadow: `3px 4px 12px ${O.shadow}`,
      transform: `rotate(${rotate}deg)`,
      position: 'relative',
      overflow: 'hidden',
      ...style,
    }}
  >
    {/* Fold crease line */}
    <div style={{ position: 'absolute', top: 0, right: 48, bottom: 0, width: 1, background: O.fold, opacity: 0.6 }} />
    {children}
  </motion.div>
);

/* Triangle-notch section label */
const FoldLabel = ({ children }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, marginBottom: 24 }}>
    <div style={{ width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: `12px solid ${O.accent}` }} />
    <div style={{ background: O.accent, padding: '4px 14px 4px 8px' }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>{children}</span>
    </div>
  </div>
);

export const OrigamiTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);

  return (
    <div style={{ background: O.bg, minHeight: '100vh', fontFamily: sans, color: O.ink }}>

      {/* Hero — angular paper fold layout */}
      <div style={{ background: O.ink, position: 'relative', overflow: 'hidden', padding: '56px 32px 0' }}>
        {/* Geometric background triangles */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 400">
          <polygon points="0,0 300,0 0,300" fill={O.accent} opacity="0.15" />
          <polygon points="800,0 500,0 800,280" fill="#fff" opacity="0.04" />
          <polygon points="400,0 800,200 600,0" fill={O.accent} opacity="0.08" />
          <polygon points="0,400 400,400 0,200" fill="#fff" opacity="0.03" />
        </svg>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 840, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: O.muted, marginBottom: 16 }}>Portfolio</div>
                <h1 style={{ fontSize: 'clamp(32px,7vw,72px)', fontWeight: 300, margin: '0 0 12px', letterSpacing: '-0.02em', lineHeight: 0.95, color: '#fff' }}>
                  {d.name.split(' ').map((word, i) => (
                    <span key={i} style={{ display: 'block', ...(i === 0 ? {} : { marginLeft: '1.5em', fontWeight: 700, color: O.accent }) }}>{word}</span>
                  ))}
                </h1>
                <p style={{ fontSize: 15, color: O.muted, margin: '0 0 20px' }}>{d.headline}{d.location ? ` · ${d.location}` : ''}</p>
              </div>
              <div style={{ paddingTop: 8 }}>
                <PaperCrane size={88} color={O.accent} />
              </div>
            </div>
          </motion.div>

          {/* Skills strip */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }} style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingBottom: 32 }}>
            {d.skills.map((s, i) => (
              <span key={s} style={{ fontSize: 11, padding: '4px 12px', background: i % 4 === 0 ? O.accent : 'rgba(255,255,255,0.1)', color: '#fff', letterSpacing: '0.05em', clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}>
                {s}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Fold transition */}
      <FoldDivider color={O.ink} />
      <FoldDivider color={O.bg} flip />

      <div style={{ maxWidth: 840, margin: '0 auto', padding: '8px 32px 80px' }}>

        {/* Bio */}
        <Reveal delay={0.05}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 32, marginBottom: 48, alignItems: 'start' }}>
            <FacetCard style={{ padding: '28px 32px' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: O.muted, marginBottom: 12 }}>About</div>
              <p style={{ fontSize: 15, lineHeight: 1.85, margin: 0, color: O.ink }}>{d.bio}</p>
            </FacetCard>

            {/* Contacts — angled card */}
            <FacetCard rotate={0.5} style={{ padding: '24px 24px', borderTop: `3px solid ${O.accent}` }}>
              <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: O.muted, marginBottom: 14 }}>Contact</div>
              {d.contacts.map((c) => (
                <a key={c.label} href={c.href} style={{ display: 'flex', gap: 10, marginBottom: 10, textDecoration: 'none', color: O.ink, alignItems: 'baseline' }}>
                  <span style={{ fontSize: 10, color: O.accent, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', minWidth: 52, flexShrink: 0 }}>{c.label}</span>
                  <span style={{ fontSize: 13 }}>{c.value}</span>
                </a>
              ))}
            </FacetCard>
          </div>
        </Reveal>

        {/* Projects — faceted grid */}
        <Reveal delay={0.08}>
          <FoldLabel>Projects</FoldLabel>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: 20, marginBottom: 48 }}>
          {d.projects.map((p, i) => (
            <Reveal key={p.id} delay={0.1 + i * 0.04}>
              <a href={p.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                <FacetCard rotate={(i % 3 - 1) * 0.4} style={{ padding: '22px 22px', height: '100%', boxSizing: 'border-box', borderTop: `2px solid ${i % 2 === 0 ? O.accent : O.fold}` }}>
                  {/* Origami corner fold */}
                  <div style={{ position: 'absolute', top: 0, right: 0, width: 0, height: 0, borderLeft: '20px solid transparent', borderTop: `20px solid ${O.fold}` }} />
                  <div style={{ fontSize: 10, color: O.muted, marginBottom: 10 }}>{p.language} · ★{p.stars}</div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, lineHeight: 1.2 }}>{p.name}</div>
                  <p style={{ fontSize: 13, color: O.muted, margin: 0, lineHeight: 1.6 }}>{p.description}</p>
                </FacetCard>
              </a>
            </Reveal>
          ))}
        </div>

        {/* Experience & Education */}
        {(d.experience.length > 0 || d.education.length > 0 || d.achievements.length > 0) && (
          <>
            <Reveal delay={0.12}>
              <FoldLabel>Background</FoldLabel>
            </Reveal>
            <Reveal delay={0.14}>
              <div style={{ display: 'grid', gridTemplateColumns: d.achievements.length > 0 ? '1fr 1fr' : '1fr', gap: 24, marginBottom: 48 }}>
                <FacetCard style={{ padding: '24px 24px' }}>
                  {[...d.experience.map(e => ({ ...e, type: 'exp' })), ...d.education.map(e => ({ ...e, type: 'edu' }))].map((item, i, arr) => (
                    <div key={i} style={{ marginBottom: i < arr.length - 1 ? 18 : 0, paddingBottom: i < arr.length - 1 ? 18 : 0, borderBottom: i < arr.length - 1 ? `1px solid ${O.fold}` : 'none', display: 'flex', gap: 14 }}>
                      <div style={{ width: 3, flexShrink: 0, background: item.type === 'edu' ? '#2c4a8a' : O.accent, borderRadius: 2, alignSelf: 'stretch' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{item.role || item.degree}</div>
                        <div style={{ fontSize: 13, color: O.muted }}>{item.company || item.institution}</div>
                        <div style={{ fontSize: 11, color: O.accent, marginTop: 2 }}>{item.startDate || item.year}{item.endDate ? `–${item.endDate}` : ''}</div>
                      </div>
                    </div>
                  ))}
                </FacetCard>

                {d.achievements.length > 0 && (
                  <FacetCard style={{ padding: '24px 24px' }}>
                    <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: O.muted, marginBottom: 14 }}>Achievements</div>
                    {d.achievements.map((a, i, arr) => (
                      <div key={i} style={{ marginBottom: i < arr.length - 1 ? 14 : 0, paddingBottom: i < arr.length - 1 ? 14 : 0, borderBottom: i < arr.length - 1 ? `1px solid ${O.fold}` : 'none' }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                          <div style={{ width: 0, height: 0, borderLeft: `6px solid ${O.accent}`, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', marginTop: 4, flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{a.title}</div>
                            <div style={{ fontSize: 11, color: O.muted, marginTop: 2 }}>{a.year}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </FacetCard>
                )}
              </div>
            </Reveal>
          </>
        )}

        {/* Footer fold */}
        <FoldDivider color={O.fold} />
        <div style={{ background: O.fold, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 11, color: O.muted, letterSpacing: '0.1em' }}>{d.name.toUpperCase()}</span>
          <PaperCrane size={28} color={O.muted} />
          <span style={{ fontSize: 11, color: O.muted }}>{new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
};
