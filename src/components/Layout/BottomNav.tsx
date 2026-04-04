import { NavLink } from 'react-router-dom';
import { Home, Heart, BookOpen, Settings } from 'lucide-react';
import { useAuth } from '@/context/useAuth';

const navItems = [
  { to: '/', icon: Home, label: 'Accueil', end: true },
  { to: '/favorites', icon: Heart, label: 'Favoris', end: false },
  { to: '/my-recipes', icon: BookOpen, label: 'Mes recettes', end: false },
];

export default function BottomNav() {
  const { user } = useAuth();
  const isAdmin = user?.roles.includes('ROLE_ADMIN');

  const items = isAdmin
    ? [...navItems, { to: '/admin/users', icon: Settings, label: 'Admin', end: false }]
    : navItems;

  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="flex h-16 items-stretch">
        {items.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
