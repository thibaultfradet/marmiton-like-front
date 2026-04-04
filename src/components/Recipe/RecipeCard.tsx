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
    <Card className="group overflow-hidden border-border/60 hover:shadow-md transition-shadow duration-200">
      <Link to={`/recipes/${recipe.id}`} className="block">
        {/* Photo */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={recipe.label}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl select-none">
              🍽️
            </div>
          )}
          {recipe.category && (
            <span className="absolute top-2 left-2 inline-flex items-center rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm">
              {recipe.category.label}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavorite}
            disabled={pending}
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background"
            aria-label={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Heart className={`h-4 w-4 transition-colors ${favorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
          </Button>
        </div>
      </Link>

      <CardContent className="p-4 space-y-2">
        <Link to={`/recipes/${recipe.id}`} className="block group/title">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover/title:text-primary transition-colors">
            {recipe.label}
          </h3>
        </Link>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {totalTime > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {totalTime} min
            </span>
          )}
          {recipe.quantity && (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {recipe.quantity} pers.
            </span>
          )}
        </div>

        {/* Rating + tags */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <StarRating value={Math.round(recipe.ratingAverage ?? 0)} readonly size="sm" />
            {recipe.ratingCount > 0 && (
              <span className="text-xs text-muted-foreground">({recipe.ratingCount})</span>
            )}
          </div>
          {recipe.author && (
            <span className="text-xs text-muted-foreground truncate max-w-[6rem]">
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
  );
}
