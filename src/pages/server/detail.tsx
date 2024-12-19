import { t } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FieldValues, UseFormSetError } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_SERVER } from 'src/api-core/path';
import { ButtonDismissNotify } from 'src/components/button';
import { CONFIG } from 'src/config-global';
import { LanguageKey, StoreName } from 'src/constants';
import { useAPI } from 'src/hooks/use-api';
import { DashboardContent } from 'src/layouts/dashboard';
import { DetailView } from 'src/sections/server';
import { usePageStore } from 'src/store/store';
import { useShallow } from 'zustand/react/shallow';
// ----------------------------------------------------------------------

export default function Page() {
  const storeName = StoreName.SERVER;

  const { setLoadingDetail, setDetail } = usePageStore.getState();
  const { data, refreshNumber = 0 } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.detail }))
  );

  const location = useLocation();
  const navigate = useNavigate();
  const id = location.pathname.split('/')[2];

  useAPI({
    baseURL: PATH_SERVER + '/detail/' + id,
    onSuccess: (res) => {
      setTimeout(
        () => setDetail(storeName, { data: res, isLoading: false, isFetching: false }),
        700
      );
      navigate(location.pathname, {
        replace: true,
        state: { ...location.state, sitename: res.name },
      });
    },
    onHandleError: (error) => setTimeout(() => setLoadingDetail(storeName, false), 700),
  });

  const handleUpdate = (setError: UseFormSetError<FieldValues>, values?: Record<string, any>) => {
    invokeRequest({
      method: HttpMethod.PATCH,
      baseURL: PATH_SERVER + '/update/' + id,
      params: values,
      onHandleError: (response) => {
        setLoadingDetail(storeName, false);

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
        setDetail(storeName, { isLoading: false, data: res, isFetching: false });
        enqueueSnackbar(t(LanguageKey.notify.successUpdate), {
          variant: 'success',
          action: (key) => <ButtonDismissNotify key={key} textColor="white" textLabel="Dismiss" />,
        });
      },
    });
  };

  const handleReconnectServer = () => {
    invokeRequest({
      method: HttpMethod.POST,
      baseURL: PATH_SERVER + '/connection/' + id,
      onHandleError: () => {
        setLoadingDetail(storeName, false);
      },
      onSuccess(res) {
        setDetail(storeName, {
          isFetching: false,
          isLoading: false,
          data: { ...data, connectionId: res.connectionId },
        });
        enqueueSnackbar(t(LanguageKey.notify.successUpdate), {
          variant: 'success',
          action: (key) => (
            <ButtonDismissNotify key={key} textColor="white" textLabel="Re-connected" />
          ),
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
        <DetailView
          key={'detail_' + refreshNumber}
          storeName={storeName}
          handleUpdate={handleUpdate}
          handleReconnectServer={handleReconnectServer}
        />
      </DashboardContent>
    </>
  );
}
