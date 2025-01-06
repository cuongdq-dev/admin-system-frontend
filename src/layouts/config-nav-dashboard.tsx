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

  // {
  //   title: LanguageKey.user.nav,
  //   path: '/user',
  //   icon: icon('ic-user'),
  // },

  {
    title: LanguageKey.server.nav,
    path: '/server',
    icon: icon('ic-server'),
  },

  // {
  //   title: LanguageKey.site.nav,
  //   path: '/site',
  //   icon: icon('ic-site'),
  // },

  {
    title: 'Color',
    path: '/color',
    icon: icon('ic-color'),
  },
  // {
  //   title: LanguageKey.product.nav,
  //   path: '/product',
  //   icon: icon('ic-cart'),
  // },
  // {
  //   title: LanguageKey.blog.nav,
  //   path: '/blog',
  //   icon: icon('ic-blog'),
  // },
  {
    title: LanguageKey.language.nav,
    path: '/language',
    icon: icon('ic-language'),
  },
];
