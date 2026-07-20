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
 * Request interceptor - attach Clerk JWT token
 * Waits up to 3s for Clerk session to hydrate (avoids 401s on fast initial requests)
 */
api.interceptors.request.use(
  async (config) => {
    let token = null;

    // Wait briefly if Clerk is present but session is loading
    if (window.Clerk) {
      let attempts = 0;
      while (!window.Clerk.session && attempts < 15) {
        await new Promise((r) => setTimeout(r, 200));
        attempts++;
      }
    }

    if (window.Clerk && window.Clerk.session) {
      try {
        token = await window.Clerk.session.getToken();
      } catch (err) {
        console.warn('Failed to get Clerk token:', err);
      }
    }

    // Fallback to localStorage authToken (used by local auth / AuthContext)
    if (!token) {
      token = localStorage.getItem('authToken');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor - handle auth errors
 * On 401 Unauthorized: clear any stale local tokens
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Intentionally NOT redirecting to avoid Clerk redirect loops.
    }
    return Promise.reject(error);
  }
);

export default api;
