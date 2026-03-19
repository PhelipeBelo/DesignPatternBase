'use client'; // Garanta que este arquivo seja tratado como client component se necessário

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

  const updateReview = async (updatedReview) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${updatedReview.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedReview),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar avaliação');
      }

      const savedReview = await response.json();

      setReviews((prevReviews) => 
        prevReviews.map((rev) => (rev.id === savedReview.id ? savedReview : rev))
      );

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  // NOVA FUNÇÃO: Deleta a avaliação na API e no estado local
  const deleteReview = async (reviewId) => {
    setLoading(true); // Opcional: setar loading global
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar avaliação');
      }

      // Remove a avaliação da lista na tela imediatamente
      setReviews((prevReviews) => prevReviews.filter((rev) => rev.id !== reviewId));

      return { success: true };
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Erro ao deletar');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!fetchOnMount) return;
    fetchReviews();
  }, [fetchOnMount, fetchReviews]);

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews,
    updateReview,
    deleteReview, // <-- Exportamos a função de deletar aqui
  };
}