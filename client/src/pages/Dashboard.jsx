import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { ProjectCard } from '../components/ProjectCard';
import { useNavigate } from 'react-router-dom';
import { useAppUser } from '../hooks/useAppUser';
import { usePortfolio } from '../hooks/usePortfolio';
import { useResume } from '../hooks/useResume';
import { mergeAiRanking } from '../utils/aiRanking';
import api from '../utils/axios';
import {
  Pencil,
  RefreshCw,
  Building2,
  Palmtree,
  Rocket,
  Activity,
  GraduationCap,
  Clapperboard,
  FileUp,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
} from 'lucide-react';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { isLoaded } = useAppUser();
  const {
    loading,
    error,
    portfolio,
    projects,
    aiRanking,
    rankingLoading,
    fetchPortfolio,
    generatePortfolio,
    togglePublish,
    syncGithub,
    fetchProjects,
    rankWithAI,
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
  // Guards the auto-ranking effect below so it fires at most once per
  // mount — the backend cache makes repeat calls cheap, but there's no
  // reason to re-request on every projects-array change (e.g. pin/hide).
  const hasAutoRanked = useRef(false);

  useEffect(() => {
    if (isLoaded) {
      fetchPortfolio();
      fetchProjects();
      // Pre-populate the GitHub link input from the saved profile
      api.get('/api/profile/me').then((res) => {
        if (res.data.success) {
          const savedGithub = res.data.data.profile?.links?.github || '';
          if (savedGithub) setGithubLink(savedGithub);
        }
      }).catch(() => {});
    }
  }, [isLoaded, fetchPortfolio, fetchProjects]);

  // Auto-run AI ranking once projects are loaded. If this profile has
  // already been ranked and no repo has changed since, the backend serves
  // the cached result instantly with no AI call — so it's always safe to
  // call this rather than requiring a manual click.
  useEffect(() => {
    if (!hasAutoRanked.current && projects.length > 0 && !aiRanking) {
      hasAutoRanked.current = true;
      rankWithAI();
    }
  }, [projects, aiRanking, rankWithAI]);

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

  const handleRankWithAI = async () => {
    setSyncStatus('ranking');
    const result = await rankWithAI(githubLink || undefined);
    setSyncStatus(result.success ? 'ranked' : 'error');
    setTimeout(() => setSyncStatus(''), 3000);
  };

  // Merge the AI ranking's scores/tiers onto the synced project list and
  // sort by them once available. Falls back to the existing (heuristic
  // score) order from the backend until a ranking has been run.
  const rankedProjects = useMemo(() => mergeAiRanking(projects, aiRanking), [projects, aiRanking]);

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
    <div className="min-h-screen bg-background selection:bg-accent selection:text-white font-sans text-foreground">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-16 pt-24 md:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-card border-2 border-border shadow-[6px_6px_0px_0px_#141822] p-6 transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#141822]">
              <h2 className="text-2xl font-black font-display uppercase tracking-tighter mb-6 border-b-2 border-border pb-2">
                Profile Settings
              </h2>
              <button
                onClick={() => navigate('/profile-edit')}
                className="w-full bg-accent text-white px-6 py-3 font-bold uppercase text-xs border-2 border-accent shadow-[4px_4px_0px_0px_#141822] hover:shadow-[6px_6px_0px_0px_#141822] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all mb-4 flex items-center justify-center gap-2"
              >
                <Pencil className="w-4 h-4" /> EDIT CONTENT
              </button>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">
                Update profile details, skills, timeline, and project visibility
              </p>
            </div>

            <div className="bg-card border-2 border-border shadow-[6px_6px_0px_0px_#141822] p-6 transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#141822]">
              <h2 className="text-2xl font-black font-display uppercase tracking-tighter mb-6 border-b-2 border-border pb-2">
                Command Center
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 border-b-2 border-border pb-1 inline-block">
                    GitHub Link or Username
                  </label>
                  <input
                    type="text"
                    placeholder="https://github.com/username"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    className="w-full bg-background text-white border-2 border-border px-4 py-3 font-sans text-sm font-bold tracking-wide focus:outline-none focus:ring-none focus:bg-accent focus:text-white transition-colors"
                  />
                  <button
                    onClick={handleSyncGithub}
                    disabled={loading || !githubLink}
                    className={`w-full flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs mt-2 py-3 border-2 border-border transition-transform hover:shadow-[4px_4px_0px_0px_#141822] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${syncStatus === 'syncing-github' ? 'bg-primary text-white' : 'bg-secondary text-foreground'}`}
                  >
                    {syncStatus === 'syncing-github' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>⚙️</span>}
                    {syncStatus === 'syncing-github' ? 'SYNCING...' : 'SYNC GITHUB'}
                  </button>
                  <button
                    onClick={handleRankWithAI}
                    disabled={rankingLoading || projects.length === 0}
                    className={`w-full flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs mt-2 py-3 border-2 border-border transition-transform hover:shadow-[4px_4px_0px_0px_#141822] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 ${syncStatus === 'ranking' ? 'bg-primary text-white' : 'bg-accent text-white'}`}
                  >
                    {rankingLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {rankingLoading ? 'RANKING...' : 'RANK WITH AI'}
                  </button>
                  {projects.length === 0 && (
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-muted-foreground">Sync GitHub first</p>
                  )}
                </div>
                <div className="pt-6 border-t-2 border-border border-dashed">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">STATUS LOGGER</span>
                  {error && <div className="text-xs font-bold text-destructive bg-destructive/10 p-2 border-2 border-destructive mb-2">Error: {error}</div>}
                  {syncStatus === 'success' && <div className="text-xs font-bold text-primary uppercase bg-primary/10 p-2 border-2 border-primary mb-2 shadow-[2px_2px_0px_0px_#141822]">SYNC SUCCESSFUL</div>}
                  {syncStatus === 'ranked' && <div className="text-xs font-bold text-accent uppercase bg-accent/10 p-2 border-2 border-accent mb-2 shadow-[2px_2px_0px_0px_#141822]">AI RANKING COMPLETE{aiRanking?.cached ? ' (CACHED)' : ''}</div>}
                  {lastSynced && <div className="text-[10px] font-bold text-muted-foreground uppercase">LAST SYNC: {lastSynced}</div>}
                </div>
              </div>
            </div>

            <div className="bg-card border-2 border-border shadow-[6px_6px_0px_0px_#141822] p-6 transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#141822]">
              <h2 className="text-2xl font-black font-display uppercase tracking-tighter mb-6 border-b-2 border-border pb-2">
                Portfolio Theme
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => updateTheme('brutalist')}
                  className={`p-4 border-2 ${portfolio?.theme === 'brutalist' || !portfolio?.theme ? 'border-accent bg-accent text-white shadow-[4px_4px_0px_0px_#141822] translate-x-[-2px] translate-y-[-2px]' : 'border-border bg-background hover:bg-secondary/50 text-foreground'}`}
                >
                  <div className="text-left">
                    <span className="block text-[10px] font-black uppercase tracking-widest opacity-60">ARCHITECT</span>
                    <span className="block text-sm font-bold uppercase mt-1">Brutalist</span>
                  </div>
                  <Building2 className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => updateTheme('egyptian')}
                  className={`p-4 border-2 ${portfolio?.theme === 'egyptian' ? 'border-accent bg-accent text-white shadow-[4px_4px_0px_0px_#141822] translate-x-[-2px] translate-y-[-2px]' : 'border-border bg-background hover:bg-secondary/50 text-foreground'}`}
                >
                  <div className="text-left">
                    <span className="block text-[10px] font-black uppercase tracking-widest opacity-60">MINIMALIST</span>
                    <span className="block text-sm font-bold uppercase mt-1">Luxor</span>
                  </div>
                  <Palmtree className={`w-5 h-5 ${portfolio?.theme === 'egyptian' ? 'text-white' : 'text-accent'}`} />
                </button>

                <button
                  onClick={() => updateTheme('space')}
                  className={`p-4 border-2 ${portfolio?.theme === 'space' ? 'border-accent bg-accent text-white shadow-[4px_4px_0px_0px_#141822] translate-x-[-2px] translate-y-[-2px]' : 'border-border bg-background hover:bg-secondary/50 text-foreground'}`}
                >
                  <div className="text-left">
                    <span className="block text-[10px] font-black uppercase tracking-widest opacity-60">FUTURISTIC</span>
                    <span className="block text-sm font-bold uppercase mt-1">Nebula</span>
                  </div>
                  <Rocket className={`w-5 h-5 ${portfolio?.theme === 'space' ? 'text-white' : 'text-accent'}`} />
                </button>

                <button
                  onClick={() => updateTheme('medical')}
                  className={`p-4 border-2 ${portfolio?.theme === 'medical' ? 'border-accent bg-accent text-white shadow-[4px_4px_0px_0px_#141822] translate-x-[-2px] translate-y-[-2px]' : 'border-border bg-background hover:bg-secondary/50 text-foreground'}`}
                >
                  <div className="text-left">
                    <span className="block text-[10px] font-black uppercase tracking-widest opacity-60">MEDICAL</span>
                    <span className="block text-sm font-bold uppercase mt-1">Asclepius</span>
                  </div>
                  <Activity className={`w-5 h-5 ${portfolio?.theme === 'medical' ? 'text-white' : 'text-accent'}`} />
                </button>

                <button
                  onClick={() => updateTheme('professional')}
                  className={`p-4 border-2 ${portfolio?.theme === 'professional' ? 'border-accent bg-accent text-white shadow-[4px_4px_0px_0px_#141822] translate-x-[-2px] translate-y-[-2px]' : 'border-border bg-background hover:bg-secondary/50 text-foreground'}`}
                >
                  <div className="text-left">
                    <span className="block text-[10px] font-black uppercase tracking-widest opacity-60">EDITORIAL</span>
                    <span className="block text-sm font-bold uppercase mt-1">Professional</span>
                  </div>
                  <GraduationCap className={`w-5 h-5 ${portfolio?.theme === 'professional' ? 'text-white' : 'text-accent'}`} />
                </button>

                <button
                  onClick={() => updateTheme('cinematic')}
                  className={`p-4 border-2 ${portfolio?.theme === 'cinematic' ? 'border-accent bg-accent text-white shadow-[4px_4px_0px_0px_#141822] translate-x-[-2px] translate-y-[-2px]' : 'border-border bg-background hover:bg-secondary/50 text-foreground'}`}
                >
                  <div className="text-left">
                    <span className="block text-[10px] font-black uppercase tracking-widest opacity-60">CINEMATIC</span>
                    <span className="block text-sm font-bold uppercase mt-1">Sakura Journey</span>
                  </div>
                  <Clapperboard className={`w-5 h-5 ${portfolio?.theme === 'cinematic' ? 'text-white' : 'text-accent'}`} />
                </button>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-6 text-center">
                Select your digital signature
              </p>
            </div>

            <div className="bg-card border-2 border-border shadow-[6px_6px_0px_0px_#141822] p-6 transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#141822]">
              <h2 className="text-2xl font-black font-display uppercase tracking-tighter mb-6 border-b-2 border-border pb-2">
                Deployment
              </h2>
              {portfolio ? (
                <div className="space-y-4">
                  <div className="p-3 bg-background border-2 border-border flex items-center justify-between shadow-[2px_2px_0px_0px_#141822]">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">STATE:</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 border-2 border-border">
                      {portfolio.published ? 'LIVE' : 'DRAFT'}
                    </span>
                  </div>

                  <button
                    onClick={handleTogglePublish}
                    disabled={loading}
                    className="w-full font-bold uppercase tracking-widest text-xs py-4 border-2 border-border bg-secondary text-foreground transition-transform hover:shadow-[4px_4px_0px_0px_#141822] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    {portfolio.published ? 'Take Offline' : 'Publish to web'}
                  </button>

                  {portfolio && portfolio.slug && (
                    <div className="mt-4 p-4 border-2 border-border bg-background text-white space-y-2">
                      <span className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-muted-foreground">LIVE URL</span>
                      <button
                        onClick={() => navigate(`/${portfolio.slug}`)}
                        className="block w-full bg-accent text-white text-center px-3 py-2 font-bold text-[10px] uppercase hover:bg-white hover:text-ink transition-colors border-2 border-accent"
                      >
                        VIEW PORTFOLIO
                      </button>
                      <div className="flex items-center justify-between gap-2 overflow-hidden border border-border px-2 py-1 bg-card">
                        <input
                          type="text"
                          readOnly
                          value={`portforge.app/${portfolio.slug}`}
                          className="bg-transparent border-none focus:outline-none focus:ring-0 flex-1 text-xs font-sans truncate py-1 selection:bg-accent min-w-0 text-white"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`portforge.app/${portfolio.slug}`);
                            setSyncStatus('success');
                            setTimeout(() => setSyncStatus(''), 2000);
                          }}
                          className="bg-secondary text-foreground px-3 py-1 font-bold text-[10px] uppercase whitespace-nowrap hover:bg-accent hover:text-white transition-colors border border-border"
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
                    className="w-full bg-accent text-white font-bold uppercase tracking-widest text-xs py-4 border-2 border-accent transition-transform hover:shadow-[4px_4px_0px_0px_#141822] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
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
            <div className="flex items-center justify-between mb-8 border-b-4 border-border pb-4">
              <h2 className="text-4xl md:text-5xl font-black font-display uppercase tracking-tighter">
                Your Repositories
              </h2>
              {aiRanking && (
                <span className="bg-accent text-white px-3 py-1 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 shrink-0">
                  <Sparkles className="w-3 h-3" /> Ranked by AI
                </span>
              )}
            </div>

            <div className="space-y-6 max-h-[900px] overflow-y-auto pr-3 scrollbar-brutalist">
              {rankedProjects.map((project) => (
                <ProjectCard
                  key={project.repoId || project._id}
                  project={project}
                  onPin={togglePin}
                  loading={loading}
                />
              ))}

              {projects.length === 0 && !loading && (
                <div className="border-4 border-border border-dashed p-12 text-center bg-card rotate-1 group hover:rotate-0 transition-transform">
                  <div className="w-16 h-16 bg-background border-2 border-border flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-[4px_4px_0px_0px_#141822]">
                    <span className="text-2xl text-white">?</span>
                  </div>
                  <h3 className="text-xl font-black font-display uppercase tracking-tight mb-2 text-white">NO DATABANKS FOUND</h3>
                  <p className="text-sm font-bold font-sans uppercase tracking-widest text-muted-foreground">AWAITING GITHUB SYNCHRONIZATION...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
