import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { invokeRequest } from 'src/api-core';
import { PATH_PROFILE } from 'src/api-core/path';
import { CONFIG } from 'src/config-global';
import { Breadcrumbs, LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { usePageStore } from 'src/store/page';
import { useShallow } from 'zustand/react/shallow';

// ----------------------------------------------------------------------

export default function Page() {
  const storeName = StoreName.PROFILE;
  const { setDetail } = usePageStore.getState();
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

  return (
    <>
      <Helmet>
        <title> {`${t(LanguageKey.user.profileTitle)} - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent
        breadcrumb={{ items: [...Breadcrumbs.SERVER_DETAIL.items, { title: data?.name }] }}
      >
        <Box display="flex" alignItems="center" mb={5}>
          <Typography variant="h4" flexGrow={1}>
            {t(LanguageKey.user.profileTitle)}
          </Typography>
        </Box>
      </DashboardContent>
    </>
  );
}
