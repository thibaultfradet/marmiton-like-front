import { Link } from 'react-router-dom';
import { Heart, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StarRating from './StarRating';
import type { Recipe } from '@/types/custom/recipe';
import { toggleFavorite } from '@/services/recipeApi';
import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

interface RecipeCardProps {
  recipe: Recipe;
  onFavoriteChange?: (id: number, favorited: boolean) => void;
}

export default function RecipeCard({ recipe, onFavoriteChange }: RecipeCardProps) {
  const [favorited, setFavorited] = useState(recipe.isFavorite);
  const [pending, setPending] = useState(false);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;
    setPending(true);
    try {
      const res = await toggleFavorite(recipe.id);
      if (res.success && res.data) {
        setFavorited(res.data.favorited);
        onFavoriteChange?.(recipe.id, res.data.favorited);
      }
    } catch {
      toast.error('Impossible de modifier le favori.');
    } finally {
      setPending(false);
    }
  };

  const photoUrl = recipe.photoUrl ? `${API_URL}${recipe.photoUrl}` : null;
  const totalTime = (recipe.preparationTime ?? 0) + (recipe.cookingTime ?? 0);

  return (
    <Link to={`/recipes/${recipe.id}`} className="block group">
      <Card className="overflow-hidden border-border/60 hover:shadow-md transition-shadow duration-200 cursor-pointer">

        {/* Photo — only when available */}
        {photoUrl && (
          <div className="relative h-32 sm:aspect-video overflow-hidden bg-muted">
            <img
              src={photoUrl}
              alt={recipe.label}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {recipe.category && (
              <span className="absolute top-2 left-2 inline-flex items-center rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm">
                {recipe.category.label}
              </span>
            )}
          </div>
        )}

        <CardContent className="p-4 space-y-2">
          {/* Category when no photo */}
          {!photoUrl && recipe.category && (
            <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
              {recipe.category.label}
            </span>
          )}

          {/* Title + favorite */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {recipe.label}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavorite}
              disabled={pending}
              className="h-8 w-8 shrink-0 rounded-full hover:bg-muted -mt-1 -mr-1"
              aria-label={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Heart className={`h-4 w-4 transition-colors ${favorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
            </Button>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {totalTime > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {totalTime} min
              </span>
            )}
            {recipe.quantity && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {recipe.quantity} pers.
              </span>
            )}
          </div>

          {/* Rating + author */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <StarRating value={Math.round(recipe.ratingAverage ?? 0)} readonly size="sm" />
              {recipe.ratingCount > 0 && (
                <span className="text-sm text-muted-foreground">({recipe.ratingCount})</span>
              )}
            </div>
            {recipe.author && (
              <span className="text-sm text-muted-foreground truncate max-w-24">
                {recipe.author.firstName}
              </span>
            )}
          </div>

          {/* Tags */}
          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {recipe.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground"
                >
                  {tag.label}
                </span>
              ))}
              {recipe.tags.length > 3 && (
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  +{recipe.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
