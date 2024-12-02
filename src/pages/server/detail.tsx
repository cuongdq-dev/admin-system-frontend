import { Box, Button, Typography } from '@mui/material';
import { t } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FieldValues, UseFormSetError } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_SERVER } from 'src/api-core/path';
import { ButtonDismissNotify } from 'src/components/button';
import { Iconify } from 'src/components/iconify';
import { CONFIG } from 'src/config-global';
import { useAPI } from 'src/hooks/use-api';
import { DashboardContent } from 'src/layouts/dashboard';
import { DetailView } from 'src/sections/server';
import * as Yup from 'yup';
// ----------------------------------------------------------------------

export default function Page() {
  const [state, setState] = useState<{ data?: IServer; loading: boolean }>({
    loading: true,
  });
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.pathname.split('/')[2];

  useAPI({
    key: 'server_detail',
    baseURL: PATH_SERVER + '/detail/' + id,
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

  const handleUpdate = (setError: UseFormSetError<FieldValues>, values?: Record<string, any>) => {
    setState((state) => ({ ...state, loading: true }));

    invokeRequest({
      method: HttpMethod.PATCH,
      baseURL: PATH_SERVER + '/update/' + id,
      params: values,
      onHandleError: (response) => {
        setState((state) => ({ ...state, loading: false }));

        if (response?.errors && typeof response.errors === 'object') {
          Object.keys(response.errors).forEach((key) => {
            setError(key, {
              type: 'server',
              message: response?.errors![key],
            });
          });
        } else {
          console.error('Unexpected error format:', response);
        }
      },
      onSuccess(res) {
        setState({ loading: false, data: res });
        enqueueSnackbar(t('notify_success_update'), {
          variant: 'success',
          action: (key) => <ButtonDismissNotify key={key} textColor="white" textLabel="Dismiss" />,
        });
      },
    });
  };
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
        <DetailView
          schema={{
            name: Yup.string().required('Email is required'),
            host: Yup.string().required('Password is required'),
            port: Yup.string().required('Password is required'),
            password: Yup.string().required('Password is required'),
            user: Yup.string().required('Password is required'),
          }}
          handleUpdate={handleUpdate}
          loading={state.loading}
          defaultData={state?.data}
        />
      </DashboardContent>
    </>
  );
}
