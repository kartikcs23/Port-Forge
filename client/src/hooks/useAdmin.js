import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import api from '../utils/axios';

/**
 * useAdmin — Hook to check if current user is admin
 */
export const useAdmin = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isLoaded || !isSignedIn) {
        setLoading(false);
        return;
      }

      try {
        // Try to access admin stats - if successful, user is admin
        const response = await api.get('/api/admin/stats');
        setIsAdmin(response.status === 200);
      } catch (error) {
        // If 403 or other error, user is not admin
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [isLoaded, isSignedIn, user]);

  return { isAdmin, loading };
};