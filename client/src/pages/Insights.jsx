import React, { useEffect, useState, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { useInsights } from '../hooks/useInsights';
import { Loader3D } from '../components/Loader3D';
import { ContributionHeatmap } from '../components/ContributionHeatmap';

const CACHE_KEY = 'pf_insights_cache';

export const Insights = () => {
  const { loading, error, data, fetchInsights } = useInsights();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [cachedData, setCachedData] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || null; } catch { return null; }
  });
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const loadData = async () => {
      // Only show full-screen loader on first-ever visit (no cache)
      if (!cachedData) setIsAnalyzing(true);
      const result = await fetchInsights();
      if (result?.success && result?.data) {
        setCachedData(result.data);
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(result.data)); } catch {}
      }
      setIsAnalyzing(false);
    };
    loadData();
  }, [fetchInsights, cachedData]);

  const handleReanalyze = async () => {
    setIsAnalyzing(true);
    const result = await fetchInsights();
    if (result?.success && result?.data) {
      setCachedData(result.data);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(result.data)); } catch {}
    }
    setIsAnalyzing(false);
  };

  // Show loader only when no cached data and actively fetching
  if (isAnalyzing && !cachedData) {
    return <Loader3D message="Analyzing your profile..." />;
  }

  const display = data || cachedData;

  const projectScores = display?.analysis?.projectScores || [];
  const badges = display?.analysis?.badges || {};
  const timelineEvents = display?.analysis?.timeline || [];
  const features = display?.analysis?.features || {};
  const githubProfile = display?.github?.profile || {};
  const linkedinData = display?.linkedin || {};
  const contributions = display?.github?.contributions || [];

  const badgeDescriptions = {
    'Night Owl': '10+ commits after midnight',
    'Polyglot': '5+ programming languages',
    'Bug Slayer': 'Closed 10+ issues',
    'Project Hopper': 'Contributed to 8+ repos',
  };

  const badgeStyles = {
    'Night Owl': 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white',
    'Polyglot': 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white',
    'Bug Slayer': 'bg-gradient-to-r from-rose-500 to-orange-500 text-white',
    'Project Hopper': 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white',
  };

  const badgeIcons = {
    'Night Owl': '🌙',
    'Polyglot': '🧠',
    'Bug Slayer': '🛡️',
    'Project Hopper': '🚀',
  };

  const projectLimit = 8;
  const visibleProjects = showAllProjects ? projectScores : projectScores.slice(0, projectLimit);

  // Calculate profile completion
  const profileCompleteness = {
    github: githubProfile.bio ? 50 : 0,
    linkedin: (linkedinData.positions?.length > 0 ? 25 : 0) + (linkedinData.education?.length > 0 ? 25 : 0),
  };
  const totalCompleteness = profileCompleteness.github + profileCompleteness.linkedin;

  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-white font-sans text-foreground">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10 md:py-16 pt-24 md:pt-28">
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b-2 border-border pb-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight text-white">Insights</h1>
              <p className="text-muted-foreground font-sans text-lg mt-2">
                ML-powered analysis of your GitHub & LinkedIn profiles.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={handleReanalyze}
                disabled={isAnalyzing}
                className="bg-accent text-white border-2 border-border px-6 py-3 font-black uppercase tracking-widest text-xs hover:bg-accent/80 transition-colors shadow-[4px_4px_0px_0px_#141822] disabled:opacity-50"
              >
                {isAnalyzing ? 'ANALYZING...' : 'REANALYZE'}
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div className="bg-accent text-white border-2 border-accent p-4 mb-8 font-bold uppercase text-sm">
            ERROR: {error}
          </div>
        )}

        {/* Background refresh indicator */}
        {isAnalyzing && display && (
          <div className="fixed bottom-4 right-4 z-50 bg-card text-white border-2 border-accent px-4 py-2 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(235,59,59,0.4)] animate-pulse">
            ⟳ Refreshing...
          </div>
        )}

        {!display ? (
          <div className="bg-card border-2 border-border shadow-[6px_6px_0px_0px_#141822] p-8 text-center">
            <p className="text-muted-foreground font-sans text-lg">No analysis data available yet.</p>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2">Sync your GitHub first in the Dashboard.</p>
          </div>
        ) : (
          <section className="space-y-8">
            <ContributionHeatmap contributions={contributions} />

            {/* Project Scores */}
            <div className="bg-card border-2 border-border shadow-[6px_6px_0px_0px_#141822] p-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 border-b-2 border-border pb-4">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-white">Project Score</h2>
                  <p className="text-muted-foreground font-sans text-sm mt-1">
                    Difficulty tiering for recruiters and automated evaluation.
                  </p>
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Easy · Normal · Hard
                </div>
              </div>

              {projectScores.length === 0 ? (
                <p className="text-muted-foreground font-sans text-sm">No project scoring data available yet.</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {visibleProjects.map((project) => {
                      const scorePercent = Math.round(project.score * 100);
                      return (
                        <div key={project.name} className="border-2 border-border bg-background p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-sm font-black uppercase tracking-tight text-white">{project.name}</div>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 border-2 ${
                              project.difficulty === 'Hard'
                                ? 'border-border bg-secondary text-white'
                                : project.difficulty === 'Normal'
                                  ? 'border-accent bg-accent text-white'
                                  : 'border-border bg-card text-foreground'
                            }`}>
                              {project.difficulty}
                            </span>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            <span>Score</span>
                            <span>{scorePercent}</span>
                          </div>
                          <div className="mt-2 h-2 border-2 border-border bg-secondary">
                            <div
                              className="h-full bg-accent"
                              style={{ width: `${Math.min(100, Math.max(5, scorePercent))}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {projectScores.length > projectLimit && (
                    <button
                      onClick={() => setShowAllProjects((prev) => !prev)}
                      className="mt-4 border-2 border-border bg-secondary px-4 py-2 font-black uppercase tracking-widest text-xs text-white hover:bg-accent transition-colors"
                    >
                      {showAllProjects ? 'Show fewer projects' : `Show all projects (${projectScores.length})`}
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Badges */}
            <div className="bg-card border-2 border-border shadow-[6px_6px_0px_0px_#141822] p-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 border-b-2 border-border pb-4">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-white">GitHub Badges</h2>
                  <p className="text-muted-foreground font-sans text-sm mt-1">
                    Achievement badges based on real activity.
                  </p>
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Activity based
                </div>
              </div>

              {badges.badges?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {badges.badges.map((badge) => (
                    <div
                      key={badge}
                      className={`border-2 border-border p-4 shadow-[4px_4px_0px_0px_#141822] ${
                        badgeStyles[badge] || 'bg-background'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{badgeIcons[badge] || '🏅'}</span>
                        <div className="text-sm font-black uppercase tracking-widest">{badge}</div>
                      </div>
                      <div className="text-xs mt-2">{badgeDescriptions[badge]}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground font-sans text-sm">No badges unlocked yet. Keep pushing commits!</p>
              )}

              {badges.metrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                  {[
                    { label: 'Night Commits', value: badges.metrics.nightCommits || 0 },
                    { label: 'Closed Issues', value: badges.metrics.closedIssues || 0 },
                    { label: 'Languages', value: badges.metrics.languageCount || 0 },
                    { label: 'Active Repos', value: badges.metrics.repoCount || 0 },
                  ].map((metric) => (
                    <div key={metric.label} className="border-2 border-border bg-background p-3 text-center">
                      <div className="text-xl font-black text-accent">{metric.value}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{metric.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-card border-2 border-border shadow-[6px_6px_0px_0px_#141822] p-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 border-b-2 border-border pb-4">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-white">Coding Timeline</h2>
                  <p className="text-muted-foreground font-sans text-sm mt-1">
                    Auto-generated journey from commits and repo milestones.
                  </p>
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Scrollable
                </div>
              </div>

              {timelineEvents.length === 0 ? (
                <p className="text-muted-foreground font-sans text-sm">No timeline events available yet.</p>
              ) : (
                <div className="max-h-[420px] overflow-y-auto pr-2 space-y-4">
                  {timelineEvents.map((event, idx) => {
                    const date = new Date(event.date);
                    const label = isNaN(date.getTime()) ? event.date : date.toISOString().split('T')[0];
                    return (
                      <div key={`${event.date}-${idx}`} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <span className="w-3 h-3 bg-accent border-2 border-border" />
                          {idx < timelineEvents.length - 1 && (
                            <span className="w-[2px] flex-1 bg-border min-h-[24px]" />
                          )}
                        </div>
                        <div className="flex-1 border-2 border-border bg-background p-4">
                          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
                          <div className="text-sm font-black uppercase tracking-tight text-white mt-1">{event.title}</div>
                          {event.source && (
                            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">
                              {event.source}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Portfolio Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-card border-2 border-border shadow-[6px_6px_0px_0px_#141822] p-6">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Repositories</div>
                <div className="text-4xl font-black text-accent">{features.repoCount || 0}</div>
                <div className="text-xs text-muted-foreground mt-2">{features.activeRepoCount || 0} active</div>
              </div>
              <div className="bg-card border-2 border-border shadow-[6px_6px_0px_0px_#141822] p-6">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Total Stars</div>
                <div className="text-4xl font-black text-accent">{features.totalStars || 0}</div>
                <div className="text-xs text-muted-foreground mt-2">⭐ Recognition</div>
              </div>
              <div className="bg-card border-2 border-border shadow-[6px_6px_0px_0px_#141822] p-6">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Total Forks</div>
                <div className="text-4xl font-black text-accent">{features.totalForks || 0}</div>
                <div className="text-xs text-muted-foreground mt-2">📊 Reusability</div>
              </div>
              <div className="bg-card border-2 border-border shadow-[6px_6px_0px_0px_#141822] p-6">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Total Commits</div>
                <div className="text-4xl font-black text-accent">{features.totalCommits || 0}</div>
                <div className="text-xs text-muted-foreground mt-2">💪 Contributions</div>
              </div>
            </div>

            {/* GitHub Profile Summary */}
            <div className="bg-card border-2 border-border shadow-[6px_6px_0px_0px_#141822] p-6">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-4 border-b-2 border-border pb-2">GitHub Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Username</div>
                  <div className="text-lg font-black uppercase text-white">{githubProfile.username}</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Name</div>
                  <div className="text-lg font-black uppercase text-white">{githubProfile.name || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Member Since</div>
                  <div className="text-lg font-black uppercase text-white">{githubProfile.createdAt || 'N/A'}</div>
                </div>
              </div>
              {githubProfile.bio && (
                <div className="mt-4 pt-4 border-t-2 border-border">
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Bio</div>
                  <div className="text-sm font-sans italic text-foreground">{githubProfile.bio}</div>
                </div>
              )}
            </div>

            {/* Skills & Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card border-2 border-border shadow-[6px_6px_0px_0px_#141822] p-6">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-4 border-b-2 border-border pb-2">Programming Languages</h2>
                <div className="space-y-3">
                  {features.primaryLanguage && (
                    <div className="border-2 border-accent bg-background p-4 flex justify-between items-center">
                      <div className="font-bold uppercase text-accent">{features.primaryLanguage}</div>
                      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">PRIMARY</div>
                    </div>
                  )}
                  <div className="border-2 border-border bg-background p-4">
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Languages</div>
                    <div className="text-2xl font-black text-accent">{features.languageCount || 0}</div>
                  </div>
                </div>
              </div>

              <div className="bg-card border-2 border-border shadow-[6px_6px_0px_0px_#141822] p-6">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-4 border-b-2 border-border pb-2">Activity Patterns</h2>
                <div className="space-y-3">
                  <div className="border-2 border-border bg-background p-4">
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Night Commits</div>
                    <div className="text-2xl font-black text-accent">{features.nightCommits || 0}</div>
                    <div className="text-xs text-muted-foreground mt-2">Commits between 12 AM - 4 AM UTC</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Experience */}
            {linkedinData.positions && linkedinData.positions.length > 0 && (
              <div className="bg-card border-2 border-border shadow-[6px_6px_0px_0px_#141822] p-6">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-4 border-b-2 border-border pb-2">Work Experience</h2>
                <div className="space-y-3">
                  {linkedinData.positions.map((pos, idx) => (
                    <div key={idx} className="border-2 border-border bg-background p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-black uppercase text-lg text-white">{pos.title || 'Position'}</div>
                          <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{pos.company || 'Company'}</div>
                        </div>
                      </div>
                      {pos.startDate && (
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2">
                          {pos.startDate} {pos.endDate ? `→ ${pos.endDate}` : '→ Present'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {linkedinData.education && linkedinData.education.length > 0 && (
              <div className="bg-card border-2 border-border shadow-[6px_6px_0px_0px_#141822] p-6">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-4 border-b-2 border-border pb-2">Education</h2>
                <div className="space-y-3">
                  {linkedinData.education.map((edu, idx) => (
                    <div key={idx} className="border-2 border-border bg-background p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-black uppercase text-lg text-white">{edu.school || 'School'}</div>
                          <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{edu.degree || 'Degree'} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</div>
                        </div>
                      </div>
                      {edu.startDate && (
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2">
                          {edu.startDate} {edu.endDate ? `→ ${edu.endDate}` : ''}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LinkedIn Skills */}
            {linkedinData.skills && linkedinData.skills.length > 0 && (
              <div className="bg-card border-2 border-border shadow-[6px_6px_0px_0px_#141822] p-6">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-4 border-b-2 border-border pb-2">LinkedIn Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {linkedinData.skills.slice(0, 10).map((skill, idx) => (
                    <div key={idx} className="border-2 border-border bg-background px-4 py-2">
                      <div className="text-xs font-bold uppercase tracking-widest text-white">{skill}</div>
                    </div>
                  ))}
                  {linkedinData.skills.length > 10 && (
                    <div className="border-2 border-accent bg-background px-4 py-2">
                      <div className="text-xs font-bold uppercase tracking-widest text-accent">+{linkedinData.skills.length - 10} more</div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </section>
        )}
      </main>
    </div>
  );
};
