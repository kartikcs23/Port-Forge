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
      if (response.data.success && response.data.data) {
        setPortfolio(response.data.data.portfolio);
        return { success: true, data: response.data.data.portfolio };
      } else {
        setPortfolio(null);
        return { success: false, message: response.data.message };
      }
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
    setError(null);
    try {
      const response = await api.patch(`/api/profile/projects/${projectId}/pin`);
      // Update local state instead of re-fetching everything
      setProjects((prev) => 
        prev.map((p) => (p._id === projectId ? { ...p, pinned: !p.pinned } : p))
      );
      return { success: true, data: response.data.data };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      return { success: false, message };
    }
  }, []);

  const updateProject = useCallback(async (projectId, projectData) => {
    setError(null);
    try {
      const response = await api.put(`/api/profile/projects/${projectId}`, projectData);
      const updatedProject = response.data.data.project;
      setProjects((prev) =>
        prev.map((project) => (project._id === projectId ? updatedProject : project))
      );
      return { success: true, data: updatedProject };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      return { success: false, message };
    }
  }, []);

  const toggleProjectVisibility = useCallback(async (projectId) => {
    setError(null);
    try {
      const response = await api.patch(`/api/profile/projects/${projectId}/visibility`);
      const updatedProject = response.data.data.project;
      setProjects((prev) =>
        prev.map((project) => (project._id === projectId ? updatedProject : project))
      );
      return { success: true, data: updatedProject };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      return { success: false, message };
    }
  }, []);

  /**
   * updateTheme — Update portfolio theme
   */
  const updateTheme = useCallback(async (theme) => {
    try {
      const response = await api.put('/api/portfolio/update', { theme });
      setPortfolio(response.data.data.portfolio);
      return { success: true, data: response.data.data.portfolio };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      return { success: false, message };
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
    updateProject,
    toggleProjectVisibility,
    updateTheme,
    updateProfileData,
  };
};
