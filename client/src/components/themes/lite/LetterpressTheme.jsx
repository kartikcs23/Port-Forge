import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const L = { paper: '#c8a87a', dark: '#d4b896', ink: '#2a1a08', stamp: '#8b3a1a', faded: '#6b4c1e', light: '#e8d4b0' };

const Reveal = ({ children, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, delay }}>{children}</motion.div>
);

const TornEdge = ({ flip = false }) => (
  <svg viewBox="0 0 800 30" preserveAspectRatio="none" style={{ width: '100%', display: 'block', transform: flip ? 'scaleY(-1)' : 'none' }}>
    <path d="M0,30 L0,15 L40,18 L80,10 L120,20 L160,8 L200,16 L240,12 L280,20 L320,6 L360,18 L400,10 L440,22 L480,8 L520,18 L560,12 L600,20 L640,5 L680,16 L720,10 L760,19 L800,8 L800,30 Z" fill={L.paper} />
  </svg>
);

const WaxSeal = ({ initials }) => (
  <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
    <svg viewBox="0 0 72 72" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <circle cx="36" cy="36" r="34" fill={L.stamp} />
      <circle cx="36" cy="36" r="28" fill="none" stroke={L.light} strokeWidth="1.5" strokeDasharray="4 3" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return <circle key={i} cx={36 + 31 * Math.cos(a)} cy={36 + 31 * Math.sin(a)} r="1.5" fill={L.light} />;
      })}
    </svg>
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Georgia',serif", fontSize: 20, fontWeight: 400, color: L.light, letterSpacing: '0.08em' }}>
      {initials}
    </div>
  </div>
);

const PressMark = ({ text, rotate = -2 }) => (
  <div style={{ display: 'inline-block', border: `2.5px solid ${L.stamp}`, padding: '4px 12px', transform: `rotate(${rotate}deg)`, fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: L.stamp, opacity: 0.8, fontFamily: "'Georgia',serif" }}>
    {text}
  </div>
);

export const LetterpressTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const serif = "'Palatino Linotype',Palatino,'Book Antiqua',Georgia,serif";
  const initials = d.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{ background: '#b8946e', minHeight: '100vh', fontFamily: serif }}>

      {/* Paper texture overlay */}
      <div style={{ background: L.paper, minHeight: '100vh', position: 'relative' }}>
        {/* Grain texture */}
        <div style={{ position: 'fixed', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`, pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* Header */}
          <div style={{ padding: '48px 40px 0', maxWidth: 760, margin: '0 auto' }}>
            <Reveal>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: `3px solid ${L.ink}`, paddingBottom: 20, marginBottom: 0, flexWrap: 'wrap', gap: 20 }}>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: L.faded, marginBottom: 12, fontFamily: serif }}>Curriculum Vitae</div>
                  <h1 style={{ fontSize: 'clamp(30px,6vw,58px)', fontWeight: 400, margin: 0, lineHeight: 0.9, color: L.ink, letterSpacing: '-0.01em' }}>{d.name}</h1>
                  <div style={{ fontStyle: 'italic', fontSize: 16, color: L.faded, marginTop: 10 }}>{d.headline}{d.location ? `, ${d.location}` : ''}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                  <WaxSeal initials={initials} />
                  <PressMark text="Open to Hire" rotate={2} />
                </div>
              </div>
            </Reveal>

            {/* Double rule */}
            <div style={{ height: 1, background: L.ink, marginBottom: 2 }} />
          </div>

          <TornEdge />

          {/* Mid section on slightly darker paper */}
          <div style={{ background: L.dark, padding: '24px 40px' }}>
            <div style={{ maxWidth: 760, margin: '0 auto' }}>
              <Reveal delay={0.04}>
                <div style={{ marginBottom: 0 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: L.faded, marginBottom: 10 }}>Introduction</div>
                  <p style={{ fontSize: 16, lineHeight: 1.9, margin: 0, textAlign: 'justify', color: L.ink, textIndent: '2em' }}>{d.bio}</p>
                </div>
              </Reveal>
            </div>
          </div>

          <TornEdge flip />

          <div style={{ padding: '24px 40px 0', maxWidth: 760, margin: '0 auto' }}>

            {/* Skills */}
            <Reveal delay={0.07}>
              <div style={{ marginBottom: 32, paddingBottom: 28, borderBottom: `1px solid ${L.paper}` }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: L.faded, marginBottom: 14 }}>Disciplines</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 0', lineHeight: 2 }}>
                  {d.skills.map((s, i) => (
                    <React.Fragment key={s}>
                      <span style={{ fontSize: 15, color: L.ink }}>{s}</span>
                      {i < d.skills.length - 1 && <span style={{ margin: '0 12px', color: L.faded }}>·</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Projects */}
            <div style={{ marginBottom: 32, paddingBottom: 28, borderBottom: `1px solid ${L.paper}` }}>
              <Reveal><div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: L.faded, marginBottom: 20 }}>Works</div></Reveal>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
                {d.projects.map((p, i) => (
                  <Reveal key={p.id} delay={0.07 + i * 0.04}>
                    <div style={{ display: 'flex', gap: 14, marginBottom: 22, paddingBottom: 22, borderBottom: `1px dotted ${L.faded}44` }}>
                      <div style={{ fontSize: 18, fontStyle: 'italic', color: L.stamp, lineHeight: 1.2, flexShrink: 0, minWidth: 28 }}>{String(i + 1).padStart(2, '0')}.</div>
                      <div>
                        <a href={p.url} target="_blank" rel="noreferrer" style={{ fontWeight: 700, fontSize: 15, color: L.ink, textDecoration: 'none', display: 'block', marginBottom: 4 }}>{p.name}</a>
                        <span style={{ fontStyle: 'italic', fontSize: 12, color: L.faded }}>{p.language}</span>
                        <p style={{ fontSize: 13, lineHeight: 1.6, margin: '4px 0 0', color: L.ink + 'cc' }}>{p.description}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Experience */}
            {(d.experience.length > 0 || d.education.length > 0) && (
              <Reveal delay={0.14}>
                <div style={{ marginBottom: 32, paddingBottom: 28, borderBottom: `1px solid ${L.paper}` }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: L.faded, marginBottom: 16 }}>Positions &amp; Education</div>
                  {[...d.experience, ...d.education].map((item, i) => (
                    <div key={i} style={{ marginBottom: 12, paddingLeft: 16, borderLeft: `2px solid ${L.stamp}44` }}>
                      <strong style={{ fontSize: 15, color: L.ink }}>{item.role || item.degree}</strong>
                      <span style={{ fontSize: 14, color: L.faded }}> — {item.company || item.institution}</span>
                      <span style={{ fontSize: 11, color: L.stamp, marginLeft: 10 }}>({item.startDate || item.year}{item.endDate ? `–${item.endDate}` : ''})</span>
                    </div>
                  ))}
                  {d.achievements.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      {d.achievements.map((a, i) => (
                        <div key={i} style={{ marginBottom: 8, paddingLeft: 16, borderLeft: `2px solid ${L.stamp}`, fontStyle: 'italic', fontSize: 14, color: L.ink }}>
                          {a.title} <span style={{ color: L.faded, fontSize: 12 }}>({a.year})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            )}

            {/* Correspondence */}
            <Reveal delay={0.16}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, paddingBottom: 48 }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: L.faded, marginBottom: 12 }}>Correspondence</div>
                  {d.contacts.map((c) => (
                    <a key={c.label} href={c.href} style={{ display: 'block', fontSize: 14, color: L.ink, marginBottom: 6, textDecoration: 'underline', textDecorationColor: L.stamp }}>
                      {c.value}
                    </a>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <PressMark text="Print Ready" rotate={-3} />
                  <PressMark text={String(new Date().getFullYear())} rotate={2} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
};
