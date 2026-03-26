'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Star, AlertCircle } from "lucide-react";

export function AddReview({ onAdd }) {
  const [isOpen, setIsOpen] = useState(false);
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSave = async () => {
    if (!author.trim() || !comment.trim()) return;
    
    setIsSaving(true);
    setErrorMsg(null);

    const result = await onAdd({ author, rating, comment });

    if (result && result.success) {
      setAuthor(""); 
      setRating(5); 
      setComment("");
      setIsOpen(false);
    } else {
      setErrorMsg(result?.error || "Erro ao comunicar com a API.");
    }
    
    setIsSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full md:w-auto bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900">
          <Plus className="mr-2 h-4 w-4" />
          Nova Avaliação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Avaliação</DialogTitle>
          <DialogDescription>Compartilhe sua experiência. Preencha os detalhes abaixo.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          
          {/* NOVO: Aviso de erro visual no modal */}
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              <AlertCircle className="h-4 w-4" />
              <p>{errorMsg}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="new-author">Autor</Label>
            <Input id="new-author" placeholder="Seu nome" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Nota</Label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                  <Star className={`h-6 w-6 transition-colors ${star <= rating ? "fill-amber-400 text-amber-400" : "text-zinc-200 dark:text-zinc-800"}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-comment">Comentário</Label>
            <textarea id="new-comment" placeholder="O que você achou?" value={comment} onChange={(e) => setComment(e.target.value)} className="flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button type="button" onClick={handleSave} disabled={isSaving || !author.trim() || !comment.trim()}>
            {isSaving ? "Adicionando..." : "Publicar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}