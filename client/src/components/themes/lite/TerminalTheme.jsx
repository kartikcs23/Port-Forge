import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const G = { bg: '#0d1117', panel: '#161b22', border: '#30363d', green: '#3fb950', cyan: '#58a6ff', yellow: '#e3b341', red: '#f85149', purple: '#bc8cff', dim: '#8b949e', white: '#e6edf3' };

const Blink = () => {
  const [on, setOn] = useState(true);
  useEffect(() => { const t = setInterval(() => setOn(o => !o), 530); return () => clearInterval(t); }, []);
  return <span style={{ color: G.green, opacity: on ? 1 : 0 }}>█</span>;
};

const Reveal = ({ children, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.3, delay }}>{children}</motion.div>
);

const Prompt = ({ path = '~', cmd }) => (
  <div style={{ fontSize: 13, marginBottom: 6, lineHeight: 1.5 }}>
    <span style={{ color: G.green, fontWeight: 700 }}>➜</span>
    <span style={{ color: G.cyan, marginLeft: 6 }}>{path}</span>
    <span style={{ color: G.dim }}> git:(</span>
    <span style={{ color: G.purple }}>main</span>
    <span style={{ color: G.dim }}>)</span>
    <span style={{ color: G.white, marginLeft: 8 }}>{cmd}</span>
  </div>
);

const LineNum = ({ n }) => <span style={{ userSelect: 'none', color: G.dim, fontSize: 12, minWidth: 32, display: 'inline-block', textAlign: 'right', marginRight: 16 }}>{n}</span>;

export const TerminalTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const mono = "ui-monospace,'SF Mono','Cascadia Code',Consolas,monospace";

  const neofetchLeft = [
    `       .-.`,
    `      (   )`,
    `       '-'`,
    `      /   \\`,
    `     /     \\`,
    `    /  dev  \\`,
    `   /  ready  \\`,
    `  /___________\\`,
  ];

  const neofetchRight = [
    [`${d.name}`, G.cyan],
    [`${'─'.repeat(Math.min(d.name.length, 20))}`, G.dim],
    [`OS: Portfolio v2.0`, G.white],
    [`Shell: zsh`, G.white],
    [`Role: ${d.headline}`, G.yellow],
    [d.location ? `Location: ${d.location}` : `Location: Remote`, G.white],
    [`Repos: ${d.projects.length} active`, G.green],
    [`Skills: ${d.skills.length} languages`, G.purple],
    [``, ''],
    [`◼ ◼ ◼ ◼ ◼ ◼ ◼ ◼`, G.white],
  ];

  return (
    <div style={{ background: G.bg, color: G.white, fontFamily: mono, minHeight: '100vh' }}>

      {/* Window chrome */}
      <div style={{ background: '#1c2128', borderBottom: `1px solid ${G.border}`, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 12, color: G.dim }}>portfolio — zsh — 180×40</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['portfolio.sh', 'about.md', 'projects.log'].map(tab => (
            <div key={tab} style={{ fontSize: 11, color: G.dim, padding: '2px 10px', background: tab === 'portfolio.sh' ? G.panel : 'transparent', borderRadius: 4 }}>{tab}</div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* Neofetch hero */}
        <Reveal>
          <div style={{ background: G.panel, border: `1px solid ${G.border}`, borderRadius: 8, padding: '24px 28px', marginBottom: 28 }}>
            <Prompt path="~/portfolio" cmd="neofetch --ascii" />
            <div style={{ display: 'flex', gap: 32, marginTop: 12, flexWrap: 'wrap' }}>
              <pre style={{ margin: 0, fontSize: 13, color: G.cyan, lineHeight: 1.6, fontFamily: mono }}>{neofetchLeft.join('\n')}</pre>
              <div style={{ fontSize: 13, lineHeight: 1.9 }}>
                {neofetchRight.map(([text, color], i) => (
                  <div key={i} style={{ color }}>{text}</div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: G.dim }}>
              <span style={{ color: G.green, fontWeight: 700 }}>➜</span>
              <span style={{ color: G.cyan, marginLeft: 6 }}>~/portfolio</span>
              <Blink />
            </div>
          </div>
        </Reveal>

        {/* cat about.md */}
        <Reveal delay={0.05}>
          <div style={{ background: G.panel, border: `1px solid ${G.border}`, borderRadius: 8, marginBottom: 20 }}>
            <div style={{ borderBottom: `1px solid ${G.border}`, padding: '8px 16px' }}>
              <Prompt path="~/portfolio" cmd="cat about.md" />
            </div>
            <div style={{ padding: '16px 20px' }}>
              {d.bio.split('. ').map((sentence, i) => (
                <div key={i} style={{ display: 'flex', gap: 0 }}>
                  <LineNum n={i + 1} />
                  <span style={{ fontSize: 14, color: G.white, lineHeight: 1.8 }}>{sentence}{sentence ? '.' : ''}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Skills */}
        <Reveal delay={0.07}>
          <div style={{ background: G.panel, border: `1px solid ${G.border}`, borderRadius: 8, marginBottom: 20 }}>
            <div style={{ borderBottom: `1px solid ${G.border}`, padding: '8px 16px' }}>
              <Prompt path="~/portfolio" cmd="ls skills/ --tree --color" />
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {d.skills.map((s, i) => (
                <span key={s} style={{ fontSize: 12, padding: '3px 12px', borderRadius: 99, fontFamily: mono, border: `1px solid ${[G.green, G.cyan, G.yellow, G.purple][i % 4]}44`, color: [G.green, G.cyan, G.yellow, G.purple][i % 4], background: `${[G.green, G.cyan, G.yellow, G.purple][i % 4]}11` }}>
                  ./{s.toLowerCase().replace(/\s+/g, '-')}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Projects */}
        <Reveal delay={0.09}>
          <div style={{ background: G.panel, border: `1px solid ${G.border}`, borderRadius: 8, marginBottom: 20 }}>
            <div style={{ borderBottom: `1px solid ${G.border}`, padding: '8px 16px' }}>
              <Prompt path="~/portfolio" cmd="git log --oneline --graph --all" />
            </div>
            <div style={{ padding: '12px 0' }}>
              {d.projects.map((p, i) => (
                <Reveal key={p.id} delay={0.09 + i * 0.04}>
                  <a href={p.url} target="_blank" rel="noreferrer" style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '10px 20px', textDecoration: 'none', color: 'inherit', borderBottom: i < d.projects.length - 1 ? `1px solid ${G.border}22` : 'none', transition: 'background 0.15s', cursor: 'pointer' }}>
                    <span style={{ color: G.dim, fontSize: 12, marginTop: 2, flexShrink: 0 }}>
                      <span style={{ color: G.purple }}>*</span> <span style={{ color: G.yellow }}>{p.name.slice(0, 7).padEnd(7, '0')}</span>
                    </span>
                    <div style={{ flex: 1 }}>
                      <span style={{ color: G.cyan, fontWeight: 700, fontSize: 14 }}>{p.name}</span>
                      <span style={{ color: G.dim, fontSize: 12, marginLeft: 12 }}>{p.language} · ★{p.stars}</span>
                      <p style={{ margin: '4px 0 0', fontSize: 13, color: G.dim, lineHeight: 1.5 }}>{p.description}</p>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        {/* History */}
        {(d.experience.length > 0 || d.education.length > 0) && (
          <Reveal delay={0.14}>
            <div style={{ background: G.panel, border: `1px solid ${G.border}`, borderRadius: 8, marginBottom: 20 }}>
              <div style={{ borderBottom: `1px solid ${G.border}`, padding: '8px 16px' }}>
                <Prompt path="~/portfolio" cmd="history --experience --education" />
              </div>
              <div style={{ padding: '16px 20px', display: 'grid', gap: 10 }}>
                {[...d.experience, ...d.education].map((item, i) => (
                  <div key={i} style={{ fontSize: 13, lineHeight: 1.7 }}>
                    <LineNum n={i + 1} />
                    <span style={{ color: G.green }}>export </span>
                    <span style={{ color: G.cyan }}>{(item.role || item.degree || '').replace(/\s+/g, '_').toUpperCase()}</span>
                    <span style={{ color: G.dim }}>="</span>
                    <span style={{ color: G.yellow }}>{item.company || item.institution}</span>
                    <span style={{ color: G.dim }}>" </span>
                    <span style={{ color: '#555' }}># {item.startDate || item.year}{item.endDate ? `–${item.endDate}` : ''}</span>
                  </div>
                ))}
                {d.achievements.map((a, i) => (
                  <div key={`a${i}`} style={{ fontSize: 13, lineHeight: 1.7 }}>
                    <LineNum n={d.experience.length + d.education.length + i + 1} />
                    <span style={{ color: G.yellow }}>echo </span>
                    <span style={{ color: G.purple }}>"🏆 {a.title}"</span>
                    <span style={{ color: '#555' }}> # {a.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* Contact */}
        <Reveal delay={0.18}>
          <div style={{ background: G.panel, border: `1px solid ${G.border}`, borderRadius: 8 }}>
            <div style={{ borderBottom: `1px solid ${G.border}`, padding: '8px 16px' }}>
              <Prompt path="~/portfolio" cmd="cat contact.json | jq ." />
            </div>
            <div style={{ padding: '16px 20px' }}>
              <span style={{ color: G.dim, fontSize: 13 }}>{'{'}</span>
              <div style={{ paddingLeft: 24 }}>
                {d.contacts.map((c, i) => (
                  <div key={c.label} style={{ fontSize: 13, lineHeight: 1.9 }}>
                    <span style={{ color: G.cyan }}>"{c.label.toLowerCase()}"</span>
                    <span style={{ color: G.dim }}>: </span>
                    <a href={c.href} style={{ color: G.green, textDecoration: 'none' }}>"{c.value}"</a>
                    {i < d.contacts.length - 1 && <span style={{ color: G.dim }}>,</span>}
                  </div>
                ))}
              </div>
              <span style={{ color: G.dim, fontSize: 13 }}>{'}'}</span>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: G.dim }}>
                <span style={{ color: G.green, fontWeight: 700 }}>➜</span>
                <span style={{ color: G.cyan, marginLeft: 6 }}>~/portfolio</span>
                <Blink />
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Status bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: G.purple, color: '#fff', padding: '4px 16px', fontSize: 12, display: 'flex', gap: 24, alignItems: 'center', fontFamily: mono }}>
        <span>⎇ main</span>
        <span>● {d.projects.length} repos</span>
        <span>✔ {d.skills.length} skills</span>
        <span style={{ marginLeft: 'auto' }}>{d.name} · portfolio.sh</span>
        <span>UTF-8</span>
        <span>LF</span>
      </div>
    </div>
  );
};
