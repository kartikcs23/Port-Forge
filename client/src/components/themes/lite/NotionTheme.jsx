import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.35, delay }}
  >
    {children}
  </motion.div>
);

const Callout = ({ emoji, children, bg = '#f7f6f3' }) => (
  <div style={{ background: bg, borderRadius: 4, padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
    <span style={{ fontSize: 18, lineHeight: 1.5, flexShrink: 0 }}>{emoji}</span>
    <div style={{ fontSize: 14, lineHeight: 1.7, color: '#37352f' }}>{children}</div>
  </div>
);

const Toggle = ({ label, children }) => {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ marginBottom: 4 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', width: '100%', textAlign: 'left' }}
      >
        <span style={{ fontSize: 12, color: '#9b9a97', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s', display: 'inline-block' }}>▶</span>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#37352f' }}>{label}</span>
      </button>
      {open && <div style={{ paddingLeft: 22, paddingTop: 4 }}>{children}</div>}
    </div>
  );
};

export const NotionTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const sans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";

  return (
    <div style={{ background: '#fff', color: '#37352f', fontFamily: sans, minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 96px 120px' }}>

        {/* Cover emoji + title */}
        <Reveal>
          <div style={{ fontSize: 64, marginBottom: 16 }}>👨‍💻</div>
          <h1 style={{ fontSize: 40, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{d.name}</h1>
          <div style={{ fontSize: 16, color: '#9b9a97', marginBottom: 24 }}>{d.headline}{d.location ? ` · ${d.location}` : ''}</div>
          <Callout emoji="💡">{d.bio}</Callout>
        </Reveal>

        {/* Properties table */}
        <Reveal delay={0.04}>
          <div style={{ border: '1px solid #e9e9e7', borderRadius: 4, overflow: 'hidden', marginBottom: 32 }}>
            {d.contacts.map((c, i) => (
              <div key={c.label} style={{ display: 'flex', borderBottom: i < d.contacts.length - 1 ? '1px solid #e9e9e7' : 'none' }}>
                <div style={{ width: 160, padding: '8px 12px', fontSize: 12, color: '#9b9a97', fontWeight: 500, background: '#fafaf9', flexShrink: 0 }}>{c.label}</div>
                <div style={{ padding: '8px 12px', fontSize: 14 }}>
                  <a href={c.href} style={{ color: '#2d6fdb', textDecoration: 'none' }}>{c.value}</a>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🛠</span> Skills
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 32 }}>
            {d.skills.map((s) => (
              <span key={s} style={{ fontSize: 12, background: '#f1f1ef', border: '1px solid #e3e3e0', borderRadius: 4, padding: '2px 10px', color: '#37352f', fontWeight: 500 }}>{s}</span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📁</span> Projects
          </h2>
          <div style={{ marginBottom: 32 }}>
            {d.projects.map((p, i) => (
              <Reveal key={p.id} delay={0.08 + i * 0.03}>
                <Toggle label={p.name}>
                  <Callout emoji={p.language === 'Python' ? '🐍' : p.language === 'JavaScript' ? '🟨' : '🔷'} bg="#f0f8ff">
                    <div style={{ fontSize: 12, color: '#9b9a97', marginBottom: 4 }}>{p.language} · ★ {p.stars}</div>
                    <div>{p.description}</div>
                    {p.url && p.url !== '#' && (
                      <a href={p.url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 8, fontSize: 12, color: '#2d6fdb' }}>View on GitHub →</a>
                    )}
                  </Callout>
                </Toggle>
              </Reveal>
            ))}
          </div>
        </Reveal>

        {(d.experience.length > 0 || d.education.length > 0) && (
          <Reveal delay={0.12}>
            <h2 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🏢</span> Experience &amp; Education
            </h2>
            <div style={{ marginBottom: 32 }}>
              {[...d.experience, ...d.education].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 0, marginBottom: 2 }}>
                  <div style={{ width: 24, color: '#9b9a97', fontSize: 13, paddingTop: 2 }}>•</div>
                  <div style={{ fontSize: 14, lineHeight: 1.7 }}>
                    <strong>{item.role || item.degree}</strong> @ {item.company || item.institution}
                    <span style={{ color: '#9b9a97', marginLeft: 8, fontSize: 12 }}>{item.startDate || item.year}{item.endDate ? `–${item.endDate}` : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {d.achievements.length > 0 && (
          <Reveal delay={0.14}>
            <h2 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🏆</span> Achievements
            </h2>
            {d.achievements.map((a, i) => (
              <Callout key={i} emoji="⭐">{a.title} <span style={{ color: '#9b9a97', fontSize: 12 }}>{a.year}</span></Callout>
            ))}
          </Reveal>
        )}
      </div>
    </div>
  );
};
