'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, AlertCircle } from "lucide-react";

export function EditRecipe({ recipe, onSave }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(recipe.title || "");
  const [description, setDescription] = useState(recipe.description || "");
  const [prepTime, setPrepTime] = useState(recipe.prepTime || "");
  const [ingredientsStr, setIngredientsStr] = useState(recipe.ingredients?.join(", ") || "");
  const [stepsStr, setStepsStr] = useState(recipe.steps?.join(", ") || "");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg(null);

    const ingredients = ingredientsStr.split(',').map(i => i.trim()).filter(Boolean);
    const steps = stepsStr.split(',').map(s => s.trim()).filter(Boolean);

    const result = await onSave({ 
      ...recipe, 
      title, 
      description, 
      prepTime: Number(prepTime), 
      ingredients,
      steps
    });

    if (result && result.success) {
      setIsOpen(false);
    } else {
      setErrorMsg(result?.error || "Erro ao editar receita.");
    }
    
    setIsSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50">
          <Edit className="h-4 w-4" /> Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Receita</DialogTitle>
          <DialogDescription>Faça as alterações necessárias abaixo.</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              <AlertCircle className="h-4 w-4" />
              <p>{errorMsg}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor={`edit-title-${recipe.id}`}>Título</Label>
            <Input id={`edit-title-${recipe.id}`} value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`edit-prep-${recipe.id}`}>Tempo de Preparo (minutos)</Label>
            <Input id={`edit-prep-${recipe.id}`} type="number" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-ing-${recipe.id}`}>Ingredientes (separados por vírgula)</Label>
            <Input id={`edit-ing-${recipe.id}`} value={ingredientsStr} onChange={(e) => setIngredientsStr(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-steps-${recipe.id}`}>Passos de preparo (separados por vírgula)</Label>
            <Input id={`edit-steps-${recipe.id}`} value={stepsStr} onChange={(e) => setStepsStr(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-desc-${recipe.id}`}>Descrição Curta</Label>
            <textarea id={`edit-desc-${recipe.id}`} value={description} onChange={(e) => setDescription(e.target.value)} className="flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300" />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}