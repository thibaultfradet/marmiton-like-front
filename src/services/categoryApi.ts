import type { ApiResponse } from '@/types/custom/api';
import type { Category } from '@/types/custom/recipe';
import fetchWithRefresh from '@/utils/fetchWithRefresh';

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  const res = await fetchWithRefresh('/api/categories');
  return res.json();
}
