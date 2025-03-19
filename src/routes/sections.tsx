import { lazy, Suspense } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { LanguageKey } from 'src/constants';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import { varAlpha } from 'src/theme/styles';
import { PrivateRoute, PublicRoute } from './components';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
//
export const BlogsPage = lazy(() => import('src/pages/blog/list'));
export const BlogDetailPage = lazy(() => import('src/pages/blog/detail'));

export const CategoryPage = lazy(() => import('src/pages/category/list'));
// export const CategoryDetailPage = lazy(() => import('src/pages/category/detail'));
//
export const UserPage = lazy(() => import('src/pages/user/list'));
export const ProfilePage = lazy(() => import('src/pages/user/profile'));
//SERVER PAGE
export const ServersPage = lazy(() => import('src/pages/server/list'));
export const ServerDetailPage = lazy(() => import('src/pages/server/detail'));
//
export const SitesPage = lazy(() => import('src/pages/site/list'));
export const SiteDetailPage = lazy(() => import('src/pages/site/detail'));
export const SiteIndexingPage = lazy(() => import('src/pages/site/indexing'));
//
// AUTHEN PAGE
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const RegisterPage = lazy(() => import('src/pages/register'));
//
export const ProductsPage = lazy(() => import('src/pages/products'));
//LANGUAGE PAGE
export const LanguagePage = lazy(() => import('src/pages/language/list'));

export const ColorPage = lazy(() => import('src/pages/color'));
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
        name: LanguageKey.dashboard.pageTitle,
      },
      {
        path: '/user',
        children: [
          {
            path: '',
            name: LanguageKey.server.listPageTitle,
            element: (
              <PrivateRoute>
                <UserPage />
              </PrivateRoute>
            ),
          },
        ],
      },
      {
        path: '/profile',
        element: (
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        ),
      },
      {
        path: '/server',
        children: [
          {
            path: '',
            name: LanguageKey.server.listPageTitle,
            element: (
              <PrivateRoute>
                <ServersPage />
              </PrivateRoute>
            ),
          },
          {
            path: ':id',
            name: LanguageKey.server.detailPageTitle,
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
        name: LanguageKey.site.listPageTitle,
        element: (
          <PrivateRoute>
            <SitesPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/product',
        name: LanguageKey.product.listPageTitle,
        element: (
          <PrivateRoute>
            <ProductsPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/blog',
        name: LanguageKey.blog.listPageTitle,
        children: [
          {
            path: '',
            element: (
              <PrivateRoute>
                <BlogsPage />
              </PrivateRoute>
            ),
          },
          {
            path: ':id',
            element: (
              <PrivateRoute>
                <BlogDetailPage />
              </PrivateRoute>
            ),
          },
        ],
      },
      {
        path: '/category',
        name: LanguageKey.category.listPageTitle,
        children: [
          {
            path: '',
            element: (
              <PrivateRoute>
                <CategoryPage />
              </PrivateRoute>
            ),
          },
          // {
          //   path: ':id',
          //   element: (
          //     <PrivateRoute>
          //       <CategoryDetailPage />
          //     </PrivateRoute>
          //   ),
          // },
        ],
      },
      {
        path: '/site',
        name: LanguageKey.site.listPageTitle,
        children: [
          {
            path: '',
            element: (
              <PrivateRoute>
                <SitesPage />
              </PrivateRoute>
            ),
          },
          {
            path: ':id',
            element: (
              <PrivateRoute>
                <SiteDetailPage />
              </PrivateRoute>
            ),
          },
        ],
      },
      {
        name: LanguageKey.indexing.listPageTitle,
        path: 'indexing',
        element: (
          <PrivateRoute>
            <SiteIndexingPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/language',
        name: LanguageKey.language.listPageTitle,
        element: (
          <PrivateRoute>
            <LanguagePage />
          </PrivateRoute>
        ),
      },
      {
        path: '/color',
        name: 'color',
        element: (
          <PrivateRoute>
            <ColorPage />
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
