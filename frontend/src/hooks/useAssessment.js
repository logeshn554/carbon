import { useState } from 'react';
import { assessmentService } from '../services/assessmentService';
import { useUser } from './useUser';

export function useAssessment() {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createAssessment = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await assessmentService.create(data);
      setAssessment(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAssessment = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await assessmentService.getById(id);
      setAssessment(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { assessment, loading, error, createAssessment, fetchAssessment };
}

export function useUserAssessments(userId) {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { resetUser } = useUser();

  const fetchAssessments = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const results = await assessmentService.getByUser(userId);
      setAssessments(results);
      return results;
    } catch (err) {
      setError(err.message);
      if (err.message?.includes('User not found')) {
        resetUser();
      }
    } finally {
      setLoading(false);
    }
  };

  return { assessments, loading, error, fetchAssessments };
}
