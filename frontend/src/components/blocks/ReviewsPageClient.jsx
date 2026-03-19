'use client';

import { useReviews } from '@/hooks/useReviews';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { RefreshCw, Star, Quote } from 'lucide-react';

export function ReviewsPageClient({ initialReviews, serverError }) {
  const { reviews, loading, error, refetch } = useReviews({
    initialReviews,
    fetchOnMount: serverError, 
  });

  // Função helper para pegar a primeira letra do nome para o Avatar
  const getInitials = (name) => name?.charAt(0).toUpperCase() || '?';

  return (
    <div className="min-h-screen w-full bg-zinc-50/50 px-4 py-12 font-sans dark:bg-zinc-950">
      <main className="mx-auto w-full max-w-6xl space-y-10">
        {/* Header Minimalista */}
        <header className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 md:flex-row md:items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              O que dizem sobre nós
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400">
              Experiências reais da nossa comunidade.
            </p>
          </div>
          <Button onClick={refetch} size="lg" disabled={loading} className="w-full md:w-auto">
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar Feed
          </Button>
        </header>

        {error && (
          <p className="text-sm font-medium text-red-500">
            Erro ao carregar: {error}
          </p>
        )}

        {/* Grid de Depoimentos estilo Masonry/Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <Card 
              key={review.id} 
              className="relative overflow-hidden border-none bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-zinc-900"
            >
              {/* Ícone de aspas d'água no fundo */}
              <Quote className="absolute -right-4 -top-4 h-24 w-24 rotate-12 text-zinc-100 dark:text-zinc-800/50" />
              
              <CardHeader className="relative z-10 flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm dark:border-zinc-800">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {getInitials(review.author)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {review.author}
                  </span>
                  {/* Renderização dinâmica de estrelas reais */}
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-3.5 w-3.5 ${
                          star <= review.rating 
                            ? 'fill-amber-400 text-amber-400' 
                            : 'fill-zinc-200 text-zinc-200 dark:fill-zinc-800 dark:text-zinc-800'
                        }`} 
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10 pt-4">
                <p className="text-zinc-600 leading-relaxed dark:text-zinc-300">
                  "{review.comment}"
                </p>
                {review.recipeName && (
                  <p className="mt-4 text-xs font-medium text-primary/80 uppercase tracking-wider">
                    — Fez: {review.recipeName}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}