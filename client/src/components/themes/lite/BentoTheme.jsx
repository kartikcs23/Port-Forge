import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const Card = ({ children, style = {}, delay = 0, span = 1 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-30px' }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ y: -4, boxShadow: '0 20px 48px rgba(0,0,0,0.18)' }}
    style={{
      borderRadius: 24,
      padding: 24,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      gridColumn: `span ${span}`,
      transition: 'box-shadow 0.25s',
      ...style
    }}
  >
    {children}
  </motion.div>
);

const PALETTES = [
  { bg: '#1a1a2e', fg: '#fff', accent: '#e94560', dim: '#aaa' },
  { bg: '#f97316', fg: '#fff', accent: '#fff', dim: 'rgba(255,255,255,0.7)' },
  { bg: '#dbeafe', fg: '#1e3a8a', accent: '#2563eb', dim: '#3b82f6' },
  { bg: '#dcfce7', fg: '#14532d', accent: '#16a34a', dim: '#166534' },
  { bg: '#fdf4ff', fg: '#581c87', accent: '#a855f7', dim: '#7c3aed' },
  { bg: '#fff7ed', fg: '#7c2d12', accent: '#ea580c', dim: '#9a3412' },
];

export const BentoTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const sans = "system-ui,-apple-system,'Segoe UI',sans-serif";
  const [p0, p1, p2, p3, p4, p5] = PALETTES;
  const top3 = d.projects.slice(0, 3);
  const rest = d.projects.slice(3, 6);

  return (
    <div style={{ background: '#f0f0f0', fontFamily: sans, minHeight: '100vh', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* Row 1: Name hero + About */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16, marginBottom: 16 }}>
          <Card delay={0} style={{ background: p0.bg, color: p0.fg, minHeight: 200 }}>
            <div style={{ fontSize: 11, color: p0.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 }}>Hello, world 👋</div>
            <h1 style={{ fontSize: 'clamp(26px,4.5vw,44px)', fontWeight: 800, margin: '0 0 10px', lineHeight: 1.05, letterSpacing: '-0.02em' }}>{d.name}</h1>
            <p style={{ fontSize: 14, color: p0.dim, margin: '0 0 20px', lineHeight: 1.5 }}>{d.headline}{d.location ? ` · ${d.location}` : ''}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto' }}>
              {d.contacts.map((c) => (
                <a key={c.label} href={c.href} style={{ fontSize: 11, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 99, padding: '4px 12px', color: '#fff', textDecoration: 'none' }}>
                  {c.label}
                </a>
              ))}
            </div>
          </Card>
          <Card delay={0.06} style={{ background: p1.bg, color: p1.fg }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.8, marginBottom: 12 }}>About</div>
            <p style={{ fontSize: 14, lineHeight: 1.75, margin: 0 }}>{d.bio}</p>
          </Card>
        </div>

        {/* Row 2: Skills full-width */}
        <Card delay={0.08} style={{ background: '#fff', marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#999', marginBottom: 16 }}>Stack &amp; Skills</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {d.skills.map((s, i) => {
              const pal = PALETTES[i % PALETTES.length];
              return (
                <span key={s} style={{ fontSize: 13, fontWeight: 600, background: pal.bg, color: pal.fg, borderRadius: 99, padding: '6px 16px' }}>{s}</span>
              );
            })}
          </div>
        </Card>

        {/* Row 3: Featured project (2/3) + small card (1/3) */}
        {top3.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
            <Card delay={0.1} style={{ background: p2.bg, color: p2.fg, minHeight: 180 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: p2.dim, marginBottom: 10 }}>Featured Project</div>
              <a href={top3[0]?.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em', marginBottom: 8 }}>{top3[0]?.name}</div>
                <p style={{ fontSize: 14, lineHeight: 1.65, margin: '0 0 16px', color: p2.accent + 'cc' }}>{top3[0]?.description}</p>
                <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
                  <span style={{ background: p2.accent, color: '#fff', borderRadius: 99, padding: '3px 12px', fontWeight: 600 }}>{top3[0]?.language}</span>
                  <span style={{ color: p2.dim }}>★ {top3[0]?.stars}</span>
                </div>
              </a>
            </Card>
            {top3[1] && (
              <Card delay={0.12} style={{ background: p3.bg, color: p3.fg }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: p3.dim, marginBottom: 10 }}>{top3[1].language}</div>
                <a href={top3[1].url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{top3[1].name}</div>
                  <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0, color: p3.accent + 'cc' }}>{top3[1].description}</p>
                </a>
              </Card>
            )}
          </div>
        )}

        {/* Row 4: rest of projects */}
        {(top3[2] || rest.length > 0) && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
            {[top3[2], ...rest].filter(Boolean).map((p, i) => {
              const pal = PALETTES[(i + 4) % PALETTES.length];
              return (
                <Card key={p.id} delay={0.14 + i * 0.04} style={{ background: pal.bg, color: pal.fg }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: pal.dim, marginBottom: 8 }}>{p.language || '—'}</div>
                  <a href={p.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{p.name}</div>
                    <p style={{ fontSize: 12, lineHeight: 1.5, margin: 0, color: pal.fg + 'aa' }}>{p.description}</p>
                  </a>
                </Card>
              );
            })}
          </div>
        )}

        {/* Row 5: Experience + Achievements + CTA */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          {(d.experience.length > 0 || d.education.length > 0) && (
            <Card delay={0.18} style={{ background: '#fff' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#999', marginBottom: 16 }}>Experience</div>
              {[...d.experience, ...d.education].slice(0, 4).map((item, i) => (
                <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < Math.min(d.experience.length + d.education.length, 4) - 1 ? '1px solid #f0f0f0' : 'none' }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#111' }}>{item.role || item.degree}</div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{item.company || item.institution}</div>
                  <div style={{ fontSize: 11, color: '#aaa', marginTop: 1 }}>{item.startDate || item.year}{item.endDate ? `–${item.endDate}` : ''}</div>
                </div>
              ))}
            </Card>
          )}
          {d.achievements.length > 0 && (
            <Card delay={0.2} style={{ background: p4.bg, color: p4.fg }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: p4.accent, marginBottom: 16 }}>Achievements</div>
              {d.achievements.map((a, i) => (
                <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < d.achievements.length - 1 ? `1px solid ${p4.accent}33` : 'none' }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: p4.accent, marginTop: 2 }}>{a.year}</div>
                </div>
              ))}
            </Card>
          )}
          <Card delay={0.22} style={{ background: p0.bg, color: p0.fg, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: p0.accent, marginBottom: 12 }}>Let's Connect</div>
              <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}>Open to opportunities →</div>
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {d.contacts.map((c) => (
                <a key={c.label} href={c.href} style={{ fontSize: 12, color: '#fff', textDecoration: 'none', padding: '8px 14px', background: 'rgba(255,255,255,0.1)', borderRadius: 10, display: 'block' }}>
                  <span style={{ opacity: 0.6 }}>{c.label} · </span>{c.value}
                </a>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
