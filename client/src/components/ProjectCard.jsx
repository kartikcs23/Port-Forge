import React from 'react';

/**
 * Brutalist Custom ProjectCard component
 */
export const ProjectCard = ({ project, onPin, loading }) => {
  return (
    <div className="bg-background border-2 border-ink p-6 hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-transform hover:-translate-y-1 relative group">
      
      {/* Activity Badge */}
      <div className="absolute -top-3 -right-3 bg-accent text-white border-2 border-ink px-3 py-1 font-bold text-xs uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] rotate-3 group-hover:rotate-6 transition-transform">
        SCORE {project.score || 0}
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-black text-ink uppercase tracking-tight">{project.name}</h3>
            {project.pinned && (
              <span className="bg-ink text-white text-[10px] px-2 py-0.5 rounded-none font-bold tracking-widest uppercase">PINNED</span>
            )}
          </div>
          <p className="text-muted font-sans text-sm line-clamp-2 max-w-2xl leading-relaxed mb-4">
            {project.description || 'No description provided.'}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {project.topics?.slice(0, 4).map((topic, i) => (
              <span key={i} className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-surface border border-ink text-ink">
                {topic}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest font-sans text-ink">
            <span className="flex items-center gap-1 border-b border-ink">★ {project.stars || 0}</span>
            <span className="flex items-center gap-1 border-b border-ink">⑂ {project.forks || 0}</span>
            <span className="flex items-center gap-1">⟎ {project.language || 'GHOST'}</span>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto pt-4 md:pt-0 border-t-2 border-ink border-dashed md:border-transparent">
          <button
            onClick={() => onPin(project._id)}
            disabled={loading}
            className="px-4 py-2 border-2 border-ink font-bold uppercase tracking-widest text-[10px] transition-all"
          >
            {project.pinned ? 'UNPIN' : 'PIN'}
          </button>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border-2 border-ink bg-surface font-bold uppercase tracking-widest text-[10px] text-ink hover:bg-ink hover:text-white transition-all text-center flex-1 md:flex-none"
          >
            SOURCE
          </a>
        </div>
      </div>
    </div>
  );
};