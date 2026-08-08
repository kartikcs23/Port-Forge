import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const COLORS = ['#ff3366', '#ffde59', '#00c8ff', '#39ff14', '#ff6b35', '#c061ff'];
const display = "'Impact','Arial Black','Haettenschweiler',sans-serif";
const body = "system-ui,-apple-system,sans-serif";
const typewriter = "'Courier New',Courier,monospace";

const Reveal = ({ children, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, scale: 0.95, rotate: -0.5 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ duration: 0.4, delay }}>{children}</motion.div>
);

const Sticker = ({ children, color, rotate = 0, shape = 'rect', style = {} }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    background: color, padding: shape === 'circle' ? '8px' : '5px 14px',
    borderRadius: shape === 'circle' ? '50%' : shape === 'badge' ? '99px' : 0,
    width: shape === 'circle' ? 44 : undefined, height: shape === 'circle' ? 44 : undefined,
    fontWeight: 900, fontSize: shape === 'circle' ? 10 : 11,
    textTransform: 'uppercase', letterSpacing: '0.06em', color: '#000',
    transform: `rotate(${rotate}deg)`,
    boxShadow: '3px 3px 0 rgba(0,0,0,0.25)',
    flexShrink: 0,
    ...style,
  }}>{children}</div>
);

const TapeStrip = ({ color, rotate = -2 }) => (
  <div style={{ height: 20, background: color + '66', transform: `rotate(${rotate}deg)`, margin: '-10px -40px', borderTop: '1px solid ' + color + '44', borderBottom: '1px solid ' + color + '44' }} />
);

export const ZineTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);

  return (
    <div style={{ background: '#f5f5f0', minHeight: '100vh', fontFamily: body, color: '#111', overflowX: 'hidden' }}>

      {/* Hero spread */}
      <div style={{ background: '#111', padding: '40px 20px 0', position: 'relative', overflow: 'hidden' }}>
        {/* Background color blocks */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '40%', height: '100%', background: COLORS[0], opacity: 0.9 }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: '30%', height: '60%', background: COLORS[1], opacity: 0.9 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Sticker color={COLORS[1]} rotate={-3}>Portfolio</Sticker>
              <Sticker color="#fff" rotate={2}>{new Date().getFullYear()}</Sticker>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {d.location && <Sticker color={COLORS[2]} shape="badge" rotate={1}>{d.location}</Sticker>}
              <Sticker color={COLORS[4]} shape="circle" rotate={-2}>DEV</Sticker>
            </div>
          </div>

          <motion.h1
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{ fontFamily: display, fontSize: 'clamp(48px,10vw,110px)', fontWeight: 900, color: '#fff', margin: '0 0 8px', lineHeight: 0.85, textTransform: 'uppercase', letterSpacing: '-0.02em', mixBlendMode: 'difference', position: 'relative', zIndex: 2 }}
          >
            {d.name}
          </motion.h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0 0', flexWrap: 'wrap' }}>
            <div style={{ fontFamily: display, fontSize: 18, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em', mixBlendMode: 'difference' }}>{d.headline}</div>
            <Sticker color={COLORS[3]} rotate={-1} style={{ fontSize: 10 }}>Open To Work</Sticker>
          </div>

          <TapeStrip color={COLORS[1]} rotate={-1} />
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 900, margin: '20px auto', padding: '0 20px 80px' }}>

        {/* Bio — torn paper card */}
        <Reveal delay={0.04}>
          <div style={{ background: COLORS[1], border: '3px solid #111', padding: '28px', marginBottom: 24, position: 'relative', transform: 'rotate(-0.5deg)' }}>
            <div style={{ position: 'absolute', top: -14, left: 20 }}>
              <Sticker color="#111" rotate={2} style={{ color: '#fff' }}>About Me</Sticker>
            </div>
            <p style={{ fontFamily: typewriter, fontSize: 15, lineHeight: 1.75, margin: '10px 0 0', letterSpacing: '0.01em' }}>{d.bio}</p>
            {/* Tape accents */}
            <div style={{ position: 'absolute', top: -8, right: 40, width: 48, height: 18, background: COLORS[2] + '88', transform: 'rotate(3deg)' }} />
          </div>
        </Reveal>

        {/* Skills — scattered stickers */}
        <Reveal delay={0.06}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: display, fontSize: 16, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
              // SKILLS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {d.skills.map((s, i) => (
                <Sticker
                  key={s}
                  color={COLORS[i % COLORS.length]}
                  rotate={(i % 5) - 2}
                  shape={i % 4 === 0 ? 'badge' : 'rect'}
                  style={{ fontSize: i % 3 === 0 ? 13 : 11 }}
                >
                  {s}
                </Sticker>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Projects — polaroid-style cards */}
        <div style={{ marginBottom: 28 }}>
          <Reveal>
            <div style={{ fontFamily: display, fontSize: 16, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>// PROJECTS</div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {d.projects.map((p, i) => (
              <Reveal key={p.id} delay={0.06 + i * 0.04}>
                <a href={p.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <motion.div
                    whileHover={{ rotate: 0, y: -8 }}
                    style={{
                      background: '#fff', padding: '16px 16px 24px',
                      border: '3px solid #111',
                      boxShadow: '5px 5px 0 #111',
                      transform: `rotate(${(i % 5) - 2}deg)`,
                      cursor: 'pointer',
                    }}
                  >
                    {/* "Photo" area */}
                    <div style={{ height: 80, background: `${COLORS[i % COLORS.length]}33`, border: '1px solid #ddd', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ fontFamily: display, fontSize: 32, color: COLORS[i % COLORS.length], fontWeight: 900, opacity: 0.5 }}>
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ position: 'absolute', top: 4, right: 4 }}>
                        <Sticker color={COLORS[(i + 2) % COLORS.length]} style={{ fontSize: 9 }}>{p.language || 'CODE'}</Sticker>
                      </div>
                    </div>
                    <div style={{ fontFamily: display, fontWeight: 900, fontSize: 17, textTransform: 'uppercase', marginBottom: 6 }}>{p.name}</div>
                    <p style={{ fontFamily: typewriter, fontSize: 12, lineHeight: 1.5, margin: '0 0 8px', color: '#444' }}>{p.description}</p>
                    <div style={{ fontSize: 10, color: '#888', fontFamily: typewriter }}>★ {p.stars} stars</div>
                  </motion.div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Experience + Contact — side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {(d.experience.length > 0 || d.education.length > 0) && (
            <Reveal delay={0.12}>
              <div style={{ background: COLORS[0], border: '3px solid #111', padding: '20px', position: 'relative', transform: 'rotate(0.5deg)', boxShadow: '4px 4px 0 #111' }}>
                <div style={{ position: 'absolute', top: -13, left: 12 }}>
                  <Sticker color="#111" rotate={-2} style={{ color: '#fff' }}>History</Sticker>
                </div>
                <div style={{ marginTop: 8 }}>
                  {[...d.experience, ...d.education].map((item, i) => (
                    <div key={i} style={{ marginBottom: 12, fontFamily: typewriter }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{item.role || item.degree}</div>
                      <div style={{ fontSize: 12 }}>{item.company || item.institution}</div>
                      <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.6)' }}>{item.startDate || item.year}{item.endDate ? `–${item.endDate}` : ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
          <Reveal delay={0.14}>
            <div style={{ background: '#111', border: '3px solid #111', padding: '20px', position: 'relative', transform: 'rotate(-0.4deg)', boxShadow: '4px 4px 0 ' + COLORS[0] }}>
              <div style={{ position: 'absolute', top: -13, left: 12 }}>
                <Sticker color={COLORS[1]} rotate={1}>Reach Out</Sticker>
              </div>
              <div style={{ marginTop: 8 }}>
                {d.contacts.map((c, i) => (
                  <a key={c.label} href={c.href} style={{ display: 'block', marginBottom: 10, textDecoration: 'none' }}>
                    <Sticker color={COLORS[i % COLORS.length]} rotate={(i % 3) - 1} style={{ width: '100%', justifyContent: 'flex-start', gap: 8, fontSize: 11 }}>
                      <span style={{ opacity: 0.6 }}>{c.label}:</span> {c.value}
                    </Sticker>
                  </a>
                ))}
                {d.achievements.length > 0 && (
                  <div style={{ marginTop: 12, borderTop: '1px dashed #333', paddingTop: 12 }}>
                    {d.achievements.map((a, i) => (
                      <div key={i} style={{ color: COLORS[1], fontFamily: typewriter, fontSize: 11, marginBottom: 4 }}>🏆 {a.title} ({a.year})</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};
