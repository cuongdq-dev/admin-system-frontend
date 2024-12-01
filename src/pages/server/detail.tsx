import { t } from 'i18next';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { Box, Button, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATH_SERVER } from 'src/api-core/path';
import { Iconify } from 'src/components/iconify';
import { CONFIG } from 'src/config-global';
import { useAPI } from 'src/hooks/use-api';
import { DashboardContent } from 'src/layouts/dashboard';
import { DetailView } from 'src/sections/server';

// ----------------------------------------------------------------------

export default function Page() {
  const [state, setState] = useState<{ data?: IServer; loading: boolean }>({
    loading: true,
  });
  const location = useLocation();
  const navigate = useNavigate();

  useAPI({
    key: 'server_detail',
    baseURL: PATH_SERVER + '/detail/' + location.pathname.split('/')[2],
    onSuccess: (res) => {
      setTimeout(() => {
        setState({ loading: false, data: res });
      }, 700);
      navigate('.', { state: { sitename: res.name } });
    },
    onHandleError: (error) => {
      setTimeout(() => {
        setState({ loading: false });
      }, 700);
    },
  });

  return (
    <>
      <Helmet>
        <title> {`${t('server_detail_page')} - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center">
          <Typography variant="h4" flexGrow={1}>
            {state.data?.name || t('server_detail_page')}
          </Typography>
          <Button
            size="medium"
            color="inherit"
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('connect_server_button')}
          </Button>
        </Box>
        <DetailView loading={state.loading} data={state?.data} />
      </DashboardContent>
    </>
  );
}
