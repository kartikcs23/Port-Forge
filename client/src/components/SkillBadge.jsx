import React from 'react';

/**
 * SkillBadge — Display a single skill tag
 */
export const SkillBadge = ({ skill }) => {
  return (
    <span className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-110 shadow-lg">
      {skill}
    </span>
  );
};

/**
 * ExperienceItem — Display a work experience entry
 */
export const ExperienceItem = ({ experience }) => {
  return (
    <div className="glass-card border-l-4 border-blue-500 pl-6 py-4 hover-lift">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
            {experience.role}
          </h4>
          <p className="text-sm text-slate-400 font-semibold">
            @ {experience.company}
          </p>
        </div>
        <span className="text-sm text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full whitespace-nowrap ml-2">
          {experience.startDate} → {experience.endDate || 'Now'}
        </span>
      </div>
      {experience.description && (
        <p className="text-slate-300 text-sm leading-relaxed">
          {experience.description}
        </p>
      )}
    </div>
  );
};

/**
 * EducationItem — Display an education entry
 */
export const EducationItem = ({ education }) => {
  return (
    <div className="glass-card p-5 hover-lift border-l-4 border-purple-500">
      <h4 className="text-lg font-bold text-slate-100 mb-2">
        {education.degree}
      </h4>
      <p className="text-sm text-slate-400 font-semibold mb-2">
        {education.field} at <span className="text-slate-300">{education.institution}</span>
      </p>
      {education.year && (
        <p className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full inline-block">
          {education.year}
        </p>
      )}
    </div>
  );
};
