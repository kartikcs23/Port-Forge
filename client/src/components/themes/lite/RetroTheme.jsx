import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const R = { bg: '#0f0f23', panel: '#1a1a3e', border: '#5555aa', cyan: '#00ffff', yellow: '#ffff00', magenta: '#ff00ff', green: '#00ff00', red: '#ff0000', white: '#ffffff', dim: '#8888cc' };
const mono = "'Courier New',Courier,monospace";

const Blink = ({ children }) => (
  <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}>{children}</motion.span>
);

const Reveal = ({ children, delay = 0 }) => (
  <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.3, delay }}>{children}</motion.div>
);

const PixelBorder = ({ color = R.cyan, children, style = {} }) => (
  <div style={{ position: 'relative', border: `2px solid ${color}`, padding: '16px', boxShadow: `4px 4px 0 ${color}44`, ...style }}>
    {/* Pixel corners */}
    {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h]) => (
      <div key={`${v}${h}`} style={{ position: 'absolute', [v]: -6, [h]: -6, width: 8, height: 8, background: color }} />
    ))}
    {children}
  </div>
);

const StatBar = ({ label, value, max = 10, color = R.green, width = 160 }) => {
  const pct = Math.min(Math.round((value / max) * 10), 10);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
      <span style={{ fontSize: 11, color: R.dim, minWidth: 120, fontFamily: mono }}>{label.substring(0, 14).padEnd(14)}</span>
      <span style={{ fontFamily: mono, fontSize: 12 }}>
        <span style={{ color }}>[{'█'.repeat(pct)}</span><span style={{ color: R.dim + '55' }}>{'░'.repeat(10 - pct)}</span><span style={{ color }}>]</span>
      </span>
    </div>
  );
};

const CharSprite = () => (
  <div style={{ fontFamily: mono, fontSize: 11, lineHeight: 1.2, color: R.cyan }}>
    <div>  O  </div>
    <div> /|\ </div>
    <div> / \ </div>
  </div>
);

export const RetroTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);

  return (
    <div style={{ background: R.bg, color: R.white, fontFamily: mono, minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* CRT scanlines */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.18) 2px,rgba(0,0,0,0.18) 4px)', pointerEvents: 'none', zIndex: 100 }} />
      {/* CRT vignette */}
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none', zIndex: 99 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: '32px 20px 80px' }}>

        {/* Boot screen / ASCII hero */}
        <Reveal>
          <PixelBorder color={R.cyan} style={{ marginBottom: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: R.dim, letterSpacing: '0.2em', marginBottom: 12 }}>★ PORTFOLIO SYSTEM v2.6 ★</div>
            <pre style={{ margin: '0 0 16px', fontSize: 'clamp(9px,2vw,16px)', lineHeight: 1.2, color: R.yellow, fontFamily: mono, display: 'inline-block', textAlign: 'left' }}>{`
██████╗  ██████╗ ██████╗ ████████╗
██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝
██████╔╝██║   ██║██████╔╝   ██║
██╔═══╝ ██║   ██║██╔══██╗   ██║
██║     ╚██████╔╝██║  ██║   ██║
╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝`}</pre>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <CharSprite />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 18, color: R.white, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{d.name}</div>
                <div style={{ fontSize: 12, color: R.cyan, marginTop: 4 }}>{d.headline}</div>
                {d.location && <div style={{ fontSize: 11, color: R.dim, marginTop: 2 }}>📍 {d.location}</div>}
                <div style={{ marginTop: 12, display: 'flex', gap: 12, fontSize: 11, color: R.dim }}>
                  <span>HP: <span style={{ color: R.green }}>100/100</span></span>
                  <span>MP: <span style={{ color: R.cyan }}>{d.skills.length * 10}/∞</span></span>
                  <span>LVL: <span style={{ color: R.yellow }}>{d.projects.length + d.experience.length}</span></span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16, fontSize: 11, color: R.dim }}>
              <Blink>▌</Blink> READY — INSERT COIN TO CONTINUE
            </div>
          </PixelBorder>
        </Reveal>

        {/* About */}
        <Reveal delay={0.04}>
          <PixelBorder color={R.yellow} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: R.yellow, letterSpacing: '0.2em', marginBottom: 10 }}>▶ MISSION BRIEFING</div>
            <div style={{ fontSize: 13, color: R.white, lineHeight: 1.8 }}>
              {'> '}{d.bio}
            </div>
          </PixelBorder>
        </Reveal>

        {/* Skills as stat bars */}
        <Reveal delay={0.06}>
          <PixelBorder color={R.green} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: R.green, letterSpacing: '0.2em', marginBottom: 14 }}>▶ CHARACTER STATS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
              {d.skills.map((s, i) => (
                <StatBar key={s} label={s} value={6 + (i % 4)} color={[R.green, R.cyan, R.yellow, R.magenta][i % 4]} />
              ))}
            </div>
          </PixelBorder>
        </Reveal>

        {/* Projects as item cards */}
        <Reveal delay={0.08}>
          <div style={{ fontSize: 10, color: R.cyan, letterSpacing: '0.2em', marginBottom: 12 }}>▶ ACHIEVEMENTS UNLOCKED</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, marginBottom: 20 }}>
            {d.projects.map((p, i) => (
              <Reveal key={p.id} delay={0.08 + i * 0.04}>
                <a href={p.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <PixelBorder color={[R.cyan, R.green, R.yellow, R.magenta][i % 4]} style={{ cursor: 'pointer', height: '100%', boxSizing: 'border-box' }}>
                    <div style={{ fontSize: 9, color: R.dim, marginBottom: 6 }}>ITEM #{String(i + 1).padStart(3, '0')} · {p.language || '???'}</div>
                    <div style={{ fontSize: 14, color: R.white, fontWeight: 700, marginBottom: 6 }}>{p.name.toUpperCase()}</div>
                    <div style={{ fontSize: 11, color: R.dim, lineHeight: 1.6, marginBottom: 8 }}>{p.description}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
                      <span style={{ color: R.yellow }}>★ {p.stars} POINTS</span>
                      <span style={{ color: R.cyan }}>PRESS A →</span>
                    </div>
                  </PixelBorder>
                </a>
              </Reveal>
            ))}
          </div>
        </Reveal>

        {/* Experience */}
        {(d.experience.length > 0 || d.education.length > 0) && (
          <Reveal delay={0.14}>
            <PixelBorder color={R.magenta} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: R.magenta, letterSpacing: '0.2em', marginBottom: 14 }}>▶ QUEST LOG</div>
              {[...d.experience, ...d.education].map((item, i) => (
                <div key={i} style={{ fontSize: 13, marginBottom: 10, display: 'flex', gap: 8 }}>
                  <span style={{ color: R.magenta }}>✦</span>
                  <div>
                    <span style={{ color: R.white, fontWeight: 700 }}>{item.role || item.degree}</span>
                    <span style={{ color: R.dim }}> @ {item.company || item.institution}</span>
                    <span style={{ color: R.dim, fontSize: 10, marginLeft: 8 }}>[{item.startDate || item.year}{item.endDate ? `-${item.endDate}` : ''}]</span>
                  </div>
                </div>
              ))}
              {d.achievements.map((a, i) => (
                <div key={`a${i}`} style={{ fontSize: 13, marginBottom: 10, display: 'flex', gap: 8 }}>
                  <span style={{ color: R.yellow }}>🏆</span>
                  <span style={{ color: R.yellow }}>{a.title}</span>
                  <span style={{ color: R.dim, fontSize: 10 }}>[{a.year}]</span>
                </div>
              ))}
            </PixelBorder>
          </Reveal>
        )}

        {/* Contact */}
        <Reveal delay={0.18}>
          <PixelBorder color={R.red} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: R.red, letterSpacing: '0.2em', marginBottom: 14 }}>▶ CONTACT DIRECTORY</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {d.contacts.map((c) => (
                <div key={c.label} style={{ display: 'flex', gap: 12, fontSize: 13, alignItems: 'center' }}>
                  <span style={{ color: R.red, minWidth: 80, fontSize: 10, letterSpacing: '0.1em' }}>[{c.label.toUpperCase()}]</span>
                  <a href={c.href} style={{ color: R.white, textDecoration: 'none' }}>{c.value}</a>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, borderTop: `1px solid ${R.border}`, paddingTop: 12, fontSize: 10, color: R.dim, textAlign: 'center' }}>
              © {new Date().getFullYear()} {d.name.toUpperCase()} — GAME OVER? NO. INSERT COIN. <Blink>█</Blink>
            </div>
          </PixelBorder>
        </Reveal>
      </div>
    </div>
  );
};
