import React from 'react';

const palettes = {
  JavaScript: ['#f7df1e', '#111827', '#f97316'],
  TypeScript: ['#3178c6', '#0f172a', '#22d3ee'],
  Python: ['#3776ab', '#ffd43b', '#0f172a'],
  Java: ['#f97316', '#0f172a', '#ef4444'],
  HTML: ['#e34f26', '#111827', '#f97316'],
  CSS: ['#1572b6', '#0f172a', '#38bdf8'],
  React: ['#61dafb', '#0f172a', '#8b5cf6'],
  default: ['#22d3ee', '#111827', '#8b5cf6'],
};

const getPalette = (language = '') => {
  const key = Object.keys(palettes).find((item) => language.toLowerCase().includes(item.toLowerCase()));
  return palettes[key] || palettes.default;
};

const initialsFromName = (name = 'Project') =>
  name
    .replace(/[-_]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'PF';

export const ProjectVisual = ({ repo = {}, theme = 'dark', compact = false }) => {
  const [primary, ink, accent] = getPalette(repo.language || repo.name);
  const name = repo.name || 'Project';
  const language = repo.language || 'Code';
  const initials = initialsFromName(name);
  const isLight = theme === 'light' || theme === 'medical' || theme === 'brutalist';

  return (
    <div
      className={`project-visual project-visual-${theme} ${compact ? 'project-visual-compact' : ''}`}
      style={{
        '--pv-primary': primary,
        '--pv-ink': ink,
        '--pv-accent': accent,
        '--pv-text': isLight ? '#0f172a' : '#ffffff',
      }}
      aria-hidden="true"
    >
      <div className="project-visual-grid" />
      <div className="project-visual-orbit project-visual-orbit-a" />
      <div className="project-visual-orbit project-visual-orbit-b" />
      <div className="project-visual-window">
        <div className="project-visual-bar">
          <span />
          <span />
          <span />
        </div>
        <div className="project-visual-body">
          <div className="project-visual-mark">{initials}</div>
          <div className="project-visual-lines">
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
      <div className="project-visual-footer">
        <span>{language}</span>
        <span>{repo.stars || 0} stars</span>
      </div>
    </div>
  );
};
