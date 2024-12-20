import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { FieldValues, UseFormSetError } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { HttpMethod, invokeRequest } from 'src/api-core';
import { PATH_SERVER } from 'src/api-core/path';
import { CONFIG } from 'src/config-global';
import { LanguageKey, StoreName } from 'src/constants';
import { useAPI } from 'src/hooks/use-api';
import { DashboardContent } from 'src/layouts/dashboard';
import { DetailView } from 'src/sections/server';
import { useNotifyStore } from 'src/store/notify';
import { usePageStore } from 'src/store/store';
import { useShallow } from 'zustand/react/shallow';
// ----------------------------------------------------------------------

export default function Page() {
  const storeName = StoreName.SERVER;
  const { setNotify } = useNotifyStore.getState();

  const { setLoadingDetail, setDetail, setList } = usePageStore.getState();
  const { data, refreshNumber = 0 } = usePageStore(
    useShallow((state) => ({ ...state.dataStore![storeName]?.detail }))
  );

  const location = useLocation();
  const id = location.pathname.split('/')[2];

  useAPI({
    baseURL: PATH_SERVER + '/connection/' + id,
    onSuccess: (res) => {
      res?.connectionId && fetchDetail(res?.connectionId);
    },
    onHandleError: (error) => {
      setLoadingDetail(storeName, false);
    },
  });

  const fetchDetail = (connectionId: string) => {
    invokeRequest({
      method: HttpMethod.GET,
      baseURL: PATH_SERVER + `/detail/${connectionId}/${id}`,
      onSuccess: (resDetail) => {
        const { listServices, listNginx, listRepositories, listImages, listContainer, ...detail } =
          resDetail;

        listContainer?.value?.data &&
          setList(StoreName.CONTAINER, {
            data: listContainer?.value?.data,
          });

        listImages?.value?.data &&
          setList(StoreName.IMAGES, {
            data: listImages?.value?.data,
          });

        listRepositories?.value?.data &&
          setList(StoreName.REPOSIROTY, {
            data: listRepositories?.value?.data,
          });

        listNginx?.value?.data &&
          setList(StoreName.NGINX, {
            data: listNginx?.value?.data,
          });

        listServices?.value?.data &&
          setList(StoreName.SERVICE, {
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

  const handleReconnectServer = () => {
    invokeRequest({
      method: HttpMethod.GET,
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
        setNotify({ title: t(LanguageKey.notify.successUpdate), options: { variant: 'success' } });
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
