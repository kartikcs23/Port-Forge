import React from 'react';

const ACCENT = '#c9302c'; // slightly deeper than the app's neon crimson — reads better in print

const SectionHeading = ({ children }) => (
  <h3 className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: ACCENT }}>
    {children}
    <span className="block w-8 h-0.5 mt-1" style={{ background: ACCENT }} />
  </h3>
);

/**
 * ModernTemplate — Same single-column, ATS-safe structure as ClassicTemplate
 * (still no tables/columns/graphics to trip up parsers), with the brand
 * accent used for hierarchy instead of relying purely on bold/italic.
 */
export const ModernTemplate = ({ profile, topProjects }) => {
  const contactParts = [
    profile?.email,
    profile?.phone,
    profile?.location,
    profile?.links?.website,
    profile?.links?.github,
    profile?.links?.linkedin,
  ].filter(Boolean);

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header className="mb-6">
        <h2 className="text-3xl font-black tracking-tight" style={{ color: ACCENT }}>{profile?.name || 'Your Name'}</h2>
        {profile?.headline && <p className="text-base font-semibold text-[#333] mt-0.5">{profile.headline}</p>}
        {contactParts.length > 0 && (
          <p className="text-xs text-[#555] mt-2">{contactParts.join('   ·   ')}</p>
        )}
      </header>

      {(profile?.intro || profile?.bio) && (
        <section className="mb-5">
          <SectionHeading>Summary</SectionHeading>
          <p className="text-sm leading-relaxed text-[#222]">{profile.intro || profile.bio}</p>
        </section>
      )}

      {profile?.education?.length > 0 && (
        <section className="mb-5">
          <SectionHeading>Education</SectionHeading>
          <div className="space-y-2.5">
            {profile.education.map((edu, i) => (
              <div key={i}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-bold text-sm text-[#111]">{edu.degree}{edu.field ? `, ${edu.field}` : ''} · {edu.institution}</span>
                  <span className="text-xs font-medium" style={{ color: ACCENT }}>{edu.year}</span>
                </div>
                {edu.description && <p className="text-sm text-[#333] mt-0.5 leading-relaxed">{edu.description}</p>}
              </div>
            ))}
          </div>
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
                  <span className="text-xs font-medium" style={{ color: ACCENT }}>{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : exp.startDate ? ' – Present' : ''}</span>
                </div>
                {exp.description && <p className="text-sm text-[#333] mt-0.5 leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {topProjects.length > 0 && (
        <section className="mb-5">
          <SectionHeading>Projects</SectionHeading>
          <div className="space-y-3">
            {topProjects.map((project) => (
              <div key={project._id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-bold text-sm text-[#111]">{project.name}</span>
                  {project.language && <span className="text-xs font-medium" style={{ color: ACCENT }}>{project.language}</span>}
                </div>
                {project.description && <p className="text-sm text-[#333] mt-0.5 leading-relaxed">{project.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {profile?.achievements?.length > 0 && (
        <section className="mb-5">
          <SectionHeading>Achievements</SectionHeading>
          <div className="space-y-2">
            {profile.achievements.map((ach, i) => (
              <div key={i}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-bold text-sm text-[#111]">{ach.title}</span>
                  <span className="text-xs font-medium" style={{ color: ACCENT }}>{ach.year}</span>
                </div>
                {ach.description && <p className="text-sm text-[#333] mt-0.5 leading-relaxed">{ach.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {profile?.skills?.length > 0 && (
        <section>
          <SectionHeading>Skills</SectionHeading>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 list-none">
            {profile.skills.map((skill, i) => (
              <li key={i} className="text-sm text-[#222] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
                {skill}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
