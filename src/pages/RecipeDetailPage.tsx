import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart, Clock, Users, ChevronLeft, Pencil, Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StarRating from '@/components/Recipe/StarRating';
import type { Recipe } from '@/types/custom/recipe';
import { getRecipe, toggleFavorite, rateRecipe } from '@/services/recipeApi';
import { useAuth } from '@/context/useAuth';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [favPending, setFavPending] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getRecipe(Number(id)).then((res) => {
      if (res.success && res.data) {
        setRecipe(res.data);
      } else {
        navigate('/');
      }
    }).finally(() => setLoading(false));
  }, [id, navigate]);

  const handleFavorite = async () => {
    if (!recipe || favPending) return;
    setFavPending(true);
    try {
      const res = await toggleFavorite(recipe.id);
      if (res.success && res.data) {
        setRecipe((r) => r ? { ...r, isFavorite: res.data!.favorited } : r);
        toast.success(res.data.favorited ? 'Ajouté aux favoris' : 'Retiré des favoris');
      }
    } finally {
      setFavPending(false);
    }
  };

  const handleRate = async (value: number) => {
    if (!recipe) return;
    try {
      const res = await rateRecipe(recipe.id, value);
      if (res.success && res.data) {
        setRecipe((r) => r ? {
          ...r,
          userRating: res.data!.userRating,
          ratingAverage: res.data!.average,
          ratingCount: res.data!.count,
        } : r);
        toast.success('Note enregistrée.');
      }
    } catch {
      toast.error('Impossible d\'enregistrer la note.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!recipe) return null;

  const isAuthor = user?.id === recipe.author?.id;
  const photoUrl = recipe.photoUrl ? `${API_URL}${recipe.photoUrl}` : null;
  const totalTime = (recipe.preparationTime ?? 0) + (recipe.cookingTime ?? 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1.5 -ml-2 text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" />
        Retour
      </Button>

      {/* Hero */}
      {photoUrl && (
        <div className="rounded-xl overflow-hidden aspect-[16/7] bg-muted">
          <img src={photoUrl} alt={recipe.label} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 items-center">
          {recipe.category && (
            <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
              {recipe.category.label}
            </span>
          )}
          {recipe.tags.map((t) => (
            <span key={t.id} className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
              {t.label}
            </span>
          ))}
        </div>

        <div className="flex items-start justify-between gap-3">
          <h1 className="text-3xl font-bold tracking-tight flex-1">{recipe.label}</h1>
          <div className="flex items-center gap-2 shrink-0 pt-0.5">
            {isAuthor && (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/recipes/${recipe.id}/edit`} className="gap-1.5">
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Modifier</span>
                </Link>
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={handleFavorite}
              disabled={favPending}
              className="h-9 w-9 shrink-0"
              aria-label={recipe.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Heart className={`h-4 w-4 transition-colors ${recipe.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
        </div>

        {recipe.description && (
          <p className="text-muted-foreground text-base leading-relaxed">{recipe.description}</p>
        )}
      </div>

      {/* Meta + rating */}
      <div className="flex flex-wrap items-center gap-6 py-4 border-y border-border/60">
        {recipe.preparationTime && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Préparation</p>
            <p className="font-semibold text-base flex items-center gap-1 mt-0.5">
              <Clock className="h-4 w-4 text-primary" />
              {recipe.preparationTime} min
            </p>
          </div>
        )}
        {recipe.cookingTime && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Cuisson</p>
            <p className="font-semibold text-base flex items-center gap-1 mt-0.5">
              <Clock className="h-4 w-4 text-primary" />
              {recipe.cookingTime} min
            </p>
          </div>
        )}
        {totalTime > 0 && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="font-semibold text-base mt-0.5">{totalTime} min</p>
          </div>
        )}
        {recipe.quantity && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Personnes</p>
            <p className="font-semibold text-base flex items-center gap-1 mt-0.5">
              <Users className="h-4 w-4 text-primary" />
              {recipe.quantity}
            </p>
          </div>
        )}
        <div className="ml-auto flex flex-col items-end gap-1">
          <StarRating value={recipe.userRating ?? null} onRate={handleRate} />
          {recipe.ratingCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {recipe.ratingAverage?.toFixed(1)} / 5 ({recipe.ratingCount} avis)
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Card className="border-border/60">
          <CardContent className="p-5 space-y-3">
            <h2 className="text-lg font-semibold">Ingrédients</h2>
            <div className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
              {recipe.ingredients}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-5 space-y-3">
            <h2 className="text-lg font-semibold">Instructions</h2>
            <div className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
              {recipe.instructions}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Author */}
      {recipe.author && (
        <p className="text-sm text-muted-foreground text-right">
          Recette par {recipe.author.firstName} {recipe.author.lastName}
        </p>
      )}
    </div>
  );
}
