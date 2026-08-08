import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const C = { bg: '#0d0d14', sidebar: '#0a0a10', panel: '#12121f', border: '#1e1e2e', active: '#313244', pink: '#ff2d78', cyan: '#00e5ff', green: '#a6e22e', yellow: '#e6db74', purple: '#ae81ff', orange: '#fd971f', comment: '#6272a4', white: '#f8f8f2', dim: '#44475a' };
const mono = "ui-monospace,'SF Mono','Cascadia Code',Consolas,monospace";

const Reveal = ({ children, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.3, delay }}>{children}</motion.div>
);

const Ln = ({ n }) => (
  <span style={{ userSelect: 'none', color: C.dim, fontSize: 12, minWidth: 36, display: 'inline-block', textAlign: 'right', marginRight: 20, flexShrink: 0 }}>{n}</span>
);

const CodeLine = ({ n, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', lineHeight: 1.7, minHeight: 22 }}>
    <Ln n={n} />
    <span style={{ fontSize: 13, fontFamily: mono, flex: 1 }}>{children}</span>
  </div>
);

const T = {
  kw: (t) => <span style={{ color: C.pink, fontWeight: 700 }}>{t}</span>,
  fn: (t) => <span style={{ color: C.green }}>{t}</span>,
  str: (t) => <span style={{ color: C.yellow }}>"{t}"</span>,
  num: (t) => <span style={{ color: C.purple }}>{t}</span>,
  op: (t) => <span style={{ color: C.white }}>{t}</span>,
  dim: (t) => <span style={{ color: C.dim }}>{t}</span>,
  cy: (t) => <span style={{ color: C.cyan }}>{t}</span>,
  or: (t) => <span style={{ color: C.orange }}>{t}</span>,
  cm: (t) => <span style={{ color: C.comment, fontStyle: 'italic' }}>{t}</span>,
};

export const NeonTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);

  const fileTree = [
    { icon: '📁', name: 'portfolio/', open: true },
    { icon: '  📄', name: 'about.js', active: false },
    { icon: '  📄', name: 'skills.js', active: false },
    { icon: '  📄', name: 'projects.js', active: true },
    { icon: '  📄', name: 'contact.js', active: false },
  ];

  const tabs = ['projects.js', 'about.js', 'skills.js'];
  const [activeTab, setActiveTab] = React.useState('projects.js');

  return (
    <div style={{ background: C.bg, color: C.white, fontFamily: mono, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Title bar */}
      <div style={{ background: '#1a1a2e', borderBottom: `1px solid ${C.border}`, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 12, color: C.dim }}>VS Portfolio — {d.name}</div>
      </div>

      {/* Tab bar */}
      <div style={{ background: C.panel, borderBottom: `1px solid ${C.border}`, display: 'flex', flexShrink: 0 }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 20px', fontSize: 12, background: activeTab === tab ? C.bg : 'transparent', color: activeTab === tab ? C.white : C.dim, border: 'none', borderBottom: activeTab === tab ? `2px solid ${C.cyan}` : '2px solid transparent', cursor: 'pointer', fontFamily: mono }}>
            {tab === 'projects.js' ? '⚡ ' : tab === 'about.js' ? '👤 ' : '🛠 '}{tab}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ padding: '8px 16px', fontSize: 11, color: C.dim }}>portfolio.js · UTF-8 · JavaScript React</div>
      </div>

      {/* Main area */}
      <div style={{ display: 'flex', flex: 1 }}>

        {/* Sidebar */}
        <div style={{ width: 220, background: C.sidebar, borderRight: `1px solid ${C.border}`, padding: '16px 0', flexShrink: 0 }}>
          <div style={{ padding: '0 12px 8px', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.dim }}>Explorer</div>
          {fileTree.map((f, i) => (
            <div key={i} style={{ padding: '4px 16px', fontSize: 13, color: f.active ? C.white : C.dim, background: f.active ? C.active : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>{f.icon}</span>
              <span>{f.name}</span>
            </div>
          ))}
          <div style={{ margin: '16px 0', borderTop: `1px solid ${C.border}` }} />
          <div style={{ padding: '0 12px 8px', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.dim }}>Outline</div>
          {['developer', 'skills', 'projects', 'experience', 'contact'].map(sym => (
            <div key={sym} style={{ padding: '3px 16px', fontSize: 12, color: C.cyan, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: C.purple, fontSize: 10 }}>ƒ</span>{sym}
            </div>
          ))}
        </div>

        {/* Editor */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 0' }}>
          <Reveal>
            <div style={{ marginBottom: 8 }}>
              <CodeLine n={1}><T.cm>{'// portfolio.js — ' + d.name}</T.cm></CodeLine>
              <CodeLine n={2}><T.cm>{'// ' + d.headline + (d.location ? ' · ' + d.location : '')}</T.cm></CodeLine>
              <CodeLine n={3} />
              <CodeLine n={4}><T.kw>const </T.kw><T.cy>developer</T.cy><T.op> = {'{'}</T.op></CodeLine>
              <CodeLine n={5}><T.op>{'  '}</T.op><T.cy>name</T.cy><T.op>: </T.op><T.str>{d.name}</T.str><T.op>,</T.op></CodeLine>
              <CodeLine n={6}><T.op>{'  '}</T.op><T.cy>role</T.cy><T.op>: </T.op><T.str>{d.headline}</T.str><T.op>,</T.op></CodeLine>
              {d.location && <CodeLine n={7}><T.op>{'  '}</T.op><T.cy>location</T.cy><T.op>: </T.op><T.str>{d.location}</T.str><T.op>,</T.op></CodeLine>}
              <CodeLine n={d.location ? 8 : 7}><T.op>{'  '}</T.op><T.cy>bio</T.cy><T.op>: </T.op><T.str>{d.bio.slice(0, 60)}…</T.str><T.op>,</T.op></CodeLine>
              <CodeLine n={d.location ? 9 : 8}><T.op>{'};'}</T.op></CodeLine>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div style={{ background: C.panel, borderLeft: `3px solid ${C.cyan}`, margin: '16px 0 8px', padding: '12px 0' }}>
              <CodeLine n={11}><T.cm>{'// ── skills ─────────────────────────────────'}</T.cm></CodeLine>
              <CodeLine n={12}><T.kw>const </T.kw><T.cy>skills</T.cy><T.op> = [</T.op></CodeLine>
              {d.skills.map((s, i) => (
                <CodeLine key={s} n={13 + i}><T.op>{'  '}</T.op><T.str>{s}</T.str>{i < d.skills.length - 1 ? <T.op>,</T.op> : ''}</CodeLine>
              ))}
              <CodeLine n={13 + d.skills.length}><T.op>{'];'}</T.op></CodeLine>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div style={{ background: C.panel, borderLeft: `3px solid ${C.pink}`, margin: '8px 0', padding: '12px 0' }}>
              <CodeLine n={15 + d.skills.length}><T.cm>{'// ── projects ───────────────────────────────'}</T.cm></CodeLine>
              <CodeLine n={16 + d.skills.length}><T.kw>const </T.kw><T.cy>projects</T.cy><T.op> = [</T.op></CodeLine>
              {d.projects.map((p, i) => {
                const base = 17 + d.skills.length + i * 5;
                return (
                  <React.Fragment key={p.id}>
                    <CodeLine n={base}><T.op>{'  {'}</T.op></CodeLine>
                    <CodeLine n={base + 1}><T.op>{'    '}</T.op><T.cy>name</T.cy><T.op>: </T.op><T.str>{p.name}</T.str><T.op>,</T.op></CodeLine>
                    <CodeLine n={base + 2}><T.op>{'    '}</T.op><T.cy>lang</T.cy><T.op>: </T.op><T.str>{p.language || '?'}</T.str><T.op>, </T.op><T.cy>stars</T.cy><T.op>: </T.op><T.num>{p.stars}</T.num><T.op>,</T.op></CodeLine>
                    <CodeLine n={base + 3}><T.op>{'    '}</T.op><T.cy>url</T.cy><T.op>: </T.op><a href={p.url} target="_blank" rel="noreferrer" style={{ color: C.yellow, textDecoration: 'none' }}>"{p.url}"</a><T.op>,</T.op></CodeLine>
                    <CodeLine n={base + 4}><T.op>{'  },'}</T.op></CodeLine>
                  </React.Fragment>
                );
              })}
              <CodeLine n={17 + d.skills.length + d.projects.length * 5}><T.op>{'];'}</T.op></CodeLine>
            </div>
          </Reveal>

          {(d.experience.length > 0 || d.education.length > 0 || d.achievements.length > 0) && (
            <Reveal delay={0.12}>
              <div style={{ background: C.panel, borderLeft: `3px solid ${C.orange}`, margin: '8px 0', padding: '12px 0' }}>
                <CodeLine n="…"><T.cm>{'// ── experience ─────────────────────────────'}</T.cm></CodeLine>
                {[...d.experience, ...d.education].map((item, i) => (
                  <CodeLine key={i} n={`…`}>
                    <T.kw>export </T.kw><T.fn>{(item.role || item.degree || '').replace(/\s+/g, '_')}</T.fn><T.op>({'"'}</T.op><T.str>{item.company || item.institution}</T.str><T.op>{'"'})</T.op>
                    <T.cm>{' // ' + (item.startDate || item.year) + (item.endDate ? '–' + item.endDate : '')}</T.cm>
                  </CodeLine>
                ))}
                {d.achievements.map((a, i) => (
                  <CodeLine key={`a${i}`} n="…">
                    <T.cm>{'// 🏆 '}{a.title}{' ('}{a.year}{')'}</T.cm>
                  </CodeLine>
                ))}
              </div>
            </Reveal>
          )}

          <Reveal delay={0.16}>
            <div style={{ background: C.panel, borderLeft: `3px solid ${C.green}`, margin: '8px 0', padding: '12px 0' }}>
              <CodeLine n="…"><T.cm>{'// ── contact ─────────────────────────────────'}</T.cm></CodeLine>
              <CodeLine n="…"><T.kw>export default </T.kw><T.op>{'{'}</T.op></CodeLine>
              {d.contacts.map((c, i) => (
                <CodeLine key={c.label} n="…">
                  <T.op>{'  '}</T.op><T.cy>{c.label.toLowerCase()}</T.cy><T.op>: </T.op>
                  <a href={c.href} style={{ color: C.yellow, textDecoration: 'none' }}>"{c.value}"</a>
                  {i < d.contacts.length - 1 && <T.op>,</T.op>}
                </CodeLine>
              ))}
              <CodeLine n="…"><T.op>{'};'}</T.op></CodeLine>
            </div>
          </Reveal>
        </div>

        {/* Minimap */}
        <div style={{ width: 60, background: C.sidebar, borderLeft: `1px solid ${C.border}`, padding: '16px 8px', flexShrink: 0 }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} style={{ height: 3, background: i % 5 === 0 ? C.cyan + '44' : C.dim + '22', marginBottom: 2, borderRadius: 1, width: `${40 + Math.sin(i) * 30}%` }} />
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div style={{ background: C.cyan, color: C.bg, padding: '4px 16px', fontSize: 12, display: 'flex', gap: 20, alignItems: 'center', flexShrink: 0, fontFamily: mono }}>
        <span style={{ fontWeight: 700 }}>⎇ main</span>
        <span>⚠ 0 errors</span>
        <span>● {d.projects.length} projects</span>
        <span style={{ marginLeft: 'auto' }}>Ln 42, Col 1</span>
        <span>JavaScript</span>
        <span>Spaces: 2</span>
      </div>
    </div>
  );
};
