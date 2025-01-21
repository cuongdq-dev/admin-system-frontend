import Box from '@mui/material/Box';
import type { Breakpoint, SxProps, Theme } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { t } from 'i18next';
import { useState } from 'react';
import { PATH_APP_SETTING } from 'src/api-core/path';
import CommonBreadcrumbs from 'src/components/breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { LanguageKey } from 'src/constants';
import { useAPI } from 'src/hooks/use-api';
import { useSettingStore } from 'src/store/setting';
import { layoutClasses } from '../classes';
import { AccountPopover } from '../components/account-popover';
import { LanguagePopover } from '../components/language-popover';
import { MenuButton } from '../components/menu-button';
import { NotificationsPopover } from '../components/notifications-popover';
import { SettingPopover } from '../components/setting-popover';
import { navData } from '../config-nav-dashboard';
import { _workspaces } from '../config-nav-workspace';
import { HeaderSection } from '../core/header-section';
import { LayoutSection } from '../core/layout-section';
import { Main } from './main';
import { NavDesktop, NavMobile } from './nav';

//
export type DashboardLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function DashboardLayout({ sx, children, header }: DashboardLayoutProps) {
  const theme = useTheme();
  const { setSetting } = useSettingStore.getState();

  useAPI({
    baseURL: PATH_APP_SETTING,
    onSuccess: (res) => {
      setSetting(res);
    },
  });

  const [navOpen, setNavOpen] = useState(false);
  const layoutQuery: Breakpoint = 'lg';
  const [open, setOpen] = useState(true);
  return (
    <LayoutSection
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          slotProps={{
            container: {
              maxWidth: false,
              sx: { px: { [layoutQuery]: 5 } },
            },
          }}
          sx={header?.sx}
          slots={{
            leftArea: (
              <>
                <MenuButton
                  onClick={() => setNavOpen(true)}
                  sx={{
                    ml: -1,
                    [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
                  }}
                />
                <CommonBreadcrumbs />
                <NavMobile
                  data={navData}
                  open={navOpen}
                  onClose={() => setNavOpen(false)}
                  workspaces={_workspaces}
                />
              </>
            ),
            rightArea: (
              <Box gap={1} display="flex" alignItems="center">
                <LanguagePopover />
                <NotificationsPopover />
                <SettingPopover />
                <AccountPopover
                  data={[
                    {
                      label: t(LanguageKey.menu.home),
                      href: '/',
                      icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" />,
                    },
                    {
                      label: t(LanguageKey.menu.profile),
                      href: '/profile',
                      icon: <Iconify width={22} icon="solar:shield-keyhole-bold-duotone" />,
                    },
                    {
                      label: t(LanguageKey.menu.settings),
                      href: '#',
                      icon: <Iconify width={22} icon="solar:settings-bold-duotone" />,
                    },
                  ]}
                />
              </Box>
            ),
          }}
        />
      }
      /** **************************************
       * Sidebar
       *************************************** */
      sidebarSection={
        <NavDesktop
          open={open}
          data={navData}
          layoutQuery={layoutQuery}
          workspaces={_workspaces}
          handleOpen={setOpen}
        />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{
        '--layout-nav-vertical-width': '300px',
        '--layout-dashboard-content-pt': theme.spacing(1),
        '--layout-dashboard-content-pb': theme.spacing(8),
        '--layout-dashboard-content-px': theme.spacing(5),
      }}
      sx={{
        [`& .${layoutClasses.hasSidebar}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            // pl: open ? 'var(--layout-nav-vertical-width)' : '100px',

            animation: `${open ? 'children-fade-open' : 'children-fade-close'} 0.5s ease-in-out forwards`,
            '@keyframes children-fade-open': {
              '0%': { pl: '100px' },
              '100%': { pl: 'var(--layout-nav-vertical-width)' },
            },
            '@keyframes children-fade-close': {
              '0%': { pl: 'var(--layout-nav-vertical-width)' },
              '100%': { pl: '100px' },
            },
          },
        },
        ...sx,
      }}
    >
      <Main>{children}</Main>
    </LayoutSection>
  );
}
