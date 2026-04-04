import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import api from '../utils/axios';
import { Loader3D } from '../components/Loader3D';
import { BrutalistTheme } from '../components/themes/BrutalistTheme';
import { MinimalistTheme } from '../components/themes/MinimalistTheme';

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

  if (loading) return <Loader3D message="Reconstructing profile..." />;
  if (error) {
    return (
      <div className="min-h-screen bg-background text-ink font-sans flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-black mb-4">ERROR</h1>
          <p className="text-lg font-bold mb-6">{error}</p>
          <a href="/" className="bg-accent text-white px-6 py-3 font-bold uppercase">
            Back to Home
          </a>
        </div>
      </div>
    );
  }
  if (!data) return <Navigate to="/" />;

  const { rootUser, profile, repos, portfolio } = data;
  const theme = portfolio?.theme || 'brutalist';

  // Render the selected theme
  if (theme === 'minimalist') {
    return <MinimalistTheme rootUser={rootUser} profile={profile} repos={repos} />;
  }

  return <BrutalistTheme rootUser={rootUser} profile={profile} repos={repos} />;
};
