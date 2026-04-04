import { useState, useCallback } from 'react';
import axios from '../utils/axios';

export const useInsights = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/insights/analyze');
      if (response.data.success) {
        setData(response.data.data);
        return { success: true, data: response.data.data };
      } else {
        setError(response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch insights';
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
    fetchInsights
  };
};
