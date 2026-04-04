import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '@/types/custom/user';
import { AuthContext } from './auth-context';
import fetchWithRefresh from '@/utils/fetchWithRefresh';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWithRefresh('/api/auth/me')
      .then(async (res) => {
        const json = await res.json();
        setUser(res.ok ? (json.data as AuthUser) : null);
      })
      .catch(() => { setUser(null); })
      .finally(() => { setIsLoading(false); });
  }, []);

  useEffect(() => {
    const handleLogout = () => setUser(null);
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetchWithRefresh('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.message ?? 'Erreur de connexion.');
    }

    const meRes = await fetchWithRefresh('/api/auth/me');
    const meJson = await meRes.json();
    setUser(meRes.ok ? (meJson.data as AuthUser) : null);
  };

  const logout = async () => {
    await fetchWithRefresh('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
