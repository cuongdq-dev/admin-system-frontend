import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },

  {
    title: 'user',
    path: '/user',
    icon: icon('ic-user'),
  },

  {
    title: 'Server',
    path: '/servers',
    icon: icon('ic-server'),
  },

  {
    title: 'Sites',
    path: '/sites',
    icon: icon('ic-site'),
  },
  {
    title: 'Product',
    path: '/products',
    icon: icon('ic-cart'),
  },
  {
    title: 'Blog',
    path: '/blog',
    icon: icon('ic-blog'),
  },

  {
    title: 'Languages',
    path: '/languages',
    icon: icon('ic-language'),
  },
];
