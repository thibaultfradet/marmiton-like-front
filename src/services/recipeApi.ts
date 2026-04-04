import type { ApiResponse } from '@/types/custom/api';
import type { Recipe, RecipeListData, SearchResult } from '@/types/custom/recipe';
import fetchWithRefresh from '@/utils/fetchWithRefresh';

interface RecipeFilters {
  category?: string;
  tag?: string;
  q?: string;
  page?: number;
  limit?: number;
}

interface RatingResult {
  userRating: number;
  average: number | null;
  count: number;
}

interface FavoriteResult {
  favorited: boolean;
}

interface PhotoResult {
  photoUrl: string;
}

export type RecipePayload = {
  label: string;
  description?: string;
  ingredients: string;
  instructions: string;
  preparationTime?: number;
  cookingTime?: number;
  quantity?: number;
  categoryId?: number;
  tagIds?: number[];
};

export async function getRecipes(filters?: RecipeFilters): Promise<ApiResponse<RecipeListData>> {
  const params = new URLSearchParams();
  if (filters?.category) params.set('category', filters.category);
  if (filters?.tag)      params.set('tag',      filters.tag);
  if (filters?.q)        params.set('q',        filters.q);
  if (filters?.page)     params.set('page',     String(filters.page));
  if (filters?.limit)    params.set('limit',    String(filters.limit));
  const qs = params.toString();
  const res = await fetchWithRefresh(`/api/recipes${qs ? '?' + qs : ''}`);
  return res.json();
}

export async function getMyRecipes(): Promise<ApiResponse<{ recipes: Recipe[] }>> {
  const res = await fetchWithRefresh('/api/recipes/my');
  return res.json();
}

export async function getRecipe(id: number): Promise<ApiResponse<Recipe>> {
  const res = await fetchWithRefresh(`/api/recipes/${id}`);
  return res.json();
}

export async function createRecipe(data: RecipePayload): Promise<ApiResponse<Recipe>> {
  const res = await fetchWithRefresh('/api/recipes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateRecipe(id: number, data: RecipePayload): Promise<ApiResponse<Recipe>> {
  const res = await fetchWithRefresh(`/api/recipes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function uploadPhoto(id: number, file: File): Promise<ApiResponse<PhotoResult>> {
  const form = new FormData();
  form.append('photo', file);
  const res = await fetchWithRefresh(`/api/recipes/${id}/photo`, {
    method: 'POST',
    body: form,
  });
  return res.json();
}

export async function deletePhoto(id: number): Promise<ApiResponse<null>> {
  const res = await fetchWithRefresh(`/api/recipes/${id}/photo`, { method: 'DELETE' });
  return res.json();
}

export async function getFavorites(): Promise<ApiResponse<{ recipes: Recipe[] }>> {
  const res = await fetchWithRefresh('/api/favorites');
  return res.json();
}

export async function toggleFavorite(id: number): Promise<ApiResponse<FavoriteResult>> {
  const res = await fetchWithRefresh(`/api/recipes/${id}/favorite`, { method: 'POST' });
  return res.json();
}

export async function rateRecipe(id: number, value: number): Promise<ApiResponse<RatingResult>> {
  const res = await fetchWithRefresh(`/api/recipes/${id}/rate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  });
  return res.json();
}

export async function search(q: string): Promise<ApiResponse<SearchResult[]>> {
  const res = await fetchWithRefresh(`/api/search?q=${encodeURIComponent(q)}`);
  return res.json();
}
