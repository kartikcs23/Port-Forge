import React from 'react';

export const BrutalistTheme = ({ rootUser, profile, repos }) => {
  return (
    <div className="min-h-screen bg-surface text-ink font-mono selection:bg-accent selection:text-white pb-20">

      {/* Grid Overlay for Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{ backgroundImage: 'radial-gradient(#111 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>

      {/* Hero Header Section */}
      <header className="pt-32 pb-20 relative overflow-hidden bg-background border-b-[6px] border-ink">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent opacity-10 rounded-full blur-[150px]"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

            {/* Avatar - High Contrast Neobrutalist */}
            <div className="flex justify-center md:justify-end">
              <div className="relative group">
                <div className="absolute inset-0 bg-accent blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="w-80 h-80 border-[8px] border-ink shadow-[20px_20px_0px_0px_rgba(17,17,17,1)] rounded-none overflow-hidden bg-white relative z-10 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  {profile?.avatarUrl || profile?.avatar ? (
                    <img src={profile.avatarUrl || profile.avatar} alt={profile?.name || rootUser?.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full bg-ink flex items-center justify-center">
                      <span className="font-black text-[12rem] text-white">{(profile?.name || rootUser?.name)?.charAt(0) || 'P'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-10">
              <div className="inline-block border-[5px] border-ink bg-accent text-white px-6 py-2 font-black text-sm uppercase tracking-[0.3em] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] -rotate-2">
                PORTFORGE_V3_SYNK
              </div>

              <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] break-words">
                {profile?.name || rootUser?.name}
              </h1>

              <p className="text-xl md:text-2xl font-bold leading-tight max-w-lg border-l-[10px] border-accent pl-8 py-4 bg-white/50 backdrop-blur-sm shadow-[8px_8px_0_0_#111] border-[4px] border-ink">
                {profile?.bio || 'Full-stack developer building high-impact digital products for the modern web.'}
              </p>

              <div className="flex flex-wrap gap-6 pt-6">
                {profile?.links?.github && (
                  <a href={profile.links.github} target="_blank" rel="noreferrer"
                    className="bg-white border-[5px] border-ink px-10 py-4 font-black uppercase text-base shadow-[10px_10px_0px_0px_#111] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all active:bg-accent active:text-white">
                    GitHub_
                  </a>
                )}
                {profile?.links?.linkedin && (
                  <a href={profile.links.linkedin} target="_blank" rel="noreferrer"
                    className="bg-accent text-white border-[5px] border-ink px-10 py-4 font-black uppercase text-base shadow-[10px_10px_0px_0px_#111] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all">
                    LinkedIn_
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-32 space-y-48 relative z-10">

        {/* Experience Section */}
        {profile?.experience && profile.experience.length > 0 && (
          <section className="space-y-16">
            <div className="relative inline-block">
              <h2 className="text-6xl md:text-7xl font-black uppercase tracking-tighter bg-white border-[6px] border-ink px-12 py-6 shadow-[14px_14px_0_0_#111] relative z-10 -rotate-1">
                Experience
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-12">
              {profile.experience.map((exp, idx) => (
                <div key={idx} className="border-[6px] border-ink p-12 bg-white shadow-[16px_16px_0px_0px_#111] hover:-translate-y-3 transition-all group">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10 border-b-[6px] border-ink pb-8">
                    <div>
                      <h3 className="text-4xl font-black uppercase tracking-tight mb-2 group-hover:text-accent transition-colors">{exp.role}</h3>
                      <p className="text-xl font-black text-accent uppercase tracking-[0.2em]">{exp.company}</p>
                    </div>
                    <div className="bg-ink text-white px-8 py-3 font-black text-base uppercase tracking-widest shadow-[8px_8px_0_0_#accent] border-[3px] border-accent">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </div>
                  </div>
                  <p className="text-xl font-bold text-muted leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {repos && repos.length > 0 && (
          <section className="space-y-16">
            <div className="relative inline-block">
              <h2 className="text-6xl md:text-7xl font-black uppercase tracking-tighter bg-accent text-white border-[6px] border-ink px-12 py-6 shadow-[14px_14px_0_0_#111] relative z-10 rotate-2">
                PROJECTS_DB
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {repos.map((repo) => (
                <div
                  key={repo._id}
                  className="group relative bg-white border-[6px] border-ink p-10 shadow-[16px_16px_0px_0px_#111] hover:-translate-y-3 transition-all flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-8">
                    <h3 className="text-3xl font-black uppercase tracking-tight group-hover:text-accent transition-colors leading-[0.9]">
                      {repo.name}
                    </h3>
                    <div className="bg-yellow-400 border-[4px] border-ink px-4 py-2 font-black text-sm -rotate-6 shadow-[4px_4px_0_0_#111] whitespace-nowrap">
                      QS: {repo.score}/10
                    </div>
                  </div>

                  <p className="text-lg font-bold text-muted leading-snug line-clamp-4 mb-10 flex-grow">
                    {repo.description || 'Professional-grade architecture featuring clean code principles and robust documentation.'}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-8 border-t-[4px] border-ink">
                    <div className="flex gap-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-muted">STARS</span>
                        <span className="font-black text-xl leading-none">{repo.stars}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-muted">FORKS</span>
                        <span className="font-black text-xl leading-none">{repo.forks}</span>
                      </div>
                    </div>
                    <a
                      href={repo.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-ink text-white p-4 hover:bg-accent transition-colors shadow-[6px_6px_0_0_#accent] border-[3px] border-ink"
                    >
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.011-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.292c0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {profile?.education && profile.education.length > 0 && (
          <section className="space-y-16">
            <div className="relative inline-block">
              <h2 className="text-6xl md:text-7xl font-black uppercase tracking-tighter bg-yellow-400 border-[6px] border-ink px-12 py-6 shadow-[14px_14px_0_0_#111] relative z-10 -rotate-2">
                Education
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {profile.education.map((edu, idx) => (
                <div key={idx} className="border-[6px] border-ink p-12 bg-white shadow-[16px_16px_0px_0px_#111]">
                  <h3 className="text-3xl font-black uppercase tracking-tight mb-4">{edu.institution}</h3>
                  <p className="text-xl font-bold text-muted uppercase tracking-[0.1em] mb-8 border-l-[6px] border-ink pl-6 py-2">{edu.degree} in {edu.field}</p>
                  <div className="inline-block bg-ink text-white px-6 py-2 font-black text-sm uppercase tracking-[0.2em]">
                    GRADUATED_{edu.year}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-48 max-w-6xl mx-auto px-6 border-t-[10px] border-ink pt-16 pb-32 flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="text-5xl font-black uppercase tracking-[0.05em] leading-none">
          {profile?.name || rootUser?.name}
          <div className="text-sm font-bold mt-2 text-muted">BUILD_TIMESTAMP: 2026.04.04</div>
        </div>
        <div className="flex flex-wrap gap-10 text-xl font-black uppercase tracking-widest">
          {profile?.links?.github && <a href={profile.links.github} className="hover:text-accent border-b-[6px] border-transparent hover:border-accent pb-1 transition-all">Github_</a>}
          {profile?.links?.linkedin && <a href={profile.links.linkedin} className="hover:text-accent border-b-[6px] border-transparent hover:border-accent pb-1 transition-all">Linkedin_</a>}
        </div>
      </footer>
    </div>
  );
};
