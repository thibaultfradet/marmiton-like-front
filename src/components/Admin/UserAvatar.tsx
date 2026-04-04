import type { AdminUser } from '@/types/custom/user';

export default function UserAvatar({ user }: { user: AdminUser }) {
  return (
    <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
      {user.firstName[0]}{user.lastName[0]}
    </div>
  );
}
