import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * ProtectedRoute — Wrapper for routes that require authentication
 * If user is not authenticated, redirects to /login
 * Otherwise, renders the requested component
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Remove loading check - let content render normally
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
