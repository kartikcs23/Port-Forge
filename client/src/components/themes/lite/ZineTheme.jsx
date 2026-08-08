import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, rotate: -1, scale: 0.97 }}
    whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.4, delay }}
  >
    {children}
  </motion.div>
);

const COLORS = ['#ff3366', '#ffde59', '#00c8ff', '#39ff14', '#ff6b35'];

const Sticker = ({ children, color, rotate = 0, style = {} }) => (
  <div style={{
    display: 'inline-block',
    background: color,
    padding: '5px 14px',
    fontWeight: 900,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#000',
    transform: `rotate(${rotate}deg)`,
    boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
    ...style,
  }}>{children}</div>
);

export const ZineTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const display = "'Arial Black', 'Impact', 'Haettenschweiler', sans-serif";
  const body = "system-ui, -apple-system, sans-serif";

  return (
    <div style={{ background: '#f5f5f0', minHeight: '100vh', fontFamily: body, color: '#111', padding: '40px 16px 80px', overflowX: 'hidden' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* Hero — collage header */}
        <Reveal>
          <div style={{ position: 'relative', marginBottom: 40, border: '3px solid #111', background: '#fff', padding: '32px 28px' }}>
            <div style={{ position: 'absolute', top: -14, left: 20 }}>
              <Sticker color={COLORS[0]} rotate={-2}>Portfolio</Sticker>
            </div>
            <div style={{ position: 'absolute', top: -12, right: 24 }}>
              <Sticker color={COLORS[1]} rotate={3}>2026</Sticker>
            </div>
            <h1 style={{ fontFamily: display, fontSize: 'clamp(36px,8vw,80px)', fontWeight: 900, margin: '16px 0 0', lineHeight: 0.9, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
              {d.name}
            </h1>
            <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: display, fontSize: 16, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{d.headline}</span>
              {d.location && <Sticker color={COLORS[2]} rotate={1}>{d.location}</Sticker>}
            </div>
          </div>
        </Reveal>

        {/* Bio box */}
        <Reveal delay={0.04}>
          <div style={{ border: '3px solid #111', background: COLORS[1], padding: '20px 24px', marginBottom: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', top: -12, left: 16 }}>
              <Sticker color="#111" rotate={-1} style={{ color: '#fff' }}>About Me</Sticker>
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.7, margin: '10px 0 0', fontFamily: body }}>{d.bio}</p>
          </div>
        </Reveal>

        {/* Skills as cut-out strips */}
        <Reveal delay={0.06}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: display, fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>// Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {d.skills.map((s, i) => (
                <Sticker key={s} color={COLORS[i % COLORS.length]} rotate={(i % 3) - 1}>{s}</Sticker>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Projects as torn-edge cards */}
        <div style={{ marginBottom: 28 }}>
          <Reveal><div style={{ fontFamily: display, fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>// Projects</div></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {d.projects.map((p, i) => (
              <Reveal key={p.id} delay={0.06 + i * 0.04}>
                <a href={p.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div style={{
                    border: '3px solid #111',
                    background: '#fff',
                    padding: '18px 18px 14px',
                    position: 'relative',
                    transform: `rotate(${(i % 3 - 1) * 0.6}deg)`,
                    boxShadow: '4px 4px 0 #111',
                    cursor: 'pointer',
                  }}>
                    <div style={{ position: 'absolute', top: -11, right: 12 }}>
                      <Sticker color={COLORS[(i + 2) % COLORS.length]} rotate={2} style={{ fontSize: 10 }}>{p.language || 'Code'}</Sticker>
                    </div>
                    <div style={{ fontFamily: display, fontWeight: 900, fontSize: 18, textTransform: 'uppercase', marginTop: 4, marginBottom: 8 }}>{p.name}</div>
                    <p style={{ fontSize: 13, lineHeight: 1.5, margin: '0 0 10px', color: '#333' }}>{p.description}</p>
                    <div style={{ fontSize: 11, color: '#666' }}>★ {p.stars}</div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Experience */}
        {(d.experience.length > 0 || d.education.length > 0) && (
          <Reveal delay={0.12}>
            <div style={{ border: '3px solid #111', background: COLORS[0], padding: '20px 24px', marginBottom: 24, position: 'relative' }}>
              <div style={{ position: 'absolute', top: -12, left: 16 }}>
                <Sticker color="#111" rotate={1} style={{ color: '#fff' }}>History</Sticker>
              </div>
              <div style={{ marginTop: 10 }}>
                {[...d.experience, ...d.education].map((item, i) => (
                  <div key={i} style={{ marginBottom: 12, fontFamily: body }}>
                    <strong style={{ fontSize: 14, fontFamily: display, textTransform: 'uppercase' }}>{item.role || item.degree}</strong>
                    <span style={{ fontSize: 13 }}> @ {item.company || item.institution}</span>
                    <span style={{ fontSize: 11, marginLeft: 8, color: 'rgba(0,0,0,0.6)' }}>({item.startDate || item.year}{item.endDate ? `–${item.endDate}` : ''})</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* Contact */}
        <Reveal delay={0.14}>
          <div style={{ border: '3px dashed #111', padding: '20px 24px', background: '#fff', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: display, fontWeight: 900, fontSize: 18, textTransform: 'uppercase' }}>Reach Out</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {d.contacts.map((c, i) => (
                <a key={c.label} href={c.href} style={{ textDecoration: 'none', display: 'block' }}>
                  <Sticker color={COLORS[i % COLORS.length]} rotate={(i % 3) - 1}>{c.label}: {c.value}</Sticker>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
