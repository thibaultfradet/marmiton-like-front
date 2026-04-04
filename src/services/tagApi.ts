import type { ApiResponse } from '@/types/custom/api';
import type { Tag } from '@/types/custom/recipe';
import fetchWithRefresh from '@/utils/fetchWithRefresh';

export async function getTags(): Promise<ApiResponse<Tag[]>> {
  const res = await fetchWithRefresh('/api/tags');
  return res.json();
}
