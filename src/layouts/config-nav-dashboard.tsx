import { t } from 'i18next';
import { SvgColor } from 'src/components/svg-color';
import { LanguageKey } from 'src/constants';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: LanguageKey.dashboard.nav,
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: LanguageKey.blog.nav,
    path: '/blog',
    icon: icon('ic-blog'),
  },

  {
    title: LanguageKey.category.nav,
    path: '/category',
    icon: icon('ic-category'),
  },

  // {
  //   title: LanguageKey.server.nav,
  //   path: '/server',
  //   icon: icon('ic-server'),
  // },

  {
    title: LanguageKey.site.nav,
    path: '/site',
    icon: icon('ic-site'),
  },

  {
    title: LanguageKey.googleConsole.nav,
    path: '/google-console',
    icon: icon('ic-google-console'),
    children: [
      // {
      //   path: '/google-website',
      //   title: LanguageKey.googleConsole.nav_website,
      //   icon: icon('ic-google-website'),
      // },
      {
        path: '/google-sitemap',
        title: LanguageKey.googleConsole.nav_sitemap,
        icon: icon('ic-sitemap'),
      },
      {
        path: '/google-index',
        title: LanguageKey.googleConsole.nav_indexing,
        icon: icon('ic-google-search'),
      },

      {
        path: '/google-logs',
        title: LanguageKey.googleConsole.nav_logs,
        icon: icon('ic-logs'),
      },
    ],
  },
  // {
  //   title: 'Color',
  //   path: '/color',
  //   icon: icon('ic-color'),
  // },

  // {
  //   title: LanguageKey.language.nav,
  //   path: '/language',
  //   icon: icon('ic-language'),
  // },
];
