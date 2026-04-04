import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { useInsights } from '../hooks/useInsights';
import { Loader3D } from '../components/Loader3D';

export const Insights = () => {
  const { loading, error, data, fetchInsights } = useInsights();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Auto-load insights on mount
    const loadData = async () => {
      setIsAnalyzing(true);
      await fetchInsights();
      setIsAnalyzing(false);
    };
    loadData();
  }, [fetchInsights]);

  const handleReanalyze = async () => {
    setIsAnalyzing(true);
    await fetchInsights();
    setIsAnalyzing(false);
  };

  if (loading || isAnalyzing) {
    return <Loader3D message="Analyzing your profile..." />;
  }

  const projectScores = data?.analysis?.projectScores || [];
  const badges = data?.analysis?.badges || {};
  const timeline = data?.analysis?.timeline || [];
  const similarity = data?.analysis?.similarity || [];
  const features = data?.analysis?.features || {};
  const githubProfile = data?.github?.profile || {};
  const linkedinData = data?.linkedin || {};

  // Calculate profile completion
  const profileCompleteness = {
    github: githubProfile.bio ? 50 : 0,
    linkedin: (linkedinData.positions?.length > 0 ? 25 : 0) + (linkedinData.education?.length > 0 ? 25 : 0),
  };
  const totalCompleteness = profileCompleteness.github + profileCompleteness.linkedin;

  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-white font-sans text-ink">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10 md:py-16 pt-24 md:pt-28">
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b-2 border-ink pb-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight">Insights</h1>
              <p className="text-muted font-sans text-lg mt-2">
                ML-powered analysis of your GitHub & LinkedIn profiles.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={handleReanalyze}
                disabled={isAnalyzing}
                className="btn-solid"
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

        {!data ? (
          <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-8 text-center">
            <p className="text-muted font-sans text-lg">No analysis data available yet.</p>
            <p className="text-xs font-bold uppercase tracking-widest text-muted mt-2">Sync your GitHub first in the Dashboard.</p>
          </div>
        ) : (
          <section className="space-y-8">
            {/* Portfolio Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6">
                <div className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Repositories</div>
                <div className="text-4xl font-black text-accent">{features.repoCount || 0}</div>
                <div className="text-xs text-muted mt-2">{features.activeRepoCount || 0} active</div>
              </div>
              <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6">
                <div className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Total Stars</div>
                <div className="text-4xl font-black text-accent">{features.totalStars || 0}</div>
                <div className="text-xs text-muted mt-2">⭐ Recognition</div>
              </div>
              <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6">
                <div className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Total Forks</div>
                <div className="text-4xl font-black text-accent">{features.totalForks || 0}</div>
                <div className="text-xs text-muted mt-2">📊 Reusability</div>
              </div>
              <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6">
                <div className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Total Commits</div>
                <div className="text-4xl font-black text-accent">{features.totalCommits || 0}</div>
                <div className="text-xs text-muted mt-2">💪 Contributions</div>
              </div>
            </div>

            {/* GitHub Profile Summary */}
            <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b-2 border-ink pb-2">GitHub Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Username</div>
                  <div className="text-lg font-black uppercase">{githubProfile.username}</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Name</div>
                  <div className="text-lg font-black uppercase">{githubProfile.name || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Member Since</div>
                  <div className="text-lg font-black uppercase">{githubProfile.createdAt || 'N/A'}</div>
                </div>
              </div>
              {githubProfile.bio && (
                <div className="mt-4 pt-4 border-t-2 border-ink">
                  <div className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Bio</div>
                  <div className="text-sm font-sans italic text-ink">{githubProfile.bio}</div>
                </div>
              )}
            </div>

            {/* Skills & Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b-2 border-ink pb-2">Programming Languages</h2>
                <div className="space-y-3">
                  {features.primaryLanguage && (
                    <div className="border-2 border-accent bg-background p-4 flex justify-between items-center">
                      <div className="font-bold uppercase text-accent">{features.primaryLanguage}</div>
                      <div className="text-xs font-bold uppercase tracking-widest text-muted">PRIMARY</div>
                    </div>
                  )}
                  <div className="border-2 border-ink bg-background p-4">
                    <div className="text-xs font-bold uppercase tracking-widest text-muted mb-1">Total Languages</div>
                    <div className="text-2xl font-black text-accent">{features.languageCount || 0}</div>
                  </div>
                </div>
              </div>

              <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b-2 border-ink pb-2">Activity Patterns</h2>
                <div className="space-y-3">
                  <div className="border-2 border-ink bg-background p-4">
                    <div className="text-xs font-bold uppercase tracking-widest text-muted mb-1">Night Commits</div>
                    <div className="text-2xl font-black text-accent">{features.nightCommits || 0}</div>
                    <div className="text-xs text-muted mt-2">Commits between 12 AM - 4 AM UTC</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Experience */}
            {linkedinData.positions && linkedinData.positions.length > 0 && (
              <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b-2 border-ink pb-2">Work Experience</h2>
                <div className="space-y-3">
                  {linkedinData.positions.map((pos, idx) => (
                    <div key={idx} className="border-2 border-ink bg-background p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-black uppercase text-lg">{pos.title || 'Position'}</div>
                          <div className="text-sm font-bold uppercase tracking-widest text-muted">{pos.company || 'Company'}</div>
                        </div>
                      </div>
                      {pos.startDate && (
                        <div className="text-xs font-bold uppercase tracking-widest text-muted mt-2">
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
              <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b-2 border-ink pb-2">Education</h2>
                <div className="space-y-3">
                  {linkedinData.education.map((edu, idx) => (
                    <div key={idx} className="border-2 border-ink bg-background p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-black uppercase text-lg">{edu.school || 'School'}</div>
                          <div className="text-sm font-bold uppercase tracking-widest text-muted">{edu.degree || 'Degree'} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</div>
                        </div>
                      </div>
                      {edu.startDate && (
                        <div className="text-xs font-bold uppercase tracking-widest text-muted mt-2">
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
              <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b-2 border-ink pb-2">LinkedIn Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {linkedinData.skills.slice(0, 10).map((skill, idx) => (
                    <div key={idx} className="border-2 border-ink bg-background px-4 py-2">
                      <div className="text-xs font-bold uppercase tracking-widest">{skill}</div>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Project Scoring */}
                <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6">
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b-2 border-ink pb-2">Project Scoring</h2>
                  {projectScores.length === 0 ? (
                    <p className="text-muted text-sm">No projects scored yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {projectScores.map((item) => (
                        <div key={item.name} className="border-2 border-ink bg-background p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div>
                            <div className="text-xs font-bold uppercase tracking-widest text-muted">{item.difficulty}</div>
                            <div className="text-xl font-black uppercase">{item.name}</div>
                            <div className="text-xs font-bold uppercase tracking-widest text-muted mt-1">
                              Stars {item.signals.stars}, Commits {item.signals.commits}, Languages {item.signals.langCount}
                            </div>
                          </div>
                          <div className="text-3xl font-black text-accent">{item.score}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Timeline */}
                <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6">
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b-2 border-ink pb-2">Timeline</h2>
                  {timeline.length === 0 ? (
                    <p className="text-muted text-sm">No timeline events yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {timeline.map((event, idx) => (
                        <div key={`${event.date}-${idx}`} className="border-2 border-ink bg-background p-4">
                          <div className="text-xs font-bold uppercase tracking-widest text-muted">{event.date} / {event.source}</div>
                          <div className="text-lg font-bold mt-1">{event.title}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                {/* Badges */}
                <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6">
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b-2 border-ink pb-2">Badges</h2>
                  {badges.badges && badges.badges.length === 0 ? (
                    <p className="text-muted text-sm">No badges earned yet. Keep contributing!</p>
                  ) : (
                    <div className="space-y-3">
                      {badges.badges && badges.badges.map((badge) => (
                        <div key={badge} className="border-2 border-ink bg-background p-4">
                          <div className="text-lg font-black uppercase">{badge}</div>
                          <div className="text-xs font-bold uppercase tracking-widest text-muted mt-1">Achievement Unlocked</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Similarity */}
                <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6">
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b-2 border-ink pb-2">Similarity</h2>
                  {similarity.length === 0 ? (
                    <div className="border-2 border-ink bg-background p-4">
                      <p className="text-sm font-sans text-muted">
                        Upload a candidate dataset to enable "Find similar developers".
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {similarity.slice(0, 5).map((dev, idx) => (
                        <div key={`${dev.username}-${idx}`} className="border-2 border-ink bg-background p-4 flex justify-between items-center">
                          <div className="font-bold uppercase">{dev.username}</div>
                          <div className="text-accent font-black">{(dev.score * 100).toFixed(0)}%</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};