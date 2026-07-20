import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { BrutalistTheme } from '../components/themes/BrutalistTheme';
import { EgyptianTheme } from '../components/themes/EgyptianTheme';
import { SpaceTheme } from '../components/themes/SpaceTheme';
import { MedicalTheme } from '../components/themes/MedicalTheme';
import { ProfessionalTheme } from '../components/themes/ProfessionalTheme';
import { CinematicTheme } from '../components/themes/CinematicTheme';

const THEMES = [
  { key: 'brutalist',    label: 'Architect',  sub: 'Brutalist',  Component: BrutalistTheme },
  { key: 'egyptian',     label: 'Luxor',      sub: 'Egyptian',   Component: EgyptianTheme },
  { key: 'space',        label: 'Nebula',     sub: 'Space',      Component: SpaceTheme },
  { key: 'medical',      label: 'Asclepius',  sub: 'Medical',    Component: MedicalTheme },
  { key: 'professional', label: 'Professional', sub: 'Editorial', Component: ProfessionalTheme },
  { key: 'cinematic',    label: 'Sakura Journey', sub: 'Cinematic', Component: CinematicTheme },
];

const defaultProfile = {
  name: '', headline: '', bio: '', intro: '', email: '', location: '', avatarUrl: '',
  skills: [], experience: [], education: [],
  links: { github: '', linkedin: '', twitter: '' },
  resumeUrl: '', leetcode: '', cgpa: '',
};
const defaultRepo = () => ({ _id: Date.now().toString() + Math.random().toString(36).slice(2), name: '', description: '', language: '', stars: 0, forks: 0, repoUrl: '' });
const defaultExp  = () => ({ role: '', company: '', startDate: '', endDate: '', description: '' });
const defaultEdu  = () => ({ degree: '', institution: '', year: '' });

const inputCx = 'w-full bg-background border-2 border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent';
const labelCx = 'block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2';
const sectionCx = 'border-2 border-border bg-card p-5 mb-5';
const sectionTitleCx = 'text-[11px] font-black uppercase tracking-widest text-accent mb-4 pb-3 border-b-2 border-border';
const addBtnCx = 'inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest border-2 border-accent text-accent px-4 py-2 hover:bg-accent hover:text-white transition-colors mt-2';
const removeBtnCx = 'inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest border-2 border-destructive text-destructive px-2 py-1 hover:bg-destructive hover:text-white transition-colors';

const Field = ({ label, children }) => (
  <div className="mb-4">
    <label className={labelCx}>{label}</label>
    {children}
  </div>
);

export const ThemeEditor = () => {
  const [themeKey, setThemeKey] = useState('brutalist');
  const [tab, setTab] = useState('edit');
  const [profile, setProfile] = useState(defaultProfile);
  const [repos, setRepos] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  const setField = (k, v) => setProfile((p) => ({ ...p, [k]: v }));
  const setLink  = (k, v) => setProfile((p) => ({ ...p, links: { ...p.links, [k]: v } }));
  const setListItem = (list, i, k, v) => setProfile((p) => ({ ...p, [list]: p[list].map((item, idx) => (idx === i ? { ...item, [k]: v } : item)) }));
  const addListItem = (list, tpl) => setProfile((p) => ({ ...p, [list]: [...p[list], tpl()] }));
  const removeListItem = (list, i) => setProfile((p) => ({ ...p, [list]: p[list].filter((_, idx) => idx !== i) }));

  const commitSkill = () => {
    const s = skillInput.trim().replace(/,+$/, '').trim();
    if (s && !profile.skills.includes(s)) setProfile((p) => ({ ...p, skills: [...p.skills, s] }));
    setSkillInput('');
  };
  const onSkillKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); commitSkill(); }
  };
  const removeSkill = (s) => setProfile((p) => ({ ...p, skills: p.skills.filter((x) => x !== s) }));

  const setRepoField = (i, k, v) => setRepos((rs) => rs.map((r, idx) => (idx === i ? { ...r, [k]: v } : r)));
  const addRepo = () => repos.length < 6 && setRepos((rs) => [...rs, defaultRepo()]);
  const removeRepo = (i) => setRepos((rs) => rs.filter((_, idx) => idx !== i));

  const switchTab = (t) => { setTab(t); window.scrollTo(0, 0); };

  const activeTheme = THEMES.find((t) => t.key === themeKey);
  const ActiveComponent = activeTheme.Component;

  if (tab === 'preview') {
    return (
      <div className="relative">
        <div className="fixed top-4 right-4 z-[1000] flex gap-2">
          <select
            value={themeKey}
            onChange={(e) => setThemeKey(e.target.value)}
            className="bg-background border-2 border-border text-foreground text-xs font-bold uppercase px-3 py-2 focus:outline-none focus:border-accent"
          >
            {THEMES.map((t) => (
              <option key={t.key} value={t.key}>{t.label} · {t.sub}</option>
            ))}
          </select>
          <button
            onClick={() => switchTab('edit')}
            className="inline-flex items-center gap-1.5 bg-foreground text-background text-xs font-black uppercase tracking-widest px-4 py-2 border-2 border-foreground"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Edit
          </button>
        </div>
        <ActiveComponent rootUser={null} profile={profile} repos={repos} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b-2 border-border bg-card sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-sm font-black uppercase tracking-widest">Template Editor</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Local preview · no data saved</p>
            </div>
          </div>
          <button
            onClick={() => switchTab('preview')}
            className="inline-flex items-center gap-1.5 bg-accent text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 border-2 border-accent hover:opacity-90"
          >
            Preview →
          </button>
        </div>

        {/* Theme picker */}
        <div className="max-w-4xl mx-auto px-6 pb-5 flex gap-2 flex-wrap">
          {THEMES.map((t) => (
            <button
              key={t.key}
              onClick={() => setThemeKey(t.key)}
              className={`px-3 py-2 border-2 text-left ${themeKey === t.key ? 'border-accent bg-accent text-white' : 'border-border bg-background hover:bg-secondary/50 text-foreground'}`}
            >
              <span className="block text-[9px] font-black uppercase tracking-widest opacity-60">{t.sub}</span>
              <span className="block text-xs font-bold uppercase mt-0.5">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* IDENTITY */}
        <div className={sectionCx}>
          <div className={sectionTitleCx}>01 · Identity</div>
          <Field label="Name">
            <input className={inputCx} value={profile.name} placeholder="e.g. Jordan Lee" onChange={(e) => setField('name', e.target.value)} />
          </Field>
          <Field label="Headline">
            <input className={inputCx} value={profile.headline} placeholder="e.g. Full-Stack Engineer" onChange={(e) => setField('headline', e.target.value)} />
          </Field>
          <Field label="Bio (short)">
            <textarea className={`${inputCx} min-h-[80px] resize-y`} value={profile.bio} placeholder="A short tagline shown near the hero..." onChange={(e) => setField('bio', e.target.value)} />
          </Field>
          <Field label="Intro (longer, optional)">
            <textarea className={`${inputCx} min-h-[80px] resize-y`} value={profile.intro} placeholder="A longer paragraph about you..." onChange={(e) => setField('intro', e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Location">
              <input className={inputCx} value={profile.location} placeholder="e.g. Bengaluru, India" onChange={(e) => setField('location', e.target.value)} />
            </Field>
            <Field label="Avatar URL (optional)">
              <input className={inputCx} value={profile.avatarUrl} placeholder="https://..." onChange={(e) => setField('avatarUrl', e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="LeetCode stat (Editorial theme)">
              <input className={inputCx} value={profile.leetcode} placeholder="500+" onChange={(e) => setField('leetcode', e.target.value)} />
            </Field>
            <Field label="CGPA (Editorial theme)">
              <input className={inputCx} value={profile.cgpa} placeholder="8.5" onChange={(e) => setField('cgpa', e.target.value)} />
            </Field>
          </div>
        </div>

        {/* SKILLS */}
        <div className={sectionCx}>
          <div className={sectionTitleCx}>02 · Skills</div>
          <Field label="Add skills (Enter or comma)">
            <div className="flex flex-wrap gap-2 items-center bg-background border-2 border-border px-3 py-2">
              {profile.skills.map((s) => (
                <span key={s} className="inline-flex items-center gap-1.5 bg-accent/10 border border-accent text-accent text-xs px-2.5 py-1">
                  {s}
                  <button onClick={() => removeSkill(s)} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={onSkillKey}
                onBlur={commitSkill}
                placeholder={profile.skills.length === 0 ? 'Python, React, AWS...' : ''}
                className="flex-1 min-w-[100px] bg-transparent outline-none text-sm text-foreground"
              />
            </div>
          </Field>
        </div>

        {/* EXPERIENCE */}
        <div className={sectionCx}>
          <div className={sectionTitleCx}>03 · Experience</div>
          {profile.experience.map((exp, i) => (
            <div key={i} className="border-2 border-border bg-background p-4 mb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Entry {i + 1}</span>
                <button className={removeBtnCx} onClick={() => removeListItem('experience', i)}>Remove</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Role"><input className={inputCx} value={exp.role} onChange={(e) => setListItem('experience', i, 'role', e.target.value)} /></Field>
                <Field label="Company"><input className={inputCx} value={exp.company} onChange={(e) => setListItem('experience', i, 'company', e.target.value)} /></Field>
                <Field label="Start Date"><input className={inputCx} value={exp.startDate} placeholder="2022" onChange={(e) => setListItem('experience', i, 'startDate', e.target.value)} /></Field>
                <Field label="End Date"><input className={inputCx} value={exp.endDate} placeholder="Present" onChange={(e) => setListItem('experience', i, 'endDate', e.target.value)} /></Field>
              </div>
              <Field label="Description">
                <textarea className={`${inputCx} min-h-[64px] resize-y`} value={exp.description} onChange={(e) => setListItem('experience', i, 'description', e.target.value)} />
              </Field>
            </div>
          ))}
          <button className={addBtnCx} onClick={() => addListItem('experience', defaultExp)}><Plus className="w-3.5 h-3.5" /> Add Experience</button>
        </div>

        {/* EDUCATION */}
        <div className={sectionCx}>
          <div className={sectionTitleCx}>04 · Education</div>
          {profile.education.map((edu, i) => (
            <div key={i} className="border-2 border-border bg-background p-4 mb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Entry {i + 1}</span>
                <button className={removeBtnCx} onClick={() => removeListItem('education', i)}>Remove</button>
              </div>
              <div className="grid grid-cols-[2fr_2fr_1fr] gap-3">
                <Field label="Degree"><input className={inputCx} value={edu.degree} placeholder="BSc Computer Science" onChange={(e) => setListItem('education', i, 'degree', e.target.value)} /></Field>
                <Field label="Institution"><input className={inputCx} value={edu.institution} onChange={(e) => setListItem('education', i, 'institution', e.target.value)} /></Field>
                <Field label="Year"><input className={inputCx} value={edu.year} placeholder="2024" onChange={(e) => setListItem('education', i, 'year', e.target.value)} /></Field>
              </div>
            </div>
          ))}
          <button className={addBtnCx} onClick={() => addListItem('education', defaultEdu)}><Plus className="w-3.5 h-3.5" /> Add Education</button>
        </div>

        {/* PROJECTS */}
        <div className={sectionCx}>
          <div className={sectionTitleCx}>05 · Projects ({repos.length}/6)</div>
          {repos.map((repo, i) => (
            <div key={repo._id} className="border-2 border-border bg-background p-4 mb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Project {i + 1}</span>
                <button className={removeBtnCx} onClick={() => removeRepo(i)}>Remove</button>
              </div>
              <div className="grid grid-cols-[2fr_1fr] gap-3">
                <Field label="Name"><input className={inputCx} value={repo.name} onChange={(e) => setRepoField(i, 'name', e.target.value)} /></Field>
                <Field label="Language"><input className={inputCx} value={repo.language} placeholder="Python" onChange={(e) => setRepoField(i, 'language', e.target.value)} /></Field>
              </div>
              <Field label="Description">
                <textarea className={`${inputCx} min-h-[60px] resize-y`} value={repo.description} onChange={(e) => setRepoField(i, 'description', e.target.value)} />
              </Field>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Stars"><input className={inputCx} value={repo.stars} onChange={(e) => setRepoField(i, 'stars', Number(e.target.value) || 0)} /></Field>
                <Field label="Forks"><input className={inputCx} value={repo.forks} onChange={(e) => setRepoField(i, 'forks', Number(e.target.value) || 0)} /></Field>
                <Field label="Repo URL"><input className={inputCx} value={repo.repoUrl} placeholder="https://github.com/..." onChange={(e) => setRepoField(i, 'repoUrl', e.target.value)} /></Field>
              </div>
            </div>
          ))}
          {repos.length < 6 && (
            <button className={addBtnCx} onClick={addRepo}><Plus className="w-3.5 h-3.5" /> Add Project</button>
          )}
        </div>

        {/* CONTACT */}
        <div className={sectionCx}>
          <div className={sectionTitleCx}>06 · Contact</div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="GitHub URL"><input className={inputCx} value={profile.links.github} placeholder="https://github.com/..." onChange={(e) => setLink('github', e.target.value)} /></Field>
            <Field label="LinkedIn URL"><input className={inputCx} value={profile.links.linkedin} placeholder="https://linkedin.com/in/..." onChange={(e) => setLink('linkedin', e.target.value)} /></Field>
            <Field label="Twitter / X URL"><input className={inputCx} value={profile.links.twitter} placeholder="https://x.com/..." onChange={(e) => setLink('twitter', e.target.value)} /></Field>
            <Field label="Email"><input className={inputCx} value={profile.email} placeholder="you@example.com" onChange={(e) => setField('email', e.target.value)} /></Field>
            <Field label="Resume URL"><input className={inputCx} value={profile.resumeUrl} placeholder="/resume.pdf" onChange={(e) => setField('resumeUrl', e.target.value)} /></Field>
          </div>
        </div>

        <button
          onClick={() => switchTab('preview')}
          className="w-full bg-foreground text-background text-sm font-black uppercase tracking-widest py-4 border-2 border-foreground hover:opacity-90"
        >
          Preview {activeTheme.label} →
        </button>
      </div>
    </div>
  );
};
