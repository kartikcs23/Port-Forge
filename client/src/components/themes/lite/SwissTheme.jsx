import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const RED = '#d81e05';
const INK = '#0a0a0a';
const PAPER = '#ffffff';
const RULE = '#e0e0e0';

const Reveal = ({ children, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, delay }}>{children}</motion.div>
);

export const SwissTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const font = "'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif";

  return (
    <div style={{ background: PAPER, color: INK, fontFamily: font, minHeight: '100vh' }}>

      {/* Top rule */}
      <div style={{ height: 6, background: RED }} />

      {/* Hero — full bleed typographic statement */}
      <div style={{ borderBottom: `1px solid ${RULE}`, padding: '48px 40px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 40, alignItems: 'end' }}>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div style={{ fontSize: 10, color: RED, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>Portfolio — {new Date().getFullYear()}</div>
            {/* Vertical page marker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 2, height: 80, background: RED }} />
              <div>
                <div style={{ fontSize: 11, color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Designer</div>
                <div style={{ fontSize: 11, color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Developer</div>
                <div style={{ fontSize: 11, color: RED, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Engineer</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.7, maxWidth: 220 }}>{d.bio}</div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.1 }}>
            <h1 style={{ fontSize: 'clamp(52px,8vw,110px)', fontWeight: 900, margin: 0, lineHeight: 0.88, letterSpacing: '-0.04em', textTransform: 'uppercase' }}>
              {d.name.split(' ').map((word, i) => (
                <div key={i} style={{ color: i === 0 ? INK : i === 1 ? RED : INK }}>{word}</div>
              ))}
            </h1>
            <div style={{ marginTop: 20, display: 'flex', gap: 24, alignItems: 'center' }}>
              <div style={{ width: 40, height: 2, background: RED }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: '#333', letterSpacing: '0.02em' }}>{d.headline}</span>
              {d.location && <span style={{ fontSize: 12, color: '#999' }}>— {d.location}</span>}
            </div>
          </motion.div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px 80px' }}>

        {/* Section grid */}
        {[
          {
            num: '01', label: 'Skills',
            content: (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 0' }}>
                {d.skills.map((s, i) => (
                  <React.Fragment key={s}>
                    <span style={{ fontSize: 15, fontWeight: i % 3 === 0 ? 700 : 400 }}>{s}</span>
                    {i < d.skills.length - 1 && <span style={{ margin: '0 14px', color: RED, fontWeight: 700 }}>·</span>}
                  </React.Fragment>
                ))}
              </div>
            )
          },
        ].map(({ num, label, content }) => (
          <Reveal key={num}>
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', borderTop: `1px solid ${INK}`, padding: '36px 0' }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, color: RED, lineHeight: 1 }}>{num}</div>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#999', marginTop: 4 }}>{label}</div>
              </div>
              <div>{content}</div>
            </div>
          </Reveal>
        ))}

        {/* Projects — full-bleed list */}
        <Reveal>
          <div style={{ borderTop: `1px solid ${INK}`, paddingTop: 36 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', marginBottom: 28 }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, color: RED, lineHeight: 1 }}>02</div>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#999', marginTop: 4 }}>Projects</div>
              </div>
              <div />
            </div>
            {d.projects.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <a href={p.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: 20, alignItems: 'baseline', borderBottom: `1px solid ${RULE}`, padding: '20px 0', cursor: 'pointer' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: RED, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{String(i + 1).padStart(2, '0')}</div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 4 }}>{p.name}</div>
                    <div style={{ fontSize: 14, color: '#555', lineHeight: 1.5, maxWidth: 560 }}>{p.description}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: RED, fontWeight: 700 }}>{p.language}</div>
                    <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>★ {p.stars}</div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </Reveal>

        {/* Experience */}
        {(d.experience.length > 0 || d.education.length > 0) && (
          <Reveal delay={0.1}>
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', borderTop: `1px solid ${INK}`, padding: '36px 0' }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, color: RED, lineHeight: 1 }}>03</div>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#999', marginTop: 4 }}>History</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
                {[...d.experience, ...d.education].map((item, i) => (
                  <div key={i} style={{ borderBottom: `1px solid ${RULE}`, padding: '16px 0' }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{item.role || item.degree}</div>
                    <div style={{ fontSize: 13, color: RED, marginTop: 2 }}>{item.company || item.institution}</div>
                    <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>{item.startDate || item.year}{item.endDate ? `–${item.endDate}` : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* Achievements */}
        {d.achievements.length > 0 && (
          <Reveal delay={0.12}>
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', borderTop: `1px solid ${INK}`, padding: '36px 0' }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, color: RED, lineHeight: 1 }}>04</div>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#999', marginTop: 4 }}>Awards</div>
              </div>
              <div>
                {d.achievements.map((a, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${RULE}`, padding: '14px 0', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>{a.title}</span>
                    <span style={{ fontSize: 11, color: RED, fontWeight: 700 }}>{a.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* Contact */}
        <Reveal delay={0.14}>
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', borderTop: `4px solid ${INK}`, padding: '36px 0' }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 900, color: RED, lineHeight: 1 }}>05</div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#999', marginTop: 4 }}>Contact</div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 40px' }}>
              {d.contacts.map((c) => (
                <a key={c.label} href={c.href} style={{ fontSize: 16, fontWeight: 700, color: INK, textDecoration: 'none', borderBottom: `2px solid ${RED}`, paddingBottom: 2 }}>
                  {c.value}
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Bottom rule */}
      <div style={{ height: 4, background: INK }} />
    </div>
  );
};
