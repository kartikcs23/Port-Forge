import axios from 'axios';

/**
 * Axios instance configured for API communication
 * Base URL from VITE_API_URL environment variable
 * Includes request/response interceptors for JWT handling
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor â€” attach Clerk JWT token
 * Fetches token live from Clerk's global instance 
 */
api.interceptors.request.use(
  async (config) => {
    // Use Clerk global object if present
    if (window.Clerk && window.Clerk.session) {
      try {
        const token = await window.Clerk.session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.warn('Failed to get clerk token:', err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor — handle auth errors
 * On 401 Unauthorized: clear token, redirect to login
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Intentionally removed window.location.href = '/login' to stop Clerk redirect loops.
    }
    return Promise.reject(error);
  }
);

export default api;
