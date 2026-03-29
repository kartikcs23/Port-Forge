import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader3D } from './Loader3D';

/**
 * ProtectedRoute — Wrapper for routes that require authentication
 * If user is not authenticated, redirects to /login
 * Otherwise, renders the requested component
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader3D message="Authenticating..." />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
