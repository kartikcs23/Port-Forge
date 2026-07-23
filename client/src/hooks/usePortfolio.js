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
  const [aiRanking, setAiRanking] = useState(null);
  const [rankingLoading, setRankingLoading] = useState(false);

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
   * rankWithAI — Runs the AI portfolio-ranking analysis over the user's
   * synced GitHub repos. Cached server-side, so repeat calls with no repo
   * changes since the last analysis are near-instant.
   */
  const rankWithAI = useCallback(async (link) => {
    setRankingLoading(true);
    setError(null);
    try {
      const query = link ? `?link=${encodeURIComponent(link)}` : '';
      const response = await api.get(`/api/ranking/analyze${query}`);
      setAiRanking(response.data.data);
      return { success: true, data: response.data.data };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      return { success: false, message };
    } finally {
      setRankingLoading(false);
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
      const updatedProject = response.data.data.project;
      // Use the server's response (it also assigns/clears pinnedOrder and
      // may shift other pinned projects' order) instead of a naive local
      // toggle, so pinnedOrder never goes stale client-side.
      setProjects((prev) => {
        const previous = prev.find((p) => p._id === projectId);
        const vacatedOrder = previous?.pinnedOrder ?? -1;
        return prev.map((p) => {
          if (p._id === projectId) return updatedProject;
          // Unpinning closes the gap in other projects' pinnedOrder server-side;
          // mirror that locally so the UI doesn't need a refetch.
          if (!updatedProject.pinned && p.pinned && p.pinnedOrder > vacatedOrder) {
            return { ...p, pinnedOrder: p.pinnedOrder - 1 };
          }
          return p;
        });
      });
      return { success: true, data: response.data.data };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      return { success: false, message };
    }
  }, []);

  /**
   * reorderPinned — Sets the explicit display order of the user's pinned
   * projects (what actually decides top-project order on the public
   * portfolio, independent of score or AI rank).
   */
  const reorderPinned = useCallback(async (orderedIds) => {
    setError(null);
    try {
      const response = await api.patch('/api/profile/projects/pinned/reorder', { order: orderedIds });
      const updatedPinned = response.data.data.projects;
      const byId = new Map(updatedPinned.map((p) => [p._id, p]));
      setProjects((prev) => prev.map((p) => byId.get(p._id) || p));
      return { success: true, data: updatedPinned };
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
    aiRanking,
    rankingLoading,
    fetchPortfolio,
    generatePortfolio,
    togglePublish,
    syncGithub,
    fetchProjects,
    rankWithAI,
    togglePin,
    reorderPinned,
    updateProject,
    toggleProjectVisibility,
    updateTheme,
    updateProfileData,
  };
};
