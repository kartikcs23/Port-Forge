import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const INK = '#1a1a1a';
const RULE = '#222';
const MUTED = '#555';

const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

const Rule = () => <div style={{ borderTop: `1px solid ${RULE}`, margin: '0' }} />;
const ThickRule = () => <div style={{ borderTop: `4px solid ${INK}`, borderBottom: `1px solid ${INK}`, height: 4, margin: '0' }} />;

export const GazetteTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const serif = "'Times New Roman', 'Georgia', serif";
  const sans = "'Arial Narrow', 'Arial', sans-serif";
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{ background: '#f9f6f0', color: INK, fontFamily: serif, minHeight: '100vh' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 20px 80px' }}>

        {/* Masthead */}
        <Reveal>
          <div style={{ textAlign: 'center', borderBottom: `4px double ${INK}`, paddingBottom: 16, marginBottom: 4 }}>
            <div style={{ fontFamily: sans, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTED, marginBottom: 8 }}>
              {today} · Portfolio Edition
            </div>
            <h1 style={{ fontSize: 'clamp(36px,7vw,80px)', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', lineHeight: 0.9, fontFamily: serif }}>
              {d.name}
            </h1>
            <div style={{ fontFamily: sans, fontSize: 13, marginTop: 10, color: MUTED, letterSpacing: '0.05em' }}>
              {d.headline}{d.location ? ` · ${d.location}` : ''}
            </div>
          </div>
          <ThickRule />
        </Reveal>

        {/* Lead story / bio */}
        <Reveal delay={0.05}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '0 20px', padding: '20px 0', borderBottom: `1px solid ${RULE}` }}>
            <div>
              <div style={{ fontFamily: sans, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: MUTED, marginBottom: 8 }}>Profile</div>
              <p style={{ fontSize: 17, lineHeight: 1.7, margin: 0, fontStyle: 'italic', textAlign: 'justify' }}>{d.bio}</p>
            </div>
            <div style={{ background: RULE }} />
            <div>
              <div style={{ fontFamily: sans, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: MUTED, marginBottom: 8 }}>Skills</div>
              <div style={{ columns: 2, columnGap: 16 }}>
                {d.skills.map((s) => (
                  <div key={s} style={{ fontSize: 14, lineHeight: 1.9, borderBottom: `1px dotted #ccc` }}>{s}</div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Projects */}
        <Reveal delay={0.08}>
          <div style={{ padding: '20px 0', borderBottom: `1px solid ${RULE}` }}>
            <div style={{ fontFamily: sans, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: MUTED, borderBottom: `2px solid ${INK}`, paddingBottom: 4, marginBottom: 16 }}>
              Works &amp; Projects
            </div>
            <div style={{ columns: Math.min(d.projects.length, 3), columnGap: 24, columnRule: `1px solid ${RULE}` }}>
              {d.projects.map((p) => (
                <div key={p.id} style={{ breakInside: 'avoid', marginBottom: 20 }}>
                  <a href={p.url} target="_blank" rel="noreferrer" style={{ color: INK, textDecoration: 'none' }}>
                    <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.2, marginBottom: 4 }}>{p.name}</div>
                    <div style={{ fontFamily: sans, fontSize: 10, color: MUTED, marginBottom: 4 }}>{p.language} · ★ {p.stars}</div>
                    <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0, color: '#333', textAlign: 'justify' }}>{p.description}</p>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Experience + Achievements */}
        <Reveal delay={0.1}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '0 20px', padding: '20px 0' }}>
            {(d.experience.length > 0 || d.education.length > 0) && (
              <div>
                <div style={{ fontFamily: sans, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: MUTED, borderBottom: `2px solid ${INK}`, paddingBottom: 4, marginBottom: 14 }}>Appointments</div>
                {[...d.experience, ...d.education].map((item, i) => (
                  <div key={i} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: i < d.experience.length + d.education.length - 1 ? `1px dotted #ccc` : 'none' }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{item.role || item.degree}</div>
                    <div style={{ fontSize: 13, color: MUTED }}>{item.company || item.institution}</div>
                    <div style={{ fontFamily: sans, fontSize: 11, color: '#888' }}>{item.startDate || item.year}{item.endDate ? `–${item.endDate}` : ''}</div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ background: RULE }} />
            <div>
              {d.achievements.length > 0 && (
                <>
                  <div style={{ fontFamily: sans, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: MUTED, borderBottom: `2px solid ${INK}`, paddingBottom: 4, marginBottom: 14 }}>Honours</div>
                  {d.achievements.map((a, i) => (
                    <div key={i} style={{ fontSize: 14, marginBottom: 10, borderBottom: `1px dotted #ccc`, paddingBottom: 10 }}>
                      <strong>{a.title}</strong> <span style={{ fontFamily: sans, fontSize: 11, color: MUTED }}>{a.year}</span>
                    </div>
                  ))}
                </>
              )}
              <div style={{ marginTop: 20 }}>
                <div style={{ fontFamily: sans, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: MUTED, borderBottom: `2px solid ${INK}`, paddingBottom: 4, marginBottom: 14 }}>Correspondence</div>
                {d.contacts.map((c) => (
                  <a key={c.label} href={c.href} style={{ display: 'block', fontSize: 13, color: INK, marginBottom: 6, textDecoration: 'underline' }}>
                    {c.label}: {c.value}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
