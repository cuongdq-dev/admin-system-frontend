import { lazy, Suspense } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import { varAlpha } from 'src/theme/styles';
import { PrivateRoute, PublicRoute } from './components';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      element: (
        <PrivateRoute>
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </PrivateRoute>
      ),
      children: [
        {
          element:
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          , index: true
        },
        {
          path: 'user',
          element:
            <PrivateRoute>
              <UserPage />
            </PrivateRoute>
        },
        {
          path: 'products', element:
            <PrivateRoute>
              <ProductsPage />
            </PrivateRoute>
        },
        {
          path: 'blog', element:
            <PrivateRoute>
              <BlogPage />
            </PrivateRoute>
        },
      ],
    },
    {
      path: 'sign-in',
      element: (
        <PublicRoute>
          <AuthLayout>
            <SignInPage />
          </AuthLayout>
        </PublicRoute>
      ),
    },

    {
      path: 'register',
      element: (
        <PublicRoute>
          <AuthLayout>
            <RegisterPage />
          </AuthLayout>
        </PublicRoute>

      ),
    },
    {
      path: '404',
      element:
        <PrivateRoute>
          <Page404 />
        </PrivateRoute>
    },
    {
      path: '*',
      element:
        <PrivateRoute>
          <Navigate to="/404" replace />
        </PrivateRoute>
    },
  ]);
}
