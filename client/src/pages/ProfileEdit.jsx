import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Plus, Save, Star, Trash2 } from 'lucide-react';
import { useAppUser } from '../hooks/useAppUser';
import { usePortfolio } from '../hooks/usePortfolio';
import api from '../utils/axios';
import { Navbar } from '../components/Navbar';

const emptyExperience = { company: '', role: '', startDate: '', endDate: '', description: '' };
const emptyEducation = { institution: '', degree: '', field: '', year: '' };

const Field = ({ label, children }) => (
  <label className="block space-y-2">
    <span className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
    {children}
  </label>
);

const inputClass = 'w-full border-2 border-border bg-background px-4 py-3 text-sm font-bold text-white outline-none transition-colors focus:border-accent';
const textareaClass = `${inputClass} min-h-28 resize-y leading-relaxed`;

export const ProfileEdit = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useAppUser();
  const {
    projects,
    loading,
    error,
    fetchProjects,
    togglePin,
    updateProject,
    toggleProjectVisibility,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState('profile');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingProjectId, setSavingProjectId] = useState(null);
  const [status, setStatus] = useState('');
  const [projectDrafts, setProjectDrafts] = useState({});
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
    experience: [],
    education: [],
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

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get('/api/profile/me');
      if (!res.data.success) return;

      const profile = res.data.data.profile || {};
      setFormData({
        name: profile.name || user?.fullName || '',
        intro: profile.intro || '',
        headline: profile.headline || '',
        bio: profile.bio || '',
        location: profile.location || '',
        email: profile.email || user?.emailAddresses?.[0]?.emailAddress || '',
        phone: profile.phone || '',
        website: profile.website || '',
        avatar: profile.avatar || profile.avatarUrl || '',
        skillsText: (profile.skills || []).join(', '),
        experience: profile.experience?.length ? profile.experience : [],
        education: profile.education?.length ? profile.education : [],
        links: {
          github: profile.links?.github || '',
          linkedin: profile.links?.linkedin || '',
          website: profile.links?.website || profile.website || '',
          twitter: profile.links?.twitter || '',
        },
      });
    } catch (err) {
      setStatus(err.response?.data?.message || err.message);
    }
  }, [user]);

  useEffect(() => {
    if (isLoaded) {
      fetchProfile();
      fetchProjects();
    }
  }, [isLoaded, fetchProfile, fetchProjects]);

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
        skills: formData.skillsText.split(',').map((skill) => skill.trim()).filter(Boolean),
        experience: formData.experience,
        education: formData.education,
        links: formData.links,
      };

      const res = await api.put('/api/profile/update', payload);
      setStatus(res.data.success ? 'Profile saved.' : res.data.message);
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
                <input className={inputClass} value={formData.name} onChange={(e) => updateField('name', e.target.value)} />
              </Field>
              <Field label="Avatar URL">
                <input className={inputClass} value={formData.avatar} onChange={(e) => updateField('avatar', e.target.value)} placeholder="https://..." />
              </Field>
              <Field label="Intro">
                <input className={inputClass} value={formData.intro} onChange={(e) => updateField('intro', e.target.value)} placeholder="Full-stack developer..." />
              </Field>
              <Field label="Headline">
                <input className={inputClass} value={formData.headline} onChange={(e) => updateField('headline', e.target.value)} placeholder="React, Node, AI systems" />
              </Field>
              <Field label="Location">
                <input className={inputClass} value={formData.location} onChange={(e) => updateField('location', e.target.value)} />
              </Field>
              <Field label="Email">
                <input className={inputClass} type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
              </Field>
              <Field label="Phone">
                <input className={inputClass} value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
              </Field>
              <Field label="Website">
                <input className={inputClass} value={formData.website} onChange={(e) => updateField('website', e.target.value)} />
              </Field>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="GitHub URL">
                <input className={inputClass} value={formData.links.github} onChange={(e) => updateLink('github', e.target.value)} />
              </Field>
              <Field label="LinkedIn URL">
                <input className={inputClass} value={formData.links.linkedin} onChange={(e) => updateLink('linkedin', e.target.value)} />
              </Field>
              <Field label="Portfolio / personal site URL">
                <input className={inputClass} value={formData.links.website} onChange={(e) => updateLink('website', e.target.value)} />
              </Field>
              <Field label="Twitter / X URL">
                <input className={inputClass} value={formData.links.twitter} onChange={(e) => updateLink('twitter', e.target.value)} />
              </Field>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6">
              <Field label="Bio">
                <textarea className={textareaClass} value={formData.bio} onChange={(e) => updateField('bio', e.target.value)} />
              </Field>
              <Field label="Skills, comma separated">
                <textarea className={textareaClass} value={formData.skillsText} onChange={(e) => updateField('skillsText', e.target.value)} placeholder="React, Node.js, MongoDB, Tailwind..." />
              </Field>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {formData.skillsText.split(',').map((skill) => skill.trim()).filter(Boolean).map((skill) => (
                <span key={skill} className="bg-accent px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                  {skill}
                </span>
              ))}
            </div>

            <button
              onClick={saveProfile}
              disabled={savingProfile}
              className="mt-8 inline-flex items-center gap-2 bg-accent px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-[5px_5px_0px_0px_#141822] disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> {savingProfile ? 'Saving...' : 'Save Profile'}
            </button>
          </section>
        )}

        {activeTab === 'timeline' && (
          <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <TimelineEditor
              title="Experience"
              items={formData.experience}
              template={emptyExperience}
              fields={['role', 'company', 'startDate', 'endDate', 'description']}
              onAdd={() => addListItem('experience', emptyExperience)}
              onRemove={(index) => removeListItem('experience', index)}
              onChange={(index, field, value) => updateListItem('experience', index, field, value)}
            />
            <TimelineEditor
              title="Education"
              items={formData.education}
              template={emptyEducation}
              fields={['institution', 'degree', 'field', 'year']}
              onAdd={() => addListItem('education', emptyEducation)}
              onRemove={(index) => removeListItem('education', index)}
              onChange={(index, field, value) => updateListItem('education', index, field, value)}
            />
            <div className="lg:col-span-2">
              <button
                onClick={saveProfile}
                disabled={savingProfile}
                className="inline-flex items-center gap-2 bg-accent px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-[5px_5px_0px_0px_#141822] disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> {savingProfile ? 'Saving...' : 'Save Timeline'}
              </button>
            </div>
          </section>
        )}

        {activeTab === 'projects' && (
          <section className="space-y-5">
            {projects.length === 0 && !loading && (
              <div className="border-2 border-border bg-card p-8 text-center text-sm font-bold uppercase tracking-widest text-muted-foreground">
                No GitHub projects found. Sync GitHub from the dashboard first.
              </div>
            )}

            {projects.map((project) => {
              const draft = projectDrafts[project._id] || {};
              return (
                <div key={project._id} className={`border-2 p-5 shadow-[5px_5px_0px_0px_#141822] ${project.hidden ? 'border-muted bg-card/50 opacity-70' : 'border-border bg-card'}`}>
                  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-2xl font-black uppercase tracking-tight text-white">{project.name}</h3>
                        {project.pinned && <span className="bg-primary px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white">Pinned</span>}
                        {project.hidden && <span className="bg-muted px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white">Hidden</span>}
                      </div>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Stars {project.stars || 0} · Forks {project.forks || 0}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => handleTogglePin(project._id)} className="inline-flex items-center gap-2 border-2 border-border bg-secondary px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-white">
                        <Star className="h-3 w-3" /> {project.pinned ? 'Unpin' : 'Pin'}
                      </button>
                      <button onClick={() => handleToggleVisibility(project._id)} className="inline-flex items-center gap-2 border-2 border-border bg-secondary px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-white">
                        {project.hidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {project.hidden ? 'Show' : 'Hide'}
                      </button>
                    </div>
                  </div>

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
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
};

const TimelineEditor = ({ title, items, fields, onAdd, onRemove, onChange }) => (
  <div className="bg-card border-2 border-border p-6 shadow-[8px_8px_0px_0px_#141822]">
    <div className="mb-5 flex items-center justify-between border-b-2 border-border pb-3">
      <h2 className="text-2xl font-black uppercase tracking-tight">{title}</h2>
      <button onClick={onAdd} className="inline-flex items-center gap-2 bg-accent px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white">
        <Plus className="h-3 w-3" /> Add
      </button>
    </div>

    <div className="space-y-5">
      {items.length === 0 && (
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">No {title.toLowerCase()} entries yet.</p>
      )}
      {items.map((item, index) => (
        <div key={index} className="border-2 border-border bg-background p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Entry {index + 1}</span>
            <button onClick={() => onRemove(index)} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent">
              <Trash2 className="h-3 w-3" /> Remove
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {fields.map((field) => (
              <Field key={field} label={field.replace(/([A-Z])/g, ' $1')}>
                {field === 'description' ? (
                  <textarea className={textareaClass} value={item[field] || ''} onChange={(e) => onChange(index, field, e.target.value)} />
                ) : (
                  <input className={inputClass} value={item[field] || ''} onChange={(e) => onChange(index, field, e.target.value)} />
                )}
              </Field>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
