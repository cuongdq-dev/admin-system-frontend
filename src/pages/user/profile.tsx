import { Avatar, Box, Card, ListItemText, Tab, Tabs, Theme, Typography, Grid } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { invokeRequest } from 'src/api-core';
import { PATH_PROFILE } from 'src/api-core/path';
import { CONFIG } from 'src/config-global';
import { Breadcrumbs, LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { useSettingStore } from 'src/store/setting';
import { useShallow } from 'zustand/react/shallow';
// ----------------------------------------------------------------------

function a11yProps(index: number) {
  return {
    id: `profile-simple-tab-${index}`,
    'aria-controls': `profile-simple-tabpanel-${index}`,
  };
}

function tabStyle(theme: Theme) {
  return {
    '&.Mui-selected': { color: theme.vars.palette.text.primary },
    color: theme.vars.palette.text.secondary,
  };
}

export default function Page() {
  const storeName = StoreName.PROFILE;
  const { setDetail } = usePageStore.getState();
  const { user } = useSettingStore(useShallow((state) => state));
  const { data } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.detail }))
  );

  const getProfile = () => {
    invokeRequest({
      baseURL: PATH_PROFILE,
      onSuccess: (res) => {
        setDetail(storeName, { data: { ...res } });
      },
      onHandleError: (error) => {},
    });
  };
  useEffect(() => {
    getProfile();
  }, []);

  const [value, setValue] = useState(0);

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Helmet>
        <title> {`${t(LanguageKey.user.profileTitle)} - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent
        breadcrumb={{ items: [...Breadcrumbs.PROFILE.items, { title: data?.name }] }}
      >
        <Box display="flex" alignItems="center" mb={5}>
          <Typography variant="h4" flexGrow={1}>
            {t(LanguageKey.user.profileTitle)}
          </Typography>
        </Box>
        <Box>
          <Card sx={{ height: '290px', position: 'relative' }}>
            <Box
              sx={(theme) => {
                return {
                  height: '100%',
                  position: 'relative',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPositionX: 'center',
                  backgroundPositionY: 'center',
                  backgroundImage: `linear-gradient(0deg, rgba(var(--palette-primary-darkerChannel) / 0.8), rgba(var(--palette-primary-darkerChannel) / 0.8)),url(https://assets.minimals.cc/public/assets/images/mock/cover/cover-4.webp)`,
                  color: theme.vars.palette.common.white,
                };
              }}
            >
              <Box
                sx={(theme) => {
                  return {
                    position: 'absolute',
                    left: theme.spacing(3),
                    bottom: theme.spacing(3),
                    display: 'flex',
                    flexDirection: 'row',
                    zIndex: 1,
                  };
                }}
              >
                <Avatar
                  variant="circular"
                  sx={{ width: '128px', height: '128px' }}
                  alt={user?.name}
                  src={user?.avatar.url}
                />
                <ListItemText
                  sx={(theme) => {
                    return { marginTop: theme.spacing(3), marginLeft: theme.spacing(3) };
                  }}
                  primaryTypographyProps={{
                    sx: (theme) => {
                      return {
                        fontSize: theme.breakpoints.up('md')
                          ? theme.typography.h4
                          : theme.typography.body1,
                        fontWeight: theme.typography.fontWeightBold,
                      };
                    },
                  }}
                  secondaryTypographyProps={{ sx: { opacity: 0.8, color: 'text.white' } }}
                  primary={user?.name}
                  secondary={user?.email}
                />
              </Box>
            </Box>

            <Box
              sx={(theme) => {
                return {
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  backgroundColor: theme.vars.palette.background.paper,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  padding: 0,
                  paddingRight: theme.spacing(3),
                };
              }}
            >
              <Tabs
                TabIndicatorProps={{
                  sx: (theme) => {
                    return {
                      backgroundColor: 'currentcolor',
                      color: theme.vars.palette.text.primary,
                    };
                  },
                }}
                value={value}
                onChange={handleChange}
                aria-label="profile-tab"
              >
                <Tab sx={tabStyle} label={t(LanguageKey.user.tabProfile)} {...a11yProps(0)} />
                {/* <Tab sx={tabStyle} label="Item Two" {...a11yProps(1)} />
                <Tab sx={tabStyle} label="Item Three" {...a11yProps(2)} /> */}
              </Tabs>
            </Box>
          </Card>
        </Box>
      </DashboardContent>
    </>
  );
}
