import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import PhotoUpload from './PhotoUpload';
import type { Category, Tag, Recipe } from '@/types/custom/recipe';
import type { RecipePayload } from '@/services/recipeApi';

interface RecipeFormProps {
  defaultValues?: Partial<Recipe>;
  categories: Category[];
  tags: Tag[];
  onSubmit: (data: RecipePayload, photo: File | null, deletePhoto: boolean) => Promise<void>;
  isLoading?: boolean;
}

export default function RecipeForm({
  defaultValues,
  categories,
  tags,
  onSubmit,
  isLoading = false,
}: RecipeFormProps) {
  const [label, setLabel] = useState(defaultValues?.label ?? '');
  const [description, setDescription] = useState(defaultValues?.description ?? '');
  const [ingredients, setIngredients] = useState(defaultValues?.ingredients ?? '');
  const [instructions, setInstructions] = useState(defaultValues?.instructions ?? '');
  const [preparationTime, setPreparationTime] = useState(String(defaultValues?.preparationTime ?? ''));
  const [cookingTime, setCookingTime] = useState(String(defaultValues?.cookingTime ?? ''));
  const [quantity, setQuantity] = useState(String(defaultValues?.quantity ?? ''));
  const [categoryId, setCategoryId] = useState(String(defaultValues?.category?.id ?? ''));
  const [selectedTags, setSelectedTags] = useState<number[]>(
    defaultValues?.tags?.map((t) => t.id) ?? []
  );
  const [photo, setPhoto] = useState<File | null>(null);
  const [deletePhoto, setDeletePhoto] = useState(false);

  const toggleTag = (id: number) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    await onSubmit(
      {
        label,
        description: description || undefined,
        ingredients,
        instructions,
        preparationTime: preparationTime ? Number(preparationTime) : undefined,
        cookingTime: cookingTime ? Number(cookingTime) : undefined,
        quantity: quantity ? Number(quantity) : undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
        tagIds: selectedTags,
      },
      photo,
      deletePhoto,
    );
  };

  const isEdit = !!defaultValues?.id;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photo */}
      <div className="space-y-1.5">
        <Label>Photo</Label>
        <PhotoUpload
          currentPhotoUrl={defaultValues?.photoUrl}
          onFileChange={setPhoto}
          deleteChecked={deletePhoto}
          onDeleteChange={setDeletePhoto}
          isEdit={isEdit}
        />
      </div>

      {/* Titre */}
      <div className="space-y-1.5">
        <Label htmlFor="label">Titre <span className="text-destructive">*</span></Label>
        <Input
          id="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Ex : Tarte tatin aux pommes"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Courte présentation de la recette…"
          rows={2}
        />
      </div>

      {/* Temps + quantité */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="prepTime">Préparation (min)</Label>
          <Input
            id="prepTime"
            type="number"
            min="0"
            value={preparationTime}
            onChange={(e) => setPreparationTime(e.target.value)}
            placeholder="30"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cookTime">Cuisson (min)</Label>
          <Input
            id="cookTime"
            type="number"
            min="0"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
            placeholder="45"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="quantity">Personnes</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="4"
          />
        </div>
      </div>

      {/* Catégorie */}
      <div className="space-y-1.5">
        <Label>Catégorie</Label>
        <Select value={categoryId || '__none__'} onValueChange={(v) => setCategoryId(v === '__none__' ? '' : v)}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">Sans catégorie</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const checked = selectedTags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-colors border ${
                    checked
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted text-muted-foreground border-border hover:border-primary hover:text-foreground'
                  }`}
                >
                  <Checkbox
                    checked={checked}
                    tabIndex={-1}
                    className="pointer-events-none h-3 w-3 border-current data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary"
                  />
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Ingrédients */}
      <div className="space-y-1.5">
        <Label htmlFor="ingredients">Ingrédients <span className="text-destructive">*</span></Label>
        <Textarea
          id="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="- 500g de farine&#10;- 3 œufs&#10;- ..."
          rows={6}
          required
        />
      </div>

      {/* Instructions */}
      <div className="space-y-1.5">
        <Label htmlFor="instructions">Instructions <span className="text-destructive">*</span></Label>
        <Textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="1. Préchauffer le four à 180°C&#10;2. Mélanger..."
          rows={8}
          required
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {isEdit ? 'Enregistrer les modifications' : 'Créer la recette'}
      </Button>
    </form>
  );
}
