import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, UtensilsCrossed } from 'lucide-react';
import { toast } from 'sonner';
import StarRating from './StarRating';
import type { Recipe } from '@/types/custom/recipe';
import { toggleFavorite } from '@/services/recipeApi';
import API_URL from '@/utils/apiUrl';

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

  return (
    <Link to={`/recipes/${recipe.id}`} className="block group">
      <div className="space-y-2">

        {/* Image */}
        <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-muted">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={recipe.label}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <UtensilsCrossed className="h-10 w-10 text-muted-foreground/25" />
            </div>
          )}

          {/* Category badge — bottom left */}
          {recipe.category && (
            <span className="absolute bottom-2 left-2 rounded-full bg-background/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-foreground">
              {recipe.category.label}
            </span>
          )}

          {/* Favorite button — top right */}
          <button
            type="button"
            onClick={handleFavorite}
            disabled={pending}
            aria-label={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            className="absolute top-2 right-2 h-11 w-11 rounded-2xl bg-background/90 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          >
            <Heart
              className={`h-7 w-7 transition-colors ${
                favorited ? 'fill-red-500 text-red-500' : 'text-primary'
              }`}
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-1 px-1">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {recipe.label}
          </h3>

          {recipe.ratingCount > 0 ? (
            <>
              <div className="flex items-center gap-1">
                <StarRating
                  value={Math.round(recipe.ratingAverage ?? 0)}
                  readonly
                  size="sm"
                />
                <span className="text-xs font-medium text-muted-foreground">
                  {recipe.ratingAverage?.toFixed(1)}/5
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{recipe.ratingCount} avis</p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">Pas encore de note</p>
          )}
        </div>
      </div>
    </Link>
  );
}
