import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import type { Category, Tag } from '@/types/custom/recipe';

interface Filters {
  q: string;
  category: string;
  tag: string;
}

interface RecipeFiltersProps {
  filters: Filters;
  categories: Category[];
  tags: Tag[];
  onChange: (filters: Filters) => void;
}

export default function RecipeFilters({ filters, categories, tags, onChange }: RecipeFiltersProps) {
  const hasActiveFilters = filters.q || filters.category || filters.tag;

  const reset = () => onChange({ q: '', category: '', tag: '' });

  return (
    <div className="space-y-3">
      {/* Row 1 — Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Rechercher une recette…"
          value={filters.q}
          onChange={(e) => onChange({ ...filters, q: e.target.value })}
          className="pl-9"
        />
      </div>

      {/* Row 2 — Filters */}
      <div className="flex items-center gap-3">
        <Select
          value={filters.category || '__all__'}
          onValueChange={(v) => onChange({ ...filters, category: v === '__all__' ? '' : v })}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Toutes les catégories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.tag || '__all__'}
          onValueChange={(v) => onChange({ ...filters, tag: v === '__all__' ? '' : v })}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Tous les tags</SelectItem>
            {tags.map((t) => (
              <SelectItem key={t.id} value={String(t.id)}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={reset} className="shrink-0 text-muted-foreground" aria-label="Effacer les filtres">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
