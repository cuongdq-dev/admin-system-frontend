import { SvgColor } from 'src/components/svg-color';
import { LanguageKey } from 'src/constants';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData: NavDataItems = [
  {
    title: LanguageKey.nav.dashboard,
    workspace: ['wp_news', 'wp_books', 'wp_system'],
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: LanguageKey.nav.blog,
    icon: icon('ic-blog'),
    workspace: ['wp_news', 'wp_system'],
    path: '/blog-group',
    children: [
      {
        path: '/blog',
        icon: icon('ic-blog-active'),
        title: LanguageKey.nav.blogAll,
      },
      {
        path: '/blog-unused',
        icon: icon('ic-blog-new'),
        title: LanguageKey.nav.blogNew,
      },
      {
        path: '/blog-archived',
        icon: icon('ic-blog-old'),
        title: LanguageKey.nav.blogArchived,
      },
      {
        path: '/blog-trending',
        icon: icon('ic-trending'),
        title: LanguageKey.nav.blogTrending,
      },
    ],
  },
  {
    title: LanguageKey.nav.bookGroup,
    icon: icon('ic-book'),
    workspace: ['wp_books', 'wp_system'],
    path: '/book-group',
    children: [
      {
        path: '/book',
        icon: icon('ic-book'),
        title: LanguageKey.nav.bookList,
      },
      {
        path: '/voice',
        icon: icon('ic-audio'),
        title: LanguageKey.nav.bookAudio,
      },
    ],
  },

  {
    title: LanguageKey.nav.googleConsole,
    path: '/google-console',
    workspace: ['wp_news'],
    icon: icon('ic-google-console'),
    children: [
      {
        path: '/google-sitemap',
        title: LanguageKey.nav.googleSitemap,
        icon: icon('ic-sitemap'),
      },
      {
        path: '/google-index',
        title: LanguageKey.nav.googleIndexing,
        icon: icon('ic-google-search'),
      },

      {
        path: '/google-logs',
        title: LanguageKey.nav.googleLogs,
        icon: icon('ic-logs'),
      },
    ],
  },

  {
    title: LanguageKey.nav.image,
    path: '/image',
    workspace: ['wp_news', 'wp_books', 'wp_system'],
    icon: icon('ic-image'),
  },

  {
    title: LanguageKey.nav.category,
    path: '/category',
    workspace: ['wp_news', 'wp_books'],
    icon: icon('ic-category'),
  },

  {
    title: LanguageKey.nav.site,
    workspace: ['wp_news', 'wp_books'],
    path: '/site',
    icon: icon('ic-site'),
  },
  {
    title: LanguageKey.nav.user,
    workspace: ['wp_system'],
    path: '/users',
    icon: icon('ic-user'),
  },

  {
    title: LanguageKey.nav.batchLogs,
    workspace: ['wp_system'],
    path: '/logs',
    icon: icon('ic-batch-logs'),
  },

  {
    title: LanguageKey.nav.setting,
    path: '/setting',
    workspace: ['wp_system'],
    icon: icon('ic-setting'),
    children: [
      {
        title: LanguageKey.nav.role,
        path: '/roles',
        icon: icon('ic-role'),
      },
      {
        title: LanguageKey.nav.color,
        path: '/color',
        icon: icon('ic-color'),
      },
    ],
  },
];
