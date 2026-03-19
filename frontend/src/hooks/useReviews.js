import { useEffect, useState, useCallback } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export function useReviews({ initialReviews = [], fetchOnMount = false } = {}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/reviews`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar avaliações (status ${response.status})`);
      }

      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!fetchOnMount) return;
    fetchReviews();
  }, [fetchOnMount, fetchReviews]);

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews,
  };
}