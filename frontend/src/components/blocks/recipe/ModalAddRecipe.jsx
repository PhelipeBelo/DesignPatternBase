'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, AlertCircle } from "lucide-react";

export function AddRecipe({ onAdd }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [ingredientsStr, setIngredientsStr] = useState("");
  const [stepsStr, setStepsStr] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) return;
    
    setIsSaving(true);
    setErrorMsg(null);

    const ingredients = ingredientsStr.split(',').map(i => i.trim()).filter(Boolean);
    const steps = stepsStr.split(',').map(s => s.trim()).filter(Boolean);

    const result = await onAdd({ 
      title, 
      description, 
      prepTime: Number(prepTime), 
      ingredients,
      steps 
    });

    if (result && result.success) {
      setTitle(""); setDescription(""); setPrepTime(""); setIngredientsStr(""); setStepsStr("");
      setIsOpen(false);
    } else {
      setErrorMsg(result?.error || "Erro ao salvar receita.");
    }
    
    setIsSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full md:w-auto bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900">
          <Plus className="mr-2 h-4 w-4" />
          Nova Receita
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Receita</DialogTitle>
          <DialogDescription>Adicione os detalhes da sua nova receita abaixo.</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              <AlertCircle className="h-4 w-4" />
              <p>{errorMsg}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="prepTime">Tempo de Preparo (minutos)</Label>
            <Input id="prepTime" type="number" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ingredients">Ingredientes (separados por vírgula)</Label>
            <Input id="ingredients" placeholder="Ovo, Leite, Farinha..." value={ingredientsStr} onChange={(e) => setIngredientsStr(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="steps">Passos de preparo (separados por vírgula)</Label>
            <Input id="steps" placeholder="Misture tudo, Asse por 20 min..." value={stepsStr} onChange={(e) => setStepsStr(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição Curta</Label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300" />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button type="button" onClick={handleSave} disabled={isSaving || !title.trim() || !description.trim()}>
            {isSaving ? "Salvando..." : "Salvar Receita"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}