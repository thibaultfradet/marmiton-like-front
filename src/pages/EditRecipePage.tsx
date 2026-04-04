import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import RecipeForm from '@/components/Recipe/RecipeForm';
import type { Category, Tag, Recipe } from '@/types/custom/recipe';
import { getRecipe, updateRecipe, uploadPhoto, deletePhoto, type RecipePayload } from '@/services/recipeApi';
import { getCategories } from '@/services/categoryApi';
import { getTags } from '@/services/tagApi';
import { useAuth } from '@/context/useAuth';

export default function EditRecipePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getRecipe(Number(id)),
      getCategories(),
      getTags(),
    ]).then(([recipeRes, catRes, tagRes]) => {
      if (!recipeRes.success || !recipeRes.data) {
        navigate('/');
        return;
      }
      // Author check
      if (recipeRes.data.author?.id !== user?.id) {
        toast.error('Vous ne pouvez pas modifier cette recette.');
        navigate(`/recipes/${id}`);
        return;
      }
      setRecipe(recipeRes.data);
      if (catRes.success && catRes.data) setCategories(catRes.data);
      if (tagRes.success && tagRes.data) setTags(tagRes.data);
    }).finally(() => setPageLoading(false));
  }, [id, user, navigate]);

  const handleSubmit = async (data: RecipePayload, photo: File | null, shouldDeletePhoto: boolean) => {
    if (!recipe) return;
    setSaving(true);
    try {
      const res = await updateRecipe(recipe.id, data);
      if (!res.success) {
        toast.error(res.message ?? 'Erreur lors de la mise à jour.');
        return;
      }
      if (shouldDeletePhoto) {
        await deletePhoto(recipe.id);
      }
      if (photo) {
        await uploadPhoto(recipe.id, photo);
      }
      toast.success('Recette mise à jour.');
      navigate(`/recipes/${recipe.id}`);
    } catch {
      toast.error('Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1.5 -ml-2 text-muted-foreground">
          <ChevronLeft className="h-4 w-4" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Modifier la recette</h1>
      </div>

      <RecipeForm
        defaultValues={recipe}
        categories={categories}
        tags={tags}
        onSubmit={handleSubmit}
        isLoading={saving}
      />
    </div>
  );
}
