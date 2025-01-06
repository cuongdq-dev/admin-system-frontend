import { Chip, emphasize, Breadcrumbs as MUIBreadcrumbs, styled, useTheme } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';
import { t } from 'i18next';
import { LanguageKey } from 'src/constants';
import { useSettingStore } from 'src/store/setting';
import { useShallow } from 'zustand/react/shallow';

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
  const theme = useTheme();
  const { breadcrumb } = useSettingStore(useShallow((state) => state));
  const layoutQuery: Breakpoint = 'lg';

  return (
    <div role="presentation">
      <MUIBreadcrumbs
        aria-label="breadcrumb"
        sx={{ ml: -1, [theme.breakpoints.down(layoutQuery)]: { display: 'none' } }}
      >
        <StyledBreadcrumbItem label={t(LanguageKey.dashboard.pageTitle)} />
        {breadcrumb?.items?.map((value, index) => {
          if (!value?.title) return undefined;
          const text = t(value.title);
          return (
            <StyledBreadcrumbItem
              key={text! + index}
              aria-current={index == Number(breadcrumb.items?.length) - 1 ? 'page' : 'false'}
              label={text}
            />
          );
        })}
      </MUIBreadcrumbs>
    </div>
  );
};

export default Breadcrumbs;
