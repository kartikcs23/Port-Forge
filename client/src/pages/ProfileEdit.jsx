import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Navbar } from '../components/Navbar';
import { Loader3D } from '../components/Loader3D';
import { usePortfolio } from '../hooks/usePortfolio';
import ManualEditor from '../components/ManualEditor';

export const ProfileEdit = () => {
  const navigate = useNavigate();
  const { isLoaded } = useUser();
  const { updateProfileData, loading: portfolioLoading, error: portfolioError } = usePortfolio();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      fetchProfile();
    }
  }, [isLoaded]);

  const fetchProfile = async () => {
    try {
      const { default: api } = await import('../utils/axios');
      const res = await api.get('/api/profile/me');
      if (res.data.success) {
        setInitialData(res.data.data.profile);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedData) => {
    const result = await updateProfileData(updatedData);
    if (result.success) {
      alert('PORTFOLIO_IDENTITY_UPDATED_SUCCESSFULLY');
      navigate('/dashboard');
    } else {
      alert('UPDATE_FAILED: ' + result.message);
    }
  };

  if (loading || portfolioLoading) return <Loader3D message="Fetching profile data..." />;

  return (
    <div className="min-h-screen bg-background text-ink font-sans selection:bg-accent selection:text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-16 pt-32 md:pt-40">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-block bg-accent text-white px-4 py-1 font-black text-xs uppercase tracking-[0.2em] mb-4 shadow-[4px_4px_0_0_#111]">
              Profile Management
            </div>
            <h1 className="text-5xl md:text-6xl font-black font-display uppercase tracking-tighter leading-none">
              Professional Identity
            </h1>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white border-2 border-ink px-8 py-3 font-black text-sm uppercase shadow-[6px_6px_0_0_#111] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            ← Back to Terminal
          </button>
        </div>

        {portfolioError && (
          <div className="bg-ink text-white p-4 border-2 border-accent mb-8 font-bold uppercase text-xs flex items-center gap-3">
            <span className="text-xl">⚠️</span> {portfolioError}
          </div>
        )}

        {/* Manual Editor Component */}
        <div className="shadow-[12px_12px_0px_0px_rgba(17,17,17,1)] hover:shadow-[16px_16px_0px_0px_rgba(17,17,17,1)] transition-shadow">
          <ManualEditor
            initialData={initialData}
            onSave={handleSave}
            loading={portfolioLoading}
          />
        </div>

        <div className="mt-12 p-8 border-4 border-ink border-dashed bg-surface/50 text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-muted">
            Note: These changes will be reflected instantly across all selected themes.
          </p>
        </div>
      </main>
    </div>
  );
};
