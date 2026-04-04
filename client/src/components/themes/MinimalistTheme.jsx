import React from 'react';

export const MinimalistTheme = ({ rootUser, profile, repos }) => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-900 selection:text-white antialiased">
      
      {/* Navigation */}
      <nav className="max-w-5xl mx-auto px-8 py-12 flex justify-between items-end border-b border-gray-50">
        <a href="/" className="text-xs font-bold tracking-[0.2em] uppercase hover:opacity-40 transition-opacity">← Back</a>
        <h1 className="text-sm font-black tracking-[0.3em] uppercase">{profile?.name || rootUser?.name}</h1>
      </nav>

      {/* Hero Section - High Impact Typography */}
      <header className="max-w-5xl mx-auto px-8 pt-32 pb-40 border-b border-gray-100">
        <div className="max-w-3xl">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] mb-12">_INTRODUCTION</p>
          <h2 className="text-6xl md:text-8xl font-bold tracking-tight mb-16 leading-[0.9] text-gray-950">
            I'm {(profile?.name || rootUser?.name)?.split(' ')[0] || 'Developer'}, a developer focused on {profile?.skills?.[0] || 'software'} & design.
          </h2>
          
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <p className="text-2xl text-gray-500 leading-relaxed font-medium max-w-xl">
              {profile?.bio || 'Building clean interfaces and robust backends for the next generation of digital products.'}
            </p>
            {profile?.links?.github && (
              <a href={profile.links.github} target="_blank" rel="noreferrer" 
                 className="text-xs font-black uppercase tracking-widest border-b-2 border-gray-900 pb-1 hover:border-gray-300 transition-all">
                GitHub Repository ↗
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Experience Section - Minimal List */}
      {profile?.experience && profile.experience.length > 0 && (
        <section className="max-w-5xl mx-auto px-8 py-40 border-b border-gray-100">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-20">_CAREER_TRANSFORMATIONS</h3>
          <div className="space-y-24">
            {profile.experience.map((exp, idx) => (
              <div key={idx} className="group flex flex-col md:grid md:grid-cols-12 gap-8 items-baseline">
                <div className="md:col-span-3 text-[10px] font-black text-gray-400 uppercase tracking-widest pt-2">
                  {exp.startDate} — {exp.endDate || 'Present'}
                </div>
                <div className="md:col-span-9">
                  <h4 className="text-3xl font-bold tracking-tight mb-2 text-gray-950 group-hover:pl-4 transition-all duration-500 border-l-0 group-hover:border-l-4 border-gray-900">
                    {exp.role}
                  </h4>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.1em] mb-6">{exp.company}</p>
                  <p className="text-lg text-gray-500 leading-relaxed max-w-2xl">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section - Clean Grid */}
      {repos && repos.length > 0 && (
        <section className="max-w-5xl mx-auto px-8 py-40 border-b border-gray-100">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-20">_SELECTED_WORKS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100 border border-gray-100">
            {repos.map((repo) => (
              <a 
                key={repo._id}
                href={repo.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="group bg-white p-12 hover:bg-gray-50 transition-all duration-700 block"
              >
                <div className="flex justify-between items-start mb-12">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">PROJ_{repo.score}/10</span>
                  <div className="w-10 h-px bg-gray-200 group-hover:w-20 transition-all duration-700"></div>
                </div>
                <h4 className="text-2xl font-bold tracking-tight mb-4 group-hover:translate-x-2 transition-transform duration-500">
                  {repo.name}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed mb-12 line-clamp-2">
                  {repo.description || 'Professional software solution built with modern architectural patterns.'}
                </p>
                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{repo.stars} Stars</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{repo.forks} Forks</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {profile?.education && profile.education.length > 0 && (
        <section className="max-w-5xl mx-auto px-8 py-40 border-b border-gray-100">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-20">_FOUNDATIONS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            {profile.education.map((edu, idx) => (
              <div key={idx}>
                <h4 className="text-2xl font-bold tracking-tight mb-2">{edu.institution}</h4>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-tight mb-4">{edu.degree} in {edu.field}</p>
                <div className="w-8 h-px bg-gray-900 mb-4"></div>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Graduated {edu.year}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-8 py-32 flex flex-col md:flex-row justify-between items-start gap-12">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.3em] mb-4">PortForge Production</div>
          <div className="text-2xl font-bold tracking-tight text-gray-900">{profile?.name || rootUser?.name}</div>
        </div>
        <div className="flex gap-12">
          {profile?.links?.github && <a href={profile.links.github} className="text-xs font-bold uppercase tracking-widest hover:opacity-50 transition-opacity">Github</a>}
          {profile?.links?.linkedin && <a href={profile.links.linkedin} className="text-xs font-bold uppercase tracking-widest hover:opacity-50 transition-opacity">Linkedin</a>}
        </div>
      </footer>
    </div>
  );
};
