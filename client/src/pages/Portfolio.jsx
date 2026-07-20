import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import api from '../utils/axios';

// Themes
import { BrutalistTheme } from '../components/themes/BrutalistTheme';
import { EgyptianTheme } from '../components/themes/EgyptianTheme';
import { SpaceTheme } from '../components/themes/SpaceTheme';
import { MedicalTheme } from '../components/themes/MedicalTheme';
import { ProfessionalTheme } from '../components/themes/ProfessionalTheme';
import { CinematicTheme } from '../components/themes/CinematicTheme';
import { Loader3D } from '../components/Loader3D';

export const Portfolio = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarOpen, setSimilarOpen] = useState(false);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [similarError, setSimilarError] = useState(null);
  const [similarMatches, setSimilarMatches] = useState([]);

  useEffect(() => {
    const fetchPublicPortfolio = async () => {
      try {
        const res = await api.get(`/api/portfolio/${slug}`);
        if (res.data.success) {
          setData(res.data.data);
        } else {
          setError(res.data.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Portfolio not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchPublicPortfolio();
  }, [slug]);

  useEffect(() => {
    setSimilarOpen(false);
    setSimilarMatches([]);
    setSimilarError(null);
  }, [slug]);

  if (loading) {
    return <Loader3D message="Synchronizing digital identity..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter text-white">ERROR_FOUND</h1>
          <p className="text-lg font-bold mb-6 text-primary uppercase tracking-widest">{error}</p>
          <a href="/" className="btn-forge-primary">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  if (!data) {
    return <Navigate to="/" />;
  }

  const { rootUser, profile, repos, portfolio } = data;
  const activeTheme = portfolio?.theme || 'brutalist';

  const handleLoadSimilar = async () => {
    setSimilarOpen(true);
    if (similarMatches.length > 0 || similarLoading) return;
    setSimilarLoading(true);
    setSimilarError(null);
    try {
      const res = await api.get(`/api/portfolio/${slug}/similar`);
      if (res.data.success) {
        setSimilarMatches(res.data.data.matches || []);
      } else {
        setSimilarError(res.data.message || 'Failed to load matches');
      }
    } catch (err) {
      setSimilarError(err.response?.data?.message || err.message || 'Failed to load matches');
    } finally {
      setSimilarLoading(false);
    }
  };

  const renderTheme = () => {
    switch (activeTheme) {
      case 'space':
        return <SpaceTheme rootUser={rootUser} profile={profile} repos={repos} />;
      case 'egyptian':
        return <EgyptianTheme rootUser={rootUser} profile={profile} repos={repos} />;
      case 'medical':
        return <MedicalTheme rootUser={rootUser} profile={profile} repos={repos} />;
      case 'professional':
        return <ProfessionalTheme rootUser={rootUser} profile={profile} repos={repos} />;
      case 'cinematic':
        return <CinematicTheme rootUser={rootUser} profile={profile} repos={repos} />;
      case 'brutalist':
      default:
        return <BrutalistTheme rootUser={rootUser} profile={profile} repos={repos} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-white">
      {renderTheme()}

      <button
        onClick={handleLoadSimilar}
        className="fixed bottom-6 right-6 z-[60] bg-accent text-white border-2 border-ink px-5 py-3 font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
      >
        Find similar developers
      </button>

      {similarOpen && (
        <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center px-4">
          <div className="w-full max-w-2xl bg-surface border-2 border-ink shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]">
            <div className="flex items-center justify-between border-b-2 border-ink px-6 py-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-muted">Skill match</div>
                <div className="text-2xl font-black uppercase tracking-tight">Similar Developers</div>
              </div>
              <button
                onClick={() => setSimilarOpen(false)}
                className="border-2 border-ink px-3 py-1 font-black uppercase text-xs"
              >
                Close
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {similarLoading && (
                <div className="text-sm font-bold uppercase tracking-widest text-muted">Loading matches...</div>
              )}
              {similarError && (
                <div className="border-2 border-ink bg-background p-3 text-xs font-bold uppercase">
                  {similarError}
                </div>
              )}
              {!similarLoading && !similarError && similarMatches.length === 0 && (
                <div className="text-sm text-muted">No similar developers found yet.</div>
              )}
              {similarMatches.map((match) => (
                <a
                  key={match.slug}
                  href={`/${match.slug}`}
                  className="flex items-center gap-4 border-2 border-ink bg-background p-4 hover:bg-surface transition-colors"
                >
                  <div className="w-12 h-12 border-2 border-ink bg-surface flex items-center justify-center overflow-hidden">
                    {match.avatar ? (
                      <img src={match.avatar} alt={match.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-black">{match.name?.charAt(0) || '?'}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-black uppercase tracking-tight">{match.name}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted">
                      @{match.username}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold uppercase tracking-widest text-muted">Match</div>
                    <div className="text-lg font-black text-accent">{Math.round(match.score * 100)}%</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

