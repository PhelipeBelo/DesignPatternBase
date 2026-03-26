'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRecipes } from '@/hooks/useRecipes';
import { useDebounce } from '@/hooks/useDebounce'; 

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Clock, RefreshCw, ChefHat, UtensilsCrossed, Star, Search, BookOpen, AlertCircle } from 'lucide-react';

import { AddRecipe } from '@/components/blocks/recipe/ModalAddRecipe';
import { EditRecipe } from '@/components/blocks/recipe/ModalEditRecipe';
import { DeleteRecipe } from '@/components/blocks/recipe/ModalDeleteRecipe';

function RecipeSkeleton() {
  return (
    <Card className="flex flex-col border-2 border-border bg-card shadow-md overflow-hidden pt-4 animate-pulse">
      <CardHeader className="space-y-2 pb-3 pt-4 px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="h-8 bg-muted border-2 border-border w-2/3"></div>
          <div className="h-7 w-20 bg-muted border-2 border-border"></div>
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-4 bg-muted border-2 border-border w-full"></div>
          <div className="h-4 bg-muted border-2 border-border w-4/5"></div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4 px-6">
        <div className="h-4 w-40 bg-muted border-2 border-border mb-3"></div>
        <div className="flex flex-wrap gap-2 pt-1">
          <div className="h-6 w-16 bg-muted border-2 border-border"></div>
          <div className="h-6 w-24 bg-muted border-2 border-border"></div>
          <div className="h-6 w-20 bg-muted border-2 border-border"></div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted border-t-2 border-border px-6 py-4 flex justify-between items-center gap-2 mt-auto">
        <div className="h-8 w-28 bg-border opacity-20"></div>
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-border opacity-20"></div>
          <div className="h-8 w-8 bg-border opacity-20"></div>
        </div>
      </CardFooter>
    </Card>
  );
}

export function RecipesPageClient({ initialRecipes }) {
  const { 
    recipes, loading, error, refetch, 
    addRecipe, updateRecipe, deleteRecipe 
  } = useRecipes({
    initialRecipes,
    fetchOnMount: initialRecipes.length === 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400); 

  const filteredRecipes = useMemo(() => {
    if (!debouncedSearchTerm) return recipes;
    const lowerTerm = debouncedSearchTerm.toLowerCase();
    return recipes.filter(recipe => 
      recipe.title?.toLowerCase().includes(lowerTerm) || 
      recipe.description?.toLowerCase().includes(lowerTerm)
    );
  }, [debouncedSearchTerm, recipes]);

  const debounceTimerRef = useRef(null);
  
  const handleDebouncedRefetch = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      refetch();
    }, 400);
  };

  const isInitialLoading = loading && recipes.length === 0;

  return (
    <div className="min-h-screen w-full bg-background font-sans text-foreground">
      
      <header className="sticky top-0 z-50 w-full bg-card border-b-2 border-border shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-6">
            
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <ChefHat className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tighter text-foreground hidden sm:block">
                FinalBoss<span className="text-muted-foreground font-normal">Menu</span>
              </span>
            </div>

            <div className="relative flex-1 max-w-xl group">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors" />
              <Input 
                placeholder="Pesquisar receitas seletas..." 
                className="w-full pl-11 h-10 border-2 border-border bg-input focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <Button 
                onClick={handleDebouncedRefetch} 
                variant="outline" 
                size="icon" 
                disabled={loading} 
                className="border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex-shrink-0"
              >
                <RefreshCw className={`h-4 w-4 ${loading && !isInitialLoading ? 'animate-spin' : ''}`} />
              </Button>
              <div className="hidden sm:block">
                <AddRecipe onAdd={addRecipe} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        
        {error && (
          <div className="border-2 border-destructive bg-destructive/10 p-4 mb-10 text-destructive flex items-center gap-3 shadow-[4px_4px_0px_0px_var(--destructive)]">
            <AlertCircle className="h-5 w-5" />
            <p className="font-bold text-sm">Falha ao carregar o menu: {error}</p>
          </div>
        )}

        {isInitialLoading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <RecipeSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((recipe) => (
              <Card 
                key={recipe.id} 
                className="flex flex-col border-2 border-border bg-card shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg overflow-hidden pt-4"
              >
                <CardHeader className="space-y-2 pb-3 pt-4 px-6">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-2xl font-bold tracking-tight text-card-foreground line-clamp-2 flex-1">
                      {recipe.title}
                    </CardTitle>
                    
                    <Badge variant="secondary" className="flex-shrink-0 bg-secondary text-secondary-foreground border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] px-3 py-1 text-xs font-bold gap-1.5 h-7">
                      <Clock className="h-3.5 w-3.5" />
                      {recipe.prepTime} min
                    </Badge>
                  </div>
                  
                  <CardDescription className="text-sm text-muted-foreground font-medium line-clamp-2">
                    {recipe.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 space-y-4 px-6">
                  {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <UtensilsCrossed className="h-3.5 w-3.5" />
                        Ingredientes Essenciais
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {recipe.ingredients.slice(0, 5).map((item, index) => (
                          <Badge key={index} variant="outline" className="border-2 border-border bg-muted text-muted-foreground font-semibold px-2.5 py-0.5 text-xs">
                            {item}
                          </Badge>
                        ))}
                        {recipe.ingredients.length > 5 && (
                          <span className="text-xs font-bold text-muted-foreground pt-1">+{recipe.ingredients.length - 5} mais</span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="bg-muted border-t-2 border-border px-6 py-4 flex justify-between items-center gap-2 mt-auto">
                  <Button asChild variant="default" size="sm" className="bg-primary text-primary-foreground border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all font-bold text-xs gap-1.5 px-4 h-8">
                    <Link href={`/${recipe.id}/Reviews`}>
                      <Star className="h-3.5 w-3.5" />
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

            {filteredRecipes.length === 0 && !loading && (
              <div className="col-span-full flex flex-col items-center justify-center text-center py-24 px-6 border-2 border-border bg-card shadow-md space-y-4">
                <div className="p-4 border-2 border-border bg-muted text-muted-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <BookOpen className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Nenhuma receita encontrada</h3>
                <p className="text-muted-foreground font-medium max-w-sm">
                  Sua busca por "{searchTerm}" não retornou resultados.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}