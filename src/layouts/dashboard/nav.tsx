import type { Breakpoint, SxProps, Theme } from '@mui/material/styles';

import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';
import { usePathname } from 'src/routes/hooks';

import { varAlpha } from 'src/theme/styles';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';

import { Divider, IconButton } from '@mui/material';
import { t } from 'i18next';
import { Iconify } from 'src/components/iconify';
import type { WorkspacesPopoverProps } from '../components/workspaces-popover';
export type NavContentProps = {
  data: { path: string; title: string; icon: React.ReactNode; info?: React.ReactNode }[];
  slots?: { topArea?: React.ReactNode; bottomArea?: React.ReactNode };
  workspaces: WorkspacesPopoverProps['data'];
  sx?: SxProps<Theme>;
};

export function NavDesktop(
  props: NavContentProps & {
    open: boolean;
    layoutQuery: Breakpoint;
    handleOpen?: (open: boolean) => void;
  }
) {
  const theme = useTheme();
  const { sx, data, slots, workspaces, layoutQuery, handleOpen, open } = props;
  return (
    <Box
      key={open + '-nav'}
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: 'var(--layout-nav-bg)',
        zIndex: 'var(--layout-nav-zIndex)',
        animation: `${open ? 'nav-fade-open' : 'nav-fade-close'} 0.5s ease-in-out forwards`,
        '@keyframes nav-fade-open': {
          '0%': { width: '100px' },
          '100%': { width: 'var(--layout-nav-vertical-width)' },
        },
        '@keyframes nav-fade-close': {
          '0%': { width: 'var(--layout-nav-vertical-width)' },
          '100%': { width: '100px' },
        },
        width: open ? 'var(--layout-nav-vertical-width)' : '100px',
        borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)})`,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <Box>
        <IconButton
          onClick={(event) => {
            event.preventDefault();
            handleOpen && handleOpen(!open);
          }}
          disableRipple
          sx={(theme) => {
            return {
              backgroundColor: theme.vars.palette.background.default,
              position: 'absolute',
              borderRadius: 20,
              right: -15,
              padding: 0,
              zIndex: 1,
              margin: 0,
            };
          }}
        >
          <Iconify
            sx={(theme) => {
              return {
                backgroundColor: theme.vars.palette.background.paper,
              };
            }}
            icon={open ? 'ph:caret-circle-left-fill' : 'ph:caret-circle-right-fill'}
            width={30}
          />
        </IconButton>
      </Box>
      <NavContent open={open} data={data} slots={slots} workspaces={workspaces} />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
  workspaces,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) onClose();
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          bgcolor: 'var(--layout-nav-bg)',
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} workspaces={workspaces} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({
  data,
  slots,
  workspaces,
  sx,
  open,
}: NavContentProps & { open?: boolean }) {
  const pathname = usePathname();

  return (
    <>
      <Logo />

      {slots?.topArea}

      {/* <WorkspacesPopover data={workspaces} sx={{ my: 2 }} /> */}

      <Divider sx={{ marginTop: 2, marginBottom: 5 }} />
      <Scrollbar fillContent>
        <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
          <Box component="ul" gap={0.5} display="flex" flexDirection="column">
            {data.map((item) => {
              const isActived = item.path === pathname;

              return (
                <ListItem disableGutters disablePadding key={item.title}>
                  <ListItemButton
                    disableGutters
                    component={RouterLink}
                    href={item.path}
                    sx={{
                      pl: 2,
                      py: 1,
                      gap: 2,
                      // pr: 1.5,
                      borderRadius: 0.75,
                      typography: 'body2',
                      fontWeight: 'fontWeightMedium',
                      color: 'var(--layout-nav-item-color)',
                      minHeight: 'var(--layout-nav-item-height)',
                      ...(isActived && {
                        fontWeight: 'fontWeightSemiBold',
                        bgcolor: 'var(--layout-nav-item-active-bg)',
                        color: 'var(--layout-nav-item-active-color)',
                        '&:hover': {
                          bgcolor: 'var(--layout-nav-item-hover-bg)',
                        },
                      }),
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 24,
                        height: 24,
                        color: isActived ? 'primary.light' : '',
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Box
                      sx={{
                        color: isActived ? 'primary.light' : '',
                        animation: `${open ? 'title-fade-open' : 'title-fade-close'} 0.2s ease-in-out forwards`,
                        '@keyframes title-fade-open': {
                          '0%': { display: 'none', width: 0 },
                          '100%': { width: '2px' },
                        },
                        '@keyframes title-fade-close': {
                          '0%': { opacity: 1 },
                          '100%': { opacity: 0, display: 'none' },
                        },
                      }}
                      component="span"
                      flexGrow={1}
                    >
                      {t(item.title)}
                    </Box>
                    {item.info && item.info}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>

      {slots?.bottomArea}

      {/* <NavUpgrade /> */}
    </>
  );
}
