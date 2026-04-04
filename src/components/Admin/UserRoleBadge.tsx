import type { AdminUser } from '@/types/custom/user';

export default function UserRoleBadge({ user }: { user: AdminUser }) {
  return user.roles.includes('ROLE_ADMIN') ? (
    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
      Admin
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
      Utilisateur
    </span>
  );
}
