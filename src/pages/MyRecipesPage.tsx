import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Loader2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Recipe } from '@/types/custom/recipe';
import { getMyRecipes } from '@/services/recipeApi';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyRecipes().then((res) => {
      if (res.success && res.data) setRecipes(res.data.recipes);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Mes recettes
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {recipes.length} recette{recipes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button asChild size="sm">
          <Link to="/recipes/new" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Nouvelle recette
          </Link>
        </Button>
      </div>

      {recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground/30" />
          <p className="text-muted-foreground">Vous n'avez pas encore créé de recette.</p>
          <Button asChild>
            <Link to="/recipes/new">Créer ma première recette</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => {
            const photoUrl = recipe.photoUrl ? `${API_URL}${recipe.photoUrl}` : null;
            return (
              <Card key={recipe.id} className="group overflow-hidden border-border/60 hover:shadow-md transition-shadow">
                <Link to={`/recipes/${recipe.id}`} className="block">
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={recipe.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
                    )}
                  </div>
                </Link>
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <Link to={`/recipes/${recipe.id}`}>
                      <h3 className="font-semibold text-sm truncate hover:text-primary transition-colors">
                        {recipe.label}
                      </h3>
                    </Link>
                    {recipe.category && (
                      <p className="text-xs text-muted-foreground mt-0.5">{recipe.category.label}</p>
                    )}
                  </div>
                  <Button variant="outline" size="icon" asChild className="h-8 w-8 shrink-0">
                    <Link to={`/recipes/${recipe.id}/edit`} aria-label="Modifier">
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
