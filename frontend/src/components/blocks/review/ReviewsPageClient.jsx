'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useDebounce } from '@/hooks/useDebounce'; 
import { useReviews } from '@/hooks/useReviews'; 

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { RefreshCw, Star, Search, MessageSquare, ArrowLeft, User, AlertCircle } from 'lucide-react';

import { EditReview } from '@/components/blocks/review/ModalEditReview';
import { DeleteReview } from '@/components/blocks/review/ModalDeleteReview';
import { AddReview } from '@/components/blocks/review/ModalAddReview';

function ReviewSkeleton() {
  return (
    <Card className="flex flex-col border-2 border-border bg-card shadow-md animate-pulse">
      <CardHeader className="pb-2 pt-6 px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
            <div className="h-5 w-32 bg-muted border-2 border-border"></div>
          </div>
          <div className="h-8 w-16 bg-muted border-2 border-border"></div>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-4 space-y-2">
        <div className="h-4 w-full bg-muted border-2 border-border"></div>
        <div className="h-4 w-5/6 bg-muted border-2 border-border"></div>
        <div className="h-4 w-4/6 bg-muted border-2 border-border"></div>
      </CardContent>
      <CardFooter className="bg-muted border-t-2 border-border px-6 py-3 flex justify-end items-center gap-3">
        <div className="h-8 w-8 bg-border opacity-20"></div>
        <div className="h-8 w-8 bg-border opacity-20"></div>
      </CardFooter>
    </Card>
  );
}

export function ReviewsPageClient({ recipeId, initialReviews }) {
  const { 
    reviews, loading, error, refetch, 
    addReview, updateReview, deleteReview 
  } = useReviews({
    recipeId,
    initialReviews,
    fetchOnMount: initialReviews?.length === 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400); 

  const filteredReviews = useMemo(() => {
    if (!debouncedSearchTerm || !reviews) return reviews || [];
    const lowerTerm = debouncedSearchTerm.toLowerCase();
    return reviews.filter(review => 
      review.author?.toLowerCase().includes(lowerTerm) || 
      review.comment?.toLowerCase().includes(lowerTerm)
    );
  }, [debouncedSearchTerm, reviews]);

  const debounceTimerRef = useRef(null);
  
  const handleDebouncedRefetch = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      refetch();
    }, 400);
  };

  
  const isInitialLoading = loading && (!reviews || reviews.length === 0);

  return (
    <div className="min-h-screen w-full bg-background font-sans text-foreground">
      
      <header className="sticky top-0 z-50 w-full bg-card border-b-2 border-border shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-6">
            
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="icon" className="border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <span className="text-xl font-bold tracking-tighter text-foreground hidden sm:block">
                Avaliações
              </span>
            </div>

            <div className="relative flex-1 max-w-xl group">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors" />
              <Input 
                placeholder="Buscar em comentários..." 
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
                 <AddReview recipeId={recipeId} onAdd={addReview} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        
        {error && (
          <div className="border-2 border-destructive bg-destructive/10 p-4 mb-10 text-destructive flex items-center gap-3 shadow-[4px_4px_0px_0px_var(--destructive)]">
            <AlertCircle className="h-5 w-5" />
            <p className="font-bold text-sm">Falha ao carregar avaliações: {error}</p>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {isInitialLoading ? (
            <>
              <ReviewSkeleton />
              <ReviewSkeleton />
              <ReviewSkeleton />
            </>
          ) : (
            <>
              {filteredReviews.map((review) => (
                <Card 
                  key={review.id} 
                  className="flex flex-col border-2 border-border bg-card shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <CardHeader className="pb-2 pt-6 px-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center border-2 border-border bg-muted text-muted-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-bold text-foreground">
                            {review.author || "Usuário Anônimo"}
                          </CardTitle>
                        </div>
                      </div>
                      
                      <Badge variant="secondary" className="flex-shrink-0 bg-accent text-accent-foreground border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] px-3 py-1 font-bold gap-1.5 h-8">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        {review.rating || 5}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="px-6 py-4">
                    <p className="text-foreground font-medium leading-relaxed">
                      {review.comment}
                    </p>
                  </CardContent>

                  <CardFooter className="bg-muted border-t-2 border-border px-6 py-3 flex justify-end items-center gap-3">
                    <DeleteReview reviewId={review.id} recipeId={recipeId} onDelete={deleteReview} />
                    <EditReview review={review} recipeId={recipeId} onSave={updateReview} />
                  </CardFooter>
                </Card>
              ))}

              {filteredReviews.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center text-center py-20 px-6 border-2 border-border bg-card shadow-md space-y-4">
                  <div className="p-4 border-2 border-border bg-muted text-muted-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <MessageSquare className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Nenhuma avaliação encontrada</h3>
                  <p className="text-muted-foreground font-medium max-w-sm">
                    Ainda não há comentários ou a sua busca por "{searchTerm}" não retornou resultados.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}