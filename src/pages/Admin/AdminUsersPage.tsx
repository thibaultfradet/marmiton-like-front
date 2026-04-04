import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UserTable from '@/components/Admin/UserTable';
import type { AdminUser } from '@/types/custom/user';
import { getUsers } from '@/services/adminApi';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getUsers().then((res) => {
      if (res.success && res.data) setUsers(res.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleUserChange = (updated: AdminUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const filtered = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2 min-w-0">
          <Users className="h-5 w-5 text-primary shrink-0" />
          <span className="truncate">Utilisateurs</span>
        </h1>
        <Button asChild size="sm" className="shrink-0">
          <Link to="/admin/users/new" className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nouvel utilisateur</span>
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Rechercher par nom ou email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Count */}
      <p className="text-sm text-muted-foreground -mt-2">
        {loading ? '…' : `${filtered.length} utilisateur${filtered.length !== 1 ? 's' : ''}`}
      </p>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <UserTable users={filtered} onUserChange={handleUserChange} />
      )}
    </div>
  );
}
