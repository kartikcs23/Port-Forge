import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { useLinkedInInsights } from '../hooks/useLinkedInInsights';
import { Loader3D } from '../components/Loader3D';
import axios from '../utils/axios';

export const LinkedInInsights = () => {
  const { loading, error, data, fetchLinkedInInsights } = useLinkedInInsights();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [syncError, setSyncError] = useState(null);

  useEffect(() => {
    // Auto-load insights on mount
    const loadData = async () => {
      setIsAnalyzing(true);
      await fetchLinkedInInsights();
      setIsAnalyzing(false);
    };
    loadData();
  }, [fetchLinkedInInsights]);

  const handleReanalyze = async () => {
    setIsAnalyzing(true);
    await fetchLinkedInInsights();
    setIsAnalyzing(false);
  };

  const handleSyncLinkedIn = async (e) => {
    e.preventDefault();
    setSyncError(null);

    if (!linkedinUrl.trim()) {
      setSyncError('Please enter a LinkedIn profile URL');
      return;
    }

    setIsSyncing(true);
    try {
      const response = await axios.get('/api/sync/linkedin', {
        params: { link: linkedinUrl }
      });

      if (response.data.success) {
        setLinkedinUrl('');
        await fetchLinkedInInsights();
      } else {
        setSyncError(response.data.message);
      }
    } catch (err) {
      setSyncError(err.response?.data?.message || 'Failed to sync LinkedIn profile');
    } finally {
      setIsSyncing(false);
    }
  };

  if (loading || isAnalyzing) {
    return <Loader3D message="Analyzing your LinkedIn profile..." />;
  }

  const profile = data?.profile || {};
  const positions = data?.positions || [];
  const education = data?.education || [];
  const skills = data?.skills || [];
  
  const hasData = positions.length > 0 || education.length > 0 || skills.length > 0 || profile?.headline;

  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-white font-sans text-ink">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10 md:py-16 pt-24 md:pt-28">
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b-2 border-ink pb-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight">LinkedIn</h1>
              <p className="text-muted font-sans text-lg mt-2">
                Professional profile analysis & career insights.
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

        {!hasData ? (
          <section className="space-y-8">
            <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-8">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-6 border-b-2 border-ink pb-4">Sync Your LinkedIn Profile</h2>
              
              <p className="text-muted font-sans text-base mb-6">
                Enter your LinkedIn profile URL to analyze your professional profile and get career insights.
              </p>

              <form onSubmit={handleSyncLinkedIn} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted mb-2 block">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.linkedin.com/in/yourprofile"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full border-2 border-ink bg-background px-4 py-3 text-ink font-sans placeholder-muted focus:outline-none focus:border-accent transition-colors"
                  />
                  <p className="text-xs font-sans text-muted mt-2">
                    Example: https://www.linkedin.com/in/john-doe
                  </p>
                </div>

                {syncError && (
                  <div className="bg-accent text-white border-2 border-accent p-3 font-bold uppercase text-xs">
                    {syncError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSyncing}
                  className="btn-solid w-full md:w-auto"
                >
                  {isSyncing ? 'SYNCING...' : 'SYNC PROFILE'}
                </button>
              </form>
            </div>

            <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-8 text-center">
              <p className="text-muted font-sans text-lg">No LinkedIn data available yet.</p>
              <p className="text-xs font-bold uppercase tracking-widest text-muted mt-2">Sync your LinkedIn profile above to get started.</p>
            </div>
          </section>
        ) : (
          <section className="space-y-8">
            {/* Update Form */}
            <div className="bg-surface border-2 border-accent shadow-[6px_6px_0px_0px_rgba(255,193,7,0.3)] p-6">
              <h3 className="text-lg font-bold uppercase tracking-tight mb-4">Update Profile</h3>
              <form onSubmit={handleSyncLinkedIn} className="flex flex-col md:flex-row gap-3">
                <input
                  type="url"
                  placeholder="https://www.linkedin.com/in/yourprofile"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="flex-1 border-2 border-ink bg-background px-4 py-2 text-ink font-sans placeholder-muted focus:outline-none focus:border-accent transition-colors text-sm"
                />
                <button
                  type="submit"
                  disabled={isSyncing}
                  className="btn-solid !px-6 !py-2 text-sm"
                >
                  {isSyncing ? 'SYNCING...' : 'UPDATE'}
                </button>
              </form>
              {syncError && <p className="text-accent font-bold text-xs mt-2">{syncError}</p>}
            </div>

            {/* Professional Headline */}
            {profile.headline && (
              <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b-2 border-ink pb-2">Professional Headline</h2>
                <div className="text-2xl font-bold italic text-ink">"{profile.headline}"</div>
                {profile.summary && (
                  <div className="mt-4 pt-4 border-t-2 border-ink">
                    <div className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Summary</div>
                    <div className="text-sm font-sans text-ink leading-relaxed">{profile.summary}</div>
                  </div>
                )}
              </div>
            )}

            {/* Work Experience */}
            {positions.length > 0 && (
              <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b-2 border-ink pb-2">Work Experience ({positions.length})</h2>
                <div className="space-y-4">
                  {positions.map((pos, idx) => (
                    <div key={idx} className="border-2 border-ink bg-background p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="text-xl font-black uppercase">{pos.title || 'Position'}</div>
                          <div className="text-sm font-bold uppercase tracking-widest text-muted">{pos.company || 'Company'}</div>
                          {pos.location && <div className="text-xs font-bold uppercase tracking-widest text-muted mt-1">📍 {pos.location}</div>}
                        </div>
                        {pos.employmentType && <div className="text-xs font-bold uppercase tracking-widest text-accent bg-background px-3 py-1 border border-accent ml-2">{pos.employmentType}</div>}
                      </div>
                      <div className="text-xs font-bold uppercase tracking-widest text-muted mt-3 border-t border-ink pt-2">
                        {pos.startDate} {pos.endDate ? `→ ${pos.endDate}` : '→ Present'}
                      </div>
                      {pos.description && <div className="text-sm font-sans text-ink mt-2 leading-relaxed">{pos.description}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b-2 border-ink pb-2">Education ({education.length})</h2>
                <div className="space-y-4">
                  {education.map((edu, idx) => (
                    <div key={idx} className="border-2 border-ink bg-background p-4">
                      <div className="mb-2">
                        <div className="text-xl font-black uppercase">{edu.school || 'School'}</div>
                        <div className="text-sm font-bold uppercase tracking-widest text-muted">
                          {edu.degree || 'Degree'} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                        </div>
                      </div>
                      <div className="text-xs font-bold uppercase tracking-widest text-muted mt-3 border-t border-ink pt-2">
                        {edu.startDate} {edu.endDate ? `→ ${edu.endDate}` : ''}
                      </div>
                      {edu.grade && <div className="text-xs font-bold uppercase tracking-widest text-accent mt-2">Grade: {edu.grade}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b-2 border-ink pb-2">Skills ({skills.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {skills.slice(0, 8).map((skill, idx) => (
                    <div key={idx} className="border-2 border-ink bg-background px-4 py-3 flex justify-between items-center">
                      <div className="text-sm font-bold uppercase">{skill}</div>
                      <div className="w-2 h-2 bg-accent border border-accent"></div>
                    </div>
                  ))}
                </div>
                {skills.length > 8 && (
                  <div className="border-2 border-accent bg-background px-4 py-3 text-center">
                    <div className="text-sm font-bold uppercase tracking-widest text-accent">+{skills.length - 8} more skills</div>
                  </div>
                )}
              </div>
            )}

            {/* Statistics */}
            {(positions.length > 0 || education.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6">
                  <div className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Total Positions</div>
                  <div className="text-4xl font-black text-accent">{positions.length}</div>
                  <div className="text-xs text-muted mt-2">💼 Career roles</div>
                </div>
                <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6">
                  <div className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Education</div>
                  <div className="text-4xl font-black text-accent">{education.length}</div>
                  <div className="text-xs text-muted mt-2">🎓 Institutions</div>
                </div>
                <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6">
                  <div className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Skills</div>
                  <div className="text-4xl font-black text-accent">{skills.length}</div>
                  <div className="text-xs text-muted mt-2">🎯 Endorsed</div>
                </div>
              </div>
            )}

            {/* Career Timeline */}
            {positions.length > 0 && (
              <div className="bg-surface border-2 border-ink shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-6 border-b-2 border-ink pb-2">Career Timeline</h2>
                <div className="space-y-6">
                  {positions.map((pos, idx) => (
                    <div key={idx} className="relative pl-8">
                      <div className="absolute left-0 top-2 w-4 h-4 bg-accent border-2 border-ink shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"></div>
                      <div className="border-l-2 border-ink pl-4">
                        <div className="text-xs font-bold uppercase tracking-widest text-accent mb-1">
                          {pos.startDate} {pos.endDate ? `→ ${pos.endDate}` : '→ Present'}
                        </div>
                        <div className="text-lg font-black uppercase">{pos.title} @ {pos.company}</div>
                        <div className="text-xs font-bold uppercase tracking-widest text-muted mt-1">
                          {pos.location && `📍 ${pos.location}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};
