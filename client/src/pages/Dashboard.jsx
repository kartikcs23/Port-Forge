import React, { useEffect, useState, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { ProjectCard } from '../components/ProjectCard';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { usePortfolio } from '../hooks/usePortfolio';
import { useResume } from '../hooks/useResume';
import {
  Pencil,
  RefreshCw,
  Building2,
  Palmtree,
  Rocket,
  Cpu,
  Activity,
  FileUp,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { isLoaded } = useUser();
  const {
    loading,
    error,
    portfolio,
    projects,
    fetchPortfolio,
    generatePortfolio,
    togglePublish,
    syncGithub,
    fetchProjects,
    togglePin,
    updateTheme,
  } = usePortfolio();

  const {
    loading: resumeLoading,
    error: resumeError,
    extractedData,
    successMessage,
    uploadResume,
    reset: resetResume,
  } = useResume();

  const [syncStatus, setSyncStatus] = useState('');
  const [lastSynced, setLastSynced] = useState(null);
  const [githubLink, setGithubLink] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isLoaded) {
      fetchPortfolio();
      fetchProjects();
    }
  }, [isLoaded, fetchPortfolio, fetchProjects]);

  const handleSyncGithub = async () => {
    if (!githubLink) {
      alert("Please paste your GitHub link or username first!");
      return;
    }
    setSyncStatus('syncing-github');
    const result = await syncGithub(githubLink);
    if (result.success) {
      setSyncStatus('success');
      setLastSynced(new Date().toLocaleString());
      setTimeout(() => setSyncStatus(''), 3000);
      fetchProjects();
    } else {
      setSyncStatus('error');
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    const result = await uploadResume(resumeFile);
    if (result.success) {
      setShowPreview(true);
      fetchPortfolio(); // refresh portfolio if it existed
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      resetResume();
      setShowPreview(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      resetResume();
      setShowPreview(false);
    }
  };

  const handleGeneratePortfolio = async () => {
    const result = await generatePortfolio();
    if (result.success) {
      setSyncStatus('success');
      setTimeout(() => setSyncStatus(''), 3000);
      fetchPortfolio(); // Refresh portfolio state
    }
  };

  const handleTogglePublish = async () => {
    const result = await togglePublish();
    if (result.success) {
      setSyncStatus('success');
      setTimeout(() => setSyncStatus(''), 3000);
      fetchPortfolio(); // Refresh to get updated portfolio state
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-white font-sans text-ink">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-16 pt-24 md:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6 transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]">
              <h2 className="text-2xl font-black font-display uppercase tracking-tighter mb-6 border-b-2 border-ink pb-2">
                Profile Settings
              </h2>
              <button
                onClick={() => navigate('/profile-edit')}
                className="w-full bg-accent text-white px-6 py-3 font-bold uppercase text-xs border-2 border-accent shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all mb-4 flex items-center justify-center gap-2"
              >
                <Pencil className="w-4 h-4" /> EDIT PROFILE
              </button>
              <p className="text-xs font-bold uppercase tracking-widest text-muted text-center">
                Update your bio, avatar, and contact details
              </p>
            </div>

            {/* ── Resume Upload Card ── */}
            <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6 transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]">
              <h2 className="text-2xl font-black font-display uppercase tracking-tighter mb-6 border-b-2 border-ink pb-2 flex items-center gap-2">
                <FileUp className="w-5 h-5" /> Resume Upload
              </h2>

              {/* Dropzone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed border-ink p-6 text-center cursor-pointer transition-all ${
                  isDragging ? 'bg-accent/10 border-accent' : 'bg-background hover:bg-surface'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                {resumeFile ? (
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-left">
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-1">SELECTED FILE</span>
                      <span className="text-sm font-bold truncate max-w-[180px] block">{resumeFile.name}</span>
                      <span className="text-[10px] font-bold text-muted">{(resumeFile.size / 1024).toFixed(0)} KB</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setResumeFile(null); resetResume(); setShowPreview(false); }}
                      className="p-1 border-2 border-ink hover:bg-ink hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <FileUp className="w-8 h-8 mx-auto mb-2 text-muted" />
                    <p className="text-xs font-bold uppercase tracking-widest">Drop PDF here or click to browse</p>
                    <p className="text-[10px] font-bold text-muted mt-1">Max 5 MB</p>
                  </>
                )}
              </div>

              {/* Upload button */}
              <button
                onClick={handleResumeUpload}
                disabled={!resumeFile || resumeLoading}
                className={`w-full mt-3 flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs py-3 border-2 border-ink transition-all hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-40 ${
                  resumeLoading ? 'bg-ink text-white' : 'bg-surface text-ink'
                }`}
              >
                {resumeLoading
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> PARSING...</>
                  : <><FileUp className="w-4 h-4" /> UPLOAD &amp; PARSE</>}
              </button>

              {/* Error */}
              {resumeError && (
                <div className="mt-3 text-xs font-bold text-white uppercase bg-ink p-2 border-2 border-ink">
                  ERROR: {resumeError}
                </div>
              )}

              {/* Success + Preview toggle */}
              {successMessage && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase p-2 border-2 border-ink bg-background shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    <span className="flex-1">{successMessage}</span>
                    <button onClick={() => setShowPreview(!showPreview)} className="ml-auto">
                      {showPreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Extracted data preview */}
                  {showPreview && extractedData && (
                    <div className="border-2 border-t-0 border-ink p-4 bg-background space-y-4">

                      {extractedData.name && (
                        <div>
                          <span className="block text-[9px] font-black uppercase tracking-widest text-muted mb-1">NAME DETECTED</span>
                          <span className="text-sm font-bold">{extractedData.name}</span>
                        </div>
                      )}

                      {extractedData.email && (
                        <div>
                          <span className="block text-[9px] font-black uppercase tracking-widest text-muted mb-1">EMAIL</span>
                          <span className="text-xs font-bold">{extractedData.email}</span>
                        </div>
                      )}

                      {extractedData.skills?.length > 0 && (
                        <div>
                          <span className="block text-[9px] font-black uppercase tracking-widest text-muted mb-2">SKILLS FOUND ({extractedData.skills.length})</span>
                          <div className="flex flex-wrap gap-1">
                            {extractedData.skills.slice(0, 20).map((skill) => (
                              <span key={skill} className="text-[9px] font-black uppercase px-2 py-1 border-2 border-ink bg-surface shadow-[1px_1px_0px_0px_rgba(17,17,17,1)]">
                                {skill}
                              </span>
                            ))}
                            {extractedData.skills.length > 20 && (
                              <span className="text-[9px] font-black uppercase px-2 py-1 border-2 border-ink bg-accent text-white">
                                +{extractedData.skills.length - 20} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {extractedData.experience?.length > 0 && (
                        <div>
                          <span className="block text-[9px] font-black uppercase tracking-widest text-muted mb-2">EXPERIENCE ({extractedData.experience.length} entries)</span>
                          {extractedData.experience.map((exp, i) => (
                            <div key={i} className="text-xs font-bold mb-1 border-l-2 border-ink pl-2">
                              {exp.company}{exp.role ? ` — ${exp.role}` : ''}
                              {exp.startDate && <span className="text-muted ml-1 font-normal">{exp.startDate} – {exp.endDate || 'Present'}</span>}
                            </div>
                          ))}
                        </div>
                      )}

                      {extractedData.education?.length > 0 && (
                        <div>
                          <span className="block text-[9px] font-black uppercase tracking-widest text-muted mb-2">EDUCATION ({extractedData.education.length} entries)</span>
                          {extractedData.education.map((edu, i) => (
                            <div key={i} className="text-xs font-bold mb-1 border-l-2 border-ink pl-2">
                              {edu.institution}{edu.degree ? ` — ${edu.degree}` : ''}
                              {edu.year && <span className="text-muted ml-1 font-normal">{edu.year}</span>}
                            </div>
                          ))}
                        </div>
                      )}

                      {(extractedData.links?.github || extractedData.links?.linkedin) && (
                        <div>
                          <span className="block text-[9px] font-black uppercase tracking-widest text-muted mb-1">LINKS FOUND</span>
                          {extractedData.links.github && <div className="text-[10px] font-bold truncate">{extractedData.links.github}</div>}
                          {extractedData.links.linkedin && <div className="text-[10px] font-bold truncate">{extractedData.links.linkedin}</div>}
                        </div>
                      )}

                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted border-t-2 border-ink pt-3">
                        Data saved to your profile. Visit Profile Settings to review.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Command Center ── */}
            <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6 transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]">
              <h2 className="text-2xl font-black font-display uppercase tracking-tighter mb-6 border-b-2 border-ink pb-2">
                Command Center
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 border-b-2 border-ink pb-1 inline-block">
                    GitHub Link or Username
                  </label>
                  <input
                    type="text"
                    placeholder="https://github.com/username"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    className="w-full bg-background border-2 border-ink px-4 py-3 font-sans text-sm font-bold uppercase tracking-wide focus:outline-none focus:ring-none focus:bg-accent focus:text-white transition-colors"
                  />
                  <button
                    onClick={handleSyncGithub}
                    disabled={loading || !githubLink}
                    className={`w-full flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs mt-2 py-3 border-2 border-ink transition-transform hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${syncStatus === 'syncing-github' ? 'bg-ink text-white' : 'bg-surface text-ink'}`}
                  >
                    {syncStatus === 'syncing-github' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>⚙️</span>}
                    {syncStatus === 'syncing-github' ? 'SYNCING...' : 'SYNC GITHUB'}
                  </button>
                </div>
                <div className="pt-6 border-t-2 border-ink border-dashed">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-2">STATUS LOGGER</span>
                  {error && <div className="text-xs font-bold text-accent uppercase bg-ink text-white p-2 border-2 border-ink mb-2">ERROR: {error}</div>}
                  {syncStatus === 'success' && <div className="text-xs font-bold text-ink uppercase bg-surface p-2 border-2 border-ink mb-2 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">SYNC SUCCESSFUL</div>}
                  {lastSynced && <div className="text-[10px] font-bold text-ink uppercase">LAST SYNC: {lastSynced}</div>}
                </div>
              </div>
            </div>

            <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6 transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]">
              <h2 className="text-2xl font-black font-display uppercase tracking-tighter mb-6 border-b-2 border-ink pb-2">
                Portfolio Theme
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => updateTheme('brutalist')}
                  className={`p-4 border-2 border-ink flex items-center justify-between transition-all ${portfolio?.theme === 'brutalist' || !portfolio?.theme ? 'bg-accent text-white shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] translate-x-[-2px] translate-y-[-2px]' : 'bg-background hover:bg-surface'}`}
                >
                  <div className="text-left">
                    <span className="block text-[10px] font-black uppercase tracking-widest opacity-60">ARCHITECT</span>
                    <span className="block text-sm font-bold uppercase mt-1">Brutalist</span>
                  </div>
                  <Building2 className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => updateTheme('egyptian')}
                  className={`p-4 border-2 border-ink flex items-center justify-between transition-all ${portfolio?.theme === 'egyptian' ? 'bg-accent text-white shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] translate-x-[-2px] translate-y-[-2px]' : 'bg-background hover:bg-surface'}`}
                >
                  <div className="text-left">
                    <span className="block text-[10px] font-black uppercase tracking-widest opacity-60">MINIMALIST</span>
                    <span className="block text-sm font-bold uppercase mt-1">Luxor</span>
                  </div>
                  <Palmtree className={`w-5 h-5 ${portfolio?.theme === 'egyptian' ? 'text-white' : 'text-accent'}`} />
                </button>

                <button
                  onClick={() => updateTheme('space')}
                  className={`p-4 border-2 border-ink flex items-center justify-between transition-all ${portfolio?.theme === 'space' ? 'bg-accent text-white shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] translate-x-[-2px] translate-y-[-2px]' : 'bg-background hover:bg-surface'}`}
                >
                  <div className="text-left">
                    <span className="block text-[10px] font-black uppercase tracking-widest opacity-60">FUTURISTIC</span>
                    <span className="block text-sm font-bold uppercase mt-1">Nebula</span>
                  </div>
                  <Rocket className={`w-5 h-5 ${portfolio?.theme === 'space' ? 'text-white' : 'text-accent'}`} />
                </button>

                <button
                  onClick={() => updateTheme('tokyo')}
                  className={`p-4 border-2 border-ink flex items-center justify-between transition-all ${portfolio?.theme === 'tokyo' ? 'bg-accent text-white shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] translate-x-[-2px] translate-y-[-2px]' : 'bg-background hover:bg-surface'}`}
                >
                  <div className="text-left">
                    <span className="block text-[10px] font-black uppercase tracking-widest opacity-60">CYBERPUNK</span>
                    <span className="block text-sm font-bold uppercase mt-1">Tokyo</span>
                  </div>
                  <Cpu className={`w-5 h-5 ${portfolio?.theme === 'tokyo' ? 'text-white' : 'text-accent'}`} />
                </button>

                <button
                  onClick={() => updateTheme('medical')}
                  className={`p-4 border-2 border-ink flex items-center justify-between transition-all ${portfolio?.theme === 'medical' ? 'bg-accent text-white shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] translate-x-[-2px] translate-y-[-2px]' : 'bg-background hover:bg-surface'}`}
                >
                  <div className="text-left">
                    <span className="block text-[10px] font-black uppercase tracking-widest opacity-60">MEDICAL</span>
                    <span className="block text-sm font-bold uppercase mt-1">Asclepius</span>
                  </div>
                  <Activity className={`w-5 h-5 ${portfolio?.theme === 'medical' ? 'text-white' : 'text-accent'}`} />
                </button>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted mt-6 text-center">
                Select your digital signature
              </p>
            </div>

            <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6 transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]">
              <h2 className="text-2xl font-black font-display uppercase tracking-tighter mb-6 border-b-2 border-ink pb-2">
                Deployment
              </h2>
              {portfolio ? (
                <div className="space-y-4">
                  <div className="p-3 bg-background border-2 border-ink flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                    <span className="text-[10px] font-bold uppercase tracking-widest">STATE:</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 border-2 border-ink">
                      {portfolio.published ? 'LIVE' : 'DRAFT'}
                    </span>
                  </div>

                  <button
                    onClick={handleTogglePublish}
                    disabled={loading}
                    className="w-full font-bold uppercase tracking-widest text-xs py-4 border-2 border-ink transition-transform hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    {portfolio.published ? 'Take Offline' : 'Publish to web'}
                  </button>

                  {portfolio && portfolio.slug && (
                    <div className="mt-4 p-4 border-2 border-ink bg-ink text-white space-y-2">
                      <span className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-muted">LIVE URL</span>
                      <button
                        onClick={() => navigate(`/${portfolio.slug}`)}
                        className="block w-full bg-accent text-ink text-center px-3 py-2 font-bold text-[10px] uppercase hover:bg-white transition-colors border-2 border-accent"
                      >
                        VIEW PORTFOLIO
                      </button>
                      <div className="flex items-center justify-between gap-2 overflow-hidden border border-white/20 px-2 py-1">
                        <input
                          type="text"
                          readOnly
                          value={`portforge.app/${portfolio.slug}`}
                          className="bg-transparent border-none focus:outline-none focus:ring-0 flex-1 text-xs font-sans truncate py-1 selection:bg-accent min-w-0"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`portforge.app/${portfolio.slug}`);
                            setSyncStatus('success');
                            setTimeout(() => setSyncStatus(''), 2000);
                          }}
                          className="bg-white text-ink px-3 py-1 font-bold text-[10px] uppercase whitespace-nowrap hover:bg-accent hover:text-white transition-colors"
                        >
                          COPY LINK
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm font-bold uppercase tracking-widest mb-4">No portfolio generated yet.</p>
                  <button
                    onClick={handleGeneratePortfolio}
                    disabled={loading || projects.length === 0}
                    className="w-full bg-accent text-white font-bold uppercase tracking-widest text-xs py-4 border-2 border-ink transition-transform hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
                  >
                    Generate Portfolio
                  </button>
                  {projects.length === 0 && (
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-accent">Sync repositories first</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-8">
            <h2 className="text-4xl md:text-5xl font-black font-display uppercase tracking-tighter mb-8 border-b-4 border-ink pb-4">
              Your Repositories
            </h2>

            <div className="space-y-6">
              {(projects || []).map((project) => (
                <ProjectCard
                  key={project.repoId || project._id}
                  project={project}
                  onPin={togglePin}
                  loading={loading}
                />
              ))}

              {projects.length === 0 && !loading && (
                <div className="border-4 border-ink border-dashed p-12 text-center bg-surface rotate-1 group hover:rotate-0 transition-transform">
                  <div className="w-16 h-16 bg-background border-2 border-ink flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
                    <span className="text-2xl">?</span>
                  </div>
                  <h3 className="text-xl font-black font-display uppercase tracking-tight mb-2">NO DATABANKS FOUND</h3>
                  <p className="text-sm font-bold font-sans uppercase tracking-widest text-muted">AWAITING GITHUB SYNCHRONIZATION...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
