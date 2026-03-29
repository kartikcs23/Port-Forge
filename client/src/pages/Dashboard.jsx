import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { ProjectCard } from '../components/ProjectCard';
import { useAuth } from '../hooks/useAuth';
import { usePortfolio } from '../hooks/usePortfolio';
import { Loader3D } from '../components/Loader3D';

/**
 * Dashboard — User dashboard (protected)
 * Sync GitHub/LinkedIn, manage projects, generate/publish portfolio
 */
export const Dashboard = () => {
  const { user } = useAuth();
  const {
    loading,
    error,
    portfolio,
    projects,
    fetchPortfolio,
    generatePortfolio,
    togglePublish,
    syncGithub,
    syncLinkedin,
    fetchProjects,
    togglePin,
  } = usePortfolio();

  const [syncStatus, setSyncStatus] = useState('');
  const [lastSynced, setLastSynced] = useState(null);

  useEffect(() => {
    fetchPortfolio();
    fetchProjects();
  }, []);

  if (loading && !portfolio && projects.length === 0) {
    return <Loader3D message="Loading your dashboard..." />;
  }

  const handleSyncGithub = async () => {
    setSyncStatus('syncing-github');
    const result = await syncGithub();
    if (result.success) {
      setSyncStatus('success');
      setLastSynced(new Date().toLocaleString());
      setTimeout(() => setSyncStatus(''), 3000);
    } else {
      setSyncStatus('error');
    }
  };

  const handleSyncLinkedin = async () => {
    setSyncStatus('syncing-linkedin');
    const result = await syncLinkedin();
    if (result.success) {
      setSyncStatus('success');
      setLastSynced(new Date().toLocaleString());
      setTimeout(() => setSyncStatus(''), 3000);
    } else {
      setSyncStatus('error');
    }
  };

  const handleGeneratePortfolio = async () => {
    const result = await generatePortfolio();
    if (result.success) {
      setSyncStatus('success');
      setTimeout(() => setSyncStatus(''), 3000);
    }
  };

  const handleTogglePublish = async () => {
    const result = await togglePublish();
    if (result.success) {
      setSyncStatus('success');
      setTimeout(() => setSyncStatus(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="glass-card p-8 mb-8 border-l-4 border-blue-500">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-slate-400">Manage your portfolio and sync your data</p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 backdrop-blur-sm text-red-300 px-4 py-3 rounded-lg mb-4 animate-pulse">
            ⚠️ {error}
          </div>
        )}
        {syncStatus === 'success' && (
          <div className="bg-green-500/20 border border-green-500/50 backdrop-blur-sm text-green-300 px-4 py-3 rounded-lg mb-4 animate-pulse">
            ✨ Operation completed successfully!
          </div>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Sync Panel */}
            <div className="glass-card p-6 mb-6 hover-lift">
              <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                🔄 Sync Your Data
              </h2>
              <div className="space-y-3">
                <button
                  onClick={handleSyncGithub}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-slate-700 to-slate-600 text-white py-3 rounded-lg font-bold hover:from-slate-600 hover:to-slate-500 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>🐙</span>
                  {loading && syncStatus === 'syncing-github'
                    ? 'Syncing...'
                    : 'Sync GitHub'}
                </button>
                <button
                  onClick={handleSyncLinkedin}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-600 text-white py-3 rounded-lg font-bold hover:from-blue-600 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>💼</span>
                  {loading && syncStatus === 'syncing-linkedin'
                    ? 'Syncing...'
                    : 'Sync LinkedIn'}
                </button>
              </div>
              {lastSynced && (
                <p className="text-xs text-slate-500 mt-4 text-center">
                  Last synced: {lastSynced}
                </p>
              )}
            </div>

            {/* Portfolio Panel */}
            <div className="glass-card p-6 hover-lift">
              <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                📋 Portfolio
              </h2>
              {portfolio ? (
                <>
                  <div className="mb-4 p-4 bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-600/50 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-semibold">Status:</span>
                    <span
                      className={`font-bold px-3 py-1 rounded-full text-sm ${
                        portfolio.published
                          ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                          : 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50'
                      }`}
                    >
                      {portfolio.published ? '✨ Published' : '📝 Draft'}
                    </span>
                  </div>
                  <button
                    onClick={handleTogglePublish}
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 mb-4 ${
                      portfolio.published
                        ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg'
                        : 'btn-gradient'
                    }`}
                  >
                    {portfolio.published ? '🔒 Unpublish' : '🚀 Publish'}
                  </button>
                  {portfolio.slug && (
                    <div className="mb-4">
                      <p className="text-xs text-slate-500 mb-2 font-semibold">
                        Your Portfolio URL:
                      </p>
                      <input
                        type="text"
                        value={`portforge.app/${portfolio.slug}`}
                        readOnly
                        className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-800/50 text-slate-300 text-sm font-mono"
                      />
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={handleGeneratePortfolio}
                  disabled={loading}
                  className="btn-gradient-alt w-full py-4 rounded-lg font-bold text-lg"
                >
                  {loading ? '✨ Generating...' : '🎨 Generate Portfolio'}
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Projects Section */}
            <div className="glass-card p-6 hover-lift">
              <h2 className="text-3xl font-bold text-slate-100 mb-8 flex items-center gap-3">
                <span>⭐</span>
                Your Projects ({projects.length})
              </h2>
              {projects.length > 0 ? (
                <div className="grid gap-4">
                  {projects.map((project) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      onPin={togglePin}
                      loading={loading}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-slate-400 mb-6 text-lg">
                    No projects found. Sync your GitHub to get started!
                  </p>
                  <button
                    onClick={handleSyncGithub}
                    disabled={loading}
                    className="btn-gradient inline-block"
                  >
                    🔗 Sync GitHub Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
