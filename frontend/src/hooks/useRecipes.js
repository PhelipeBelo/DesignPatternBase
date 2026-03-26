import { useEffect, useState, useCallback } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export function useRecipes({ initialRecipes = [], fetchOnMount = true } = {}) {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/recipes`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar receitas (status ${response.status})`);
      }

      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  const addRecipe = async (newRecipe) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecipe),
      });

      if (!response.ok) {
        const errData = await response.text();
        throw new Error(errData || 'Erro ao adicionar receita');
      }

      const savedRecipe = await response.json();
      setRecipes((prev) => [savedRecipe, ...prev]);

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateRecipe = async (updatedRecipe) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${updatedRecipe.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRecipe),
      });

      if (!response.ok) throw new Error('Erro ao atualizar receita');

      const savedRecipe = await response.json();
      setRecipes((prev) => 
        prev.map((r) => (r.id === savedRecipe.id ? savedRecipe : r))
      );

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao deletar receita');

      setRecipes((prev) => prev.filter((r) => r.id !== recipeId));

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    if (!fetchOnMount) return;
    fetchRecipes();
  }, [fetchOnMount, fetchRecipes]);

  return {
    recipes, loading, error, refetch: fetchRecipes,
    addRecipe, updateRecipe, deleteRecipe
  };
}