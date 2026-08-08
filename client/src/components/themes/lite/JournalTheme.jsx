import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const J = { bg: '#faf8f4', paper: '#f5f2eb', rule: '#d4c9a8', ink: '#1a1208', muted: '#7a6e58', accent: '#2c4a8a', red: '#9b1c1c', light: '#ece6d4' };
const serif = "'Palatino Linotype',Palatino,'Book Antiqua',Georgia,serif";
const mono = "'Courier New',Courier,monospace";

const Reveal = ({ children, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>
);

const Rule = ({ thick = false }) => (
  <div style={{ margin: '0 0 0', borderBottom: `${thick ? 2 : 1}px solid ${J.rule}` }} />
);

const SectionHead = ({ number, title }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, margin: '32px 0 16px' }}>
    <span style={{ fontFamily: mono, fontSize: 11, color: J.accent, letterSpacing: '0.1em', flexShrink: 0 }}>[{number}]</span>
    <span style={{ fontFamily: serif, fontSize: 13, fontWeight: 400, letterSpacing: '0.15em', textTransform: 'uppercase', color: J.muted }}>{title}</span>
    <div style={{ flex: 1, borderBottom: `1px solid ${J.rule}` }} />
  </div>
);

const Marginal = ({ children }) => (
  <div style={{ fontFamily: mono, fontSize: 10, color: J.muted, lineHeight: 1.6, borderLeft: `2px solid ${J.rule}`, paddingLeft: 10, marginTop: 6 }}>
    {children}
  </div>
);

export const JournalTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const pageNum = (n) => <span style={{ fontFamily: mono, fontSize: 10, color: J.muted }}>{n}</span>;

  return (
    <div style={{ background: J.bg, minHeight: '100vh', fontFamily: serif, color: J.ink }}>

      {/* Ruled page lines background */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: `repeating-linear-gradient(transparent, transparent 27px, ${J.rule}55 27px, ${J.rule}55 28px)`, backgroundPositionY: '64px', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto', padding: '0 40px 80px' }}>

        {/* Running header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0 8px', marginBottom: 0, borderBottom: `1px solid ${J.rule}` }}>
          <span style={{ fontFamily: mono, fontSize: 10, color: J.muted, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Portfolio · {d.name}</span>
          <span style={{ fontFamily: mono, fontSize: 10, color: J.muted }}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        {/* Title block */}
        <Reveal>
          <div style={{ padding: '40px 0 28px', borderBottom: `3px double ${J.ink}` }}>
            <div style={{ fontFamily: mono, fontSize: 10, color: J.accent, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>§ Curriculum Vitae &amp; Portfolio</div>
            <h1 style={{ fontSize: 'clamp(32px,6vw,64px)', fontWeight: 400, margin: '0 0 10px', letterSpacing: '-0.015em', lineHeight: 1 }}>{d.name}</h1>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontStyle: 'italic', fontSize: 18, color: J.muted }}>{d.headline}</span>
              {d.location && <span style={{ fontFamily: mono, fontSize: 11, color: J.accent }}>@ {d.location}</span>}
            </div>
          </div>
        </Reveal>

        {/* Abstract */}
        <Reveal delay={0.05}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, padding: '24px 0', borderBottom: `1px solid ${J.rule}` }}>
            <div>
              <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: J.muted, marginBottom: 10 }}>Abstract</div>
              <p style={{ fontSize: 15, lineHeight: 2, margin: 0, textAlign: 'justify', textIndent: '1.5em' }}>{d.bio}</p>
            </div>
            {/* Sidebar meta */}
            <div style={{ borderLeft: `1px solid ${J.rule}`, paddingLeft: 20 }}>
              <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: J.muted, marginBottom: 10 }}>Keywords</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {d.skills.slice(0, 8).map((s, i) => (
                  <div key={s} style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
                    <span style={{ fontFamily: mono, fontSize: 9, color: J.accent }}>{String(i + 1).padStart(2, '0')}.</span>
                    <span style={{ fontSize: 13 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Projects */}
        <SectionHead number="1" title="Works & Projects" />
        {d.projects.map((p, i) => (
          <Reveal key={p.id} delay={0.06 + i * 0.03}>
            <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 12, marginBottom: 20, paddingBottom: 20, borderBottom: `1px dashed ${J.rule}` }}>
              <div>
                <div style={{ fontFamily: mono, fontSize: 10, color: J.accent, lineHeight: 1.4 }}>[{String(i + 1).padStart(2, '0')}]</div>
                <div style={{ fontFamily: mono, fontSize: 9, color: J.muted, marginTop: 4 }}>★{p.stars}</div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                  <a href={p.url} target="_blank" rel="noreferrer" style={{ fontWeight: 700, fontSize: 16, color: J.ink, textDecoration: 'none', borderBottom: `1px solid ${J.accent}44` }}>{p.name}</a>
                  <span style={{ fontFamily: mono, fontSize: 11, color: J.muted }}>{p.language}</span>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.75, margin: 0, color: J.muted }}>{p.description}</p>
                <Marginal>github.com / {p.url?.replace('https://github.com/', '') || p.name}</Marginal>
              </div>
            </div>
          </Reveal>
        ))}

        {/* Experience / Education */}
        {(d.experience.length > 0 || d.education.length > 0) && (
          <>
            <SectionHead number="2" title="Experience & Education" />
            <Reveal delay={0.1}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
                {d.experience.length > 0 && (
                  <div>
                    <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: J.red, marginBottom: 12 }}>Experience</div>
                    {d.experience.map((e, i) => (
                      <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: `1px dotted ${J.rule}` }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{e.role}</div>
                        <div style={{ fontSize: 13, color: J.muted, fontStyle: 'italic' }}>{e.company}</div>
                        <div style={{ fontFamily: mono, fontSize: 10, color: J.accent, marginTop: 2 }}>{e.startDate}{e.endDate ? `–${e.endDate}` : ''}</div>
                      </div>
                    ))}
                  </div>
                )}
                {d.education.length > 0 && (
                  <div>
                    <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: J.accent, marginBottom: 12 }}>Education</div>
                    {d.education.map((e, i) => (
                      <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: `1px dotted ${J.rule}` }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{e.degree}</div>
                        <div style={{ fontSize: 13, color: J.muted, fontStyle: 'italic' }}>{e.institution}</div>
                        <div style={{ fontFamily: mono, fontSize: 10, color: J.accent, marginTop: 2 }}>{e.year}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          </>
        )}

        {/* Achievements */}
        {d.achievements.length > 0 && (
          <>
            <SectionHead number="3" title="Distinctions & Awards" />
            <Reveal delay={0.12}>
              <div style={{ marginBottom: 8 }}>
                {d.achievements.map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'baseline', marginBottom: 10, paddingBottom: 10, borderBottom: `1px dotted ${J.rule}` }}>
                    <span style={{ fontFamily: mono, fontSize: 9, color: J.accent, flexShrink: 0 }}>{a.year}</span>
                    <span style={{ fontSize: 14 }}>{a.title}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </>
        )}

        {/* Contact */}
        <SectionHead number="4" title="Correspondence" />
        <Reveal delay={0.14}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 40px', paddingBottom: 48 }}>
            {d.contacts.map((c) => (
              <div key={c.label} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: J.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{c.label}</span>
                <a href={c.href} style={{ fontSize: 14, color: J.accent, textDecoration: 'none', borderBottom: `1px solid ${J.accent}44` }}>{c.value}</a>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Footer rule */}
        <div style={{ borderTop: `1px solid ${J.rule}`, display: 'flex', justifyContent: 'space-between', paddingTop: 10 }}>
          {pageNum('p. 1')}
          <span style={{ fontFamily: mono, fontSize: 10, color: J.muted, fontStyle: 'italic' }}>— end of document —</span>
          {pageNum('p. 1')}
        </div>
      </div>
    </div>
  );
};
