import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/axios';

/**
 * AuthContext — Global authentication state
 * Stores user info, token, loading state
 * Provides login, register, logout methods
 */
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * On mount: check localStorage for existing token
   * If found, verify with backend (/api/auth/me)
   */
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * register — Create new user account
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @returns {object} { success, user, token }
   */
  const register = async (name, email, password) => {
    try {
      const response = await api.post('/api/auth/register', {
        name,
        email,
        password,
      });

      const { data: userData, token: newToken } = response.data.data;

      localStorage.setItem('authToken', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);

      return { success: true, user: userData, token: newToken };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, message };
    }
  };

  /**
   * login — Authenticate with email + password
   * @param {string} email
   * @param {string} password
   * @returns {object} { success, user, token }
   */
  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password,
      });

      const { data: userData, token: newToken } = response.data.data;

      localStorage.setItem('authToken', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);

      return { success: true, user: userData, token: newToken };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, message };
    }
  };

  /**
   * logout — Clear auth state and localStorage
   */
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
