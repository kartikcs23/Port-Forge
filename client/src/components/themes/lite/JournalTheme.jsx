import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const MAROON = '#7a1f1f';
const INK = '#2b2620';

const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.4, delay }}
  >
    {children}
  </motion.div>
);

/**
 * Journal — a portfolio styled as an academic paper: serif body text,
 * numbered footnote-style project citations, an "Abstract" instead of a
 * hero blurb. Leans into a student audience literally already writing
 * papers like this.
 */
export const JournalTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const serif = "'Iowan Old Style', 'Palatino Linotype', Georgia, 'Times New Roman', serif";

  return (
    <div style={{ background: '#f7f3ea', color: INK, fontFamily: serif, minHeight: '100vh' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '64px 24px 100px' }}>
        <Reveal>
          <div style={{ textAlign: 'center', borderBottom: `2px solid ${INK}`, paddingBottom: 24, marginBottom: 32 }}>
            <div style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: MAROON, marginBottom: 14 }}>Curriculum Vitae &amp; Portfolio</div>
            <h1 style={{ fontSize: 'clamp(30px,5vw,42px)', margin: 0, fontWeight: 400 }}>{d.name}</h1>
            <div style={{ fontStyle: 'italic', fontSize: 16, marginTop: 6, color: '#4a4038' }}>{d.headline}{d.location ? `, ${d.location}` : ''}</div>
          </div>
        </Reveal>

        <Reveal>
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em' }}>ABSTRACT</div>
            <p style={{ fontSize: 16, lineHeight: 1.75, marginTop: 8, textAlign: 'justify' }}>{d.bio}</p>
          </div>
        </Reveal>

        <Reveal>
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em' }}>I. KEYWORDS</div>
            <p style={{ fontSize: 15, marginTop: 8, fontStyle: 'italic', lineHeight: 1.9 }}>{d.skills.join(', ')}.</p>
          </div>
        </Reveal>

        <div style={{ marginBottom: 36 }}>
          <Reveal><div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em' }}>II. PROJECTS &amp; CITATIONS</div></Reveal>
          <div style={{ marginTop: 12, display: 'grid', gap: 18 }}>
            {d.projects.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ color: MAROON, fontWeight: 700 }}>[{i + 1}]</span>
                  <div>
                    <a href={p.url} target="_blank" rel="noreferrer" style={{ color: INK, fontWeight: 700, textDecoration: 'none', fontSize: 16 }}>{p.name}</a>
                    <span style={{ fontStyle: 'italic', color: '#5a4f44', fontSize: 14 }}> — {p.language}, {p.stars} citations</span>
                    <p style={{ margin: '4px 0 0', fontSize: 15, lineHeight: 1.6 }}>{p.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {(d.experience.length > 0 || d.education.length > 0) && (
          <div style={{ marginBottom: 36 }}>
            <Reveal><div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em' }}>III. AFFILIATIONS</div></Reveal>
            <div style={{ marginTop: 12, display: 'grid', gap: 14 }}>
              {[...d.experience, ...d.education].map((item, i) => (
                <Reveal key={i}>
                  <div style={{ fontSize: 15 }}>
                    <strong>{item.role || item.degree}</strong>, {item.company || item.institution}
                    <span style={{ color: '#6b5f52' }}> ({item.startDate || item.year}{item.endDate ? `–${item.endDate}` : ''})</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {d.achievements.length > 0 && (
          <div style={{ marginBottom: 36 }}>
            <Reveal><div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em' }}>IV. HONORS</div></Reveal>
            <ul style={{ marginTop: 12, paddingLeft: 20 }}>
              {d.achievements.map((a, i) => (
                <Reveal key={i}><li style={{ fontSize: 15, marginBottom: 6 }}>{a.title} <span style={{ color: '#6b5f52' }}>({a.year})</span></li></Reveal>
              ))}
            </ul>
          </div>
        )}

        <Reveal>
          <div style={{ borderTop: `2px solid ${INK}`, paddingTop: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 10 }}>CORRESPONDENCE</div>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '6px 20px', fontSize: 14 }}>
              {d.contacts.map((c) => (
                <a key={c.label} href={c.href} style={{ color: MAROON }}>{c.value}</a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
