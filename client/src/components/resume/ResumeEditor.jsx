import React, { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';

const inputClass =
  'w-full bg-background text-white border-2 border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-accent transition-colors';
const textareaClass = `${inputClass} min-h-[80px] resize-y`;
const labelClass = 'block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5';

const Field = ({ label, children }) => (
  <div>
    <label className={labelClass}>{label}</label>
    {children}
  </div>
);

const emptyExperience = { role: '', company: '', startDate: '', endDate: '', description: '' };
const emptyEducation = { degree: '', field: '', institution: '', year: '', description: '' };
const emptyProject = { name: '', language: '', description: '' };
const emptyAchievement = { title: '', year: '', description: '' };

/**
 * ResumeEditor — Edits resume content independently of the main Profile.
 * A resume is often a trimmed/tailored version of a full profile (fewer
 * bullet points, different emphasis), so this operates on its own local
 * draft rather than writing back to /api/profile.
 */
export const ResumeEditor = ({ initialData, initialProjects, onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    headline: initialData?.headline || '',
    intro: initialData?.intro || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    location: initialData?.location || '',
    website: initialData?.links?.website || '',
    github: initialData?.links?.github || '',
    linkedin: initialData?.links?.linkedin || '',
    skillsText: (initialData?.skills || []).join(', '),
  });
  const [experience, setExperience] = useState(initialData?.experience?.length ? initialData.experience : [{ ...emptyExperience }]);
  const [education, setEducation] = useState(initialData?.education?.length ? initialData.education : [{ ...emptyEducation }]);
  const [projects, setProjects] = useState(initialProjects?.length ? initialProjects.map((p) => ({ name: p.name || '', language: p.language || '', description: p.description || '' })) : [{ ...emptyProject }]);
  const [achievements, setAchievements] = useState(initialData?.achievements?.length ? initialData.achievements : [{ ...emptyAchievement }]);

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const updateListItem = (list, setList, index, field, value) => {
    setList(list.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };
  const addListItem = (list, setList, template) => setList([...list, { ...template }]);
  const removeListItem = (list, setList, index) => setList(list.filter((_, i) => i !== index));

  const handleSave = () => {
    const resumeData = {
      name: form.name,
      headline: form.headline,
      intro: form.intro,
      email: form.email,
      phone: form.phone,
      location: form.location,
      skills: form.skillsText.split(',').map((s) => s.trim()).filter(Boolean),
      experience: experience.filter((e) => e.role || e.company || e.description),
      education: education.filter((e) => e.degree || e.institution),
      achievements: achievements.filter((a) => a.title),
      links: { website: form.website, github: form.github, linkedin: form.linkedin },
    };
    const resumeProjects = projects
      .filter((p) => p.name)
      .map((p, i) => ({ _id: `edited-${i}`, name: p.name, language: p.language, description: p.description }));
    onSave(resumeData, resumeProjects);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border-2 border-border p-6 shadow-[5px_5px_0px_0px_#141822] space-y-4">
        <h3 className="text-lg font-black uppercase tracking-tight border-b-2 border-border pb-2">Basics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Full name"><input className={inputClass} value={form.name} onChange={(e) => updateField('name', e.target.value)} /></Field>
          <Field label="Headline"><input className={inputClass} value={form.headline} onChange={(e) => updateField('headline', e.target.value)} placeholder="Software Engineer" /></Field>
          <Field label="Email"><input className={inputClass} value={form.email} onChange={(e) => updateField('email', e.target.value)} /></Field>
          <Field label="Phone"><input className={inputClass} value={form.phone} onChange={(e) => updateField('phone', e.target.value)} /></Field>
          <Field label="Location"><input className={inputClass} value={form.location} onChange={(e) => updateField('location', e.target.value)} /></Field>
          <Field label="Website"><input className={inputClass} value={form.website} onChange={(e) => updateField('website', e.target.value)} /></Field>
          <Field label="GitHub"><input className={inputClass} value={form.github} onChange={(e) => updateField('github', e.target.value)} /></Field>
          <Field label="LinkedIn"><input className={inputClass} value={form.linkedin} onChange={(e) => updateField('linkedin', e.target.value)} /></Field>
        </div>
        <Field label="Summary">
          <textarea className={textareaClass} value={form.intro} onChange={(e) => updateField('intro', e.target.value)} placeholder="2-3 sentences on who you are and what you build." />
        </Field>
        <Field label="Skills (comma-separated)">
          <input className={inputClass} value={form.skillsText} onChange={(e) => updateField('skillsText', e.target.value)} placeholder="React, Node.js, PostgreSQL" />
        </Field>
      </div>

      <div className="bg-card border-2 border-border p-6 shadow-[5px_5px_0px_0px_#141822] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-border pb-2">
          <h3 className="text-lg font-black uppercase tracking-tight">Experience</h3>
          <button onClick={() => addListItem(experience, setExperience, emptyExperience)} className="inline-flex items-center gap-1 bg-accent px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>
        {experience.map((exp, i) => (
          <div key={i} className="border-2 border-border/60 p-4 relative">
            {experience.length > 1 && (
              <button onClick={() => removeListItem(experience, setExperience, i)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive">
                <X className="h-4 w-4" />
              </button>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <Field label="Role"><input className={inputClass} value={exp.role} onChange={(e) => updateListItem(experience, setExperience, i, 'role', e.target.value)} /></Field>
              <Field label="Company"><input className={inputClass} value={exp.company} onChange={(e) => updateListItem(experience, setExperience, i, 'company', e.target.value)} /></Field>
              <Field label="Start date"><input className={inputClass} value={exp.startDate} onChange={(e) => updateListItem(experience, setExperience, i, 'startDate', e.target.value)} placeholder="2022" /></Field>
              <Field label="End date (blank = Present)"><input className={inputClass} value={exp.endDate} onChange={(e) => updateListItem(experience, setExperience, i, 'endDate', e.target.value)} /></Field>
            </div>
            <Field label="Description">
              <textarea className={textareaClass} value={exp.description} onChange={(e) => updateListItem(experience, setExperience, i, 'description', e.target.value)} />
            </Field>
          </div>
        ))}
      </div>

      <div className="bg-card border-2 border-border p-6 shadow-[5px_5px_0px_0px_#141822] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-border pb-2">
          <h3 className="text-lg font-black uppercase tracking-tight">Education</h3>
          <button onClick={() => addListItem(education, setEducation, emptyEducation)} className="inline-flex items-center gap-1 bg-accent px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>
        {education.map((edu, i) => (
          <div key={i} className="border-2 border-border/60 p-4 relative">
            {education.length > 1 && (
              <button onClick={() => removeListItem(education, setEducation, i)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive">
                <X className="h-4 w-4" />
              </button>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <Field label="Degree"><input className={inputClass} value={edu.degree} onChange={(e) => updateListItem(education, setEducation, i, 'degree', e.target.value)} placeholder="BSc" /></Field>
              <Field label="Field of study"><input className={inputClass} value={edu.field} onChange={(e) => updateListItem(education, setEducation, i, 'field', e.target.value)} placeholder="Computer Science" /></Field>
              <Field label="Institution"><input className={inputClass} value={edu.institution} onChange={(e) => updateListItem(education, setEducation, i, 'institution', e.target.value)} /></Field>
              <Field label="Year"><input className={inputClass} value={edu.year} onChange={(e) => updateListItem(education, setEducation, i, 'year', e.target.value)} /></Field>
            </div>
            <Field label="Description (optional — coursework, honors, etc.)">
              <textarea className={textareaClass} value={edu.description || ''} onChange={(e) => updateListItem(education, setEducation, i, 'description', e.target.value)} />
            </Field>
          </div>
        ))}
      </div>

      <div className="bg-card border-2 border-border p-6 shadow-[5px_5px_0px_0px_#141822] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-border pb-2">
          <h3 className="text-lg font-black uppercase tracking-tight">Achievements</h3>
          <button onClick={() => addListItem(achievements, setAchievements, emptyAchievement)} className="inline-flex items-center gap-1 bg-accent px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>
        <p className="text-xs text-muted-foreground -mt-2">Hackathons, awards, certifications, Dean's List, competitions — anything that stands on its own outside a job or class.</p>
        {achievements.map((ach, i) => (
          <div key={i} className="border-2 border-border/60 p-4 relative">
            {achievements.length > 1 && (
              <button onClick={() => removeListItem(achievements, setAchievements, i)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive">
                <X className="h-4 w-4" />
              </button>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <Field label="Title"><input className={inputClass} value={ach.title} onChange={(e) => updateListItem(achievements, setAchievements, i, 'title', e.target.value)} placeholder="1st Place, Campus Hackathon" /></Field>
              <Field label="Year"><input className={inputClass} value={ach.year} onChange={(e) => updateListItem(achievements, setAchievements, i, 'year', e.target.value)} placeholder="2025" /></Field>
            </div>
            <Field label="Description (optional)">
              <textarea className={textareaClass} value={ach.description} onChange={(e) => updateListItem(achievements, setAchievements, i, 'description', e.target.value)} />
            </Field>
          </div>
        ))}
      </div>

      <div className="bg-card border-2 border-border p-6 shadow-[5px_5px_0px_0px_#141822] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-border pb-2">
          <h3 className="text-lg font-black uppercase tracking-tight">Projects</h3>
          <button onClick={() => addListItem(projects, setProjects, emptyProject)} className="inline-flex items-center gap-1 bg-accent px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>
        {projects.map((project, i) => (
          <div key={i} className="border-2 border-border/60 p-4 relative">
            {projects.length > 1 && (
              <button onClick={() => removeListItem(projects, setProjects, i)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive">
                <X className="h-4 w-4" />
              </button>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <Field label="Project name"><input className={inputClass} value={project.name} onChange={(e) => updateListItem(projects, setProjects, i, 'name', e.target.value)} /></Field>
              <Field label="Primary language"><input className={inputClass} value={project.language} onChange={(e) => updateListItem(projects, setProjects, i, 'language', e.target.value)} /></Field>
            </div>
            <Field label="Description">
              <textarea className={textareaClass} value={project.description} onChange={(e) => updateListItem(projects, setProjects, i, 'description', e.target.value)} />
            </Field>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={handleSave} className="inline-flex items-center gap-2 bg-accent px-6 py-3 text-sm font-black uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_#141822]">
          <Save className="h-4 w-4" /> Save & Preview
        </button>
        <button onClick={onCancel} className="inline-flex items-center gap-2 border-2 border-border bg-secondary px-6 py-3 text-sm font-black uppercase tracking-widest text-foreground hover:bg-accent hover:text-white">
          Cancel
        </button>
      </div>
    </div>
  );
};
