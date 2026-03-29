import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/axios';
import { SkillBadge, ExperienceItem, EducationItem } from '../components/SkillBadge';
import { Loader3D } from '../components/Loader3D';

/**
 * Portfolio — Public portfolio page (/:slug)
 * Displays user's portfolio with projects, skills, experience
 */
export const Portfolio = () => {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await api.get(`/api/portfolio/${slug}`);
        const data = response.data.data;
        setPortfolio(data.portfolio);
        setProfile(data.profile);
        setProjects(data.projects || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Portfolio not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [slug]);

  if (loading) {
    return <Loader3D message="Loading portfolio..." />;
  }

  if (error || !portfolio || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <p className="text-2xl text-red-400 font-bold mb-4">
            {error || 'Portfolio not found'}
          </p>
          <a
            href="/"
            className="btn-gradient inline-block"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-800/50 to-slate-900/50 border-b border-slate-700/50 py-20">
        {/* Background Glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
            {profile.user?.avatar && (
              <img
                src={profile.user.avatar}
                alt={profile.user.name}
                className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-2xl hover:scale-110 transition-transform"
              />
            )}
            <div className="text-center sm:text-left">
              <h1 className="text-5xl font-black gradient-text mb-3">
                {profile.user?.name}
              </h1>
              {profile.bio && (
                <p className="text-xl text-slate-300 mb-3 font-semibold">
                  {profile.bio}
                </p>
              )}
              {profile.location && (
                <p className="text-slate-400 flex items-center gap-2 justify-center sm:justify-start">
                  📍 {profile.location}
                </p>
              )}
            </div>
          </div>

          {/* Social Links */}
          {profile.links && (
            <div className="flex gap-4 justify-center sm:justify-start flex-wrap">
              {profile.links.github && (
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass hover:from-slate-700 hover:to-slate-600"
                >
                  🐙 GitHub
                </a>
              )}
              {profile.links.linkedin && (
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass hover:from-blue-700 hover:to-blue-600"
                >
                  💼 LinkedIn
                </a>
              )}
              {profile.links.website && (
                <a
                  href={profile.links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass hover:from-purple-700 hover:to-purple-600"
                >
                  🌐 Website
                </a>
              )}
              {profile.links.twitter && (
                <a
                  href={profile.links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass hover:from-blue-700 hover:to-cyan-600"
                >
                  𝕏 Twitter
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Projects Section */}
        {projects.length > 0 && (
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-slate-100 mb-3 flex items-center gap-2">
              ⭐ Featured Projects
            </h2>
            <p className="text-slate-400 mb-10">Showcase of my best work</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {projects
                .filter((p) => p.pinned)
                .slice(0, 2)
                .map((project) => (
                  <a
                    key={project._id}
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card p-6 hover-lift group"
                  >
                    <h3 className="text-2xl font-bold text-blue-400 group-hover:text-blue-300 mb-3 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-slate-400 group-hover:text-slate-300 mb-4 transition-colors">
                      {project.description}
                    </p>
                    <div className="flex gap-4 items-center text-sm flex-wrap">
                      <span className="flex items-center gap-1 text-yellow-400 font-bold bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30">
                        ⭐ {project.stars}
                      </span>
                      <span className="flex items-center gap-1 text-green-400 font-bold bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
                        🍴 {project.forks}
                      </span>
                      {project.languages && project.languages[0] && (
                        <span className="bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold border border-blue-500/30">
                          {project.languages[0]}
                        </span>
                      )}
                    </div>
                  </a>
                ))}
            </div>

            {/* All Projects */}
            <h3 className="text-3xl font-bold text-slate-100 mt-16 mb-8">
              All Projects ({projects.length})
            </h3>
            <div className="space-y-4">
              {projects.map((project) => (
                <a
                  key={project._id}
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-5 hover-lift group flex justify-between items-start"
                >
                  <div className="flex-1">
                    <h4 className="font-bold text-blue-400 group-hover:text-blue-300 text-lg mb-2 transition-colors">
                      {project.name}
                    </h4>
                    <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex gap-3 text-sm ml-4 flex-shrink-0">
                    <span className="text-yellow-400 font-bold">⭐ {project.stars}</span>
                    {project.languages?.[0] && (
                      <span className="text-slate-400">{project.languages[0]}</span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {profile.skills && profile.skills.length > 0 && (
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-slate-100 mb-10 flex items-center gap-2">
              🛠 Skills
            </h2>
            <div className="flex flex-wrap gap-4">
              {profile.skills.map((skill, idx) => (
                <SkillBadge key={idx} skill={skill} />
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {profile.experience && profile.experience.length > 0 && (
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-slate-100 mb-10 flex items-center gap-2">
              💼 Experience
            </h2>
            <div className="space-y-6">
              {profile.experience.map((exp, idx) => (
                <ExperienceItem key={idx} experience={exp} />
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {profile.education && profile.education.length > 0 && (
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-slate-100 mb-10 flex items-center gap-2">
              🎓 Education
            </h2>
            <div className="space-y-4">
              {profile.education.map((edu, idx) => (
                <EducationItem key={idx} education={edu} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-950/50 py-12 text-center text-slate-400">
        <p className="mb-2">Made with ❤️ by PortForge</p>
        <p className="text-sm text-slate-500">Portfolio Generator for Developers | 2026</p>
      </footer>
    </div>
  );
};
