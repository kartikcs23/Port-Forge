import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeData } from './useThemeData';

const N = { bg: '#ffffff', sidebar: '#f7f6f3', border: '#e9e9e7', hover: '#f1f1ef', text: '#37352f', muted: '#9b9a97', accent: '#2d6fdb', subtle: '#f0f0ed' };

const Reveal = ({ children, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.3, delay }}>{children}</motion.div>
);

const Callout = ({ emoji, children, bg = N.subtle, color = N.text }) => (
  <div style={{ background: bg, borderRadius: 4, padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
    <span style={{ fontSize: 18, lineHeight: 1.5, flexShrink: 0 }}>{emoji}</span>
    <div style={{ fontSize: 14, lineHeight: 1.7, color }}>{children}</div>
  </div>
);

const Toggle = ({ label, emoji = '📁', children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: 2 }}>
      <button onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', width: '100%', textAlign: 'left', borderRadius: 4, transition: 'background 0.1s' }}>
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.15 }} style={{ display: 'inline-block', fontSize: 11, color: N.muted }}>▶</motion.span>
        <span style={{ fontSize: 15, fontWeight: 600, color: N.text }}>{emoji} {label}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
            <div style={{ paddingLeft: 24, paddingTop: 4 }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavItem = ({ emoji, label, active = false }) => (
  <div style={{ padding: '4px 12px', borderRadius: 4, cursor: 'pointer', background: active ? N.hover : 'transparent', display: 'flex', alignItems: 'center', gap: 8, color: active ? N.text : N.muted, fontSize: 14, fontWeight: active ? 600 : 400 }}>
    <span>{emoji}</span>
    <span>{label}</span>
  </div>
);

const Tag = ({ children, color = '#e8f0fe', textColor = '#1a73e8' }) => (
  <span style={{ display: 'inline-block', background: color, color: textColor, borderRadius: 4, padding: '1px 8px', fontSize: 12, fontWeight: 500 }}>{children}</span>
);

export const NotionTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const sans = "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif";
  const [activeSection, setActiveSection] = useState('overview');

  const langColors = { JavaScript: ['#fff3cd', '#856404'], Python: ['#e8f5e9', '#2e7d32'], TypeScript: ['#e3f2fd', '#1565c0'], Go: ['#e0f7fa', '#00695c'], Rust: ['#fff3e0', '#e65100'] };
  const getLangColor = (lang) => langColors[lang] || ['#f3e5f5', '#6a1b9a'];

  return (
    <div style={{ display: 'flex', fontFamily: sans, minHeight: '100vh', background: N.bg, color: N.text }}>

      {/* Sidebar */}
      <div style={{ width: 240, background: N.sidebar, borderRight: `1px solid ${N.border}`, padding: '12px 8px', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflow: 'auto' }}>
        {/* Workspace */}
        <div style={{ padding: '8px 12px', marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600 }}>
            <span>🗂</span>
            <span>{d.name.split(' ')[0]}'s Portfolio</span>
          </div>
        </div>

        <div style={{ height: 1, background: N.border, margin: '8px 0' }} />

        {/* Nav */}
        <NavItem emoji="👤" label="Overview" active={activeSection === 'overview'} />
        <NavItem emoji="🛠" label="Skills" />
        <NavItem emoji="📁" label="Projects" active={activeSection === 'projects'} />
        <NavItem emoji="🏢" label="Experience" />
        {d.achievements.length > 0 && <NavItem emoji="🏆" label="Achievements" />}
        <NavItem emoji="✉️" label="Contact" />

        <div style={{ height: 1, background: N.border, margin: '8px 0' }} />

        {/* Quick properties */}
        <div style={{ padding: '4px 12px', fontSize: 12, color: N.muted, marginBottom: 6 }}>Properties</div>
        <div style={{ padding: '4px 12px' }}>
          <div style={{ fontSize: 12, marginBottom: 8 }}>
            <div style={{ color: N.muted, marginBottom: 2 }}>Role</div>
            <div style={{ fontWeight: 500, fontSize: 13 }}>{d.headline}</div>
          </div>
          {d.location && (
            <div style={{ fontSize: 12, marginBottom: 8 }}>
              <div style={{ color: N.muted, marginBottom: 2 }}>Location</div>
              <div style={{ fontWeight: 500, fontSize: 13 }}>📍 {d.location}</div>
            </div>
          )}
          <div style={{ fontSize: 12, marginBottom: 8 }}>
            <div style={{ color: N.muted, marginBottom: 4 }}>Status</div>
            <Tag color="#d4edda" textColor="#155724">✓ Open to opportunities</Tag>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Cover gradient */}
        <div style={{ height: 140, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))' }} />
        </div>

        {/* Page */}
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 80px 80px' }}>

          {/* Avatar + title */}
          <Reveal>
            <div style={{ marginTop: -28, marginBottom: 24 }}>
              {d.avatar ? (
                <img src={d.avatar} alt={d.name} style={{ width: 64, height: 64, borderRadius: 12, border: '3px solid #fff', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} />
              ) : (
                <div style={{ width: 64, height: 64, borderRadius: 12, border: '3px solid #fff', background: '#667eea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>👨‍💻</div>
              )}
            </div>
            <h1 style={{ fontSize: 38, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{d.name}</h1>
            <p style={{ fontSize: 16, color: N.muted, margin: '0 0 24px' }}>{d.headline}{d.location ? ` · ${d.location}` : ''}</p>
            <Callout emoji="💡">{d.bio}</Callout>
          </Reveal>

          {/* Properties table */}
          <Reveal delay={0.04}>
            <div style={{ border: `1px solid ${N.border}`, borderRadius: 4, overflow: 'hidden', marginBottom: 32 }}>
              {d.contacts.map((c, i) => (
                <div key={c.label} style={{ display: 'flex', borderBottom: i < d.contacts.length - 1 ? `1px solid ${N.border}` : 'none', transition: 'background 0.1s' }}>
                  <div style={{ width: 160, padding: '8px 14px', fontSize: 12, color: N.muted, fontWeight: 500, background: N.subtle, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{c.label === 'Email' ? '📧' : c.label === 'GitHub' ? '🐙' : c.label === 'LinkedIn' ? '💼' : '🌐'}</span>
                    {c.label}
                  </div>
                  <div style={{ padding: '8px 14px', fontSize: 14, display: 'flex', alignItems: 'center' }}>
                    <a href={c.href} style={{ color: N.accent, textDecoration: 'none' }}>{c.value}</a>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Skills */}
          <Reveal delay={0.06}>
            <Toggle label="Skills" emoji="🛠">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '8px 0 16px' }}>
                {d.skills.map((s, i) => {
                  const palettes = [['#e8f0fe', '#1a73e8'], ['#e8f5e9', '#2e7d32'], ['#fff3e0', '#e65100'], ['#f3e5f5', '#6a1b9a'], ['#e0f7fa', '#00695c']];
                  const [bg, fg] = palettes[i % palettes.length];
                  return <Tag key={s} color={bg} textColor={fg}>{s}</Tag>;
                })}
              </div>
            </Toggle>
          </Reveal>

          {/* Projects database */}
          <Reveal delay={0.08}>
            <Toggle label="Projects" emoji="📁">
              <div style={{ marginTop: 8, marginBottom: 16 }}>
                {/* Table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 60px', gap: 0, fontSize: 11, color: N.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1px solid ${N.border}`, paddingBottom: 6, paddingLeft: 8 }}>
                  <span>Name</span><span>Language</span><span>Stars</span><span>Link</span>
                </div>
                {d.projects.map((p, i) => {
                  const [bg, fg] = getLangColor(p.language);
                  return (
                    <Reveal key={p.id} delay={0.08 + i * 0.03}>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 60px', gap: 0, padding: '10px 8px', borderBottom: `1px solid ${N.border}`, alignItems: 'center', fontSize: 14, transition: 'background 0.1s', cursor: 'pointer' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: N.muted, marginTop: 2 }}>{p.description}</div>
                        </div>
                        <div><Tag color={bg} textColor={fg}>{p.language || '—'}</Tag></div>
                        <div style={{ color: N.muted, fontSize: 13 }}>★ {p.stars}</div>
                        <div>
                          <a href={p.url} target="_blank" rel="noreferrer" style={{ color: N.accent, fontSize: 12, textDecoration: 'none' }}>↗ View</a>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </Toggle>
          </Reveal>

          {/* Experience */}
          {(d.experience.length > 0 || d.education.length > 0) && (
            <Reveal delay={0.12}>
              <Toggle label="Experience & Education" emoji="🏢">
                <div style={{ paddingTop: 8, paddingBottom: 16 }}>
                  {[...d.experience, ...d.education].map((item, i) => (
                    <Callout key={i} emoji={item.role ? '💼' : '🎓'}>
                      <div style={{ fontWeight: 600 }}>{item.role || item.degree}</div>
                      <div style={{ color: N.muted, fontSize: 13 }}>{item.company || item.institution} · {item.startDate || item.year}{item.endDate ? `–${item.endDate}` : ''}</div>
                    </Callout>
                  ))}
                </div>
              </Toggle>
            </Reveal>
          )}

          {/* Achievements */}
          {d.achievements.length > 0 && (
            <Reveal delay={0.14}>
              <Toggle label="Achievements" emoji="🏆">
                <div style={{ paddingTop: 8, paddingBottom: 16 }}>
                  {d.achievements.map((a, i) => (
                    <Callout key={i} emoji="⭐" bg="#fffde7">
                      <span style={{ fontWeight: 600 }}>{a.title}</span>
                      <span style={{ color: N.muted, fontSize: 12, marginLeft: 8 }}>{a.year}</span>
                    </Callout>
                  ))}
                </div>
              </Toggle>
            </Reveal>
          )}

          {/* Footer */}
          <Reveal delay={0.16}>
            <div style={{ marginTop: 40, paddingTop: 20, borderTop: `1px solid ${N.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: N.muted }}>
              <span>Last edited: {new Date().toLocaleDateString()}</span>
              <div style={{ display: 'flex', gap: 16 }}>
                {d.contacts.map((c) => (
                  <a key={c.label} href={c.href} style={{ color: N.accent, textDecoration: 'none' }}>{c.label}</a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};
