import { ReviewsPageClient } from "@/components/blocks/review/ReviewsPageClient";

async function getReviews(recipeId) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  
  try {
    const res = await fetch(`${API_URL}/recipes/${recipeId}/reviews`, {
      cache: 'no-store',
    });

    if (!res.ok) return { data: [], hasError: true };

    const data = await res.json();
    return { data, hasError: false };
  } catch {
    return { data: [], hasError: true };
  }
}

export default async function RecipeReviewsPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id; 
  
  const { data, hasError } = await getReviews(id);

  return (
    <ReviewsPageClient 
      recipeId={id} 
      initialReviews={data} 
      serverError={hasError} 
    />
  );
}