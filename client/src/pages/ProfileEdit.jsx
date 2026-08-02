import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Eye, EyeOff, Plus, Save, Sparkles, Star, Trash2, X, Pencil } from 'lucide-react';
import { useAppUser } from '../hooks/useAppUser';
import { usePortfolio } from '../hooks/usePortfolio';
import api from '../utils/axios';
import { Navbar } from '../components/Navbar';
import { mergeAiRanking } from '../utils/aiRanking';

// Portfolio themes feature a "top 3" project slot — keep in sync with the
// server-side cap in server/controllers/profileController.js
const MAX_PINNED_PROJECTS = 3;

// Common tech skills for autocomplete suggestions
const COMMON_SKILLS = [
  'JavaScript','TypeScript','Python','Java','C++','C#','Go','Rust','PHP','Ruby','Swift','Kotlin',
  'React','Next.js','Vue.js','Angular','Svelte','Node.js','Express','NestJS','FastAPI','Django','Flask','Spring Boot','Laravel',
  'MongoDB','PostgreSQL','MySQL','Redis','Firebase','Supabase','Prisma','Mongoose',
  'GraphQL','REST API','gRPC','WebSockets','Docker','Kubernetes','AWS','GCP','Azure','Vercel','Netlify',
  'Git','GitHub','GitLab','CI/CD','Linux','Nginx','Tailwind CSS','CSS','HTML','SCSS',
  'React Native','Flutter','Expo','Android','iOS',
  'Machine Learning','TensorFlow','PyTorch','OpenAI','LangChain','Data Science','NumPy','Pandas',
  'Figma','UI/UX','Three.js','WebGL','Framer Motion',
];

// Professional job title suggestions (used by Intro + Headline autocomplete)
const ROLE_TITLES = [
  // ─── Cloud ────────────────────────────────────────────────────────────
  'Cloud Engineer','Cloud Solutions Architect','Cloud Infrastructure Engineer',
  'AWS Cloud Engineer','AWS Solutions Architect','AWS DevOps Engineer',
  'Google Cloud Engineer','GCP Solutions Architect','Azure Cloud Engineer',
  'Azure Solutions Architect','Multi-Cloud Engineer','Cloud Security Engineer',
  'Cloud Platform Engineer','Cloud Migration Engineer','Cloud Native Developer',
  'Cloud Operations Engineer','Serverless Developer','Cloud Data Engineer',
  'Cloud Networking Engineer','FinOps Cloud Engineer',
  // ─── Frontend ─────────────────────────────────────────────────────────
  'Frontend Developer','Frontend Engineer','React Developer','React.js Engineer',
  'Next.js Developer','Vue.js Developer','Angular Developer','UI Developer',
  'Web Developer','JavaScript Developer','TypeScript Developer',
  'Senior Frontend Engineer','Lead Frontend Developer',
  'Frontend Architect','CSS / Animation Engineer','Accessibility Engineer',
  // ─── Backend ──────────────────────────────────────────────────────────
  'Backend Developer','Backend Engineer','Node.js Developer','Python Developer',
  'Java Developer','Go Developer','Rust Developer','PHP Developer',
  'Django Developer','FastAPI Developer','Spring Boot Developer',
  'API Developer','Microservices Engineer','Database Engineer',
  'PostgreSQL Engineer','MongoDB Developer','Senior Backend Engineer',
  // ─── Full-stack ───────────────────────────────────────────────────────
  'Full-Stack Developer','Full-Stack Engineer','MERN Stack Developer',
  'MEAN Stack Developer','JAMstack Developer','Full-Stack JavaScript Developer',
  'Full-Stack Python Developer','Full-Stack Java Developer',
  'Software Engineer','Software Developer','Senior Software Engineer',
  'Principal Engineer','Staff Engineer','Lead Software Engineer',
  // ─── DevOps / SRE ─────────────────────────────────────────────────────
  'DevOps Engineer','Site Reliability Engineer','SRE','Platform Engineer',
  'Infrastructure Engineer','CI/CD Engineer','Kubernetes Engineer',
  'Docker Engineer','Terraform Engineer','Ansible Engineer',
  'GitOps Engineer','DevSecOps Engineer','Release Engineer',
  'Build & Release Engineer','Linux Systems Engineer',
  // ─── Data ─────────────────────────────────────────────────────────────
  'Data Engineer','Data Analyst','Data Scientist','Business Intelligence Developer',
  'ETL Developer','Spark Engineer','Kafka Engineer','BigQuery Engineer',
  'Snowflake Engineer','dbt Developer','Data Architect','Analytics Engineer',
  'SQL Developer','Database Administrator','NoSQL Engineer',
  // ─── AI / ML ──────────────────────────────────────────────────────────
  'Machine Learning Engineer','AI Engineer','Deep Learning Engineer',
  'NLP Engineer','Computer Vision Engineer','MLOps Engineer',
  'LLM Engineer','Generative AI Developer','AI Research Engineer',
  'Data Scientist','Applied ML Engineer','Reinforcement Learning Engineer',
  'AI Product Engineer','Prompt Engineer','LangChain Developer',
  // ─── Mobile ───────────────────────────────────────────────────────────
  'Mobile Developer','iOS Developer','Android Developer','React Native Developer',
  'Flutter Developer','Swift Developer','Kotlin Developer',
  'Cross-Platform Mobile Developer','Mobile UI Engineer',
  // ─── Security ─────────────────────────────────────────────────────────
  'Security Engineer','Cybersecurity Engineer','Application Security Engineer',
  'Penetration Tester','Security Analyst','SOC Analyst',
  'Cloud Security Architect','Network Security Engineer','DevSecOps Engineer',
  // ─── QA / Testing ─────────────────────────────────────────────────────
  'QA Engineer','Test Automation Engineer','SDET','Performance Engineer',
  'Quality Assurance Engineer','Manual QA Tester','QA Lead',
  // ─── Design / UX ──────────────────────────────────────────────────────
  'UI/UX Designer','Product Designer','UX Researcher','UX Engineer',
  'Design System Engineer','Creative Technologist','Interaction Designer',
  'Motion Designer','Frontend Designer',
  // ─── Management / Leadership ──────────────────────────────────────────
  'Engineering Manager','Tech Lead','CTO','VP of Engineering',
  'Product Manager','Scrum Master','Agile Coach','Solutions Engineer',
  'Technical Program Manager','Developer Advocate','Open Source Maintainer',
];

const emptyExperience = { company: '', role: '', startDate: '', endDate: '', description: '' };
const emptyEducation = { institution: '', degree: '', field: '', year: '', description: '' };
const emptyAchievement = { title: '', year: '', description: '' };

const Field = ({ label, children }) => (
  <label className="block space-y-1.5">
    <span className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
    {children}
  </label>
);

const inputClass = 'w-full border-2 border-border bg-background px-4 py-3 text-sm font-bold text-white outline-none transition-colors focus:border-accent';
const textareaClass = `${inputClass} min-h-28 resize-y leading-relaxed`;

/** Clickable chip shown under a field when a suggested value is available */
const SuggestionChip = ({ label, value, onUse }) => {
  if (!value || typeof value !== 'string' || !value.trim()) return null;
  const display = value.length > 40 ? value.substring(0, 40) + '…' : value;
  return (
    <button
      type="button"
      onClick={() => onUse(value)}
      title={value}
      className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-accent/40 text-accent bg-accent/10 hover:bg-accent hover:text-white transition-all"
    >
      <Sparkles className="h-2.5 w-2.5 shrink-0" />
      {label && <span className="text-white/50 mr-0.5">{label}:</span>}
      {display}
    </button>
  );
};

/** Skills autocomplete — shows matching suggestions while typing */
const SkillsAutocomplete = ({ value, onChange, extraSuggestions = [], disabled }) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  const allSkills = useMemo(() => {
    const combined = [...new Set([...COMMON_SKILLS, ...extraSuggestions])];
    return combined.sort();
  }, [extraSuggestions]);

  const currentSkills = useMemo(
    () => value.split(',').map((s) => s.trim()).filter(Boolean),
    [value]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allSkills
      .filter((s) => s.toLowerCase().includes(q) && !currentSkills.includes(s))
      .slice(0, 8);
  }, [query, allSkills, currentSkills]);

  const addSkill = (skill) => {
    if (disabled) return;
    const next = [...currentSkills, skill].join(', ');
    onChange(next);
    setQuery('');
    setOpen(false);
    inputRef.current?.focus();
  };

  const removeSkill = (skill) => {
    if (disabled) return;
    onChange(currentSkills.filter((s) => s !== skill).join(', '));
  };

  return (
    <div className="space-y-2">
      {/* Skill tags */}
      {currentSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {currentSkills.map((skill) => (
            <span key={skill} className="inline-flex items-center gap-1 bg-accent/20 border border-accent/40 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-accent">
              {skill}
              {!disabled && (
                <button type="button" onClick={() => removeSkill(skill)} className="hover:text-white">
                  <X className="h-2.5 w-2.5" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}
      {/* Type-to-search input */}
      <div className="relative">
        <input
          ref={inputRef}
          className={inputClass}
          value={query}
          disabled={disabled}
          placeholder={disabled ? '' : (currentSkills.length ? 'Type to add more skills…' : 'React, Node.js, MongoDB…')}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => query && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim()) {
              e.preventDefault();
              if (filtered.length) addSkill(filtered[0]);
              else addSkill(query.trim());
            }
            if (e.key === 'Backspace' && !query && currentSkills.length) {
              removeSkill(currentSkills[currentSkills.length - 1]);
            }
          }}
        />
        {open && filtered.length > 0 && (
          <ul className="absolute z-50 left-0 right-0 top-full mt-0.5 border-2 border-accent bg-card shadow-[4px_4px_0px_0px_#141822] max-h-52 overflow-y-auto">
            {filtered.map((skill) => (
              <li key={skill}>
                <button
                  type="button"
                  className="w-full px-4 py-2.5 text-left text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-colors"
                  onMouseDown={() => addSkill(skill)}
                >
                  {skill}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Hidden textarea keeps existing behavior / comma-string format */}
      <textarea className="sr-only" readOnly value={value} aria-hidden="true" />
    </div>
  );
};

/**
 * RoleAutocomplete — Typeahead for Intro / Headline fields.
 * Shows matching professional job titles from ROLE_TITLES as the user types.
 * Selecting a suggestion replaces the field value.
 */
const RoleAutocomplete = ({ value, onChange, placeholder, disabled }) => {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q || q.length < 2) return [];
    return ROLE_TITLES
      .filter((r) => r.toLowerCase().includes(q))
      .slice(0, 10);
  }, [value]);

  const select = (title) => {
    if (disabled) return;
    onChange(title);
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (disabled || !open || !filtered.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[activeIdx]) {
      e.preventDefault();
      select(filtered[activeIdx]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  // Reset active index whenever the filtered list changes
  useEffect(() => { setActiveIdx(0); }, [filtered]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const active = listRef.current.children[activeIdx];
      active?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIdx]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        className={inputClass}
        value={value}
        placeholder={placeholder}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => filtered.length && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        spellCheck={false}
      />
      {open && filtered.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 left-0 right-0 top-full mt-0.5 border-2 border-accent bg-card shadow-[4px_4px_0px_0px_#141822] max-h-60 overflow-y-auto"
        >
          {filtered.map((title, idx) => {
            // Highlight matched part
            const q = value.trim().toLowerCase();
            const lo = title.toLowerCase();
            const start = lo.indexOf(q);
            const end = start + q.length;
            const before = title.slice(0, start);
            const match  = title.slice(start, end);
            const after  = title.slice(end);
            return (
              <li key={title}>
                <button
                  type="button"
                  className={`w-full px-4 py-2.5 text-left text-xs font-bold tracking-wide transition-colors ${
                    idx === activeIdx ? 'bg-accent text-white' : 'hover:bg-accent/20'
                  }`}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onMouseDown={() => select(title)}
                >
                  {before}
                  <span className={idx === activeIdx ? 'underline' : 'text-accent font-black'}>{match}</span>
                  {after}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};


export const ProfileEdit = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useAppUser();
  const {
    projects,
    loading,
    error,
    aiRanking,
    fetchProjects,
    rankWithAI,
    togglePin,
    reorderPinned,
    updateProject,
    toggleProjectVisibility,
  } = usePortfolio();

  const pinnedCount = useMemo(() => projects.filter((p) => p.pinned).length, [projects]);
  // The user's explicit top picks — sorted by their own chosen order, not
  // score or AI rank. This is the definitive "top projects" list that
  // feeds the public portfolio.
  const pinnedProjects = useMemo(
    () => projects.filter((p) => p.pinned).sort((a, b) => (a.pinnedOrder ?? 0) - (b.pinnedOrder ?? 0)),
    [projects]
  );
  const rankedProjects = useMemo(() => mergeAiRanking(projects, aiRanking), [projects, aiRanking]);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [reordering, setReordering] = useState(false);

  const handleMovePinned = async (projectId, direction) => {
    const ids = pinnedProjects.map((p) => p._id);
    const index = ids.indexOf(projectId);
    const swapWith = index + direction;
    if (swapWith < 0 || swapWith >= ids.length) return;
    [ids[index], ids[swapWith]] = [ids[swapWith], ids[index]];
    setReordering(true);
    const result = await reorderPinned(ids);
    setStatus(result.success ? 'Top picks reordered.' : result.message);
    setReordering(false);
  };

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingProjectId, setSavingProjectId] = useState(null);
  const [status, setStatus] = useState('');
  const [projectDrafts, setProjectDrafts] = useState({});
  const [rawProfile, setRawProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    intro: '',
    headline: '',
    bio: '',
    location: '',
    email: '',
    phone: '',
    website: '',
    avatar: '',
    skillsText: '',
    cgpa: '',
    leetcode: '',
    hobbiesText: '',
    experience: [],
    education: [],
    achievements: [],
    links: {
      github: '',
      linkedin: '',
      website: '',
      twitter: '',
    },
  });

  const visibleProjectCount = useMemo(
    () => projects.filter((project) => !project.hidden).length,
    [projects]
  );

  // Guard so we only auto-fetch the profile once on mount, not on every re-render.
  const hasFetchedProfile = useRef(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get('/api/profile/me');
      if (!res.data.success) return;

      const profile = res.data.data.profile || {};
      setRawProfile(profile); // store raw for suggestion chips
      setFormData((prev) => ({
        ...prev,
        name: profile.name || prev.name || '',
        intro: profile.intro || '',
        headline: profile.headline || '',
        bio: profile.bio || '',
        location: profile.location || '',
        email: profile.email || prev.email || '',
        phone: profile.phone || '',
        website: profile.website || '',
        avatar: profile.avatar || profile.avatarUrl || '',
        skillsText: (profile.skills || []).join(', '),
        cgpa: profile.cgpa || '',
        leetcode: profile.leetcode || '',
        hobbiesText: (profile.hobbies || []).join(', '),
        experience: profile.experience?.length ? profile.experience : [],
        education: profile.education?.length ? profile.education : [],
        achievements: profile.achievements?.length ? profile.achievements : [],
        links: {
          github: profile.links?.github || '',
          linkedin: profile.links?.linkedin || '',
          website: profile.links?.website || profile.website || '',
          twitter: profile.links?.twitter || '',
        },
      }));
    } catch (err) {
      setStatus(err.response?.data?.message || err.message);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derive suggestion values from raw profile (GitHub/LinkedIn synced data)
  const suggestions = useMemo(() => {
    if (!rawProfile) return {};
    const li = rawProfile.linkedinData || {};
    return {
      name:     rawProfile.name || '',
      avatar:   rawProfile.avatar || '',
      bio:      li.summary || rawProfile.bio || '',
      intro:    rawProfile.bio || li.summary || '',
      headline: li.headline || rawProfile.headline || '',
      location: rawProfile.location || '',
      email:    rawProfile.email || user?.emailAddresses?.[0]?.emailAddress || '',
      website:  rawProfile.links?.website || rawProfile.website || '',
      github:   rawProfile.links?.github || '',
      linkedin: rawProfile.links?.linkedin || li.linkedinUrl || '',
      // LinkedIn skills as extra autocomplete options
      liSkills: Array.isArray(li.skills) ? li.skills : [],
    };
  }, [rawProfile, user]);

  useEffect(() => {
    if (isLoaded && !hasFetchedProfile.current) {
      hasFetchedProfile.current = true;
      fetchProfile();
      fetchProjects();
    }
  }, [isLoaded, fetchProfile, fetchProjects]);

  // Auto-run AI ranking once projects are loaded, same as the dashboard —
  // a cached result comes back near-instantly if this profile has already
  // been ranked, so it's safe to call unconditionally rather than needing
  // a manual trigger here too.
  const hasAutoRanked = useRef(false);
  useEffect(() => {
    if (!hasAutoRanked.current && projects.length > 0 && !aiRanking) {
      hasAutoRanked.current = true;
      rankWithAI();
    }
  }, [projects, aiRanking, rankWithAI]);

  useEffect(() => {
    const drafts = {};
    projects.forEach((project) => {
      drafts[project._id] = {
        name: project.name || '',
        description: project.description || '',
        language: project.language || project.languages?.[0] || '',
        repoUrl: project.repoUrl || project.url || '',
        score: project.score ?? 0,
      };
    });
    setProjectDrafts(drafts);
  }, [projects]);

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateLink = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      links: { ...prev.links, [name]: value },
    }));
  };

  const updateListItem = (listName, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [listName]: prev[listName].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addListItem = (listName, template) => {
    setFormData((prev) => ({ ...prev, [listName]: [...prev[listName], template] }));
  };

  const removeListItem = (listName, index) => {
    setFormData((prev) => ({
      ...prev,
      [listName]: prev[listName].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const saveProfile = async () => {
    setSavingProfile(true);
    setStatus('');
    try {
      const payload = {
        name: formData.name,
        avatar: formData.avatar,
        intro: formData.intro,
        headline: formData.headline,
        bio: formData.bio,
        location: formData.location,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        cgpa: formData.cgpa,
        leetcode: formData.leetcode,
        hobbies: formData.hobbiesText.split(',').map((hobby) => hobby.trim()).filter(Boolean),
        skills: formData.skillsText.split(',').map((skill) => skill.trim()).filter(Boolean),
        experience: formData.experience,
        education: formData.education,
        achievements: formData.achievements.filter((a) => a.title?.trim()),
        links: formData.links,
      };
      const res = await api.put('/api/profile/update', payload);
      if (res.data.success) {
        setStatus('✅ Profile saved successfully.');
        setIsEditing(false); // Lock the form after update
      } else {
        setStatus(res.data.message);
      }
    } catch (err) {
      setStatus(err.response?.data?.message || err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const updateProjectDraft = (projectId, field, value) => {
    setProjectDrafts((prev) => ({
      ...prev,
      [projectId]: { ...prev[projectId], [field]: value },
    }));
  };

  const saveProject = async (projectId) => {
    setSavingProjectId(projectId);
    setStatus('');
    const draft = projectDrafts[projectId];
    const result = await updateProject(projectId, {
      ...draft,
      score: Number(draft.score) || 0,
    });
    setStatus(result.success ? 'Project saved.' : result.message);
    setSavingProjectId(null);
  };

  const handleTogglePin = async (projectId) => {
    const result = await togglePin(projectId);
    setStatus(result.success ? 'Project pin updated.' : result.message);
  };

  const handleToggleVisibility = async (projectId) => {
    const result = await toggleProjectVisibility(projectId);
    setStatus(result.success ? 'Project visibility updated.' : result.message);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-10 pt-28 md:pt-32">
        <div className="mb-8 flex flex-col gap-4 border-b-4 border-border pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.45em] text-accent">Portfolio editor</p>
            <h1 className="mt-2 text-4xl md:text-6xl font-black uppercase tracking-tighter">
              Edit Content
            </h1>
            <p className="mt-3 max-w-2xl text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Update your public details, skills, timeline, and the GitHub projects used in your portfolio.
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="border-2 border-border bg-secondary px-5 py-3 text-xs font-black uppercase tracking-widest text-foreground hover:bg-accent hover:text-white"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
            ['profile', 'Profile', 'Bio and contact details'],
            ['timeline', 'Timeline', 'Experience and education'],
            ['projects', 'Projects', `${visibleProjectCount}/${projects.length} shown`],
          ].map(([id, label, helper]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`border-2 p-4 text-left transition-all ${
                activeTab === id
                  ? 'border-accent bg-accent text-white shadow-[5px_5px_0px_0px_#141822]'
                  : 'border-border bg-card hover:border-accent'
              }`}
            >
              <span className="block text-lg font-black uppercase tracking-tight">{label}</span>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-widest opacity-70">{helper}</span>
            </button>
          ))}
        </div>

        {(status || error) && (
          <div className="mb-6 border-2 border-border bg-card px-4 py-3 text-xs font-bold uppercase tracking-widest text-accent">
            {status || error}
          </div>
        )}

        {activeTab === 'profile' && (
          <section className="bg-card border-2 border-border p-6 md:p-8 shadow-[8px_8px_0px_0px_#141822]">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="Display name">
                <input disabled={!isEditing} className={inputClass} value={formData.name} onChange={(e) => updateField('name', e.target.value)} />
                {isEditing && <SuggestionChip label="GitHub" value={!formData.name ? suggestions.name : ''} onUse={(v) => updateField('name', v)} />}
              </Field>
              <Field label="Avatar URL">
                <input disabled={!isEditing} className={inputClass} value={formData.avatar} onChange={(e) => updateField('avatar', e.target.value)} placeholder="https://..." />
                {isEditing && <SuggestionChip label="GitHub avatar" value={!formData.avatar ? suggestions.avatar : ''} onUse={(v) => updateField('avatar', v)} />}
              </Field>
              <Field label="Intro">
                <RoleAutocomplete
                  value={formData.intro}
                  disabled={!isEditing}
                  onChange={(v) => updateField('intro', v)}
                  placeholder="Full-stack developer..."
                />
                {isEditing && <SuggestionChip label="From bio" value={!formData.intro ? suggestions.intro : ''} onUse={(v) => updateField('intro', v)} />}
              </Field>
              <Field label="Headline">
                <RoleAutocomplete
                  value={formData.headline}
                  disabled={!isEditing}
                  onChange={(v) => updateField('headline', v)}
                  placeholder="Cloud Engineer | AWS | DevOps"
                />
                {isEditing && <SuggestionChip label="LinkedIn" value={!formData.headline ? suggestions.headline : ''} onUse={(v) => updateField('headline', v)} />}
              </Field>
              <Field label="Location">
                <input disabled={!isEditing} className={inputClass} value={formData.location} onChange={(e) => updateField('location', e.target.value)} />
                {isEditing && <SuggestionChip label="GitHub" value={!formData.location ? suggestions.location : ''} onUse={(v) => updateField('location', v)} />}
              </Field>
              <Field label="Email">
                <input disabled={!isEditing} className={inputClass} type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
                {isEditing && <SuggestionChip label="Account" value={!formData.email ? suggestions.email : ''} onUse={(v) => updateField('email', v)} />}
              </Field>
              <Field label="Phone">
                <input disabled={!isEditing} className={inputClass} value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
              </Field>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="GitHub URL">
                <input disabled={!isEditing} className={inputClass} value={formData.links.github} onChange={(e) => updateLink('github', e.target.value)} />
                {isEditing && <SuggestionChip label="Synced" value={!formData.links.github ? suggestions.github : ''} onUse={(v) => updateLink('github', v)} />}
              </Field>
              <Field label="LinkedIn URL">
                <input disabled={!isEditing} className={inputClass} value={formData.links.linkedin} onChange={(e) => updateLink('linkedin', e.target.value)} />
                {isEditing && <SuggestionChip label="Synced" value={!formData.links.linkedin ? suggestions.linkedin : ''} onUse={(v) => updateLink('linkedin', v)} />}
              </Field>
              <Field label="Twitter / X URL">
                <input disabled={!isEditing} className={inputClass} value={formData.links.twitter} onChange={(e) => updateLink('twitter', e.target.value)} />
              </Field>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6">
              <Field label="Bio">
                <textarea disabled={!isEditing} className={textareaClass} value={formData.bio} onChange={(e) => updateField('bio', e.target.value)} />
                {isEditing && <SuggestionChip label="LinkedIn summary" value={!formData.bio ? suggestions.bio : ''} onUse={(v) => updateField('bio', v)} />}
              </Field>
              <Field label="Skills">
                <SkillsAutocomplete
                  value={formData.skillsText}
                  disabled={!isEditing}
                  onChange={(v) => updateField('skillsText', v)}
                  extraSuggestions={suggestions.liSkills || []}
                />
                {isEditing && suggestions.liSkills?.length > 0 && !formData.skillsText && (
                  <button
                    type="button"
                    onClick={() => updateField('skillsText', suggestions.liSkills.join(', '))}
                    className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-accent/40 text-accent bg-accent/10 hover:bg-accent hover:text-white transition-all"
                  >
                    <Sparkles className="h-2.5 w-2.5" />
                    Import all {suggestions.liSkills.length} LinkedIn skills
                  </button>
                )}
              </Field>
            </div>

            <div className="mt-8 border-t-2 border-border pt-6">
              <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Portfolio extras — used by some themes (Professional, Egyptian, Medical, Cinematic)
              </p>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field label="CGPA">
                  <input disabled={!isEditing} className={inputClass} value={formData.cgpa} onChange={(e) => updateField('cgpa', e.target.value)} placeholder="8.5 / 10" />
                </Field>
                <Field label="LeetCode handle or stat">
                  <input disabled={!isEditing} className={inputClass} value={formData.leetcode} onChange={(e) => updateField('leetcode', e.target.value)} placeholder="500+ solved" />
                </Field>
                <Field label="Hobbies (comma separated)">
                  <input disabled={!isEditing} className={inputClass} value={formData.hobbiesText} onChange={(e) => updateField('hobbiesText', e.target.value)} placeholder="Photography, Chess, Hiking" />
                </Field>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4 flex-wrap">
              {isEditing ? (
                <button
                  onClick={saveProfile}
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 bg-accent px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-[5px_5px_0px_0px_#141822] disabled:opacity-50"
                >
                  <Save className="h-4 w-4" /> {savingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              ) : (
                <button
                  onClick={() => { setIsEditing(true); setStatus(''); }}
                  className="inline-flex items-center gap-2 bg-accent px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-[5px_5px_0px_0px_#141822]"
                >
                  <Pencil className="h-4 w-4" /> Edit Profile
                </button>
              )}
              {status && (
                <span className="border-2 border-border bg-background px-4 py-3 text-xs font-bold uppercase tracking-widest text-accent shadow-[3px_3px_0px_0px_#141822]">
                  {status}
                </span>
              )}
            </div>
          </section>
        )}

        {activeTab === 'timeline' && (
          <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <TimelineEditor
              title="Experience"
              items={formData.experience}
              template={emptyExperience}
              fields={['role', 'company', 'startDate', 'endDate', 'description']}
              disabled={!isEditing}
              onAdd={() => addListItem('experience', emptyExperience)}
              onRemove={(index) => removeListItem('experience', index)}
              onChange={(index, field, value) => updateListItem('experience', index, field, value)}
            />
            <TimelineEditor
              title="Education"
              items={formData.education}
              template={emptyEducation}
              fields={['institution', 'degree', 'field', 'year', 'description']}
              disabled={!isEditing}
              onAdd={() => addListItem('education', emptyEducation)}
              onRemove={(index) => removeListItem('education', index)}
              onChange={(index, field, value) => updateListItem('education', index, field, value)}
            />
            <div className="lg:col-span-2">
              <TimelineEditor
                title="Achievements"
                items={formData.achievements}
                template={emptyAchievement}
                fields={['title', 'year', 'description']}
                disabled={!isEditing}
                onAdd={() => addListItem('achievements', emptyAchievement)}
                onRemove={(index) => removeListItem('achievements', index)}
                onChange={(index, field, value) => updateListItem('achievements', index, field, value)}
              />
            </div>
            <div className="lg:col-span-2 flex items-center gap-4 flex-wrap">
              {isEditing ? (
                <button
                  onClick={saveProfile}
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 bg-accent px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-[5px_5px_0px_0px_#141822] disabled:opacity-50"
                >
                  <Save className="h-4 w-4" /> {savingProfile ? 'Saving...' : 'Save Timeline'}
                </button>
              ) : (
                <button
                  onClick={() => { setIsEditing(true); setStatus(''); }}
                  className="inline-flex items-center gap-2 bg-accent px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-[5px_5px_0px_0px_#141822]"
                >
                  <Pencil className="h-4 w-4" /> Edit Timeline
                </button>
              )}
              {status && (
                <span className="border-2 border-border bg-background px-4 py-3 text-xs font-bold uppercase tracking-widest text-accent shadow-[3px_3px_0px_0px_#141822]">
                  {status}
                </span>
              )}
            </div>
          </section>
        )}

        {activeTab === 'projects' && (
          <section className="space-y-3">
            {projects.length === 0 && !loading && (
              <div className="border-2 border-border bg-card p-8 text-center text-sm font-bold uppercase tracking-widest text-muted-foreground">
                No GitHub projects found. Sync GitHub from the dashboard first.
              </div>
            )}

            {projects.length > 0 && (
              <div className="border-2 border-primary bg-card shadow-[5px_5px_0px_0px_#141822]">
                <div className="flex items-center justify-between px-5 py-3 border-b-2 border-border">
                  <span className="text-xs font-black uppercase tracking-widest text-white">
                    Your Top Picks <span className="text-primary">{pinnedCount}/{MAX_PINNED_PROJECTS}</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    You choose these — not the AI
                  </span>
                </div>

                {pinnedProjects.length === 0 ? (
                  <p className="px-5 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Nothing pinned yet. Hit "Pin" on up to {MAX_PINNED_PROJECTS} projects below to choose what leads your portfolio.
                  </p>
                ) : (
                  <div className="divide-y-2 divide-border">
                    {pinnedProjects.map((project, i) => (
                      <div key={project._id} className="flex items-center gap-3 px-5 py-3">
                        <span className="shrink-0 bg-primary text-white w-6 h-6 flex items-center justify-center text-xs font-black">{i + 1}</span>
                        <span className="text-sm font-black uppercase tracking-tight text-white flex-1 truncate">{project.name}</span>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => handleMovePinned(project._id, -1)}
                            disabled={reordering || i === 0}
                            title="Move up"
                            className="border-2 border-border bg-secondary p-1.5 hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <ChevronUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleMovePinned(project._id, 1)}
                            disabled={reordering || i === pinnedProjects.length - 1}
                            title="Move down"
                            className="border-2 border-border bg-secondary p-1.5 hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleTogglePin(project._id)}
                            title="Unpin"
                            className="border-2 border-border bg-secondary px-2 py-1 text-[9px] font-black uppercase tracking-widest hover:bg-accent hover:text-white"
                          >
                            Unpin
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {projects.length > 0 && (
              <p className="pt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                All projects {aiRanking && !aiRanking.aiUnavailable ? '· sorted by AI ranking as a starting point' : ''}
              </p>
            )}

            {rankedProjects.map((project) => {
              const draft = projectDrafts[project._id] || {};
              const pinDisabled = !project.pinned && pinnedCount >= MAX_PINNED_PROJECTS;
              const expanded = expandedProjectId === project._id;
              return (
                <div key={project._id} className={`border-2 shadow-[3px_3px_0px_0px_#141822] ${project.hidden ? 'border-muted bg-card/50 opacity-70' : 'border-border bg-card'}`}>
                  {/* Compact row — always visible */}
                  <div className="flex flex-wrap items-center gap-3 px-4 py-3">
                    {project.aiScore != null && (
                      <span className="shrink-0 bg-accent px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                        #{project.aiRank} · {project.aiScore}
                      </span>
                    )}
                    <h3 className="text-sm font-black uppercase tracking-tight text-white truncate">{project.name}</h3>
                    {project.pinned && <span className="shrink-0 bg-primary px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white">Pinned</span>}
                    {project.hidden && <span className="shrink-0 bg-muted px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white">Hidden</span>}
                    {project.aiTier && !project.hidden && (
                      <span className={`shrink-0 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${project.aiTier === 'featured' ? 'bg-primary text-white' : project.aiTier === 'recommended' ? 'border border-border text-foreground' : 'bg-muted text-white'}`}>
                        {project.aiTier}
                      </span>
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-auto shrink-0">
                      ★{project.stars || 0} ⑂{project.forks || 0}
                    </span>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => handleTogglePin(project._id)}
                        disabled={pinDisabled}
                        title={pinDisabled ? `Unpin another project first — max ${MAX_PINNED_PROJECTS}` : undefined}
                        className="inline-flex items-center gap-1 border-2 border-border bg-secondary px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-secondary disabled:hover:text-inherit"
                      >
                        <Star className="h-3 w-3" /> {project.pinned ? 'Unpin' : 'Pin'}
                      </button>
                      <button onClick={() => handleToggleVisibility(project._id)} className="inline-flex items-center gap-1 border-2 border-border bg-secondary px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest hover:bg-accent hover:text-white">
                        {project.hidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      </button>
                      <button
                        onClick={() => setExpandedProjectId(expanded ? null : project._id)}
                        className="inline-flex items-center gap-1 border-2 border-border bg-secondary px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest hover:bg-accent hover:text-white"
                      >
                        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />} Edit
                      </button>
                    </div>
                  </div>

                  {/* Expanded edit form */}
                  {expanded && (
                    <div className="border-t-2 border-border p-5">
                      {project.aiReason && (
                        <p className="mb-4 text-xs italic text-accent">AI: {project.aiReason}</p>
                      )}
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field label="Project name">
                          <input className={inputClass} value={draft.name || ''} onChange={(e) => updateProjectDraft(project._id, 'name', e.target.value)} />
                        </Field>
                        <Field label="Primary language">
                          <input className={inputClass} value={draft.language || ''} onChange={(e) => updateProjectDraft(project._id, 'language', e.target.value)} />
                        </Field>
                        <Field label="Repository URL">
                          <input className={inputClass} value={draft.repoUrl || ''} onChange={(e) => updateProjectDraft(project._id, 'repoUrl', e.target.value)} />
                        </Field>
                        <Field label="Score">
                          <input className={inputClass} type="number" min="0" max="100" value={draft.score ?? 0} onChange={(e) => updateProjectDraft(project._id, 'score', e.target.value)} />
                        </Field>
                        <div className="md:col-span-2">
                          <Field label="Description">
                            <textarea className={textareaClass} value={draft.description || ''} onChange={(e) => updateProjectDraft(project._id, 'description', e.target.value)} />
                          </Field>
                        </div>
                      </div>

                      <button
                        onClick={() => saveProject(project._id)}
                        disabled={savingProjectId === project._id}
                        className="mt-5 inline-flex items-center gap-2 bg-accent px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_#141822] disabled:opacity-50"
                      >
                        <Save className="h-4 w-4" /> {savingProjectId === project._id ? 'Saving...' : 'Save Project'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
};

const TimelineEditor = ({ title, items, fields, disabled, onAdd, onRemove, onChange }) => (
  <div className="bg-card border-2 border-border p-6 shadow-[8px_8px_0px_0px_#141822]">
    <div className="mb-5 flex items-center justify-between border-b-2 border-border pb-3">
      <h2 className="text-2xl font-black uppercase tracking-tight">{title}</h2>
      {!disabled && (
        <button onClick={onAdd} className="inline-flex items-center gap-2 bg-accent px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white">
          <Plus className="h-3 w-3" /> Add
        </button>
      )}
    </div>

    <div className="space-y-5">
      {items.length === 0 && (
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">No {title.toLowerCase()} entries yet.</p>
      )}
      {items.map((item, index) => (
        <div key={index} className="border-2 border-border bg-background p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Entry {index + 1}</span>
            {!disabled && (
              <button onClick={() => onRemove(index)} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent">
                <Trash2 className="h-3 w-3" /> Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3">
            {fields.map((field) => (
              <Field key={field} label={field.replace(/([A-Z])/g, ' $1')}>
                {field === 'description' ? (
                  <textarea disabled={disabled} className={textareaClass} value={item[field] || ''} onChange={(e) => onChange(index, field, e.target.value)} />
                ) : (
                  <input disabled={disabled} className={inputClass} value={item[field] || ''} onChange={(e) => onChange(index, field, e.target.value)} />
                )}
              </Field>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
