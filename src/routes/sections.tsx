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
//
export const BlogPage = lazy(() => import('src/pages/blog'));
//
export const UserPage = lazy(() => import('src/pages/user'));
//SERVER PAGE
export const ServersPage = lazy(() => import('src/pages/server/list'));
export const ServerDetailPage = lazy(() => import('src/pages/server/detail'));
//
export const SitesPage = lazy(() => import('src/pages/sites'));
//
// AUTHEN PAGE
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const RegisterPage = lazy(() => import('src/pages/register'));
//
export const ProductsPage = lazy(() => import('src/pages/products'));
//LANGUAGE PAGE
export const LanguagePage = lazy(() => import('src/pages/language/list'));
//
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

export const RouterConfig = [
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
        path: '/',
        element: (
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        ),
        index: true,
        name: 'dashboard_page',
      },
      {
        path: '/user',
        name: 'user_list_page',
        element: (
          <PrivateRoute>
            <UserPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/server',
        children: [
          {
            path: '',
            name: 'server_list_page',
            element: (
              <PrivateRoute>
                <ServersPage />
              </PrivateRoute>
            ),
          },
          {
            path: ':id',
            name: 'server_detail_page',
            element: (
              <PrivateRoute>
                <ServerDetailPage />
              </PrivateRoute>
            ),
          },
        ],
      },

      {
        path: '/site',
        name: 'site_list_page',
        element: (
          <PrivateRoute>
            <SitesPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/product',
        name: 'product_list_page',
        element: (
          <PrivateRoute>
            <ProductsPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/blog',
        name: 'blog_list_page',
        element: (
          <PrivateRoute>
            <BlogPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/language',
        name: 'language_list_page',
        element: (
          <PrivateRoute>
            <LanguagePage />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: '/sign-in',
    element: (
      <PublicRoute>
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      </PublicRoute>
    ),
  },

  {
    path: '/register',
    element: (
      <PublicRoute>
        <AuthLayout>
          <RegisterPage />
        </AuthLayout>
      </PublicRoute>
    ),
  },
  {
    path: '/404',
    element: (
      <PrivateRoute>
        <Page404 />
      </PrivateRoute>
    ),
  },
  {
    path: '*',
    element: (
      <PrivateRoute>
        <Navigate to="/404" replace />
      </PrivateRoute>
    ),
  },
];

export function Router() {
  return useRoutes(RouterConfig);
}
