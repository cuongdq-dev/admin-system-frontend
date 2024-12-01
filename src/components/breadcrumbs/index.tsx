import { Chip, emphasize, Breadcrumbs as MUIBreadcrumbs, styled, useTheme } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';
import { t } from 'i18next';
import { useLocation } from 'react-router-dom';
import { RouterConfig } from 'src/routes/sections';

const StyledBreadcrumbItem = styled(Chip)(({ theme }) => {
  return {
    backgroundColor: theme.palette.background.paperChannel,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(theme.palette.background.paper, 0.06),
    },
    '&:active, &[aria-current="page"]': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.background.paper, 0.12),
      fontWeight: theme.typography.fontWeightBold,
    },
  };
}) as typeof Chip;

const findRouteName = (path: string, routes: any[]): string | undefined => {
  for (const route of routes) {
    if (route.path === path && route.name) {
      return t(route.name);
    }
    if (route.path === path && !route.name && route.children) {
      const childResult = findRouteName('', route.children);
      return t(childResult!);
    }

    if (route.children) {
      const childResult = findRouteName(path, route.children);
      if (childResult) return t(childResult);
    }
  }
  return undefined;
};

const Breadcrumbs = () => {
  const location = useLocation();
  const theme = useTheme();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const layoutQuery: Breakpoint = 'lg';

  return (
    <div role="presentation">
      <MUIBreadcrumbs
        aria-label="breadcrumb"
        sx={{ ml: -1, [theme.breakpoints.down(layoutQuery)]: { display: 'none' } }}
      >
        <StyledBreadcrumbItem component="a" href="/" label={t('dashboard_page')} />
        {pathnames.map((value, index) => {
          const key = value + '_' + index;
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const routeName = findRouteName('/' + value, RouterConfig) || location?.state?.sitename;
          return last ? (
            <StyledBreadcrumbItem key={key} aria-current="page" label={routeName} />
          ) : (
            <StyledBreadcrumbItem key={key} component={'a'} href={to} label={routeName} />
          );
        })}
      </MUIBreadcrumbs>
    </div>
  );
};

export default Breadcrumbs;
