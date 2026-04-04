import type { ApiResponse } from '@/types/custom/api';
import type { AuthUser } from '@/types/custom/user';
import fetchWithRefresh from '@/utils/fetchWithRefresh';

export async function login(email: string, password: string): Promise<ApiResponse<null>> {
  const res = await fetchWithRefresh('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function logout(): Promise<ApiResponse<null>> {
  const res = await fetchWithRefresh('/api/auth/logout', { method: 'POST' });
  return res.json();
}

export async function getMe(): Promise<ApiResponse<AuthUser>> {
  const res = await fetchWithRefresh('/api/auth/me');
  return res.json();
}

export async function forgotPassword(email: string): Promise<ApiResponse<null>> {
  const res = await fetchWithRefresh('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function resetPassword(token: string, password: string): Promise<ApiResponse<null>> {
  const res = await fetchWithRefresh('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  });
  return res.json();
}
