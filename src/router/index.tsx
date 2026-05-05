import { createBrowserRouter } from 'react-router-dom';
import { AuthGuard, AdminGuard } from './guards';
import AppLayout from '@/components/Layout/AppLayout';
import LoginPage from '@/pages/LoginPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import HomePage from '@/pages/HomePage';
import RecipeDetailPage from '@/pages/RecipeDetailPage';
import NewRecipePage from '@/pages/NewRecipePage';
import EditRecipePage from '@/pages/EditRecipePage';
import FavoritesPage from '@/pages/FavoritesPage';
import MyRecipesPage from '@/pages/MyRecipesPage';
import ProfilePage from '@/pages/ProfilePage';
import AdminUsersPage from '@/pages/Admin/AdminUsersPage';
import AdminNewUserPage from '@/pages/Admin/AdminNewUserPage';
import AdminEditUserPage from '@/pages/Admin/AdminEditUserPage';
import ErrorPage from '@/pages/ErrorPage';

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/reset-password',
        element: <ResetPasswordPage />,
      },
      {
        element: <AuthGuard />,
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
              { path: '/profile',                element: <ProfilePage /> },
            ],
          },
        ],
      },
      {
        element: <AdminGuard />,
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
    ],
  },
]);

export default router;
