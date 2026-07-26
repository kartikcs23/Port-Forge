import React from 'react';

const SectionHeading = ({ children, dark }) => (
  <h3 className={`text-[11px] font-black uppercase tracking-widest mb-2 pb-1 border-b ${dark ? 'text-white border-white/25' : 'text-[#eb3b3b] border-[#eb3b3b]/30'}`}>
    {children}
  </h3>
);

/**
 * CompactTemplate — Two-column layout: a narrow sidebar for contact/skills/
 * education, wider main column for experience and projects. Fits more
 * content on one page than the single-column templates, at a small ATS
 * tradeoff — some older parsers read multi-column layouts out of order.
 * Best for candidates with a longer history who've already got past initial
 * resume screens, or are submitting directly to a person rather than a bot.
 */
export const CompactTemplate = ({ profile, topProjects }) => {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header className="mb-6">
        <h2 className="text-3xl font-black tracking-tight text-[#111]">{profile?.name || 'Your Name'}</h2>
        {profile?.headline && <p className="text-base font-semibold text-[#eb3b3b] mt-0.5">{profile.headline}</p>}
      </header>

      <div className="grid grid-cols-[1fr_2fr] gap-6">
        {/* Sidebar */}
        <div className="bg-[#1a1a1a] text-white p-4 -ml-4 space-y-5" style={{ marginTop: '-0.5rem' }}>
          <div>
            <SectionHeading dark>Contact</SectionHeading>
            <div className="space-y-1 text-xs text-white/85">
              {profile?.email && <div className="break-all">{profile.email}</div>}
              {profile?.phone && <div>{profile.phone}</div>}
              {profile?.location && <div>{profile.location}</div>}
              {profile?.links?.website && <div className="break-all">{profile.links.website}</div>}
              {profile?.links?.github && <div className="break-all">{profile.links.github}</div>}
              {profile?.links?.linkedin && <div className="break-all">{profile.links.linkedin}</div>}
            </div>
          </div>

          {profile?.skills?.length > 0 && (
            <div>
              <SectionHeading dark>Skills</SectionHeading>
              <div className="flex flex-col gap-1">
                {profile.skills.map((skill, i) => (
                  <span key={i} className="text-xs text-white/85">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {profile?.education?.length > 0 && (
            <div>
              <SectionHeading dark>Education</SectionHeading>
              <div className="space-y-3">
                {profile.education.map((edu, i) => (
                  <div key={i}>
                    <div className="text-xs font-bold text-white">{edu.degree}{edu.field ? `, ${edu.field}` : ''}</div>
                    <div className="text-xs text-white/70">{edu.institution}</div>
                    <div className="text-xs text-white/70">{edu.year}</div>
                    {edu.description && <div className="text-[11px] text-white/60 mt-1 leading-snug">{edu.description}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile?.achievements?.length > 0 && (
            <div>
              <SectionHeading dark>Achievements</SectionHeading>
              <div className="space-y-2.5">
                {profile.achievements.map((ach, i) => (
                  <div key={i}>
                    <div className="text-xs font-bold text-white">{ach.title}</div>
                    {ach.year && <div className="text-xs text-white/70">{ach.year}</div>}
                    {ach.description && <div className="text-[11px] text-white/60 mt-1 leading-snug">{ach.description}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main column */}
        <div>
          {(profile?.intro || profile?.bio) && (
            <section className="mb-5">
              <SectionHeading>Summary</SectionHeading>
              <p className="text-sm leading-relaxed text-[#222]">{profile.intro || profile.bio}</p>
            </section>
          )}

          {profile?.experience?.length > 0 && (
            <section className="mb-5">
              <SectionHeading>Experience</SectionHeading>
              <div className="space-y-3">
                {profile.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-bold text-sm text-[#111]">{exp.role}{exp.company ? ` · ${exp.company}` : ''}</span>
                      <span className="text-xs font-medium text-[#eb3b3b]">{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : exp.startDate ? ' – Present' : ''}</span>
                    </div>
                    {exp.description && <p className="text-sm text-[#333] mt-0.5 leading-relaxed">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {topProjects.length > 0 && (
            <section>
              <SectionHeading>Projects</SectionHeading>
              <div className="space-y-3">
                {topProjects.map((project) => (
                  <div key={project._id}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-bold text-sm text-[#111]">{project.name}</span>
                      {project.language && <span className="text-xs font-medium text-[#eb3b3b]">{project.language}</span>}
                    </div>
                    {project.description && <p className="text-sm text-[#333] mt-0.5 leading-relaxed">{project.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
