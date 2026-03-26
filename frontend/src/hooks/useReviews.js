'use client'; 

import { useEffect, useState, useCallback } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export function useReviews({ recipeId, initialReviews = [], fetchOnMount = false } = {}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    if (!recipeId) return;
    
    setLoading(true);
    setError(null);

    try {
      // Rota GET corrigida conforme o Swagger
      const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/reviews`);

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
  }, [recipeId]);

  const addReview = async (newReview) => {
    // ADICIONE ESTE LOG PARA VER O QUE ESTÁ CHEGANDO:
    console.log("Tentando salvar na receita de ID:", recipeId);
    console.log("URL que será chamada:", `${API_BASE_URL}/recipes/${recipeId}/reviews`);

    if (!recipeId) return { success: false, error: "ID da receita ausente" };

    try {
     
      const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) throw new Error('Erro ao adicionar avaliação');

      const savedReview = await response.json();
      setReviews((prevReviews) => [savedReview, ...prevReviews]);

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  const updateReview = async (updatedReview) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${updatedReview.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedReview),
      });

      if (!response.ok) throw new Error('Erro ao atualizar avaliação');

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

  const deleteReview = async (reviewId) => {
    setLoading(true); 
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao deletar avaliação');

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
    reviews, loading, error, refetch: fetchReviews,
    addReview, updateReview, deleteReview, 
  };
}