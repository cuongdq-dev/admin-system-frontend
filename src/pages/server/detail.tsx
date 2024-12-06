import { t } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FieldValues, UseFormSetError } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_SERVER } from 'src/api-core/path';
import { ButtonDismissNotify } from 'src/components/button';
import { HeadComponent } from 'src/components/page-head';
import { CONFIG } from 'src/config-global';
import { LanguageKey } from 'src/constants';
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
  const id = location.pathname.split('/')[2];

  useAPI({
    key: 'server_detail',
    baseURL: PATH_SERVER + '/detail/' + id,
    onSuccess: (res) => {
      setTimeout(() => {
        setState({ loading: false, data: res });
      }, 700);
      navigate(location.pathname, {
        replace: true,
        state: { ...location.state, sitename: res.name },
      });
    },
    onHandleError: (error) => {
      setTimeout(() => {
        setState({ loading: false });
      }, 700);
    },
  });

  const handleUpdate = (setError: UseFormSetError<FieldValues>, values?: Record<string, any>) => {
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
        enqueueSnackbar(t(LanguageKey.notify.successUpdate), {
          variant: 'success',
          action: (key) => <ButtonDismissNotify key={key} textColor="white" textLabel="Dismiss" />,
        });
      },
    });
  };
  return (
    <>
      <Helmet>
        <title> {`${t(LanguageKey.server.detailPageTitle)} - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <DetailView handleUpdate={handleUpdate} loading={state.loading} defaultData={state?.data} />
      </DashboardContent>
    </>
  );
}
