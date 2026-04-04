import { useState, useCallback } from 'react';
import api from '../utils/axios';

/**
 * usePortfolio — Hook for portfolio operations
 * Handles sync, generate, publish, and fetch operations
 */
export const usePortfolio = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [projects, setProjects] = useState([]);

  /**
   * fetchPortfolio — Get current user's portfolio
   */
  const fetchPortfolio = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/portfolio/mine');
      setPortfolio(response.data.data.portfolio);
      return { success: true, data: response.data.data.portfolio };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * generatePortfolio — Create a new portfolio
   */
  const generatePortfolio = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/portfolio/generate');
      setPortfolio(response.data.data.portfolio);
      return { success: true, data: response.data.data.portfolio };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * togglePublish — Toggle portfolio published status
   */
  const togglePublish = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch('/api/portfolio/publish');
      setPortfolio(response.data.data.portfolio);
      return { success: true, data: response.data.data.portfolio };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * syncGithub — Sync GitHub data
   */
  const syncGithub = useCallback(async (link) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/sync/github?link=${encodeURIComponent(link)}`);
      setProjects(response.data.data.topProjects || [])
      return { success: true, data: response.data.data };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * updateProfileData — Manually update profile fields
   */
  const updateProfileData = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put('/api/profile/update', profileData);
      return { success: true, data: response.data.data.profile };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * fetchProjects — Get current user's projects
   */
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/profile/projects');
      setProjects(response.data.data.projects || []);
      return { success: true, data: response.data.data.projects };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * togglePin — Toggle project pinned status
   */
  const togglePin = useCallback(async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/api/profile/projects/${projectId}/pin`);
      // Update local state instead of re-fetching everything
      setProjects((prev) => 
        prev.map((p) => (p._id === projectId ? { ...p, isPinned: !p.isPinned } : p))
      );
      return { success: true, data: response.data.data };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * updateTheme — Update portfolio theme
   */
  const updateTheme = useCallback(async (theme) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put('/api/portfolio/update', { theme });
      setPortfolio(response.data.data.portfolio);
      return { success: true, data: response.data.data.portfolio };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    portfolio,
    projects,
    fetchPortfolio,
    generatePortfolio,
    togglePublish,
    syncGithub,
    fetchProjects,
    togglePin,
    updateTheme,
    updateProfileData,
  };
};
