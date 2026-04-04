import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import api from '../utils/axios';
import { Navbar } from '../components/Navbar';

export const ProfileEdit = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    avatar: null,
    intro: '',
    email: '',
    phone: '',
    website: '',
    experience: [],
    education: [],
    skills: [],
    links: {
      github: '',
      linkedin: '',
      website: '',
      twitter: '',
    },
  });

  useEffect(() => {
    if (isLoaded) {
      fetchProfile();
    }
  }, [isLoaded]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/profile/me');
      if (res.data.success) {
        const profile = res.data.data.profile;
        setFormData(prev => ({
          ...prev,
          bio: profile.bio || '',
          location: profile.location || '',
          intro: profile.intro || '',
          email: profile.email || user?.emailAddresses?.[0]?.emailAddress || '',
          phone: profile.phone || '',
          website: profile.website || '',
          experience: profile.experience || [],
          education: profile.education || [],
          skills: profile.skills || [],
          links: profile.links || {
            github: '',
            linkedin: '',
            website: '',
            twitter: '',
          },
        }));
        if (profile.avatarUrl) {
          setAvatarPreview(profile.avatarUrl);
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData(prev => ({ ...prev, avatar: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLinksChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      links: { ...prev.links, [name]: value }
    }));
  };

  const handleSkillsChange = (value) => {
    const skills = value.split(',').map(s => s.trim()).filter(s => s);
    setFormData(prev => ({ ...prev, skills }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = {
        bio: formData.bio,
        location: formData.location,
        intro: formData.intro,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        skills: formData.skills,
        links: formData.links,
      };

      const res = await api.put('/api/profile/update', updateData);
      if (res.data.success) {
        alert('Profile updated successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      alert('Failed to update profile: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  // Remove loading check - let content render normally

  return (
    <div className="min-h-screen bg-background text-ink font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-16 pt-32">
        <div className="bg-surface border-2 border-ink shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] p-8">
          <h1 className="text-4xl font-black font-display uppercase tracking-tighter mb-12 border-b-4 border-ink pb-6">
            Edit Profile
          </h1>

          <div className="space-y-12">
            {/* Avatar Section */}
            <div className="space-y-4">
              <label className="block text-sm font-black uppercase tracking-widest">Profile Avatar</label>
              <div className="flex gap-8 items-start">
                <div className="w-32 h-32 border-3 border-ink rounded-xl overflow-hidden bg-background flex items-center justify-center">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-black opacity-20">{user?.firstName?.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="block w-full text-sm border-2 border-ink p-2"
                  />
                  <p className="text-xs text-muted mt-2 font-bold uppercase">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-black uppercase tracking-widest">Intro / Headline</label>
                <input
                  type="text"
                  name="intro"
                  value={formData.intro}
                  onChange={handleInputChange}
                  placeholder="e.g., Full Stack Developer | React, Node.js"
                  className="w-full border-2 border-ink p-3 font-sans bg-background focus:outline-none focus:bg-accent focus:text-white uppercase"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-black uppercase tracking-widest">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., San Francisco, CA"
                  className="w-full border-2 border-ink p-3 font-sans bg-background focus:outline-none focus:bg-accent focus:text-white uppercase"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="block text-sm font-black uppercase tracking-widest">About / Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                className="w-full border-2 border-ink p-3 font-sans bg-background focus:outline-none focus:bg-accent focus:text-white h-32 resize-none"
              />
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase tracking-tighter border-b-2 border-ink pb-2">Contact Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-black uppercase tracking-widest">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border-2 border-ink p-3 font-sans bg-background focus:outline-none focus:bg-accent focus:text-white uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-black uppercase tracking-widest">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full border-2 border-ink p-3 font-sans bg-background focus:outline-none focus:bg-accent focus:text-white uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase tracking-tighter border-b-2 border-ink pb-2">Social Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-black uppercase tracking-widest">GitHub</label>
                  <input
                    type="url"
                    name="github"
                    value={formData.links.github}
                    onChange={handleLinksChange}
                    placeholder="https://github.com/username"
                    className="w-full border-2 border-ink p-3 font-sans bg-background focus:outline-none focus:bg-accent focus:text-white text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-black uppercase tracking-widest">LinkedIn</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.links.linkedin}
                    onChange={handleLinksChange}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full border-2 border-ink p-3 font-sans bg-background focus:outline-none focus:bg-accent focus:text-white text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-black uppercase tracking-widest">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.links.website}
                    onChange={handleLinksChange}
                    placeholder="https://yoursite.com"
                    className="w-full border-2 border-ink p-3 font-sans bg-background focus:outline-none focus:bg-accent focus:text-white text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-black uppercase tracking-widest">Twitter</label>
                  <input
                    type="url"
                    name="twitter"
                    value={formData.links.twitter}
                    onChange={handleLinksChange}
                    placeholder="https://twitter.com/username"
                    className="w-full border-2 border-ink p-3 font-sans bg-background focus:outline-none focus:bg-accent focus:text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <label className="block text-sm font-black uppercase tracking-widest">Tech Stack (comma-separated)</label>
              <textarea
                value={formData.skills.join(', ')}
                onChange={(e) => handleSkillsChange(e.target.value)}
                placeholder="React, Node.js, JavaScript, Python, MongoDB..."
                className="w-full border-2 border-ink p-3 font-sans bg-background focus:outline-none focus:bg-accent focus:text-white h-24 resize-none"
              />
              <div className="flex flex-wrap gap-2 mt-4">
                {formData.skills.map((skill, idx) => (
                  <span key={idx} className="bg-accent text-white px-3 py-1 font-bold text-xs uppercase">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-8 border-t-2 border-ink">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-accent text-white px-8 py-4 font-black text-sm uppercase border-2 border-accent shadow-[5px_5px_0px_0px_rgba(17,17,17,1)] hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-1 transition-all disabled:opacity-50"
              >
                {saving ? 'SAVING...' : '✓ SAVE CHANGES'}
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-white text-ink px-8 py-4 font-black text-sm uppercase border-2 border-ink shadow-[5px_5px_0px_0px_rgba(17,17,17,1)] hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-1 transition-all"
              >
                ← CANCEL
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
