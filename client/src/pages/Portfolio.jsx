import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Loader3D } from '../components/Loader3D';

export const Portfolio = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicPortfolio = async () => {
      try {
        const res = await axios.get(`/api/portfolio/public/${slug}`);
        if (res.data.success) {
          setData(res.data.data);
        } else {
          setError(res.data.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Portfolio not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchPublicPortfolio();
  }, [slug]);

  if (loading) return <Loader3D message="Reconstructing profile..." />;
  if (error || !data) return <Navigate to="/" />;

  const { rootUser, profile, repos } = data;

  return (
    <div className="min-h-screen bg-background text-ink font-sans selection:bg-accent selection:text-white">
      
      {/* Header Profile Section */}
      <header className="border-b-4 border-ink relative overflow-hidden bg-surface py-24 md:py-32">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22%23111111%22 fill-opacity=%221%22 fill-rule=%22evenodd%22%3E%3Ccircle cx=%223%22 cy=%223%22 r=%223%22/%3E%3Ccircle cx=%2213%22 cy=%2213%22 r=%223%22/%3E%3C/g%3E%3C/svg%3E')]"></div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-4 flex justify-center md:justify-end">
            <div className="w-48 h-48 md:w-64 md:h-64 border-4 border-ink shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] relative group isolate">
              <div className="absolute inset-0 bg-accent transition-transform group-hover:translate-x-2 group-hover:translate-y-2 -z-10"></div>
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt={rootUser.name} className="w-full h-full object-cover grayscale contrast-125" />
              ) : (
                <div className="w-full h-full bg-background flex flex-col items-center justify-center font-black text-6xl text-ink">
                  {rootUser.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
          <div className="md:col-span-8">
            <div className="inline-block border-2 border-ink bg-accent text-white px-3 py-1 font-bold text-[10px] uppercase tracking-widest mb-4 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] rotate-[-2deg]">
              ENGINEER PROFILE
            </div>
            <h1 className="text-5xl md:text-7xl font-black font-display uppercase tracking-tighter mb-4 leading-[0.9]">
              {rootUser.name}
            </h1>
            <p className="text-xl md:text-2xl font-bold text-muted font-sans line-clamp-3 leading-relaxed max-w-2xl">
              {profile?.bio || 'Full stack developer building incredible software.'}
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              {profile?.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-solid py-2 text-xs">
                  GITHUB
                </a>
              )}
              {profile?.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn-outline py-2 text-xs">
                  LINKEDIN
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Column (Metadata) */}
        <div className="lg:col-span-4 space-y-12">
          
          {profile?.skills && profile.skills.length > 0 && (
            <div className="border-2 border-ink p-6 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] bg-surface transform -rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl font-black font-display uppercase tracking-tighter mb-6 border-b-2 border-ink pb-2">
                Tech Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="text-xs font-bold uppercase tracking-widest px-3 py-1 border-2 border-ink bg-background text-ink shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:bg-accent hover:text-white transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {profile?.location && (
            <div className="border-2 border-ink p-6 bg-background">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-1">BASE OF OPERATIONS</span>
              <span className="font-bold text-lg uppercase tracking-widest">{profile.location}</span>
            </div>
          )}

          <div className="text-[10px] font-bold text-muted uppercase tracking-widest pt-8 border-t-2 border-ink border-dashed">
            POWERED BY PORTFORGE
          </div>
        </div>

        {/* Right Column (Projects) */}
        <div className="lg:col-span-8">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-4xl font-black font-display uppercase tracking-tighter decoration-accent underline decoration-4 underline-offset-8">
              TOP REPOSITORIES
            </h2>
            <div className="flex-1 h-2 bg-[url('data:image/svg+xml,%3Csvg width=%228%22 height=%228%22 viewBox=%220 0 8 8%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M0 0h2v2H0V0zm4 4h2v2H4V4z%22 fill=%22%23111111%22 fill-opacity=%220.2%22 fill-rule=%22evenodd%22/%3E%3C/svg%3E')]"></div>
          </div>
          
          {repos && repos.length > 0 ? (
            <div className="space-y-8">
              {repos.map((project) => (
                <div key={project._id} className="border-2 border-ink p-8 bg-surface shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-1 transition-transform relative">
                  <div className="absolute top-0 right-0 w-16 h-16 border-l-2 border-b-2 border-ink bg-background flex flex-col items-center justify-center -translate-y-px translate-x-px">
                    <span className="text-accent text-[10px] font-black uppercase">SCORE</span>
                    <span className="text-lg font-black leading-none">{project.activityScore || 0}</span>
                  </div>
                  
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 pr-12 text-ink break-words w-full overflow-hidden text-ellipsis whitespace-nowrap" style={{textOverflow: "ellipsis"}}>{project.name}</h3>
                  <p className="text-muted font-sans text-sm line-clamp-3 mb-6 max-w-xl pr-12 min-h-[4rem]">
                    {project.description || 'No description provided for this repository sequence.'}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 items-center">
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn-solid !px-6 !py-2 !text-[10px]">
                      VIEW SOURCE
                    </a>
                    
                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-ink ml-auto">
                      <span className="hidden sm:inline" title="Primary Language">⟎ {project.language || 'N/A'}</span>
                      <span title="Stars">★ {project.stars || 0}</span>
                      <span title="Forks">⑂ {project.forks || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="border-4 border-ink border-dashed p-12 text-center bg-background">
               <span className="font-bold uppercase tracking-widest text-muted text-sm">NO PUBLIC REPOSITORIES ACCESSIBLE</span>
             </div>
          )}
        </div>
      </div>

    </div>
  );
};