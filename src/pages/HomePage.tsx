import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, UtensilsCrossed, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RecipeCard from '@/components/Recipe/RecipeCard';
import RecipeFilters from '@/components/Recipe/RecipeFilters';
import type { Recipe, Category, Tag } from '@/types/custom/recipe';
import { getRecipes } from '@/services/recipeApi';

const LIMIT = 15;

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
  const [debouncedQ, setDebouncedQ] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search query
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQ(filters.q), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filters.q]);

  // Fetch page 1 when filters change
  useEffect(() => {
    let cancelled = false;

    getRecipes({ q: debouncedQ, category: filters.category, tag: filters.tag, page: 1, limit: LIMIT })
      .then((res) => {
        if (cancelled) return;
        if (!res.success || !res.data) {
          setLoading(false);
          return;
        }
        setRecipes(res.data.recipes);
        setCategories(res.data.categories);
        setTags(res.data.tags);
        setTotal(res.data.total);
        setHasMore(res.data.hasMore);
        setPage(1);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [debouncedQ, filters.category, filters.tag]);

  // Load next page
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);

    getRecipes({ q: debouncedQ, category: filters.category, tag: filters.tag, page: nextPage, limit: LIMIT })
      .then((res) => {
        if (!res.success || !res.data) return;
        setRecipes((prev) => [...prev, ...res.data!.recipes]);
        setHasMore(res.data.hasMore);
        setPage(nextPage);
      })
      .finally(() => setLoadingMore(false));
  }, [loadingMore, hasMore, page, debouncedQ, filters.category, filters.tag]);

  // IntersectionObserver on sentinel
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  const handleFavoriteChange = (id: number, favorited: boolean) => {
    setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, isFavorite: favorited } : r)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recettes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {loading ? '…' : `${total} recette${total !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button asChild size="sm">
          <Link to="/recipes/new" className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nouvelle recette</span>
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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-muted animate-pulse aspect-4/3" />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <UtensilsCrossed className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">Aucune recette trouvée.</p>
          <Button variant="outline" onClick={() => setFilters({ q: '', category: '', tag: '' })}>
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onFavoriteChange={handleFavoriteChange}
              />
            ))}
          </div>

          {/* Sentinel + loading indicator */}
          <div ref={sentinelRef} className="flex justify-center py-4">
            {loadingMore && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
          </div>
        </>
      )}
    </div>
  );
}
