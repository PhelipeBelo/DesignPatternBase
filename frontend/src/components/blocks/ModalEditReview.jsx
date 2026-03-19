'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Star } from "lucide-react";

export function EditReview({ review, onSave }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const [author, setAuthor] = useState(review.author);
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave({
      ...review,
      author,
      rating,
      comment,
    });
    setIsSaving(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* BOTÃO ATUALIZADO: Variante outline, tamanho padrão, com ícone e texto */}
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50"
        >
          <Edit className="h-4 w-4" />
          Editar
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Avaliação</DialogTitle>
          <DialogDescription>
            Faça as alterações necessárias na avaliação abaixo.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="author">Autor</Label>
            <Input 
              id="author" 
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Nota</Label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      star <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-zinc-200 dark:text-zinc-800"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comentário</Label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}