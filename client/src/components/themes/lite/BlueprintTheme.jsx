import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const B = { bg: '#0a1628', mid: '#0f1f3a', line: '#1e4080', cyan: '#7ec8e3', cyanDim: '#4a8fa8', white: '#e8f0f8', dim: '#3a5a8a', label: '#5a8ab0' };

const Reveal = ({ children, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.4, delay }}>{children}</motion.div>
);

const BlueprintGrid = () => (
  <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
    <defs>
      <pattern id="small" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke={B.line} strokeWidth="0.3" />
      </pattern>
      <pattern id="large" width="100" height="100" patternUnits="userSpaceOnUse">
        <rect width="100" height="100" fill="url(#small)" />
        <path d="M 100 0 L 0 0 0 100" fill="none" stroke={B.dim} strokeWidth="0.8" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#large)" />
  </svg>
);

const DimArrow = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: B.cyanDim, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
    <div style={{ width: 20, height: 1, background: B.cyanDim, position: 'relative' }}>
      <div style={{ position: 'absolute', right: -3, top: -3, borderLeft: '6px solid ' + B.cyanDim, borderTop: '3px solid transparent', borderBottom: '3px solid transparent' }} />
      <div style={{ position: 'absolute', left: -3, top: -3, borderRight: '6px solid ' + B.cyanDim, borderTop: '3px solid transparent', borderBottom: '3px solid transparent' }} />
    </div>
    <span>{label}</span>
  </div>
);

export const BlueprintTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const mono = "'Courier New', Courier, monospace";

  return (
    <div style={{ background: B.bg, color: B.white, fontFamily: mono, minHeight: '100vh', position: 'relative' }}>
      <BlueprintGrid />

      {/* Blueprint outer border frame */}
      <div style={{ position: 'relative', zIndex: 1, margin: '24px', border: `2px solid ${B.dim}`, minHeight: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column' }}>

        {/* Inner border */}
        <div style={{ margin: 12, border: `1px solid ${B.cyanDim}33`, flex: 1, display: 'flex', flexDirection: 'column' }}>

          {/* Title block header */}
          <div style={{ borderBottom: `1px solid ${B.dim}`, display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'stretch' }}>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: 9, color: B.label, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
                PORTFOLIO DOCUMENTATION — REV A
              </div>
              <div style={{ fontSize: 'clamp(24px,4vw,48px)', fontWeight: 400, color: B.white, letterSpacing: '0.05em', lineHeight: 1 }}>{d.name.toUpperCase()}</div>
              <div style={{ fontSize: 13, color: B.cyan, marginTop: 6, letterSpacing: '0.08em' }}>{d.headline.toUpperCase()}{d.location ? ` // ${d.location.toUpperCase()}` : ''}</div>
            </div>
            {/* Title block grid — right side */}
            <div style={{ borderLeft: `1px solid ${B.dim}`, width: 220 }}>
              {[
                ['DRAWN BY', d.name],
                ['DATE', new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })],
                ['SCALE', '1:1'],
                ['DWG NO', `PF-${new Date().getFullYear()}-001`],
                ['REV', 'A'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1px solid ${B.dim}`, padding: '7px 12px' }}>
                  <span style={{ fontSize: 8, color: B.label, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{k}</span>
                  <span style={{ fontSize: 10, color: B.cyan }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '24px', flex: 1 }}>

            {/* About section */}
            <Reveal>
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ fontSize: 9, color: B.label, letterSpacing: '0.2em', textTransform: 'uppercase' }}>§1 — ABSTRACT</div>
                  <div style={{ flex: 1, height: 1, background: B.dim }} />
                  <DimArrow label={`${d.bio.split(' ').length} words`} />
                </div>
                <div style={{ borderLeft: `2px solid ${B.cyan}`, paddingLeft: 16 }}>
                  <p style={{ fontSize: 13, lineHeight: 1.8, margin: 0, color: '#c0d8e8' }}>{d.bio}</p>
                </div>
              </div>
            </Reveal>

            {/* Skills with dimension markers */}
            <Reveal delay={0.06}>
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ fontSize: 9, color: B.label, letterSpacing: '0.2em', textTransform: 'uppercase' }}>§2 — COMPONENTS</div>
                  <div style={{ flex: 1, height: 1, background: B.dim }} />
                  <DimArrow label={`QTY: ${d.skills.length}`} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                  {d.skills.map((s, i) => (
                    <div key={s} style={{ border: `1px solid ${B.dim}`, padding: '8px 12px', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: -8, left: 8, fontSize: 8, color: B.label, background: B.bg, padding: '0 4px' }}>{String(i + 1).padStart(2, '0')}</div>
                      <div style={{ fontSize: 12, color: B.cyan, letterSpacing: '0.05em' }}>{s}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Projects */}
            <Reveal delay={0.1}>
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ fontSize: 9, color: B.label, letterSpacing: '0.2em', textTransform: 'uppercase' }}>§3 — ASSEMBLIES</div>
                  <div style={{ flex: 1, height: 1, background: B.dim }} />
                  <DimArrow label={`${d.projects.length} units`} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                  {d.projects.map((p, i) => (
                    <Reveal key={p.id} delay={0.1 + i * 0.04}>
                      <a href={p.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block', border: `1px solid ${B.dim}`, padding: '14px 16px', position: 'relative', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                        {/* Corner marks */}
                        <div style={{ position: 'absolute', top: -1, left: -1, width: 8, height: 8, borderTop: `2px solid ${B.cyan}`, borderLeft: `2px solid ${B.cyan}` }} />
                        <div style={{ position: 'absolute', top: -1, right: -1, width: 8, height: 8, borderTop: `2px solid ${B.cyan}`, borderRight: `2px solid ${B.cyan}` }} />
                        <div style={{ position: 'absolute', bottom: -1, left: -1, width: 8, height: 8, borderBottom: `2px solid ${B.cyan}`, borderLeft: `2px solid ${B.cyan}` }} />
                        <div style={{ position: 'absolute', bottom: -1, right: -1, width: 8, height: 8, borderBottom: `2px solid ${B.cyan}`, borderRight: `2px solid ${B.cyan}` }} />
                        <div style={{ fontSize: 8, color: B.label, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>UNIT {String(i + 1).padStart(2, '0')} / {p.language || 'N/A'}</div>
                        <div style={{ fontSize: 15, color: B.white, fontWeight: 700, marginBottom: 6 }}>{p.name.toUpperCase()}</div>
                        <p style={{ fontSize: 12, color: B.label, margin: '0 0 8px', lineHeight: 1.6 }}>{p.description}</p>
                        <div style={{ fontSize: 9, color: B.cyanDim }}>★ {p.stars} CITATIONS</div>
                      </a>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* History + Contact in two columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {(d.experience.length > 0 || d.education.length > 0) && (
                <Reveal delay={0.16}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <div style={{ fontSize: 9, color: B.label, letterSpacing: '0.2em', textTransform: 'uppercase' }}>§4 — HISTORY</div>
                      <div style={{ flex: 1, height: 1, background: B.dim }} />
                    </div>
                    {[...d.experience, ...d.education].map((item, i) => (
                      <div key={i} style={{ borderBottom: `1px solid ${B.dim}22`, padding: '10px 0', fontSize: 12 }}>
                        <span style={{ color: B.cyan }}>►</span>
                        <span style={{ color: B.white, fontWeight: 700, marginLeft: 8 }}>{item.role || item.degree}</span>
                        <div style={{ color: B.label, marginLeft: 20, marginTop: 2 }}>{item.company || item.institution} · {item.startDate || item.year}{item.endDate ? `–${item.endDate}` : ''}</div>
                      </div>
                    ))}
                    {d.achievements.map((a, i) => (
                      <div key={`a${i}`} style={{ borderBottom: `1px solid ${B.dim}22`, padding: '10px 0', fontSize: 12 }}>
                        <span style={{ color: B.cyan }}>[CERT]</span>
                        <span style={{ color: B.white, marginLeft: 8 }}>{a.title}</span>
                        <span style={{ color: B.label, marginLeft: 8 }}>{a.year}</span>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}
              <Reveal delay={0.18}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ fontSize: 9, color: B.label, letterSpacing: '0.2em', textTransform: 'uppercase' }}>§5 — CONTACT</div>
                    <div style={{ flex: 1, height: 1, background: B.dim }} />
                  </div>
                  {d.contacts.map((c) => (
                    <div key={c.label} style={{ borderBottom: `1px solid ${B.dim}22`, padding: '10px 0', display: 'flex', gap: 12, alignItems: 'baseline', fontSize: 12 }}>
                      <span style={{ color: B.label, minWidth: 70, textTransform: 'uppercase', fontSize: 9, letterSpacing: '0.1em' }}>{c.label}</span>
                      <a href={c.href} style={{ color: B.cyan, textDecoration: 'none', wordBreak: 'break-all' }}>{c.value}</a>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>

          {/* Bottom margin with scale bar */}
          <div style={{ borderTop: `1px solid ${B.dim}`, padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 8, color: B.label, letterSpacing: '0.12em' }}>CONFIDENTIAL — FOR REVIEW PURPOSES ONLY</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} style={{ width: 16, height: 6, background: i % 2 === 0 ? B.cyan : B.bg, border: `1px solid ${B.dim}` }} />
              ))}
              <span style={{ fontSize: 8, color: B.label, marginLeft: 8 }}>SCALE BAR</span>
            </div>
            <div style={{ fontSize: 8, color: B.label, letterSpacing: '0.12em' }}>SHEET 1 OF 1</div>
          </div>
        </div>
      </div>
    </div>
  );
};
