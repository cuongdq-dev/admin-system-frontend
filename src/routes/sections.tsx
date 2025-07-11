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
export const BlogCreatePage = lazy(() => import('src/pages/blog/create'));
export const BlogsArchivedPage = lazy(() => import('src/pages/blog/listArchived'));
export const BlogsUnusedPage = lazy(() => import('src/pages/blog/listUnused'));
export const BlogsTrendingPage = lazy(() => import('src/pages/blog/listTrending'));

//

export const BooksPage = lazy(() => import('src/pages/book/list'));
export const BookDetailPage = lazy(() => import('src/pages/book/detail'));
export const BookCreatePage = lazy(() => import('src/pages/book/create'));

export const VoicePage = lazy(() => import('src/pages/voice/list'));
export const VoiceDetailPage = lazy(() => import('src/pages/voice/detail'));
export const VoiceCreatePage = lazy(() => import('src/pages/voice/create'));

//
export const CategoryPage = lazy(() => import('src/pages/category/list'));
// export const CategoryDetailPage = lazy(() => import('src/pages/category/detail'));
//
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
//LANGUAGE PAGE
export const LanguagePage = lazy(() => import('src/pages/language/list'));

export const ColorPage = lazy(() => import('src/pages/color'));
export const UserPage = lazy(() => import('src/pages/user/list'));

export const RoleListPage = lazy(() => import('src/pages/role/list'));
export const RoleDetailPage = lazy(() => import('src/pages/role/detail'));

export const BatchLogsPage = lazy(() => import('src/pages/logs/list'));

//
export const Page404 = lazy(() => import('src/pages/page-not-found'));

//GOOGLE PAGE
export const GoogleLogsDetail = lazy(() => import('src/pages/google/logs/detail'));
export const GoogleLogsList = lazy(() => import('src/pages/google/logs/list'));

export const GoogleWebsiteDetail = lazy(() => import('src/pages/google/website/detail'));
export const GoogleWebsiteList = lazy(() => import('src/pages/google/website/list'));

export const GoogleSitemapDetail = lazy(() => import('src/pages/google/sitemap/detail'));
export const GoogleSitemapList = lazy(() => import('src/pages/google/sitemap/list'));

export const GoogleIndexingDetail = lazy(() => import('src/pages/google/indexing/detail'));
export const GoogleIndexingList = lazy(() => import('src/pages/google/indexing/list'));

// IMAGE PAGE
export const ImagePage = lazy(() => import('src/pages/media/list'));

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
        path: '/blog-archived',
        element: (
          <PrivateRoute>
            <BlogsArchivedPage />
          </PrivateRoute>
        ),
      },

      {
        path: '/blog-unused',
        element: (
          <PrivateRoute>
            <BlogsUnusedPage />
          </PrivateRoute>
        ),
      },

      {
        path: '/blog-trending',
        element: (
          <PrivateRoute>
            <BlogsTrendingPage />
          </PrivateRoute>
        ),
      },

      {
        name: LanguageKey.book.listPageTitle,
        path: '/book',
        children: [
          {
            path: 'create',
            element: (
              <PrivateRoute>
                <BookCreatePage />
              </PrivateRoute>
            ),
          },
          {
            path: '',
            element: (
              <PrivateRoute>
                <BooksPage />
              </PrivateRoute>
            ),
          },

          {
            path: ':id',
            element: (
              <PrivateRoute>
                <BookDetailPage />
              </PrivateRoute>
            ),
          },
        ],
      },
      {
        name: LanguageKey.book.listPageTitle,
        path: '/voice',
        children: [
          {
            path: 'create',
            element: (
              <PrivateRoute>
                <VoiceCreatePage />
              </PrivateRoute>
            ),
          },
          {
            path: '',
            element: (
              <PrivateRoute>
                <VoicePage />
              </PrivateRoute>
            ),
          },

          {
            path: ':id',
            element: (
              <PrivateRoute>
                <VoiceDetailPage />
              </PrivateRoute>
            ),
          },
        ],
      },

      {
        name: LanguageKey.blog.listPageTitle,
        path: '/blog',
        children: [
          {
            path: 'create',
            element: (
              <PrivateRoute>
                <BlogCreatePage />
              </PrivateRoute>
            ),
          },
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
        name: LanguageKey.googleConsole.listPageTitle,
        children: [
          {
            path: '/google-index',
            element: (
              <PrivateRoute>
                <GoogleIndexingList />
              </PrivateRoute>
            ),
          },

          {
            path: '/google-website',
            element: (
              <PrivateRoute>
                <GoogleWebsiteList />
              </PrivateRoute>
            ),
          },

          {
            path: '/google-logs',
            element: (
              <PrivateRoute>
                <GoogleLogsList />
              </PrivateRoute>
            ),
          },

          {
            path: '/google-sitemap',
            element: (
              <PrivateRoute>
                <GoogleSitemapList />
              </PrivateRoute>
            ),
          },
        ],
      },

      {
        name: LanguageKey.googleConsole.listPageTitle,
        path: 'indexing',
        element: (
          <PrivateRoute>
            <SiteIndexingPage />
          </PrivateRoute>
        ),
      },

      {
        path: '/image',
        element: (
          <PrivateRoute>
            <ImagePage />
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

      {
        path: '/user',
        name: 'user',
        element: (
          <PrivateRoute>
            <UserPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/roles',
        name: LanguageKey.role.listPagetitle,
        children: [
          {
            path: '/roles',
            element: (
              <PrivateRoute>
                <RoleListPage />
              </PrivateRoute>
            ),
          },

          {
            path: ':id',
            element: (
              <PrivateRoute>
                <RoleDetailPage />
              </PrivateRoute>
            ),
          },
        ],
      },

      {
        path: '/logs',
        name: 'logs',
        element: (
          <PrivateRoute>
            <BatchLogsPage />
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
