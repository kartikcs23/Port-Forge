import React, { useState, useRef } from 'react';
import { EgyptianTheme } from '../components/themes/EgyptianTheme';

const GOLD  = '#FFD54A';
const CYAN  = '#4DEBFF';
const DARK  = '#15100a';
const DARK2 = '#1c1208';
const DARK3 = '#181208';
const PIX   = "'Press Start 2P', monospace";
const BODY  = "'Pixelify Sans', monospace";

/* ── shared input styles ── */
const inputSx = {
  width: '100%', boxSizing: 'border-box',
  background: DARK2, border: `2px solid ${GOLD}`,
  color: '#fff', fontFamily: BODY, fontSize: 16,
  padding: '10px 12px', outline: 'none',
};
const labelSx = {
  display: 'block', fontFamily: PIX, fontSize: 9,
  color: CYAN, letterSpacing: '0.15em', marginBottom: 6,
  textTransform: 'uppercase',
};
const sectionHeadSx = {
  fontFamily: PIX, fontSize: 10, color: GOLD,
  letterSpacing: '0.15em', marginBottom: 18,
  paddingBottom: 10, borderBottom: `2px solid ${DARK2}`,
};
const addBtnSx = {
  fontFamily: PIX, fontSize: 9, color: DARK, background: GOLD,
  border: 'none', padding: '10px 18px', cursor: 'pointer',
  letterSpacing: '0.1em', marginTop: 12,
};
const removeBtnSx = {
  fontFamily: PIX, fontSize: 8, color: GOLD, background: 'transparent',
  border: `1px solid ${GOLD}`, padding: '5px 10px', cursor: 'pointer',
  letterSpacing: '0.1em', flexShrink: 0,
};

/* ── Field wrapper ── */
const Field = ({ label, children }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={labelSx}>{label}</label>
    {children}
  </div>
);

/* ── Section card ── */
const Section = ({ title, children }) => (
  <div style={{ background: DARK3, padding: '22px 20px', marginBottom: 20, border: `1px solid ${DARK2}` }}>
    <div style={sectionHeadSx}>{title}</div>
    {children}
  </div>
);

/* ── default state ── */
const defaultProfile = {
  name: '', headline: '', bio: '',
  skills: [],
  experience: [],
  education: [],
  links: { github: '', linkedin: '', email: '' },
  resumeUrl: '',
};
const defaultRepo = () => ({ _id: Date.now().toString(), name: '', description: '', language: '', stars: 0, forks: 0, repoUrl: '' });
const defaultExp  = () => ({ role: '', company: '', startDate: '', endDate: '', description: '' });
const defaultEdu  = () => ({ degree: '', institution: '', year: '' });

export const EgyptianEditor = () => {
  const [tab,     setTab]     = useState('edit');
  const [profile, setProfile] = useState(defaultProfile);
  const [repos,   setRepos]   = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const skillInputRef = useRef(null);

  /* ── profile field helpers ── */
  const setField  = (k, v)    => setProfile(p => ({ ...p, [k]: v }));
  const setLink   = (k, v)    => setProfile(p => ({ ...p, links: { ...p.links, [k]: v } }));
  const setListItem = (list, i, k, v) =>
    setProfile(p => ({ ...p, [list]: p[list].map((item, idx) => idx === i ? { ...item, [k]: v } : item) }));
  const addListItem   = (list, tpl)  => setProfile(p => ({ ...p, [list]: [...p[list], tpl()] }));
  const removeListItem = (list, i)   => setProfile(p => ({ ...p, [list]: p[list].filter((_, idx) => idx !== i) }));

  /* ── skills chip helpers ── */
  const commitSkill = () => {
    const s = skillInput.trim().replace(/,+$/, '').trim();
    if (s && !profile.skills.includes(s)) setProfile(p => ({ ...p, skills: [...p.skills, s] }));
    setSkillInput('');
  };
  const onSkillKey = e => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); commitSkill(); }
    if (e.key === 'Backspace' && skillInput === '' && profile.skills.length > 0) {
      setProfile(p => ({ ...p, skills: p.skills.slice(0, -1) }));
    }
  };
  const removeSkill = s => setProfile(p => ({ ...p, skills: p.skills.filter(x => x !== s) }));

  /* ── repo helpers ── */
  const setRepoField = (i, k, v) =>
    setRepos(rs => rs.map((r, idx) => idx === i ? { ...r, [k]: v } : r));
  const addRepo    = () => setRepos(rs => [...rs, defaultRepo()]);
  const removeRepo = i  => setRepos(rs => rs.filter((_, idx) => idx !== i));

  /* ── tab switch ── */
  const switchTab = t => { setTab(t); window.scrollTo(0, 0); };

  /* ── Tab bar ── */
  const TabBar = () => (
    <div style={{
      display: 'flex', gap: 0,
      borderBottom: `3px solid ${GOLD}`,
      position: 'sticky', top: 0, zIndex: 200,
      background: DARK,
    }}>
      {[['edit', '✦ EDIT'], ['preview', '▶ PREVIEW']].map(([key, label]) => (
        <button key={key} onClick={() => switchTab(key)} style={{
          fontFamily: PIX, fontSize: 10, letterSpacing: '0.15em',
          padding: '14px 28px', border: 'none', cursor: 'pointer',
          background: tab === key ? GOLD : DARK2,
          color: tab === key ? DARK : GOLD,
          borderRight: `3px solid ${GOLD}`,
        }}>
          {label}
        </button>
      ))}
      <div style={{ flex: 1, background: DARK2 }} />
    </div>
  );

  /* ══════════════════════════════════════════════
     EDIT TAB
  ══════════════════════════════════════════════ */
  const EditTab = () => (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '32px 24px 80px' }}>

      {/* IDENTITY */}
      <Section title="01 · IDENTITY">
        <Field label="Name">
          <input style={inputSx} value={profile.name}
            placeholder="e.g. Nishit S K"
            onChange={e => setField('name', e.target.value)} />
        </Field>
        <Field label="Headline">
          <input style={inputSx} value={profile.headline}
            placeholder="e.g. Computer Science · Data & AI"
            onChange={e => setField('headline', e.target.value)} />
        </Field>
        <Field label="Bio / About">
          <textarea style={{ ...inputSx, minHeight: 90, resize: 'vertical' }}
            value={profile.bio}
            placeholder="A short description shown in the contact section..."
            onChange={e => setField('bio', e.target.value)} />
        </Field>
      </Section>

      {/* SKILLS */}
      <Section title="02 · SKILLS">
        <Field label="Add Skills (Enter or comma to add)">
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center',
            background: DARK2, border: `2px solid ${GOLD}`, padding: '8px 10px',
            cursor: 'text',
          }} onClick={() => skillInputRef.current?.focus()}>
            {profile.skills.map(s => (
              <span key={s} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(77,235,255,.12)', border: `1px solid ${CYAN}`,
                color: CYAN, fontFamily: BODY, fontSize: 14, padding: '4px 10px',
              }}>
                {s}
                <button onClick={e => { e.stopPropagation(); removeSkill(s); }} style={{
                  background: 'none', border: 'none', color: CYAN,
                  cursor: 'pointer', fontFamily: PIX, fontSize: 9, padding: 0, lineHeight: 1,
                }}>×</button>
              </span>
            ))}
            <input ref={skillInputRef}
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={onSkillKey}
              onBlur={commitSkill}
              placeholder={profile.skills.length === 0 ? 'Python, React, AWS...' : ''}
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: '#fff', fontFamily: BODY, fontSize: 15, minWidth: 120, flex: 1,
              }} />
          </div>
        </Field>
      </Section>

      {/* EXPERIENCE */}
      <Section title="03 · EXPERIENCE">
        {profile.experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: 20, padding: '16px', background: DARK, border: `1px solid ${GOLD}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontFamily: PIX, fontSize: 8, color: GOLD }}>ENTRY {i + 1}</span>
              <button style={removeBtnSx} onClick={() => removeListItem('experience', i)}>REMOVE</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Role">
                <input style={inputSx} value={exp.role} placeholder="e.g. Data Engineer"
                  onChange={e => setListItem('experience', i, 'role', e.target.value)} />
              </Field>
              <Field label="Company">
                <input style={inputSx} value={exp.company} placeholder="e.g. Acme Corp"
                  onChange={e => setListItem('experience', i, 'company', e.target.value)} />
              </Field>
              <Field label="Start Date">
                <input style={inputSx} value={exp.startDate} placeholder="e.g. 2022"
                  onChange={e => setListItem('experience', i, 'startDate', e.target.value)} />
              </Field>
              <Field label="End Date">
                <input style={inputSx} value={exp.endDate} placeholder="Present"
                  onChange={e => setListItem('experience', i, 'endDate', e.target.value)} />
              </Field>
            </div>
            <Field label="Description">
              <textarea style={{ ...inputSx, minHeight: 72, resize: 'vertical' }}
                value={exp.description} placeholder="What did you do?"
                onChange={e => setListItem('experience', i, 'description', e.target.value)} />
            </Field>
          </div>
        ))}
        <button style={addBtnSx} onClick={() => addListItem('experience', defaultExp)}>
          + ADD EXPERIENCE
        </button>
      </Section>

      {/* EDUCATION */}
      <Section title="04 · EDUCATION">
        {profile.education.map((edu, i) => (
          <div key={i} style={{ marginBottom: 16, padding: '16px', background: DARK, border: `1px solid ${GOLD}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontFamily: PIX, fontSize: 8, color: GOLD }}>ENTRY {i + 1}</span>
              <button style={removeBtnSx} onClick={() => removeListItem('education', i)}>REMOVE</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 12 }}>
              <Field label="Degree / Field">
                <input style={inputSx} value={edu.degree} placeholder="e.g. BSc Computer Science"
                  onChange={e => setListItem('education', i, 'degree', e.target.value)} />
              </Field>
              <Field label="Institution">
                <input style={inputSx} value={edu.institution} placeholder="e.g. Cairo University"
                  onChange={e => setListItem('education', i, 'institution', e.target.value)} />
              </Field>
              <Field label="Year">
                <input style={inputSx} value={edu.year} placeholder="2024"
                  onChange={e => setListItem('education', i, 'year', e.target.value)} />
              </Field>
            </div>
          </div>
        ))}
        <button style={addBtnSx} onClick={() => addListItem('education', defaultEdu)}>
          + ADD EDUCATION
        </button>
      </Section>

      {/* PROJECTS */}
      <Section title="05 · PROJECTS (TREASURY CARDS)">
        <p style={{ fontFamily: BODY, fontSize: 14, color: '#e6dcc4', marginTop: 0, marginBottom: 16 }}>
          First 3 entries appear as treasury cards. All entries appear in the guide section.
        </p>
        {repos.map((repo, i) => (
          <div key={repo._id} style={{ marginBottom: 16, padding: '16px', background: DARK, border: `1px solid ${GOLD}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontFamily: PIX, fontSize: 8, color: GOLD }}>PROJECT {i + 1}</span>
              <button style={removeBtnSx} onClick={() => removeRepo(i)}>REMOVE</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
              <Field label="Name">
                <input style={inputSx} value={repo.name} placeholder="e.g. Nile Data Platform"
                  onChange={e => setRepoField(i, 'name', e.target.value)} />
              </Field>
              <Field label="Language">
                <input style={inputSx} value={repo.language} placeholder="Python"
                  onChange={e => setRepoField(i, 'language', e.target.value)} />
              </Field>
            </div>
            <Field label="Description">
              <textarea style={{ ...inputSx, minHeight: 64, resize: 'vertical' }}
                value={repo.description} placeholder="What does this project do?"
                onChange={e => setRepoField(i, 'description', e.target.value)} />
            </Field>
            <Field label="Repo URL (optional)">
              <input style={inputSx} value={repo.repoUrl} placeholder="https://github.com/..."
                onChange={e => setRepoField(i, 'repoUrl', e.target.value)} />
            </Field>
          </div>
        ))}
        {repos.length < 6 && (
          <button style={addBtnSx} onClick={addRepo}>+ ADD PROJECT</button>
        )}
      </Section>

      {/* CONTACT */}
      <Section title="06 · CONTACT LINKS">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="GitHub URL">
            <input style={inputSx} value={profile.links.github} placeholder="https://github.com/..."
              onChange={e => setLink('github', e.target.value)} />
          </Field>
          <Field label="LinkedIn URL">
            <input style={inputSx} value={profile.links.linkedin} placeholder="https://linkedin.com/in/..."
              onChange={e => setLink('linkedin', e.target.value)} />
          </Field>
          <Field label="Email">
            <input style={inputSx} value={profile.links.email} placeholder="you@example.com"
              onChange={e => setLink('email', e.target.value)} />
          </Field>
          <Field label="Resume URL">
            <input style={inputSx} value={profile.resumeUrl} placeholder="/resume.pdf"
              onChange={e => setField('resumeUrl', e.target.value)} />
          </Field>
        </div>
      </Section>

      {/* Preview CTA */}
      <div style={{ textAlign: 'center', paddingTop: 12 }}>
        <button onClick={() => switchTab('preview')} style={{
          fontFamily: PIX, fontSize: 11, color: DARK, background: GOLD,
          border: `3px solid #fff`, padding: '16px 40px', cursor: 'pointer',
          boxShadow: `6px 6px 0 rgba(0,0,0,.5)`, letterSpacing: '0.15em',
        }}>
          ▶ PREVIEW THEME
        </button>
      </div>
    </div>
  );

  /* ══════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════ */
  return (
    <div style={{ minHeight: '100vh', background: DARK, color: GOLD, fontFamily: PIX }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&family=Press+Start+2P&display=swap');
        * { box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.25); font-family: ${BODY}; }
        input:focus, textarea:focus { border-color: ${CYAN} !important; }
        body { margin: 0; padding: 0; }
      `}</style>

      {/* Header */}
      {tab === 'edit' && (
        <div style={{
          background: DARK2, borderBottom: `3px solid ${GOLD}`,
          padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{ width: 10, height: 10, background: GOLD, transform: 'rotate(45deg)' }} />
          <span style={{ fontFamily: PIX, fontSize: 11, color: GOLD, letterSpacing: '0.2em' }}>
            EGYPTIAN THEME EDITOR
          </span>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: BODY, fontSize: 14, color: '#e6dcc4', opacity: 0.6 }}>
            local preview · no data saved
          </span>
        </div>
      )}

      <TabBar />

      {tab === 'edit' ? (
        <EditTab />
      ) : (
        <EgyptianTheme
          rootUser={null}
          profile={{
            ...profile,
            email: profile.links.email,
          }}
          repos={repos}
        />
      )}
    </div>
  );
};
