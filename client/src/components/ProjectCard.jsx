import React from 'react';

/**
 * Brutalist Custom ProjectCard component
 */
export const ProjectCard = ({ project, onPin, loading }) => {
  const sourceUrl = project.repoUrl || project.url;
  const hasAiScore = project.aiScore != null;

  return (
    <div className={`bg-card border-2 border-border p-6 hover:shadow-[6px_6px_0px_0px_#141822] hover:border-primary transition-all duration-300 relative group ${project.hidden || project.aiTier === 'hidden' ? 'opacity-60' : ''}`}>

      {/* Score badge — AI rank/score once ranked, activity heuristic otherwise */}
      <div className="absolute -top-3 -right-3 bg-accent text-white border-2 border-border px-3 py-1 font-bold text-xs uppercase tracking-widest shadow-[2px_2px_0px_0px_#141822] rotate-3 group-hover:rotate-6 transition-transform">
        {hasAiScore ? `AI #${project.aiRank ?? '—'} · ${project.aiScore}/100` : `SCORE ${project.score || 0} / 10`}
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">{project.name}</h3>
            {project.pinned && (
              <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-none font-bold tracking-widest uppercase">PINNED</span>
            )}
            {project.hidden && (
              <span className="bg-muted text-white text-[10px] px-2 py-0.5 rounded-none font-bold tracking-widest uppercase">HIDDEN</span>
            )}
            {project.isCollaboration && (
              <span className="bg-background border border-border text-foreground text-[10px] px-2 py-0.5 rounded-none font-bold tracking-widest uppercase">COLLABORATOR</span>
            )}
            {project.aiTier && (
              <span className={`text-[10px] px-2 py-0.5 rounded-none font-bold tracking-widest uppercase ${
                project.aiTier === 'featured' ? 'bg-primary text-white' : project.aiTier === 'recommended' ? 'bg-secondary text-foreground border border-border' : 'bg-muted text-white'
              }`}>
                {project.aiTier}
              </span>
            )}
            {project.aiCategory && (
              <span className="text-[10px] px-2 py-0.5 rounded-none font-bold tracking-widest uppercase bg-background border border-border text-muted-foreground">
                {project.aiCategory}
              </span>
            )}
          </div>
          <p className="text-muted-foreground font-sans text-sm line-clamp-2 max-w-2xl leading-relaxed mb-4">
            {project.description || 'No description provided.'}
          </p>
          {project.aiReason && (
            <p className="text-accent font-sans text-xs italic line-clamp-2 max-w-2xl leading-relaxed mb-4">
              AI: {project.aiReason}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {project.topics?.slice(0, 4).map((topic, i) => (
              <span key={i} className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-secondary border border-border text-foreground">
                {topic}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest font-sans text-muted-foreground">
            <span className="flex items-center gap-1 border-b border-border">★ {project.stars || 0}</span>
            <span className="flex items-center gap-1 border-b border-border">⑂ {project.forks || 0}</span>
            <span className="flex items-center gap-1 text-primary">⟎ {project.language || 'GHOST'}</span>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto pt-4 md:pt-0 border-t-2 border-border border-dashed md:border-transparent">
          <button
            onClick={() => onPin(project._id)}
            disabled={loading}
            className="px-4 py-2 border-2 border-border bg-secondary text-foreground hover:bg-primary hover:text-white font-bold uppercase tracking-widest text-[10px] transition-all"
          >
            {project.pinned ? 'UNPIN' : 'PIN'}
          </button>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-4 py-2 border-2 border-border bg-secondary font-bold uppercase tracking-widest text-[10px] text-foreground hover:bg-primary hover:text-white transition-all text-center flex-1 md:flex-none ${!sourceUrl ? 'pointer-events-none opacity-50' : ''}`}
          >
            SOURCE
          </a>
        </div>
      </div>
    </div>
  );
};
