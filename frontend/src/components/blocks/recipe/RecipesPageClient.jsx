'use client';

import Link from 'next/link';
import { useRecipes } from '@/hooks/useRecipes';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, RefreshCw, ChefHat, UtensilsCrossed, Star } from 'lucide-react';

import { AddRecipe } from '@/components/blocks/recipe/ModalAddRecipe';
import { EditRecipe } from '@/components/blocks/recipe/ModalEditRecipe';
import { DeleteRecipe } from '@/components/blocks/recipe/ModalDeleteRecipe';

export function RecipesPageClient({ initialRecipes }) {
  const { 
    recipes, loading, error, refetch, 
    addRecipe, updateRecipe, deleteRecipe 
  } = useRecipes({
    initialRecipes,
    fetchOnMount: initialRecipes.length === 0,
  });

  return (
    <div className="min-h-screen w-full bg-zinc-50/50 px-4 py-12 font-sans dark:bg-zinc-950">
      <main className="mx-auto w-full max-w-6xl space-y-10">
        <header className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 md:flex-row md:items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Menu Exclusivo
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400">
              Descubra nossas melhores receitas selecionadas para você.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button onClick={refetch} variant="outline" size="lg" disabled={loading} className="w-full md:w-auto">
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Sincronizar Menu
            </Button>
            <AddRecipe onAdd={addRecipe} />
          </div>
        </header>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-950/50 dark:text-red-400">
            Erro ao carregar o menu: {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-primary/5">
              <div className="relative flex h-48 w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                <ChefHat className="h-16 w-16 text-zinc-300 transition-transform duration-500 group-hover:scale-110 dark:text-zinc-700" />
                <Badge className="absolute right-4 top-4 bg-white/90 text-zinc-900 hover:bg-white dark:bg-zinc-950/90 dark:text-zinc-50">
                  <Clock className="mr-1.5 h-3.5 w-3.5" />
                  {recipe.prepTime} min
                </Badge>
              </div>

              <CardHeader>
                <CardTitle className="line-clamp-1 text-2xl">{recipe.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-sm">
                  {recipe.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1">
                {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      <UtensilsCrossed className="h-4 w-4 text-primary" />
                      Ingredientes principais
                    </div>
                    <Separator />
                    <div className="flex flex-wrap gap-2">
                      {recipe.ingredients.map((item, index) => (
                        <Badge key={index} variant="secondary" className="font-normal">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center pt-4 pb-4">
                <Button asChild variant="secondary" size="sm" className="gap-2">
                  <Link href={`/${recipe.id}/Reviews`}>
                    <Star className="h-4 w-4" />
                    Avaliações
                  </Link>
                </Button>
                
                <div className="flex items-center gap-2">
                  <DeleteRecipe recipeId={recipe.id} onDelete={deleteRecipe} />
                  <EditRecipe recipe={recipe} onSave={updateRecipe} />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}