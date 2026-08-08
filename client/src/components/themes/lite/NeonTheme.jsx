import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const BG = '#0d0d14';
const NEON_PINK = '#ff2d78';
const NEON_CYAN = '#00e5ff';
const NEON_GREEN = '#39ff14';
const NEON_YELLOW = '#ffff00';
const DIM = '#3a3a4a';

const SYNTAX = { keyword: NEON_PINK, string: NEON_GREEN, number: NEON_YELLOW, comment: '#666a7e', func: NEON_CYAN, punc: '#aaa' };

const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.35, delay }}
  >
    {children}
  </motion.div>
);

export const NeonTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const mono = "ui-monospace, 'SF Mono', 'Cascadia Code', Consolas, monospace";

  return (
    <div style={{ background: BG, color: '#cdd6f4', fontFamily: mono, minHeight: '100vh', padding: '48px 20px 80px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* File header */}
        <Reveal>
          <div style={{ background: '#1a1a2e', borderRadius: '8px 8px 0 0', border: `1px solid ${DIM}`, borderBottom: 'none', padding: '8px 16px', display: 'flex', gap: 8, alignItems: 'center', marginBottom: 0 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
            <span style={{ fontSize: 12, color: '#666', marginLeft: 12 }}>portfolio.js</span>
          </div>
          <div style={{ background: '#12121f', border: `1px solid ${DIM}`, borderRadius: '0 0 8px 8px', padding: '28px 28px', marginBottom: 28 }}>
            <div style={{ fontSize: 13 }}>
              <span style={{ color: SYNTAX.comment }}>{'// '}{d.name} — {d.headline}</span><br />
              <span style={{ color: SYNTAX.keyword }}>const </span>
              <span style={{ color: NEON_CYAN }}>developer</span>
              <span style={{ color: SYNTAX.punc }}> = {'{'}</span><br />
              <span style={{ paddingLeft: 24 }}><span style={{ color: SYNTAX.string }}>"name"</span><span style={{ color: SYNTAX.punc }}>: </span><span style={{ color: NEON_GREEN }}>"{d.name}"</span><span style={{ color: SYNTAX.punc }}>,</span></span><br />
              <span style={{ paddingLeft: 24 }}><span style={{ color: SYNTAX.string }}>"role"</span><span style={{ color: SYNTAX.punc }}>: </span><span style={{ color: NEON_GREEN }}>"{d.headline}"</span><span style={{ color: SYNTAX.punc }}>,</span></span><br />
              {d.location && <><span style={{ paddingLeft: 24 }}><span style={{ color: SYNTAX.string }}>"location"</span><span style={{ color: SYNTAX.punc }}>: </span><span style={{ color: NEON_GREEN }}>"{d.location}"</span><span style={{ color: SYNTAX.punc }}>,</span></span><br /></>}
              <span style={{ color: SYNTAX.punc }}>{'}'}</span>
            </div>
          </div>
        </Reveal>

        {/* Bio */}
        <Reveal delay={0.05}>
          <div style={{ background: '#12121f', border: `1px solid ${DIM}`, borderRadius: 8, padding: '20px 24px', marginBottom: 20 }}>
            <div style={{ color: SYNTAX.comment, fontSize: 12, marginBottom: 10 }}>{'//'} about.txt</div>
            <p style={{ fontSize: 14, lineHeight: 1.75, margin: 0, color: '#b4bcd0' }}>{d.bio}</p>
          </div>
        </Reveal>

        {/* Skills */}
        <Reveal delay={0.07}>
          <div style={{ background: '#12121f', border: `1px solid ${DIM}`, borderRadius: 8, padding: '20px 24px', marginBottom: 20 }}>
            <div style={{ color: SYNTAX.comment, fontSize: 12, marginBottom: 12 }}>{'//'} skills[]</div>
            <div style={{ fontSize: 13 }}>
              <span style={{ color: SYNTAX.keyword }}>const </span>
              <span style={{ color: NEON_CYAN }}>skills</span>
              <span style={{ color: SYNTAX.punc }}> = [</span>
              <div style={{ paddingLeft: 24, paddingTop: 4 }}>
                {d.skills.map((s, i) => (
                  <span key={s} style={{ color: NEON_GREEN }}>"{s}"{i < d.skills.length - 1 ? <span style={{ color: SYNTAX.punc }}>, </span> : ''}</span>
                ))}
              </div>
              <span style={{ color: SYNTAX.punc }}>]</span>
            </div>
          </div>
        </Reveal>

        {/* Projects */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ color: SYNTAX.comment, fontSize: 12, padding: '0 4px 10px' }}>{'//'} projects[]</div>
          <div style={{ display: 'grid', gap: 12 }}>
            {d.projects.map((p, i) => (
              <Reveal key={p.id} delay={0.08 + i * 0.04}>
                <a href={p.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div style={{ background: '#12121f', border: `1px solid ${DIM}`, borderRadius: 8, padding: '16px 20px', transition: 'border-color 0.2s', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                      <span style={{ color: NEON_CYAN, fontWeight: 700, fontSize: 15 }}>{p.name}</span>
                      <span style={{ color: NEON_YELLOW, fontSize: 11 }}>{p.language} · ★{p.stars}</span>
                    </div>
                    <span style={{ color: SYNTAX.comment, fontSize: 12 }}>{'// '}</span>
                    <span style={{ color: '#9a9bb5', fontSize: 13 }}>{p.description}</span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Experience */}
        {(d.experience.length > 0 || d.education.length > 0) && (
          <Reveal delay={0.16}>
            <div style={{ background: '#12121f', border: `1px solid ${DIM}`, borderRadius: 8, padding: '20px 24px', marginBottom: 20 }}>
              <div style={{ color: SYNTAX.comment, fontSize: 12, marginBottom: 12 }}>{'//'} history[]</div>
              {[...d.experience, ...d.education].map((item, i) => (
                <div key={i} style={{ marginBottom: 10, fontSize: 13 }}>
                  <span style={{ color: NEON_PINK }}>{item.role || item.degree}</span>
                  <span style={{ color: SYNTAX.punc }}> @ </span>
                  <span style={{ color: NEON_CYAN }}>{item.company || item.institution}</span>
                  <span style={{ color: SYNTAX.comment }}> // {item.startDate || item.year}{item.endDate ? `–${item.endDate}` : ''}</span>
                </div>
              ))}
              {d.achievements.map((a, i) => (
                <div key={`a${i}`} style={{ marginBottom: 10, fontSize: 13 }}>
                  <span style={{ color: NEON_YELLOW }}>🏆 {a.title}</span>
                  <span style={{ color: SYNTAX.comment }}> // {a.year}</span>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {/* Contact */}
        <Reveal delay={0.2}>
          <div style={{ background: '#12121f', border: `1px solid ${DIM}`, borderRadius: 8, padding: '20px 24px' }}>
            <div style={{ color: SYNTAX.comment, fontSize: 12, marginBottom: 10 }}>{'//'} contact{}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 28px' }}>
              {d.contacts.map((c) => (
                <a key={c.label} href={c.href} style={{ fontSize: 13, color: NEON_GREEN, textDecoration: 'none' }}>
                  <span style={{ color: SYNTAX.string }}>"{c.label}"</span><span style={{ color: SYNTAX.punc }}>: </span><span style={{ color: NEON_CYAN }}>"{c.value}"</span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
