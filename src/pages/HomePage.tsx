import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RecipeCard from '@/components/Recipe/RecipeCard';
import RecipeFilters from '@/components/Recipe/RecipeFilters';
import type { Recipe, Category, Tag } from '@/types/custom/recipe';
import { getRecipes } from '@/services/recipeApi';

interface Filters {
  q: string;
  category: string;
  tag: string;
}

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [filters, setFilters] = useState<Filters>({ q: '', category: '', tag: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getRecipes().then((res) => {
      if (res.success && res.data) {
        setRecipes(res.data.recipes);
        setCategories(res.data.categories);
        setTags(res.data.tags);
      }
    }).finally(() => setLoading(false));
  }, []);

  const filtered = recipes.filter((r) => {
    if (filters.q) {
      const q = filters.q.toLowerCase();
      if (!r.label.toLowerCase().includes(q) &&
          !(r.description ?? '').toLowerCase().includes(q) &&
          !r.ingredients.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (filters.category && String(r.category?.id) !== filters.category) return false;
    if (filters.tag && !r.tags.some((t) => String(t.id) === filters.tag)) return false;
    return true;
  });

  const handleFavoriteChange = (id: number, favorited: boolean) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFavorite: favorited } : r))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recettes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {loading ? '…' : `${filtered.length} recette${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button asChild size="sm">
          <Link to="/recipes/new" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Nouvelle recette
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <RecipeFilters
        filters={filters}
        categories={categories}
        tags={tags}
        onChange={setFilters}
      />

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-muted animate-pulse aspect-[4/5]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <UtensilsCrossed className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">Aucune recette trouvée.</p>
          <Button variant="outline" onClick={() => setFilters({ q: '', category: '', tag: '' })}>
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((recipe) => (
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
