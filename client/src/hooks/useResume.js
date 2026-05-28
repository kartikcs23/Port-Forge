import { useState, useCallback } from 'react';
import api from '../utils/axios';

/**
 * useResume — Hook for resume upload and parsing
 * Sends a PDF file to POST /api/resume/upload and returns
 * the structured extracted data (skills, experience, education, links).
 */
export const useResume = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const uploadResume = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    setExtractedData(null);
    setSuccessMessage('');

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await api.post('/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { extracted, profile } = response.data.data;
      setExtractedData(extracted);
      setSuccessMessage(response.data.message);

      return { success: true, extracted, profile };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setExtractedData(null);
    setSuccessMessage('');
  }, []);

  return { loading, error, extractedData, successMessage, uploadResume, reset };
};
