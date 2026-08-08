import React from 'react';
import { motion } from 'framer-motion';
import { useThemeData } from './useThemeData';

const INK = '#111111';
const PAPER = '#f5f0e8';
const RULE = '#c8b89a';
const MUTED = '#666';
const RED = '#b22222';

const Reveal = ({ children, delay = 0 }) => (
  <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay }}>{children}</motion.div>
);

const DropCap = ({ text }) => {
  const first = text[0];
  const rest = text.slice(1);
  return (
    <p style={{ fontSize: 15, lineHeight: 1.75, margin: 0, textAlign: 'justify', hyphens: 'auto' }}>
      <span style={{ float: 'left', fontSize: 64, lineHeight: 0.8, fontWeight: 900, marginRight: 6, marginTop: 8, color: INK, fontFamily: "'Times New Roman', serif" }}>{first}</span>
      {rest}
    </p>
  );
};

export const GazetteTheme = ({ rootUser, profile, repos }) => {
  const d = useThemeData(rootUser, profile, repos);
  const serif = "'Times New Roman', 'Georgia', 'Palatino Linotype', serif";
  const sans = "'Arial Narrow', 'Arial', sans-serif";
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const liteTheme = portfolio => portfolio;

  return (
    <div style={{ background: PAPER, color: INK, fontFamily: serif, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px 80px' }}>

        {/* Masthead */}
        <Reveal>
          <div style={{ paddingTop: 32, textAlign: 'center', marginBottom: 0 }}>
            <div style={{ height: 4, background: INK, marginBottom: 6 }} />
            <div style={{ height: 1, background: INK, marginBottom: 12 }} />
            <div style={{ fontFamily: sans, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: MUTED, marginBottom: 6 }}>
              {today}
              <span style={{ margin: '0 16px', color: RULE }}>◆</span>
              Portfolio Edition
              <span style={{ margin: '0 16px', color: RULE }}>◆</span>
              {d.location || 'Worldwide'}
            </div>
            <h1 style={{ fontFamily: "'Times New Roman', serif", fontSize: 'clamp(40px,7vw,88px)', fontWeight: 900, margin: '6px 0', letterSpacing: '-0.02em', lineHeight: 0.9, textTransform: 'uppercase' }}>
              The Portfolio
            </h1>
            <h2 style={{ fontFamily: "'Times New Roman', serif", fontSize: 'clamp(20px,4vw,44px)', fontWeight: 400, margin: '0 0 10px', letterSpacing: '0.08em', fontStyle: 'italic' }}>
              &amp; Professional Gazette
            </h2>
            <div style={{ height: 1, background: INK, marginBottom: 4 }} />
            <div style={{ height: 4, background: INK, marginBottom: 0 }} />
          </div>
        </Reveal>

        {/* Byline strip */}
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${INK}`, padding: '6px 0', marginBottom: 24 }}>
            <span style={{ fontFamily: sans, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>By {d.name}</span>
            <span style={{ fontFamily: sans, fontSize: 10, color: RED, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>● SPECIAL REPORT</span>
            <span style={{ fontFamily: sans, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{d.headline}</span>
          </div>
        </Reveal>

        {/* Lead story — 3 column */}
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 0, borderBottom: `2px solid ${INK}`, paddingBottom: 24 }}>
            <div>
              {/* Headline */}
              <h2 style={{ fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 900, lineHeight: 1.05, margin: '0 0 12px', letterSpacing: '-0.01em' }}>
                {d.name} Ships Code, Builds Futures, Seeks Next Challenge
              </h2>
              <div style={{ borderTop: `1px solid ${INK}`, borderBottom: `1px solid ${INK}`, padding: '6px 0', margin: '12px 0', fontFamily: sans, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
                <span>Developer · {d.skills.slice(0, 3).join(' · ')}</span>
                <span>{d.location || 'Remote'}</span>
              </div>
              <DropCap text={d.bio} />
            </div>

            <div style={{ borderLeft: `1px solid ${RULE}`, paddingLeft: 20 }}>
              {/* Pull quote */}
              <div style={{ borderTop: `3px solid ${INK}`, borderBottom: `1px solid ${INK}`, padding: '14px 0', marginBottom: 20 }}>
                <div style={{ fontFamily: sans, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: MUTED, marginBottom: 8 }}>Profile at a Glance</div>
                {d.contacts.map((c) => (
                  <div key={c.label} style={{ marginBottom: 8 }}>
                    <div style={{ fontFamily: sans, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED }}>{c.label}</div>
                    <a href={c.href} style={{ fontSize: 13, color: INK, textDecoration: 'underline', wordBreak: 'break-all' }}>{c.value}</a>
                  </div>
                ))}
              </div>
              {/* Skill column */}
              <div>
                <div style={{ fontFamily: sans, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', borderBottom: `2px solid ${INK}`, paddingBottom: 4, marginBottom: 10, fontWeight: 700 }}>Technical Skills</div>
                {d.skills.map((s) => (
                  <div key={s} style={{ fontSize: 13, lineHeight: 1.9, borderBottom: `1px dotted ${RULE}`, paddingBottom: 2 }}>{s}</div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Projects — newspaper columns */}
        <Reveal delay={0.06}>
          <div style={{ marginTop: 28, marginBottom: 28, borderBottom: `2px solid ${INK}`, paddingBottom: 24 }}>
            <div style={{ borderBottom: `3px double ${INK}`, paddingBottom: 6, marginBottom: 18 }}>
              <span style={{ fontFamily: sans, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>Works &amp; Projects — Complete Portfolio</span>
            </div>
            <div style={{ columns: Math.min(d.projects.length, 3), columnGap: 24, columnRule: `1px solid ${RULE}` }}>
              {d.projects.map((p, i) => (
                <div key={p.id} style={{ breakInside: 'avoid', marginBottom: 22, paddingBottom: 22, borderBottom: `1px dotted ${RULE}` }}>
                  <a href={p.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ fontFamily: sans, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: RED, fontWeight: 700, marginBottom: 4 }}>
                      {p.language || 'Code'} · ★ {p.stars}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 17, lineHeight: 1.15, marginBottom: 6 }}>{p.name}</div>
                    <p style={{ fontSize: 13, lineHeight: 1.65, margin: 0, color: '#333', textAlign: 'justify' }}>{p.description}</p>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Experience + Awards — two column */}
        <Reveal delay={0.1}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
            {(d.experience.length > 0 || d.education.length > 0) && (
              <div style={{ gridColumn: 'span 2', borderRight: `1px solid ${RULE}`, paddingRight: 24 }}>
                <div style={{ borderBottom: `3px double ${INK}`, paddingBottom: 6, marginBottom: 16 }}>
                  <span style={{ fontFamily: sans, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>Appointments &amp; Education</span>
                </div>
                <div style={{ columns: 2, columnGap: 20, columnRule: `1px dotted ${RULE}` }}>
                  {[...d.experience, ...d.education].map((item, i) => (
                    <div key={i} style={{ breakInside: 'avoid', marginBottom: 16, paddingBottom: 16, borderBottom: `1px dotted ${RULE}` }}>
                      <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2, marginBottom: 2 }}>{item.role || item.degree}</div>
                      <div style={{ fontSize: 13, color: MUTED, marginBottom: 2 }}>{item.company || item.institution}</div>
                      <div style={{ fontFamily: sans, fontSize: 10, letterSpacing: '0.08em', color: RED }}>{item.startDate || item.year}{item.endDate ? `–${item.endDate}` : ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              {d.achievements.length > 0 && (
                <>
                  <div style={{ borderBottom: `3px double ${INK}`, paddingBottom: 6, marginBottom: 16 }}>
                    <span style={{ fontFamily: sans, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>Honours &amp; Awards</span>
                  </div>
                  {d.achievements.map((a, i) => (
                    <div key={i} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px dotted ${RULE}` }}>
                      <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2, marginBottom: 2 }}>{a.title}</div>
                      <div style={{ fontFamily: sans, fontSize: 10, color: RED, fontWeight: 700 }}>{a.year}</div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </Reveal>

        {/* Footer rule */}
        <div style={{ marginTop: 28 }}>
          <div style={{ height: 1, background: INK, marginBottom: 4 }} />
          <div style={{ height: 4, background: INK, marginBottom: 8 }} />
          <div style={{ fontFamily: sans, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, textAlign: 'center' }}>
            The Portfolio Gazette · Est. {new Date().getFullYear()} · All Rights Reserved
          </div>
        </div>
      </div>
    </div>
  );
};
