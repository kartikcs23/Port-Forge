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
 * Request interceptor — attach JWT token from localStorage
 * Adds Authorization header with Bearer token if available
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      // Dispatch logout event or redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
