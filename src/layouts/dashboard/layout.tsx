import type { Breakpoint, SxProps, Theme } from '@mui/material/styles';

import { useState } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { _notifications } from 'src/_mock';

import { Iconify } from 'src/components/iconify';

import { t } from 'i18next';
import { PATH_LANGUAGE } from 'src/api-core/path';
import CommonBreadcrumbs from 'src/components/breadcrumbs';
import { LanguageKey } from 'src/constants';
import { useAPI } from 'src/hooks/use-api';
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
export type DashboardLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function DashboardLayout({ sx, children, header }: DashboardLayoutProps) {
  const theme = useTheme();
  const [languages, setLanguages] = useState([]);

  useAPI({
    baseURL: PATH_LANGUAGE,
    onSuccess: (res) => setLanguages(res),
  });

  const [navOpen, setNavOpen] = useState(false);
  const layoutQuery: Breakpoint = 'lg';

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
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
                {/* <Searchbar /> */}
                <LanguagePopover data={languages} />
                <NotificationsPopover data={_notifications} />
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
                      href: '#',
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
        <NavDesktop data={navData} layoutQuery={layoutQuery} workspaces={_workspaces} />
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
            pl: 'var(--layout-nav-vertical-width)',
          },
        },
        ...sx,
      }}
    >
      <Main>{children}</Main>
    </LayoutSection>
  );
}
