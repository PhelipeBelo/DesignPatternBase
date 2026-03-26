'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useReviews } from '@/hooks/useReviews';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { RefreshCw, Star, Quote } from 'lucide-react';

import { EditReview } from '@/components/blocks/review/ModalEditReview';
import { DeleteReview } from '@/components/blocks/review/ModalDeleteReview';
import { AddReview } from '@/components/blocks/review/ModalAddReview';

export function ReviewsPageClient({ recipeId, initialReviews, serverError }) {
  const {
    reviews, loading, error, refetch,
    addReview, updateReview, deleteReview
  } = useReviews({
    recipeId,
    initialReviews,
    fetchOnMount: serverError,
  });

  const getInitials = (name) => name?.charAt(0).toUpperCase() || '?';

  return (
    <div className="min-h-screen w-full bg-zinc-50/50 px-4 py-12 font-sans dark:bg-zinc-950">
      <main className="mx-auto w-full max-w-6xl space-y-10">
        <Button asChild variant="outline" size="sm" className="mb-6 w-fit gap-2 text-zinc-600 dark:text-zinc-400">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Voltar para o Menu
          </Link>
        </Button>
        <header className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 md:flex-row md:items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              O que dizem sobre nós
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400">
              Experiências reais da nossa comunidade.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button onClick={refetch} variant="outline" size="lg" disabled={loading} className="w-full sm:w-auto">
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Atualizar Feed
            </Button>

            <AddReview onAdd={addReview} />
          </div>
        </header>

        {error && (
          <p className="text-sm font-medium text-red-500 bg-red-50 p-3 rounded-lg border border-red-200 dark:bg-red-950/50 dark:border-red-800">
            Erro: {error}
          </p>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <Card key={review.id} className="relative overflow-hidden border-none bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-zinc-900 flex flex-col">
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
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-zinc-200 text-zinc-200 dark:fill-zinc-800 dark:text-zinc-800'}`}
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 pt-4 flex flex-col flex-grow justify-between">
                <div>
                  <p className="text-zinc-600 leading-relaxed dark:text-zinc-300">
                    "{review.comment}"
                  </p>
                </div>

                <div className="relative z-20 mt-6 pt-3 flex justify-end items-center gap-2 border-t border-zinc-100 dark:border-zinc-800">
                  <DeleteReview reviewId={review.id} onDelete={deleteReview} />
                  <EditReview review={review} onSave={updateReview} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}