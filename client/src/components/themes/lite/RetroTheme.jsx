import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const BG = '#0f0f23';
const FG = '#cccccc';
const YELLOW = '#ffff00';
const CYAN = '#00ffff';
const MAGENTA = '#ff00ff';
const GREEN = '#00ff00';
const RED = '#ff0000';
const WHITE = '#ffffff';

const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.3, delay }}
  >
    {children}
  </motion.div>
);

const Blink = ({ children }) => (
  <motion.span
    animate={{ opacity: [1, 0, 1] }}
    transition={{ duration: 1, repeat: Infinity, repeatType: 'loop' }}
  >
    {children}
  </motion.span>
);

const Box = ({ title, color = CYAN, children }) => (
  <div style={{ border: `2px solid ${color}`, marginBottom: 20, fontFamily: "'Courier New', monospace" }}>
    <div style={{ background: color, color: BG, padding: '2px 10px', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em' }}>
      ╔═ {title} ═╗
    </div>
    <div style={{ padding: '12px 16px' }}>{children}</div>
  </div>
);

const PixelBar = ({ value, max = 10, color = GREEN }) => {
  const filled = Math.round((value / max) * 10);
  return (
    <span style={{ fontFamily: "'Courier New', monospace", fontSize: 13 }}>
      <span style={{ color }}>[{'█'.repeat(filled)}{'░'.repeat(10 - filled)}]</span>
    </span>
  );
};

export const RetroTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const mono = "'Courier New', Courier, monospace";

  return (
    <div style={{ background: BG, color: FG, fontFamily: mono, minHeight: '100vh', padding: '32px 16px 80px' }}>
      {/* CRT scanline overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>

        {/* Boot screen */}
        <Reveal>
          <div style={{ marginBottom: 28, textAlign: 'center', borderBottom: `1px solid ${CYAN}44`, paddingBottom: 20 }}>
            <div style={{ color: CYAN, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 8 }}>
              *** PORTFOLIO OS v1.0 ***
            </div>
            <pre style={{ color: YELLOW, fontSize: 'clamp(12px,3vw,20px)', lineHeight: 1.2, margin: '0 0 12px', fontWeight: 700 }}>{`
 ██████╗  ██████╗ ██████╗ ████████╗
 ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝
 ██████╔╝██║   ██║██████╔╝   ██║
 ██╔═══╝ ██║   ██║██╔══██╗   ██║
 ██║     ╚██████╔╝██║  ██║   ██║
 ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝`}</pre>
            <div style={{ fontSize: 18, color: WHITE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{d.name}</div>
            <div style={{ fontSize: 13, color: GREEN, marginTop: 4 }}>{d.headline}{d.location ? ` // ${d.location}` : ''}</div>
            <div style={{ fontSize: 12, color: FG, marginTop: 16 }}>
              <Blink>▌</Blink> READY.
            </div>
          </div>
        </Reveal>

        <Box title="ABOUT" color={CYAN}>
          <Reveal delay={0.04}>
            <div style={{ fontSize: 13, lineHeight: 1.8, color: FG }}>
              {'> '}{d.bio}
            </div>
          </Reveal>
        </Box>

        <Box title="SKILLS DATABASE" color={YELLOW}>
          <Reveal delay={0.06}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '6px 20px' }}>
              {d.skills.map((s, i) => (
                <div key={s} style={{ fontSize: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ color: YELLOW, minWidth: 140 }}>{s.padEnd(14, '.')}</span>
                  <PixelBar value={7 + (i % 3)} color={YELLOW} />
                </div>
              ))}
            </div>
          </Reveal>
        </Box>

        <Box title="PROJECTS" color={GREEN}>
          <div style={{ display: 'grid', gap: 16 }}>
            {d.projects.map((p, i) => (
              <Reveal key={p.id} delay={0.06 + i * 0.04}>
                <a href={p.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div style={{ borderLeft: `3px solid ${GREEN}`, paddingLeft: 12, cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                      <span style={{ color: GREEN, fontWeight: 700, fontSize: 14 }}>[{String(i + 1).padStart(2, '0')}] {p.name}</span>
                      <span style={{ color: CYAN, fontSize: 11 }}>{p.language} | ★{p.stars}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#aaa', marginTop: 4, lineHeight: 1.5 }}>{p.description}</div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </Box>

        {(d.experience.length > 0 || d.education.length > 0) && (
          <Box title="HISTORY LOG" color={MAGENTA}>
            <Reveal delay={0.14}>
              {[...d.experience, ...d.education].map((item, i) => (
                <div key={i} style={{ fontSize: 13, marginBottom: 10, color: FG }}>
                  <span style={{ color: MAGENTA }}>{'>'} </span>
                  <span style={{ color: WHITE, fontWeight: 700 }}>{item.role || item.degree}</span>
                  <span style={{ color: CYAN }}> @ {item.company || item.institution}</span>
                  <span style={{ color: '#666' }}> [{item.startDate || item.year}{item.endDate ? `-${item.endDate}` : ''}]</span>
                </div>
              ))}
              {d.achievements.map((a, i) => (
                <div key={`a${i}`} style={{ fontSize: 13, marginBottom: 10 }}>
                  <span style={{ color: YELLOW }}>{'>'} ACHIEVEMENT UNLOCKED: </span>
                  <span style={{ color: WHITE }}>{a.title}</span>
                  <span style={{ color: '#666' }}> [{a.year}]</span>
                </div>
              ))}
            </Reveal>
          </Box>
        )}

        <Box title="CONTACT DIRECTORY" color={RED}>
          <Reveal delay={0.18}>
            <div style={{ display: 'grid', gap: 8 }}>
              {d.contacts.map((c) => (
                <div key={c.label} style={{ fontSize: 13, display: 'flex', gap: 8 }}>
                  <span style={{ color: RED, minWidth: 80 }}>{c.label.toUpperCase()}:</span>
                  <a href={c.href} style={{ color: WHITE, textDecoration: 'none' }}>{c.value}</a>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, fontSize: 11, color: '#444' }}>
              © {new Date().getFullYear()} {d.name}. ALL RIGHTS RESERVED. <Blink>█</Blink>
            </div>
          </Reveal>
        </Box>
      </div>
    </div>
  );
};
