import React from 'react';

/**
 * ProjectCard — Display a single project
 * Shows: name, description, stars, languages, pinned toggle
 */
export const ProjectCard = ({ project, onPin, loading }) => {
  return (
    <div className="glass-card p-6 hover-lift group">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-cyan-300 transition-all group-hover:scale-105"
          >
            {project.name}
          </a>
          <p className="text-sm text-slate-400 mt-2 group-hover:text-slate-300 transition-colors">
            {project.description || 'No description provided'}
          </p>
        </div>
        <button
          onClick={() => onPin(project._id)}
          disabled={loading}
          className={`ml-4 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 transform hover:scale-110 active:scale-95 disabled:opacity-50 flex-shrink-0 ${
            project.pinned
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50'
          }`}
        >
          {project.pinned ? '📌' : '📍'}
        </button>
      </div>

      {/* Meta Info */}
      <div className="flex items-center flex-wrap gap-3 mb-4">
        <span className="flex items-center gap-1 text-yellow-400 font-semibold bg-yellow-500/20 px-3 py-1 rounded-full text-sm border border-yellow-500/30">
          ⭐ {project.stars}
        </span>
        <span className="flex items-center gap-1 text-green-400 font-semibold bg-green-500/20 px-3 py-1 rounded-full text-sm border border-green-500/30">
          🍴 {project.forks}
        </span>
        {project.score && (
          <span className="flex items-center gap-1 text-blue-300 font-semibold bg-blue-500/20 px-3 py-1 rounded-full text-sm border border-blue-500/30">
            🔥 Score: {Math.round(project.score)}
          </span>
        )}
      </div>

      {/* Languages */}
      {project.languages && project.languages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {project.languages.map((lang, idx) => (
            <span
              key={idx}
              className="text-xs bg-gradient-to-r from-slate-700 to-slate-600 text-slate-200 px-3 py-1 rounded-full font-semibold border border-slate-600/50 hover:from-slate-600 hover:to-slate-500 transition-all"
            >
              {lang}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
