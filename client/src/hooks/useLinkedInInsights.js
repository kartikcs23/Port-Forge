import { useState, useCallback } from 'react';
import axios from '../utils/axios';

export const useLinkedInInsights = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchLinkedInInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/linkedin/analyze');
      if (response.data.success) {
        setData(response.data.data);
        return { success: true, data: response.data.data };
      } else {
        setError(response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch LinkedIn insights';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    data,
    fetchLinkedInInsights
  };
};
