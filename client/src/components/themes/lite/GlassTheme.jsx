import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const Reveal = ({ children, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>
);

const glass = (alpha = 0.12, blur = 18) => ({
  background: `rgba(255,255,255,${alpha})`,
  backdropFilter: `blur(${blur}px)`,
  WebkitBackdropFilter: `blur(${blur}px)`,
  border: '1px solid rgba(255,255,255,0.22)',
  borderRadius: 20,
});

const Blob = ({ style }) => (
  <div style={{ position: 'fixed', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', ...style }} />
);

export const GlassTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const sans = "system-ui,-apple-system,'Segoe UI',sans-serif";

  return (
    <div style={{ minHeight: '100vh', fontFamily: sans, background: 'linear-gradient(135deg,#0f0524 0%,#1a0533 30%,#0a1628 70%,#04111f 100%)', color: '#fff', padding: '48px 20px 80px', position: 'relative', overflow: 'hidden' }}>

      {/* Background blobs */}
      <Blob style={{ width: 600, height: 600, top: '-15%', left: '-10%', background: 'radial-gradient(circle, rgba(167,139,250,0.5), transparent 70%)' }} />
      <Blob style={{ width: 500, height: 500, top: '20%', right: '-8%', background: 'radial-gradient(circle, rgba(56,189,248,0.4), transparent 70%)' }} />
      <Blob style={{ width: 400, height: 400, bottom: '10%', left: '20%', background: 'radial-gradient(circle, rgba(244,114,182,0.35), transparent 70%)' }} />
      <Blob style={{ width: 300, height: 300, bottom: '-5%', right: '15%', background: 'radial-gradient(circle, rgba(52,211,153,0.3), transparent 70%)' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto' }}>

        {/* Hero card */}
        <Reveal>
          <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.3 }} style={{ ...glass(0.14, 24), padding: '40px 36px', marginBottom: 20, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Inner shine */}
            <div style={{ position: 'absolute', top: 0, left: '-50%', width: '200%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)' }} />

            {d.avatar ? (
              <img src={d.avatar} alt={d.name} style={{ width: 88, height: 88, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.4)', marginBottom: 18, objectFit: 'cover', display: 'block', margin: '0 auto 18px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} />
            ) : (
              <div style={{ width: 88, height: 88, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.4)', marginBottom: 18, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 18px' }}>
                {d.name[0]}
              </div>
            )}
            <h1 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 700, margin: '0 0 10px', letterSpacing: '-0.02em', lineHeight: 1.05 }}>{d.name}</h1>
            <p style={{ fontSize: 16, opacity: 0.75, margin: '0 0 20px' }}>{d.headline}{d.location ? ` · ${d.location}` : ''}</p>

            {/* Contact pills */}
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
              {d.contacts.map((c) => (
                <motion.a key={c.label} href={c.href} whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.25)' }} style={{ ...glass(0.16, 8), borderRadius: 99, padding: '6px 18px', fontSize: 12, color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'background 0.2s' }}>
                  {c.label === 'Email' ? '✉️' : c.label === 'GitHub' ? '🐙' : c.label === 'LinkedIn' ? '💼' : '🌐'}
                  {c.value}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </Reveal>

        {/* About */}
        <Reveal delay={0.06}>
          <div style={{ ...glass(0.1, 16), padding: '24px 28px', marginBottom: 20 }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5, marginBottom: 12 }}>About</div>
            <p style={{ fontSize: 15, lineHeight: 1.8, margin: 0, opacity: 0.9 }}>{d.bio}</p>
          </div>
        </Reveal>

        {/* Skills */}
        <Reveal delay={0.08}>
          <div style={{ ...glass(0.1, 16), padding: '24px 28px', marginBottom: 20 }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5, marginBottom: 16 }}>Stack</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {d.skills.map((s, i) => {
                const colors = ['rgba(167,139,250,0.3)', 'rgba(56,189,248,0.3)', 'rgba(244,114,182,0.3)', 'rgba(52,211,153,0.3)', 'rgba(251,191,36,0.3)'];
                return (
                  <motion.span key={s} whileHover={{ scale: 1.08 }} style={{ background: colors[i % colors.length], border: '1px solid rgba(255,255,255,0.25)', borderRadius: 99, padding: '6px 16px', fontSize: 13, fontWeight: 500, backdropFilter: 'blur(8px)', cursor: 'default' }}>
                    {s}
                  </motion.span>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Projects grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: 16, marginBottom: 20 }}>
          {d.projects.map((p, i) => (
            <Reveal key={p.id} delay={0.1 + i * 0.04}>
              <motion.a href={p.url} target="_blank" rel="noreferrer" whileHover={{ y: -6, boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }} style={{ ...glass(0.1, 14), padding: '22px 22px', display: 'block', textDecoration: 'none', color: '#fff', transition: 'box-shadow 0.25s', cursor: 'pointer', height: '100%', boxSizing: 'border-box', position: 'relative', overflow: 'hidden' }}>
                {/* Top shimmer */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)' }} />
                <div style={{ fontSize: 10, opacity: 0.5, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{p.language} · ★{p.stars}</div>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8, lineHeight: 1.2 }}>{p.name}</div>
                <p style={{ fontSize: 13, opacity: 0.7, margin: 0, lineHeight: 1.6 }}>{p.description}</p>
                <div style={{ marginTop: 14, fontSize: 11, opacity: 0.5 }}>View project →</div>
              </motion.a>
            </Reveal>
          ))}
        </div>

        {/* Bottom row */}
        <div style={{ display: 'grid', gridTemplateColumns: d.achievements.length > 0 ? '1fr 1fr' : '1fr', gap: 16 }}>
          {(d.experience.length > 0 || d.education.length > 0) && (
            <Reveal delay={0.14}>
              <div style={{ ...glass(0.1, 16), padding: '24px 28px' }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5, marginBottom: 16 }}>Journey</div>
                {[...d.experience, ...d.education].map((item, i) => (
                  <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < d.experience.length + d.education.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{item.role || item.degree}</div>
                    <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 2 }}>{item.company || item.institution}</div>
                    <div style={{ fontSize: 11, opacity: 0.4 }}>{item.startDate || item.year}{item.endDate ? `–${item.endDate}` : ''}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          )}
          {d.achievements.length > 0 && (
            <Reveal delay={0.16}>
              <div style={{ ...glass(0.1, 16), padding: '24px 28px' }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.5, marginBottom: 16 }}>Achievements</div>
                {d.achievements.map((a, i) => (
                  <div key={i} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: i < d.achievements.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>✨ {a.title}</div>
                    <div style={{ fontSize: 12, opacity: 0.5, marginTop: 2 }}>{a.year}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
};
