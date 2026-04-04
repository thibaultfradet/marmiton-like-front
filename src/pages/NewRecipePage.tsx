import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import RecipeForm from '@/components/Recipe/RecipeForm';
import type { Category, Tag } from '@/types/custom/recipe';
import { createRecipe, uploadPhoto, type RecipePayload } from '@/services/recipeApi';
import { getCategories } from '@/services/categoryApi';
import { getTags } from '@/services/tagApi';

export default function NewRecipePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([getCategories(), getTags()]).then(([catRes, tagRes]) => {
      if (catRes.success && catRes.data) setCategories(catRes.data);
      if (tagRes.success && tagRes.data) setTags(tagRes.data);
    });
  }, []);

  const handleSubmit = async (data: RecipePayload, photo: File | null) => {
    setLoading(true);
    try {
      const res = await createRecipe(data);
      if (!res.success || !res.data) {
        toast.error(res.message ?? 'Erreur lors de la création.');
        return;
      }
      if (photo) {
        await uploadPhoto(res.data.id, photo);
      }
      toast.success('Recette créée avec succès !');
      navigate(`/recipes/${res.data.id}`);
    } catch {
      toast.error('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1.5 -ml-2 text-muted-foreground">
          <ChevronLeft className="h-4 w-4" />
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nouvelle recette</h1>
        </div>
      </div>

      <RecipeForm
        categories={categories}
        tags={tags}
        onSubmit={handleSubmit}
        isLoading={loading}
      />
    </div>
  );
}
