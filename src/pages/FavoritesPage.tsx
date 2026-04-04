import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RecipeCard from '@/components/Recipe/RecipeCard';
import type { Recipe } from '@/types/custom/recipe';
import { getFavorites } from '@/services/recipeApi';

export default function FavoritesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFavorites().then((res) => {
      if (res.success && res.data) setRecipes(res.data.recipes);
    }).finally(() => setLoading(false));
  }, []);

  const handleFavoriteChange = (id: number, favorited: boolean) => {
    if (!favorited) setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500 fill-red-500" />
          Favoris
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {recipes.length} recette{recipes.length !== 1 ? 's' : ''} sauvegardée{recipes.length !== 1 ? 's' : ''}
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <Heart className="h-10 w-10 text-muted-foreground/30" />
          <p className="text-muted-foreground">Vous n'avez pas encore de recettes favorites.</p>
          <Button asChild variant="outline">
            <Link to="/">Découvrir des recettes</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onFavoriteChange={handleFavoriteChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
