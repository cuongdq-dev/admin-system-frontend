import { CircularProgress, IconButton, useTheme } from '@mui/material';
import { t } from 'i18next';
import { closeSnackbar } from 'notistack';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FieldValues, UseFormSetError } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_SERVER } from 'src/api-core/path';
import { Iconify } from 'src/components/iconify';
import { CONFIG } from 'src/config-global';
import { LanguageKey, StoreName } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { DetailView } from 'src/sections/server';
import { useNotifyStore } from 'src/store/notify';
import { usePageStore } from 'src/store/page';
import { useShallow } from 'zustand/react/shallow';

// ----------------------------------------------------------------------

export default function Page() {
  const { id } = useParams();

  const storeName = StoreName.SERVER;
  const { setNotify } = useNotifyStore.getState();
  const theme = useTheme();
  const { setLoadingDetail, setDetail, setList, removeStore } = usePageStore.getState();
  const { data, refreshNumber = 0 } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.detail }))
  );

  const connectServer = () => {
    invokeRequest({
      baseURL: PATH_SERVER + '/connection/' + id,
      onSuccess: (res) => {
        if (res.connectionId) {
          setDetail(storeName, {
            data: { ...res, connectionId: undefined, connectionTemp: res?.connectionId },
          });
          setNotify({
            title: t(LanguageKey.server.notifyFetchingData),
            dismissAction: false,
            key: 'server_connection',
            options: {
              action: (key) => {
                return (
                  <CircularProgress
                    size={20}
                    sx={{
                      color: theme.vars.palette.LinearProgress.infoBg,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                );
              },
              variant: 'info',
              hideIconVariant: true,
              style: { backgroundColor: theme.vars.palette.primary.main },
              persist: true,
              anchorOrigin: {
                horizontal: 'center',
                vertical: 'bottom',
              },
            },
          });
          fetchDetail(res.connectionId);
        } else {
          setNotify({
            title: t(LanguageKey.server.notifyDisconnected),
            dismissAction: false,
            key: 'server_connection',
            options: {
              action: () => {
                return (
                  <IconButton onClick={connectServer} size="small">
                    <Iconify
                      color={theme.vars.palette.grey[400]}
                      icon={'material-symbols:signal-wifi-statusbar-not-connected'}
                    />
                  </IconButton>
                );
              },
              variant: 'error',
              persist: true,
              anchorOrigin: {
                horizontal: 'center',
                vertical: 'bottom',
              },
            },
          });
          setDetail(storeName, { data: res, isFetching: false, isLoading: false });
        }
      },
      onHandleError: (error) => {
        setLoadingDetail(storeName, false);
      },
    });
  };

  const re_connectServer = () => {
    invokeRequest({
      baseURL: PATH_SERVER + '/connection/' + id,
      onSuccess: (res) => {
        if (res.connectionId) {
          setNotify({
            title: t(LanguageKey.server.notifyFetchingData),
            dismissAction: false,
            key: 'server_connection',
            options: {
              action: (key) => {
                return (
                  <CircularProgress
                    size={20}
                    sx={{
                      color: theme.vars.palette.LinearProgress.infoBg,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                );
              },
              variant: 'info',
              hideIconVariant: true,
              style: { backgroundColor: theme.vars.palette.primary.main },
              persist: true,
              anchorOrigin: {
                horizontal: 'center',
                vertical: 'bottom',
              },
            },
          });
          fetchDetail(res.connectionId);
        } else {
          setNotify({
            title: t(LanguageKey.server.notifyDisconnected),
            dismissAction: false,
            key: 'server_connection',
            options: {
              action: () => {
                return (
                  <IconButton onClick={connectServer} size="small">
                    <Iconify
                      color={theme.vars.palette.grey[400]}
                      icon={'material-symbols:signal-wifi-statusbar-not-connected'}
                    />
                  </IconButton>
                );
              },
              variant: 'error',
              persist: true,
              anchorOrigin: {
                horizontal: 'center',
                vertical: 'bottom',
              },
            },
          });
        }
      },
      onHandleError: (error) => {
        setLoadingDetail(storeName, false);
      },
    });
  };

  const disconnect = () => {
    const connectionId = data?.connectionId || data?.connectionTemp;
    connectionId &&
      invokeRequest({
        baseURL: PATH_SERVER + '/disconnect/' + connectionId,
        method: HttpMethod.DELETE,
        onSuccess: () => {},
      });
  };

  useEffect(() => {
    if (id == data?.id) {
      re_connectServer();
    } else {
      setLoadingDetail(storeName, true);
      removeStore(storeName);
      removeStore(StoreName.SERVER_CONTAINER);
      removeStore(StoreName.SERVER_IMAGES);
      removeStore(StoreName.SERVER_NGINX);
      removeStore(StoreName.SERVER_REPOSIROTY);
      removeStore(StoreName.SERVER_SERVICE);
      connectServer();
    }
  }, [id]);

  useEffect(() => {
    return () => {
      closeSnackbar('server_connection');
      disconnect();
    };
  }, []);

  const fetchDetail = (connectionId: string) => {
    invokeRequest({
      method: HttpMethod.GET,
      baseURL: PATH_SERVER + `/detail/${connectionId}/${id}`,
      onSuccess: (resDetail) => {
        closeSnackbar('server_connection');

        const { listServices, listNginx, listRepositories, listImages, listContainer, ...detail } =
          resDetail;

        listContainer?.value?.data &&
          setList(StoreName.SERVER_CONTAINER, {
            data: listContainer?.value?.data,
          });

        listImages?.value?.data &&
          setList(StoreName.SERVER_IMAGES, {
            data: listImages?.value?.data,
          });

        listRepositories?.value?.data &&
          setList(StoreName.SERVER_REPOSIROTY, {
            data: listRepositories?.value?.data,
          });

        listNginx?.value?.data &&
          setList(StoreName.SERVER_NGINX, {
            data: listNginx?.value?.data,
          });

        listServices?.value?.data &&
          setList(StoreName.SERVER_SERVICE, {
            data: listServices?.value?.data,
          });

        setDetail(storeName, { data: detail, isLoading: false, isFetching: false });
      },
      onHandleError: () => {},
    });
  };

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
        setNotify({ title: t(LanguageKey.notify.successUpdate), options: { variant: 'success' } });
      },
    });
  };

  return (
    <>
      <Helmet>
        <title> {`${t(LanguageKey.server.detailPageTitle)} - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent
      // breadcrumb={{ items: [{ href: '/color', title: t(LanguageKey.common.listTitle) }] }}
      >
        <DetailView
          key={'detail_' + refreshNumber}
          storeName={storeName}
          handleUpdate={handleUpdate}
          handleReconnectServer={re_connectServer}
        />
      </DashboardContent>
    </>
  );
}
