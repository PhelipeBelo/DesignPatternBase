import { ReviewsPageClient } from "@/components/blocks/ReviewsPageClient";


// A função de fetch agora recebe o ID para buscar no servidor
async function getReviews(recipeId) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  
  try {
    const res = await fetch(`${API_URL}/reviews?recipeId=${recipeId}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return { data: [], hasError: true };
    }

    const data = await res.json();
    return { data, hasError: false };
  } catch {
    return { data: [], hasError: true };
  }
}

// O componente de página recebe "params" da URL (ex: /recipes/1/reviews)
export default async function RecipeReviewsPage({ params }) {
  const { id } = params; // Pegamos o ID da receita da URL
  
  const { data, hasError } = await getReviews(id);

  return (
    <ReviewsPageClient 
      recipeId={id} 
      initialReviews={data} 
      serverError={hasError} 
    />
  );
}