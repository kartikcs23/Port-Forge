import React from 'react';

const SectionHeading = ({ children }) => (
  <h3 className="text-sm font-bold uppercase tracking-wide border-b border-[#1a1a1a] pb-0.5 mb-2">{children}</h3>
);

/**
 * ClassicTemplate — Modeled directly on "Jake's Resume" (Jake Gutierrez),
 * the most widely recommended resume template among CS/software engineering
 * students — single-column, no graphics or tables, bold/italic hierarchy
 * only. Praised specifically because it parses cleanly through ATS systems
 * that choke on multi-column layouts and decoration.
 */
export const ClassicTemplate = ({ profile, topProjects }) => {
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
      <header className="text-center mb-5">
        <h2 className="text-2xl font-bold tracking-wide">{profile?.name || 'Your Name'}</h2>
        {contactParts.length > 0 && (
          <p className="text-xs text-[#333] mt-1.5">
            {contactParts.map((part, i) => (
              <span key={i}>
                {i > 0 && <span className="mx-1.5">|</span>}
                <span className="underline">{part}</span>
              </span>
            ))}
          </p>
        )}
      </header>

      {profile?.education?.length > 0 && (
        <section className="mb-4">
          <SectionHeading>Education</SectionHeading>
          <div className="space-y-3">
            {profile.education.map((edu, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm">
                  <span className="font-bold">{edu.institution}</span>
                  <span className="font-bold">{edu.year || ''}</span>
                </div>
                <div className="text-sm italic">{edu.degree}{edu.field ? `, ${edu.field}` : ''}</div>
                {edu.description && (
                  <ul className="list-disc list-outside ml-4 mt-1 text-sm leading-snug text-[#222]">
                    <li>{edu.description}</li>
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {(profile?.intro || profile?.bio) && (
        <section className="mb-4">
          <SectionHeading>Summary</SectionHeading>
          <p className="text-sm leading-snug text-[#222]">{profile.intro || profile.bio}</p>
        </section>
      )}

      {profile?.experience?.length > 0 && (
        <section className="mb-4">
          <SectionHeading>Experience</SectionHeading>
          <div className="space-y-3">
            {profile.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm">
                  <span className="font-bold">{exp.company}</span>
                  <span className="font-bold">{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : exp.startDate ? ' – Present' : ''}</span>
                </div>
                <div className="text-sm italic">{exp.role}</div>
                {exp.description && (
                  <ul className="list-disc list-outside ml-4 mt-1 text-sm leading-snug text-[#222]">
                    <li>{exp.description}</li>
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {topProjects.length > 0 && (
        <section className="mb-4">
          <SectionHeading>Projects</SectionHeading>
          <div className="space-y-3">
            {topProjects.map((project) => (
              <div key={project._id}>
                <div className="flex justify-between text-sm">
                  <span>
                    <span className="font-bold">{project.name}</span>
                    {project.language && <span className="italic"> | {project.language}</span>}
                  </span>
                </div>
                {project.description && (
                  <ul className="list-disc list-outside ml-4 mt-1 text-sm leading-snug text-[#222]">
                    <li>{project.description}</li>
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {profile?.achievements?.length > 0 && (
        <section className="mb-4">
          <SectionHeading>Achievements</SectionHeading>
          <div className="space-y-2">
            {profile.achievements.map((ach, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm">
                  <span className="font-bold">{ach.title}</span>
                  <span className="font-bold">{ach.year || ''}</span>
                </div>
                {ach.description && (
                  <ul className="list-disc list-outside ml-4 mt-1 text-sm leading-snug text-[#222]">
                    <li>{ach.description}</li>
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {profile?.skills?.length > 0 && (
        <section>
          <SectionHeading>Skills</SectionHeading>
          <ul className="grid grid-cols-3 gap-x-4 gap-y-1 list-none">
            {profile.skills.map((skill, i) => (
              <li key={i} className="text-sm text-[#222] flex items-start gap-1.5">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-[#1a1a1a] shrink-0" />
                {skill}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
