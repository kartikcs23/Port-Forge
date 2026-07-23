import { useState, useEffect } from 'react';
import { useAppUser } from './useAppUser';
import api from '../utils/axios';

/**
 * useAdmin — Hook to check if current user is admin
 */
export const useAdmin = () => {
  const { isLoaded, isSignedIn, user } = useAppUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isLoaded || !isSignedIn) {
        setLoading(false);
        return;
      }

      try {
        // Query admin status endpoint cleanly
        const response = await api.get('/api/admin/check');
        setIsAdmin(response.data?.isAdmin === true);
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [isLoaded, isSignedIn, user]);

  return { isAdmin, loading };
};