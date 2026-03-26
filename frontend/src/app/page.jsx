import { RecipesPageClient } from '../components/blocks/recipe/RecipesPageClient';

async function getRecipes() {
  try {
    const res = await fetch('http://localhost:8080/recipes', {
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch {
    return [];
  }
}

export default async function Home() {
  const recipes = await getRecipes();

  return <RecipesPageClient initialRecipes={recipes} />;
}