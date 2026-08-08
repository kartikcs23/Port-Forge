import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.35, delay }}
    style={{ height: '100%' }}
  >
    {children}
  </motion.div>
);

const Card = ({ style = {}, children, span = 1 }) => (
  <div style={{
    background: '#fff',
    borderRadius: 20,
    padding: 24,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    gridColumn: `span ${span}`,
    ...style
  }}>
    {children}
  </div>
);

export const BentoTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const sans = "system-ui, -apple-system, 'Segoe UI', sans-serif";
  const accent = '#f97316';
  const top4 = d.projects.slice(0, 4);

  return (
    <div style={{ background: '#f5f0eb', fontFamily: sans, minHeight: '100vh', padding: '48px 20px 80px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Intro row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <Reveal>
            <Card style={{ background: '#1a1a1a', color: '#fff' }}>
              <div style={{ fontSize: 12, color: accent, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Hello, I'm</div>
              <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, margin: '0 0 8px', lineHeight: 1.1 }}>{d.name}</h1>
              <p style={{ fontSize: 14, color: '#aaa', margin: 0 }}>{d.headline}{d.location ? ` · ${d.location}` : ''}</p>
            </Card>
          </Reveal>
          <Reveal delay={0.05}>
            <Card style={{ background: accent, color: '#fff' }}>
              <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, opacity: 0.8 }}>About</div>
              <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0 }}>{d.bio}</p>
            </Card>
          </Reveal>
        </div>

        {/* Skills */}
        <Reveal delay={0.07}>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#888', marginBottom: 14 }}>Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {d.skills.map((s) => (
                <span key={s} style={{ background: '#f5f0eb', borderRadius: 99, padding: '6px 14px', fontSize: 13, fontWeight: 600, color: '#333' }}>{s}</span>
              ))}
            </div>
          </Card>
        </Reveal>

        {/* Projects grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 16 }}>
          {top4.map((p, i) => (
            <Reveal key={p.id} delay={0.08 + i * 0.04}>
              <a href={p.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                <Card style={{ background: i === 0 ? '#f0f7ff' : i === 1 ? '#fff7f0' : i === 2 ? '#f0fff4' : '#fdf0ff', cursor: 'pointer', transition: 'transform 0.15s', height: '100%', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>{p.name}</span>
                    <span style={{ fontSize: 11, background: '#1a1a1a', color: '#fff', padding: '2px 8px', borderRadius: 99 }}>{p.language || '?'}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, margin: '0 0 12px' }}>{p.description}</p>
                  <div style={{ fontSize: 12, color: '#888' }}>★ {p.stars} stars</div>
                </Card>
              </a>
            </Reveal>
          ))}
        </div>

        {/* Experience / Achievements / Contact */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          {(d.experience.length > 0 || d.education.length > 0) && (
            <Reveal delay={0.12}>
              <Card>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#888', marginBottom: 14 }}>Experience</div>
                {[...d.experience, ...d.education].slice(0, 3).map((item, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{item.role || item.degree}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{item.company || item.institution}</div>
                  </div>
                ))}
              </Card>
            </Reveal>
          )}
          {d.achievements.length > 0 && (
            <Reveal delay={0.14}>
              <Card style={{ background: '#1a1a1a', color: '#fff' }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: accent, marginBottom: 14 }}>Achievements</div>
                {d.achievements.slice(0, 4).map((a, i) => (
                  <div key={i} style={{ fontSize: 13, marginBottom: 10, paddingBottom: 10, borderBottom: i < d.achievements.length - 1 ? '1px solid #333' : 'none' }}>
                    <div style={{ fontWeight: 600 }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{a.year}</div>
                  </div>
                ))}
              </Card>
            </Reveal>
          )}
          <Reveal delay={0.16}>
            <Card style={{ background: accent, color: '#fff' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.8, marginBottom: 14 }}>Connect</div>
              {d.contacts.map((c) => (
                <a key={c.label} href={c.href} style={{ display: 'block', color: '#fff', fontSize: 13, marginBottom: 10, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  {c.label}: {c.value}
                </a>
              ))}
            </Card>
          </Reveal>
        </div>
      </div>
    </div>
  );
};
