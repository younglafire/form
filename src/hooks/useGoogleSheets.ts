import { useState, useEffect, useCallback } from 'react';
import { GoogleSheetsService } from '../services/googleSheets';
import { Answer } from '../types';

export const useGoogleSheets = () => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sheetsService = GoogleSheetsService.getInstance();

  const fetchAnswers = useCallback(async () => {
    try {
      setError(null);
      const fetchedAnswers = await sheetsService.fetchAvailableAnswers();
      setAnswers(fetchedAnswers);
    } catch (err) {
      setError('Failed to load available answers');
    } finally {
      setLoading(false);
    }
  }, [sheetsService]);

  const submitResponse = async (name: string, selectedAnswerId: string): Promise<boolean> => {
    setSubmitting(true);
    setError(null);

    try {
      const success = await sheetsService.submitResponse(name, selectedAnswerId);
      
      if (success) {
        // Remove the selected answer from local state
        setAnswers(prev => prev.filter(answer => answer.id !== selectedAnswerId));
        return true;
      }
      
      return false;
    } catch (err) {
      setError('Failed to submit response');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Real-time polling for updates
  useEffect(() => {
    fetchAnswers();
    
    const interval = setInterval(fetchAnswers, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
  }, [fetchAnswers]);

  return {
    answers,
    loading,
    submitting,
    error,
    submitResponse,
    refetch: fetchAnswers,
  };
};