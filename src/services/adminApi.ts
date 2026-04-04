import type { ApiResponse } from '@/types/custom/api';
import type { AdminUser } from '@/types/custom/user';
import fetchWithRefresh from '@/utils/fetchWithRefresh';

export interface UserPayload {
  firstName: string;
  lastName: string;
  email: string;
  isAdmin?: boolean;
}

export async function getUsers(): Promise<ApiResponse<AdminUser[]>> {
  const res = await fetchWithRefresh('/api/admin/users');
  return res.json();
}

export async function createUser(data: UserPayload): Promise<ApiResponse<AdminUser>> {
  const res = await fetchWithRefresh('/api/admin/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateUser(id: number, data: UserPayload): Promise<ApiResponse<AdminUser>> {
  const res = await fetchWithRefresh(`/api/admin/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function toggleDisable(id: number): Promise<ApiResponse<AdminUser>> {
  const res = await fetchWithRefresh(`/api/admin/users/${id}/toggle-disable`, { method: 'POST' });
  return res.json();
}
