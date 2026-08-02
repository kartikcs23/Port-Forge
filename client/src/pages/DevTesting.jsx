import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { BrutalistTheme } from '../components/themes/BrutalistTheme';
import { EgyptianTheme } from '../components/themes/EgyptianTheme';
import { SpaceTheme } from '../components/themes/SpaceTheme';
import { MedicalTheme } from '../components/themes/MedicalTheme';
import { ProfessionalTheme } from '../components/themes/ProfessionalTheme';
import { CinematicTheme } from '../components/themes/CinematicTheme';

/**
 * DEV-ONLY testing page — fetches a real GitHub profile + repos client-side
 * (public GitHub REST API) and renders any theme with real data.
 * Reached via 5 rapid clicks on the navbar logo. Never linked anywhere.
 *
 * An optional Personal Access Token can be pasted in to raise the GitHub
 * API rate limit from 60/hr (unauthenticated) to 5000/hr. Generate one at
 * github.com → Settings → Developer settings → Personal access tokens
 * (a fine-grained token with no scopes/read-only is enough — this page
 * only ever does GET requests). The token stays in this browser's
 * localStorage and is sent directly from the browser to api.github.com;
 * it never touches our server.
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
const LS_KEY_TOKEN = 'pf-dev-testing-token';

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
  const navigate = useNavigate();
  const [username, setUsername] = useState(() => localStorage.getItem(LS_KEY) || '');
  const [token, setToken] = useState(() => localStorage.getItem(LS_KEY_TOKEN) || '');
  const [themeKey, setThemeKey] = useState('cinematic');
  const [status, setStatus] = useState('idle'); // idle | loading | error | ready
  const [error, setError] = useState('');
  const [rateLimit, setRateLimit] = useState(null);
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [devLoginBusy, setDevLoginBusy] = useState(false);
  const [devLoginError, setDevLoginError] = useState('');
  const devLoggedIn = !!localStorage.getItem('authToken');

  // Real backend session for a fixed local test account — lets you click
  // through the actual Dashboard/Profile/Resume pages against the live
  // API without going through Clerk's hosted sign-in each time. Issues a
  // normally-verified local JWT (server/controllers/authController.js
  // devLogin, 404s outside development) — not an auth bypass, just a
  // fast way to obtain a real credential locally.
  const handleDevLogin = async () => {
    setDevLoginBusy(true);
    setDevLoginError('');
    try {
      const res = await api.post('/api/auth/dev-login');
      if (res.data.success) {
        localStorage.setItem('authToken', res.data.data.token);
        navigate('/dashboard');
      } else {
        setDevLoginError(res.data.message || 'Dev login failed');
      }
    } catch (err) {
      setDevLoginError(err.response?.data?.message || err.message);
    } finally {
      setDevLoginBusy(false);
    }
  };

  const handleDevLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const fetchGithub = async (name, tok) => {
    if (!name.trim()) return;
    setStatus('loading');
    setError('');
    setRateLimit(null);
    try {
      const headers = tok ? { Authorization: `token ${tok}` } : {};
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${encodeURIComponent(name)}`, { headers }),
        fetch(`https://api.github.com/users/${encodeURIComponent(name)}/repos?sort=updated&per_page=30`, { headers }),
      ]);

      const remaining = userRes.headers.get('x-ratelimit-remaining');
      const limit = userRes.headers.get('x-ratelimit-limit');
      if (remaining !== null) setRateLimit(`${remaining}/${limit} GitHub requests left this hour`);

      if (!userRes.ok) {
        if (userRes.status === 404) throw new Error('GitHub user not found');
        if (userRes.status === 401) throw new Error('Invalid token — check it was copied correctly');
        if (userRes.status === 403) throw new Error('Rate limited by GitHub. Paste a Personal Access Token below to raise the limit to 5000/hr.');
        throw new Error(`GitHub API error (${userRes.status})`);
      }
      if (!reposRes.ok) throw new Error(`Failed to fetch repos (${reposRes.status})`);

      const userData = await userRes.json();
      const reposData = await reposRes.json();

      setProfile(mapGithubToProfile(userData, reposData));
      setRepos(mapGithubRepos(reposData));
      setStatus('ready');
      localStorage.setItem(LS_KEY, name);
      if (tok) localStorage.setItem(LS_KEY_TOKEN, tok);
    } catch (err) {
      setError(err.message || 'Failed to fetch GitHub data');
      setStatus('error');
    }
  };

  useEffect(() => {
    if (username) fetchGithub(username, token);
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

        <div style={{ border: '1px solid #333', borderRadius: 8, padding: 16, marginBottom: 24, textAlign: 'left' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', color: '#22d3ee', marginBottom: 8 }}>REAL BACKEND SESSION</div>
          <p style={{ fontSize: 12, opacity: 0.6, marginBottom: 12, lineHeight: 1.5 }}>
            Log into a fixed local test account to click through the actual Dashboard, Profile, and Resume pages against the live API — no Clerk sign-in needed.
          </p>
          {devLoggedIn ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#4ade80' }}>✓ Signed in as dev@portforge.local</span>
              <button onClick={handleDevLogout} style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 12 }}>Log out</button>
              <Link to="/dashboard" style={{ color: '#22d3ee', fontSize: 12 }}>Go to Dashboard →</Link>
            </div>
          ) : (
            <button onClick={handleDevLogin} disabled={devLoginBusy} style={{ background: '#22d3ee', color: '#0a0a0f', border: 'none', borderRadius: 6, padding: '10px 18px', fontWeight: 700, cursor: 'pointer', opacity: devLoginBusy ? 0.6 : 1 }}>
            {devLoginBusy ? 'Logging in…' : 'Dev Login →'}
            </button>
          )}
          {devLoginError && <div style={{ fontSize: 12, color: '#ef4444', marginTop: 8 }}>{devLoginError}</div>}
        </div>

        <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 24 }}>Or enter a real GitHub username to preview any theme with live data (fetched client-side), no login needed.</p>
        <form onSubmit={(e) => { e.preventDefault(); fetchGithub(username, token); }} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="github-username"
              style={{ flex: 1, background: '#16161f', border: '1px solid #333', borderRadius: 6, padding: '10px 12px', color: '#fff', fontFamily: 'monospace' }}
            />
            <select value={themeKey} onChange={(e) => setThemeKey(e.target.value)} style={{ background: '#16161f', color: '#fff', border: '1px solid #333', borderRadius: 6, padding: '0 8px' }}>
              {THEMES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
            </select>
          </div>
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            type="password"
            placeholder="GitHub token (optional — raises rate limit to 5000/hr)"
            style={{ background: '#16161f', border: '1px solid #333', borderRadius: 6, padding: '10px 12px', color: '#fff', fontFamily: 'monospace', fontSize: 12 }}
          />
          <button type="submit" style={{ background: '#f472b6', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 18px', fontWeight: 700, cursor: 'pointer' }}>Go</button>
        </form>
        {status === 'loading' && <div style={{ fontSize: 12, opacity: 0.6 }}>Fetching from GitHub…</div>}
        {status === 'error' && <div style={{ fontSize: 12, color: '#ef4444', marginBottom: 8 }}>{error}</div>}
        {rateLimit && <div style={{ fontSize: 11, opacity: 0.5 }}>{rateLimit}</div>}
        <p style={{ fontSize: 10, opacity: 0.4, marginTop: 16, lineHeight: 1.5 }}>
          No token needed for occasional use. If you hit a rate limit, generate a token at{' '}
          <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" style={{ color: '#22d3ee' }}>github.com/settings/tokens</a>
          {' '}(no scopes needed — this page only reads public data) and paste it above. It's stored only in this browser's localStorage and sent directly to GitHub, never through our server.
        </p>
        <Link to="/" style={{ display: 'inline-block', marginTop: 16, fontSize: 12, color: '#22d3ee' }}>← Back to site</Link>
      </div>
    </div>
  );
};
