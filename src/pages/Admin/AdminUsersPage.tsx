import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserTable from '@/components/Admin/UserTable';
import type { AdminUser } from '@/types/custom/user';
import { getUsers } from '@/services/adminApi';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers().then((res) => {
      if (res.success && res.data) setUsers(res.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleUserChange = (updated: AdminUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Utilisateurs
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {loading ? '…' : `${users.length} utilisateur${users.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button asChild size="sm">
          <Link to="/admin/users/new" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Nouvel utilisateur
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <UserTable users={users} onUserChange={handleUserChange} />
      )}
    </div>
  );
}
