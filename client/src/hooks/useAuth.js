import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * useAuth — Hook to access auth context
 * @returns {object} { user, token, loading, register, login, logout, isAuthenticated }
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
