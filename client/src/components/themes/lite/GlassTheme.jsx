import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

const glass = {
  background: 'rgba(255,255,255,0.12)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 16,
};

export const GlassTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const sans = "system-ui, -apple-system, 'Segoe UI', sans-serif";

  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: sans,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 40%, #f093fb 100%)',
      color: '#fff',
      padding: '48px 20px 80px',
    }}>
      {/* Decorative blobs */}
      <div style={{ position: 'fixed', top: '-10%', left: '-5%', width: 500, height: 500, background: 'rgba(255,255,255,0.06)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '-5%', width: 600, height: 600, background: 'rgba(255,255,255,0.06)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 820, margin: '0 auto' }}>
        <Reveal>
          <div style={{ ...glass, padding: '36px 32px', marginBottom: 20, textAlign: 'center' }}>
            {d.avatar && (
              <img src={d.avatar} alt={d.name} style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.4)', marginBottom: 16, objectFit: 'cover' }} />
            )}
            <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.02em' }}>{d.name}</h1>
            <p style={{ fontSize: 16, opacity: 0.85, margin: 0 }}>{d.headline}{d.location ? ` · ${d.location}` : ''}</p>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div style={{ ...glass, padding: '24px 28px', marginBottom: 20 }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.65, marginBottom: 10 }}>About</div>
            <p style={{ fontSize: 15, lineHeight: 1.75, margin: 0, opacity: 0.9 }}>{d.bio}</p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div style={{ ...glass, padding: '24px 28px', marginBottom: 20 }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.65, marginBottom: 14 }}>Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {d.skills.map((s) => (
                <span key={s} style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 99, padding: '5px 14px', fontSize: 13 }}>{s}</span>
              ))}
            </div>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 20 }}>
          {d.projects.map((p, i) => (
            <Reveal key={p.id} delay={0.1 + i * 0.04}>
              <a href={p.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                <div style={{ ...glass, padding: '20px 22px', height: '100%', boxSizing: 'border-box', transition: 'background 0.2s', cursor: 'pointer' }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{p.name}</div>
                  <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>{p.language} · ★{p.stars}</div>
                  <p style={{ fontSize: 13, opacity: 0.8, margin: 0, lineHeight: 1.5 }}>{p.description}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {(d.experience.length > 0 || d.education.length > 0) && (
            <Reveal delay={0.14}>
              <div style={{ ...glass, padding: '24px 28px' }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.65, marginBottom: 14 }}>Experience</div>
                {[...d.experience, ...d.education].map((item, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{item.role || item.degree}</div>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>{item.company || item.institution}</div>
                    <div style={{ fontSize: 11, opacity: 0.5 }}>{item.startDate || item.year}{item.endDate ? `–${item.endDate}` : ''}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          )}
          <Reveal delay={0.16}>
            <div style={{ ...glass, padding: '24px 28px' }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.65, marginBottom: 14 }}>Connect</div>
              {d.contacts.map((c) => (
                <a key={c.label} href={c.href} style={{ display: 'block', color: '#fff', fontSize: 14, marginBottom: 10, textDecoration: 'none', opacity: 0.85 }}>
                  <span style={{ opacity: 0.6 }}>{c.label}: </span>{c.value}
                </a>
              ))}
              {d.achievements.length > 0 && (
                <>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.65, margin: '16px 0 10px' }}>Achievements</div>
                  {d.achievements.slice(0, 3).map((a, i) => (
                    <div key={i} style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>{a.title} <span style={{ opacity: 0.5 }}>{a.year}</span></div>
                  ))}
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};
