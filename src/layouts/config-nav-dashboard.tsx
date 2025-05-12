import { SvgColor } from 'src/components/svg-color';
import { LanguageKey } from 'src/constants';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: LanguageKey.nav.dashboard,
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: LanguageKey.nav.blog,
    icon: icon('ic-blog'),
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
    title: LanguageKey.nav.book,
    icon: icon('ic-book'),
    path: '/book',
  },

  {
    title: LanguageKey.nav.googleConsole,
    path: '/google-console',
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
    icon: icon('ic-image'),
  },

  {
    title: LanguageKey.nav.category,
    path: '/category',
    icon: icon('ic-category'),
  },

  {
    title: LanguageKey.nav.site,
    path: '/site',
    icon: icon('ic-site'),
  },

  {
    title: LanguageKey.nav.setting,
    path: '/google-console',
    icon: icon('ic-setting'),
    children: [
      {
        title: LanguageKey.nav.color,
        path: '/color',
        icon: icon('ic-color'),
      },
    ],
  },
];
