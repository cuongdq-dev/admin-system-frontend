import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'dashboard_nav',
    path: '/',
    icon: icon('ic-analytics'),
  },

  {
    title: 'user_nav',
    path: '/user',
    icon: icon('ic-user'),
  },

  {
    title: 'server_nav',
    path: '/server',
    icon: icon('ic-server'),
  },

  {
    title: 'site_nav',
    path: '/site',
    icon: icon('ic-site'),
  },
  {
    title: 'product_nav',
    path: '/product',
    icon: icon('ic-cart'),
  },
  {
    title: 'blog_nav',
    path: '/blog',
    icon: icon('ic-blog'),
  },

  {
    title: 'language_nav',
    path: '/language',
    icon: icon('ic-language'),
  },
];
