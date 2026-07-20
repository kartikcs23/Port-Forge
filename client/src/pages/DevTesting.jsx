import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BrutalistTheme } from '../components/themes/BrutalistTheme';
import { EgyptianTheme } from '../components/themes/EgyptianTheme';
import { SpaceTheme } from '../components/themes/SpaceTheme';
import { MedicalTheme } from '../components/themes/MedicalTheme';
import { ProfessionalTheme } from '../components/themes/ProfessionalTheme';
import { CinematicTheme } from '../components/themes/CinematicTheme';

/**
 * DEV-ONLY testing page — fetches a real GitHub profile + repos client-side
 * (public GitHub REST API, no token) and renders any theme with real data.
 * Reached via 5 rapid clicks on the navbar logo. Never linked anywhere.
 *
 * This whole route is only registered when import.meta.env.DEV is true
 * (see App.jsx) — a production build statically evaluates that to `false`
 * and Vite/Rollup tree-shakes this file out of the shipped bundle, so
 * pushing to GitHub / deploying automatically drops it. Nothing to
 * manually delete before a push.
 */

const THEMES = [
  { key: 'cinematic', label: 'Sakura Journey', Component: CinematicTheme },
  { key: 'brutalist', label: 'Architect', Component: BrutalistTheme },
  { key: 'egyptian', label: 'Luxor', Component: EgyptianTheme },
  { key: 'space', label: 'Nebula', Component: SpaceTheme },
  { key: 'medical', label: 'Asclepius', Component: MedicalTheme },
  { key: 'professional', label: 'Professional', Component: ProfessionalTheme },
];

const LS_KEY = 'pf-dev-testing-username';

const mapGithubToProfile = (user, repos) => {
  const languages = [...new Set(repos.map((r) => r.language).filter(Boolean))];
  return {
    name: user.name || user.login,
    headline: user.bio || 'Software Developer',
    bio: user.bio || `Building things at ${user.company || 'the terminal'}.`,
    intro: user.bio || '',
    email: user.email || '',
    location: user.location || '',
    avatarUrl: user.avatar_url,
    resumeUrl: '',
    skills: languages.slice(0, 15),
    experience: [],
    education: [],
    links: {
      github: user.html_url,
      linkedin: '',
      website: user.blog || '',
    },
  };
};

const mapGithubRepos = (repos) =>
  repos
    .filter((r) => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 8)
    .map((r) => ({
      _id: String(r.id),
      name: r.name,
      description: r.description || '',
      language: r.language || '',
      stars: r.stargazers_count,
      forks: r.forks_count,
      repoUrl: r.html_url,
    }));

export const DevTesting = () => {
  const [username, setUsername] = useState(() => localStorage.getItem(LS_KEY) || '');
  const [themeKey, setThemeKey] = useState('cinematic');
  const [status, setStatus] = useState('idle'); // idle | loading | error | ready
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);

  const fetchGithub = async (name) => {
    if (!name.trim()) return;
    setStatus('loading');
    setError('');
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${encodeURIComponent(name)}`),
        fetch(`https://api.github.com/users/${encodeURIComponent(name)}/repos?sort=updated&per_page=30`),
      ]);
      if (!userRes.ok) throw new Error(userRes.status === 404 ? 'GitHub user not found' : `GitHub API error (${userRes.status})`);
      if (!reposRes.ok) throw new Error(`Failed to fetch repos (${reposRes.status})`);

      const userData = await userRes.json();
      const reposData = await reposRes.json();

      setProfile(mapGithubToProfile(userData, reposData));
      setRepos(mapGithubRepos(reposData));
      setStatus('ready');
      localStorage.setItem(LS_KEY, name);
    } catch (err) {
      setError(err.message || 'Failed to fetch GitHub data');
      setStatus('error');
    }
  };

  useEffect(() => {
    if (username) fetchGithub(username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ActiveTheme = THEMES.find((t) => t.key === themeKey)?.Component || CinematicTheme;

  if (status === 'ready' && profile) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'fixed', top: 12, left: 12, zIndex: 9999, display: 'flex', gap: 8, alignItems: 'center',
          background: 'rgba(10,10,15,0.9)', border: '1px solid #f472b6', borderRadius: 10, padding: '8px 12px',
          fontFamily: 'monospace', fontSize: 12, color: '#fff', backdropFilter: 'blur(6px)',
        }}>
          <span style={{ color: '#f472b6', fontWeight: 700 }}>DEV TEST</span>
          <span>@{username}</span>
          <select value={themeKey} onChange={(e) => setThemeKey(e.target.value)} style={{ background: '#1a1a24', color: '#fff', border: '1px solid #444', borderRadius: 4, padding: '2px 6px' }}>
            {THEMES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
          </select>
          <button onClick={() => setStatus('idle')} style={{ background: '#f472b6', color: '#fff', border: 'none', borderRadius: 4, padding: '3px 10px', cursor: 'pointer', fontWeight: 700 }}>Change</button>
          <Link to="/" style={{ color: '#22d3ee' }}>Exit</Link>
        </div>
        <ActiveTheme rootUser={null} profile={profile} repos={repos} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: '#fff', fontFamily: 'monospace', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.3em', color: '#f472b6', marginBottom: 8 }}>DEV-ONLY · NOT SHIPPED TO PRODUCTION</div>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 24 }}>Testing Mode</h1>
        <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 24 }}>Enter a real GitHub username to preview any theme with live data (fetched client-side, no auth).</p>
        <form onSubmit={(e) => { e.preventDefault(); fetchGithub(username); }} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="github-username"
            style={{ flex: 1, background: '#16161f', border: '1px solid #333', borderRadius: 6, padding: '10px 12px', color: '#fff', fontFamily: 'monospace' }}
          />
          <select value={themeKey} onChange={(e) => setThemeKey(e.target.value)} style={{ background: '#16161f', color: '#fff', border: '1px solid #333', borderRadius: 6, padding: '0 8px' }}>
            {THEMES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
          </select>
          <button type="submit" style={{ background: '#f472b6', color: '#fff', border: 'none', borderRadius: 6, padding: '0 18px', fontWeight: 700, cursor: 'pointer' }}>Go</button>
        </form>
        {status === 'loading' && <div style={{ fontSize: 12, opacity: 0.6 }}>Fetching from GitHub…</div>}
        {status === 'error' && <div style={{ fontSize: 12, color: '#ef4444' }}>{error}</div>}
        <Link to="/" style={{ display: 'inline-block', marginTop: 24, fontSize: 12, color: '#22d3ee' }}>← Back to site</Link>
      </div>
    </div>
  );
};
