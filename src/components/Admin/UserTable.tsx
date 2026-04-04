import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import type { AdminUser } from '@/types/custom/user';
import { toggleDisable } from '@/services/adminApi';

interface UserTableProps {
  users: AdminUser[];
  onUserChange: (updated: AdminUser) => void;
}

export default function UserTable({ users, onUserChange }: UserTableProps) {
  const [pendingId, setPendingId] = useState<number | null>(null);

  const handleToggle = async (user: AdminUser) => {
    if (pendingId) return;
    setPendingId(user.id);
    try {
      const res = await toggleDisable(user.id);
      if (res.success && res.data) {
        onUserChange(res.data);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Erreur lors de la mise à jour.');
    } finally {
      setPendingId(null);
    }
  };

  if (users.length === 0) {
    return <p className="text-muted-foreground text-sm py-8 text-center">Aucun utilisateur.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border/60">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/60 bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Utilisateur</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Rôle</th>
            <th className="px-4 py-3 text-center font-medium text-muted-foreground">Actif</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div>
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
              <td className="px-4 py-3">
                {user.roles.includes('ROLE_ADMIN') ? (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    Utilisateur
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-center">
                  {pendingId === user.id ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    <Switch
                      checked={user.disabledAt === null}
                      onCheckedChange={() => handleToggle(user)}
                      aria-label={user.disabledAt ? 'Réactiver' : 'Désactiver'}
                    />
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                  <Link to={`/admin/users/${user.id}/edit`} aria-label="Modifier">
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
