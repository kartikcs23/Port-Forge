import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const GREEN = '#3ddc84';
const DIM = '#5c7a6e';
const BG = '#0b0f0e';

const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.4, delay }}
  >
    {children}
  </motion.div>
);

const Prompt = ({ cmd }) => (
  <div style={{ fontSize: 13, color: DIM, marginBottom: 10 }}>
    <span style={{ color: GREEN }}>guest@portfolio</span>:<span style={{ color: '#7aa2f7' }}>~</span>$ {cmd}
  </div>
);

/**
 * Terminal — a real shell session, not a decoration. Every section is
 * framed as a command someone typed and the output that followed, using
 * only monospace type throughout (no display face) so the whole page reads
 * as one consistent artifact — a CS student's actual terminal.
 */
export const TerminalTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const font = "ui-monospace, 'SF Mono', Consolas, 'Cascadia Code', monospace";

  return (
    <div style={{ background: BG, color: '#d7e0e8', fontFamily: font, minHeight: '100vh', padding: '48px 20px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Reveal>
          <Prompt cmd="whoami" />
          <div style={{ fontSize: 'clamp(28px,5vw,44px)', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>{d.name}</div>
          <div style={{ color: GREEN, fontSize: 15, marginTop: 4 }}>{d.headline}</div>
          {d.location && <div style={{ color: DIM, fontSize: 13, marginTop: 4 }}># {d.location}</div>}
        </Reveal>

        <div style={{ marginTop: 40 }}>
          <Reveal>
            <Prompt cmd="cat about.txt" />
            <p style={{ fontSize: 15, lineHeight: 1.7, color: '#c3cdd4', borderLeft: `2px solid ${GREEN}33`, paddingLeft: 14 }}>{d.bio}</p>
          </Reveal>
        </div>

        <div style={{ marginTop: 40 }}>
          <Reveal>
            <Prompt cmd="ls skills/ --tree" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {d.skills.map((s) => (
                <span key={s} style={{ fontSize: 13, color: '#fff', border: `1px solid ${DIM}`, padding: '4px 10px', borderRadius: 3 }}>
                  ./{s.toLowerCase().replace(/\s+/g, '-')}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <div style={{ marginTop: 40 }}>
          <Reveal>
            <Prompt cmd="git log --projects --oneline" />
          </Reveal>
          <div style={{ display: 'grid', gap: 14 }}>
            {d.projects.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <a href={p.url} target="_blank" rel="noreferrer" style={{ display: 'block', textDecoration: 'none', color: 'inherit', border: `1px solid #1c2622`, borderRadius: 6, padding: '14px 16px', background: '#0f1513' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{p.name}</span>
                    <span style={{ color: DIM, fontSize: 12 }}>{p.language} · ★{p.stars}</span>
                  </div>
                  <div style={{ color: '#9fb0aa', fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>{p.description}</div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>

        {(d.experience.length > 0 || d.education.length > 0) && (
          <div style={{ marginTop: 40 }}>
            <Reveal>
              <Prompt cmd="history --experience" />
              <div style={{ display: 'grid', gap: 12 }}>
                {[...d.experience, ...d.education].map((item, i) => (
                  <div key={i} style={{ fontSize: 14, color: '#c3cdd4' }}>
                    <span style={{ color: GREEN }}>&gt;</span> {item.role || item.degree} {item.company ? `@ ${item.company}` : item.institution ? `@ ${item.institution}` : ''}
                    <span style={{ color: DIM }}> [{item.startDate || item.year}{item.endDate ? `–${item.endDate}` : ''}]</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        )}

        {d.achievements.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <Reveal>
              <Prompt cmd="cat achievements.log" />
              <div style={{ display: 'grid', gap: 10 }}>
                {d.achievements.map((a, i) => (
                  <div key={i} style={{ fontSize: 14, color: '#c3cdd4' }}>
                    <span style={{ color: '#f7b955' }}>[OK]</span> {a.title} <span style={{ color: DIM }}>{a.year}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        )}

        <div style={{ marginTop: 40, paddingTop: 20, borderTop: `1px dashed ${DIM}55` }}>
          <Reveal>
            <Prompt cmd="cat contact.json" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px' }}>
              {d.contacts.map((c) => (
                <a key={c.label} href={c.href} style={{ color: GREEN, fontSize: 13, textDecoration: 'none' }}>
                  "{c.label.toLowerCase()}": "{c.value}"
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};
