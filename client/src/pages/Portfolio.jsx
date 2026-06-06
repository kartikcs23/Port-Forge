import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import api from '../utils/axios';

// Themes
import { BrutalistTheme } from '../components/themes/BrutalistTheme';
import { EgyptianTheme } from '../components/themes/EgyptianTheme';
import { SpaceTheme } from '../components/themes/SpaceTheme';
import { TokyoTheme } from '../components/themes/TokyoTheme';
import { MedicalTheme } from '../components/themes/MedicalTheme';
import { Loader3D } from '../components/Loader3D';

export const Portfolio = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const renderTheme = () => {
    switch (activeTheme) {
      case 'space':
        return <SpaceTheme rootUser={rootUser} profile={profile} repos={repos} />;
      case 'egyptian':
        return <EgyptianTheme rootUser={rootUser} profile={profile} repos={repos} />;
      case 'tokyo':
        return <TokyoTheme rootUser={rootUser} profile={profile} repos={repos} />;
      case 'medical':
        return <MedicalTheme rootUser={rootUser} profile={profile} repos={repos} />;
      case 'brutalist':
      default:
        return <BrutalistTheme rootUser={rootUser} profile={profile} repos={repos} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-white">
      {renderTheme()}
    </div>
  );
};

