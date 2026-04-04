import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/Layout/AppLayout';
import LoginPage from '@/pages/LoginPage';
import HomePage from '@/pages/HomePage';
import RecipeDetailPage from '@/pages/RecipeDetailPage';
import NewRecipePage from '@/pages/NewRecipePage';
import EditRecipePage from '@/pages/EditRecipePage';
import FavoritesPage from '@/pages/FavoritesPage';
import MyRecipesPage from '@/pages/MyRecipesPage';
import AdminUsersPage from '@/pages/Admin/AdminUsersPage';
import AdminNewUserPage from '@/pages/Admin/AdminNewUserPage';
import AdminEditUserPage from '@/pages/Admin/AdminEditUserPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/',                       element: <HomePage /> },
          { path: '/recipes/:id',            element: <RecipeDetailPage /> },
          { path: '/recipes/new',            element: <NewRecipePage /> },
          { path: '/recipes/:id/edit',       element: <EditRecipePage /> },
          { path: '/favorites',              element: <FavoritesPage /> },
          { path: '/my-recipes',             element: <MyRecipesPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute requireAdmin />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/admin/users',            element: <AdminUsersPage /> },
          { path: '/admin/users/new',        element: <AdminNewUserPage /> },
          { path: '/admin/users/:id/edit',   element: <AdminEditUserPage /> },
        ],
      },
    ],
  },
]);

export default router;
