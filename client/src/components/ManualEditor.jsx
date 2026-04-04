import React, { useState, useEffect } from 'react';

const ManualEditor = ({ initialData, onSave, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    bio: '',
    experience: [],
    education: [],
    skills: [],
    links: {
      github: '',
      linkedin: ''
    }
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        avatar: initialData.avatar || '',
        bio: initialData.bio || '',
        experience: initialData.experience || [],
        education: initialData.education || [],
        skills: initialData.skills || [],
        links: initialData.links || { github: '', linkedin: '' }
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      links: { ...prev.links, [name]: value }
    }));
  };

  // Experience Handlers
  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { role: '', company: '', startDate: '', endDate: '', description: '' }]
    }));
  };

  const updateExperience = (index, field, value) => {
    const newExp = [...formData.experience];
    newExp[index][field] = value;
    setFormData(prev => ({ ...prev, experience: newExp }));
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // Education Handlers
  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', field: '', institution: '', year: '' }]
    }));
  };

  const updateEducation = (index, field, value) => {
    const newEdu = [...formData.education];
    newEdu[index][field] = value;
    setFormData(prev => ({ ...prev, education: newEdu }));
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-surface border-2 border-ink p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="border-b-2 border-ink pb-4 mb-6">
        <h2 className="text-2xl font-black uppercase tracking-tighter">Manual Profile Editor</h2>
        <p className="text-sm text-muted font-bold mt-1">Design your professional identity directly.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Nishit Kumar"
              className="w-full bg-background border-2 border-ink p-3 font-bold focus:ring-0 focus:border-accent outline-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted">Avatar URL</label>
            <input
              type="text"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full bg-background border-2 border-ink p-3 font-bold focus:ring-0 focus:border-accent outline-none transition-colors"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted">GitHub URL</label>
            <input
              type="text"
              name="github"
              value={formData.links.github}
              onChange={handleLinkChange}
              placeholder="https://github.com/..."
              className="w-full bg-background border-2 border-ink p-3 font-bold focus:ring-0 focus:border-accent outline-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted">LinkedIn URL</label>
            <input
              type="text"
              name="linkedin"
              value={formData.links.linkedin}
              onChange={handleLinkChange}
              placeholder="https://linkedin.com/in/..."
              className="w-full bg-background border-2 border-ink p-3 font-bold focus:ring-0 focus:border-accent outline-none transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted">Professional Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            placeholder="Tell us about your expertise..."
            className="w-full bg-background border-2 border-ink p-3 font-bold focus:ring-0 focus:border-accent outline-none transition-colors resize-none"
          />
        </div>

        {/* Experience Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-ink text-white p-3">
            <h3 className="text-sm font-black uppercase tracking-widest">Experience</h3>
            <button
              type="button"
              onClick={addExperience}
              className="bg-accent text-white px-3 py-1 font-black text-xs hover:bg-white hover:text-ink transition-colors border-2 border-transparent hover:border-ink"
            >
              + ADD ROLE
            </button>
          </div>

          <div className="space-y-6">
            {formData.experience.map((exp, idx) => (
              <div key={idx} className="border-l-4 border-ink pl-6 py-2 space-y-4 relative group">
                <button
                  type="button"
                  onClick={() => removeExperience(idx)}
                  className="absolute right-0 top-0 text-red-500 hover:text-red-700 font-black text-xs uppercase"
                >
                  [REMOVE]
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Role (e.g. Senior Dev)"
                    value={exp.role}
                    onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                    className="bg-transparent border-b-2 border-ink/20 p-2 font-bold focus:border-ink outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                    className="bg-transparent border-b-2 border-ink/20 p-2 font-bold focus:border-ink outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Start Date"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                    className="bg-transparent border-b-2 border-ink/20 p-2 font-bold focus:border-ink outline-none"
                  />
                  <input
                    type="text"
                    placeholder="End Date"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                    className="bg-transparent border-b-2 border-ink/20 p-2 font-bold focus:border-ink outline-none"
                  />
                </div>
                <textarea
                  placeholder="Description..."
                  value={exp.description}
                  onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                  rows={2}
                  className="w-full bg-transparent border-b-2 border-ink/20 p-2 font-medium focus:border-ink outline-none resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-ink text-white p-3">
            <h3 className="text-sm font-black uppercase tracking-widest">Education</h3>
            <button
              type="button"
              onClick={addEducation}
              className="bg-accent text-white px-3 py-1 font-black text-xs hover:bg-white hover:text-ink transition-colors border-2 border-transparent hover:border-ink"
            >
              + ADD DEGREE
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.education.map((edu, idx) => (
              <div key={idx} className="border-2 border-ink p-4 space-y-3 relative group bg-background shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
                <button
                  type="button"
                  onClick={() => removeEducation(idx)}
                  className="absolute -top-3 -right-3 bg-red-500 text-white w-6 h-6 flex items-center justify-center font-black rounded-full"
                >
                  ×
                </button>
                <input
                  type="text"
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                  className="w-full bg-transparent border-b-2 border-ink/10 p-1 font-black text-sm uppercase"
                />
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                  className="w-full bg-transparent border-b-2 border-ink/10 p-1 font-bold text-xs"
                />
                <input
                  type="text"
                  placeholder="Year"
                  value={edu.year}
                  onChange={(e) => updateEducation(idx, 'year', e.target.value)}
                  className="w-full bg-transparent border-b-2 border-ink/10 p-1 font-bold text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-white py-4 font-black uppercase tracking-[0.2em] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
        >
          {loading ? 'STORING_CHANGES...' : 'SAVE_PUBLIC_PROFILE_v3.0'}
        </button>
      </form>
    </div>
  );
};

export default ManualEditor;
