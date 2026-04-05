import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import api from '../utils/axios';

export const Portfolio = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
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
      }
    };
    fetchPublicPortfolio();
  }, [slug]);

  // Remove loading check - let content render normally
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

  const { rootUser, profile, repos } = data;

  return (
    <div className="min-h-screen bg-background text-ink font-sans selection:bg-accent selection:text-white">
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-surface border-b-2 border-ink z-50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="font-black text-sm xs:text-lg uppercase hover:text-accent transition-colors">← BACK</a>
          <div className="font-black text-xs xs:text-sm uppercase tracking-widest text-muted">{rootUser?.name?.split(' ')[0] || 'Portfolio'}</div>
        </div>
      </nav>

      {/* Hero Header Section */}
      <header className="pt-24 pb-16 relative overflow-hidden bg-gradient-to-br from-surface via-background to-surface border-b-4 border-ink">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent opacity-5 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Avatar */}
            <div className="flex justify-center md:justify-end">
              <div className="relative group">
                <div className="absolute inset-0 bg-accent blur-2xl opacity-30 group-hover:opacity-50 transition-opacity rounded-3xl"></div>
                <div className="w-64 h-64 border-4 border-ink shadow-[12px_12px_0px_0px_rgba(17,17,17,1)] rounded-3xl overflow-hidden bg-background relative z-10">
                  {profile?.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={rootUser?.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-accent to-ink flex items-center justify-center">
                      <span className="font-black text-9xl text-white opacity-30">{rootUser?.name?.charAt(0) || 'P'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-6">
              <div className="inline-block border-3 border-ink bg-accent text-white px-5 py-2 font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
                👨‍💻 Developer Profile
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.95]">
                {rootUser?.name}
              </h1>
              
              <p className="text-lg md:text-xl font-bold text-muted leading-relaxed max-w-lg">
                {profile?.bio || 'Full-stack developer passionate about building beautiful, functional digital experiences.'}
              </p>

              {profile?.location && (
                <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest">
                  <span className="text-xl">📍</span>
                  <span>{profile.location}</span>
                </div>
              )}
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                {profile?.githubUrl && (
                  <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="bg-ink text-white px-6 py-3 font-black text-xs uppercase border-2 border-ink shadow-[5px_5px_0px_0px_rgba(17,17,17,1)] hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-1 transition-all">
                    🔗 GitHub
                  </a>
                )}
                {profile?.linkedinUrl && (
                  <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="bg-white text-ink px-6 py-3 font-black text-xs uppercase border-2 border-ink shadow-[5px_5px_0px_0px_rgba(17,17,17,1)] hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-1 transition-all">
                    💼 LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-20 space-y-24">
        
        {/* Tech Stack Section */}
        {profile?.skills && profile.skills.length > 0 && (
          <section className="space-y-10">
            <div className="flex items-end gap-6">
              <h2 className="text-5xl font-black uppercase tracking-tighter">Tech Arsenal</h2>
              <div className="flex-1 h-1.5 bg-ink"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Primary Skills */}
              <div className="border-3 border-ink p-8 bg-surface shadow-[10px_10px_0px_0px_rgba(17,17,17,1)] hover:shadow-[12px_12px_0px_0px_rgba(17,17,17,1)] transition-shadow">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted mb-6 border-b-2 border-ink pb-3">Languages & Frameworks</h3>
                <div className="flex flex-wrap gap-3">
                  {profile.skills.slice(0, Math.ceil(profile.skills.length / 2)).map((skill, idx) => (
                    <span key={idx} className="bg-accent text-white px-4 py-2 font-bold text-xs uppercase tracking-wide shadow-[3px_3px_0px_0px_rgba(17,17,17,1)]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Secondary Skills */}
              <div className="border-3 border-ink p-8 bg-background shadow-[10px_10px_0px_0px_rgba(17,17,17,1)] hover:shadow-[12px_12px_0px_0px_rgba(17,17,17,1)] transition-shadow">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted mb-6 border-b-2 border-ink pb-3">Tools & Platforms</h3>
                <div className="flex flex-wrap gap-3">
                  {profile.skills.slice(Math.ceil(profile.skills.length / 2)).map((skill, idx) => (
                    <span key={idx} className="border-2 border-ink px-4 py-2 font-bold text-xs uppercase tracking-wide hover:bg-accent hover:text-white hover:border-accent transition-all">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Projects Section */}
        <section className="space-y-12">
          <div className="flex items-end gap-6">
            <h2 className="text-5xl font-black uppercase tracking-tighter">Featured Projects</h2>
            <div className="flex-1 h-1.5 bg-ink"></div>
          </div>
          
          {repos && repos.length > 0 ? (
            <div className="space-y-8">
              {repos.map((project, idx) => (
                <div key={project._id} className="group border-3 border-ink p-10 bg-surface shadow-[10px_10px_0px_0px_rgba(17,17,17,1)] hover:shadow-[14px_14px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-2 transition-all relative overflow-hidden">
                  
                  {/* Accent Background */}
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                  
                  {/* Score Badge */}
                  <div className="absolute top-6 right-6 bg-accent text-white px-5 py-2 font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] z-20">
                    ⭐ Score: {project.activityScore || 0}
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted">Project {String(idx + 1).padStart(2, '0')}</span>
                    
                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 pr-32">
                      {project.name}
                    </h3>
                    
                    <p className="text-base md:text-lg text-muted font-sans mb-8 line-clamp-2 max-w-3xl">
                      {project.description || 'A quality project built with passion and expertise.'}
                    </p>
                    
                    {/* Meta Info Grid */}
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-6 mb-8">
                      {project.language && (
                        <div className="space-y-2">
                          <div className="text-2xl">💻</div>
                          <div className="text-xs font-black uppercase tracking-widest text-muted">{project.language}</div>
                        </div>
                      )}
                      {project.stars !== undefined && (
                        <div className="space-y-2">
                          <div className="text-2xl">⭐</div>
                          <div className="text-sm font-black">{project.stars}</div>
                        </div>
                      )}
                      {project.forks !== undefined && (
                        <div className="space-y-2">
                          <div className="text-2xl">🔱</div>
                          <div className="text-sm font-black">{project.forks}</div>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {project.topics && project.topics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.topics.slice(0, 5).map((topic, tidx) => (
                          <span key={tidx} className="text-xs font-bold uppercase tracking-widest px-3 py-1 bg-background border-2 border-ink hover:bg-accent hover:text-white hover:border-accent transition-all">
                            #{topic}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* CTA Button */}
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-block bg-accent text-white px-8 py-4 font-black text-xs uppercase tracking-widest shadow-[5px_5px_0px_0px_rgba(17,17,17,1)] hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-1 transition-all">
                      → View Source Code
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-4 border-ink border-dashed p-16 text-center bg-surface">
              <p className="font-bold uppercase tracking-widest text-muted text-base">📦 No repositories synced yet</p>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="border-t-3 border-ink pt-16 text-center space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-black uppercase tracking-widest text-muted">
              Built with PortForge
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">
              Portfolio Generator for Developers © 2026
            </p>
          </div>
        </footer>
      </div>

    </div>
  );
};
