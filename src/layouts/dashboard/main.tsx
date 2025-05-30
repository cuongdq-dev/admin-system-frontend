import type { BoxProps } from '@mui/material/Box';
import type { ContainerProps } from '@mui/material/Container';
import type { Breakpoint } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';

import { useEffect } from 'react';
import { layoutClasses } from 'src/layouts/classes';
import { useSettingStore } from 'src/store/setting';

// ----------------------------------------------------------------------

export function Main({ children, sx, ...other }: BoxProps) {
  return (
    <Box
      component="main"
      className={layoutClasses.main}
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

// ----------------------------------------------------------------------

type DashboardContentProps = ContainerProps & {
  disablePadding?: boolean;
  breadcrumb?: IBreadcrumb;
};

export function DashboardContent({
  sx,
  children,
  disablePadding,
  breadcrumb,
  maxWidth,
  ...other
}: DashboardContentProps) {
  const { setBreadcrumb } = useSettingStore.getState();
  const theme = useTheme();

  const layoutQuery: Breakpoint = 'lg';

  useEffect(() => {
    breadcrumb && Number(breadcrumb?.items?.length) > 0 && setBreadcrumb(breadcrumb);
    return () => {
      setBreadcrumb(undefined);
    };
  }, []);

  return (
    <Container
      className={layoutClasses.content}
      maxWidth={maxWidth || false}
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        height: '100%',
        p: '12px !important',
        [theme.breakpoints.up(layoutQuery)]: { px: 'var(--layout-dashboard-content-px)' },
        ...(disablePadding && { p: { xs: 0, sm: 0, md: 0, lg: 0, xl: 0 } }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Container>
  );
}
