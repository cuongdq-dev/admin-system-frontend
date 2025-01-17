import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { default as queryString } from 'query-string';
import { useNotifyStore } from 'src/store/notify';
import { getCookie, removeCookie } from '../utils/cookies';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

axios.defaults.headers.common['Authorization'] = `Bearer ${getCookie('token')}`;

axios.interceptors.request.use(function (config) {
  const token = getCookie('token');
  config.baseURL = import.meta.env.VITE_API_URL || '';
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const ApiCore = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete,
};

export const handleError = (err: AxiosError) => {
  const statusErr = err.response?.status;
  if (statusErr === 401) {
    location.replace('/sign-in');
    removeCookie('token');
    removeCookie('refresh-token');
    removeCookie('user-info');
  } else if (statusErr === 403 || statusErr === 404) {
    // location.replace('/404');
  } else {
  }
};

export type RequestProps = {
  baseURL: string;
  onSuccess: (data: any) => void;
  onHandleError?: (error?: { status?: number | string; errors?: Record<string, string> }) => void;
  method?: HttpMethod;
  params?: unknown;
  config?: AxiosRequestConfig;
};

export const onUpdateQuery = (url = '', query = {}) => {
  const currentQuery = queryString.parse(location.search);
  return url + '?' + queryString.stringify(Object.assign(currentQuery, query));
};

const abortControllers: Record<string, AbortController> = {};

const createAbortController = (endpoint: string) => {
  if (abortControllers[endpoint]) {
    abortControllers[endpoint].abort();
  }
  abortControllers[endpoint] = new AbortController();
  return abortControllers[endpoint].signal;
};

export const invokeRequest = async (options: RequestProps) => {
  const { baseURL, params: body, method = HttpMethod.GET, config } = options;
  const { onSuccess, onHandleError } = options;
  const endpointRequest = baseURL;
  const { setNotify } = useNotifyStore.getState();
  try {
    let response: AxiosResponse;
    const signal = method === HttpMethod.GET ? createAbortController(endpointRequest) : undefined;
    if (method === HttpMethod.DELETE)
      response = await ApiCore.delete(endpointRequest, { data: body, timeout: 120000 });
    else if (method === HttpMethod.PATCH)
      response = await ApiCore.patch(endpointRequest, body, { timeout: 120000 });
    else if (method === HttpMethod.POST)
      response = await ApiCore.post(endpointRequest, body, { ...config, timeout: 120000 });
    else response = await ApiCore.get(endpointRequest, { params: body, signal });
    onSuccess(response.data);
  } catch (error) {
    if (axios.isCancel(error)) return;

    error?.response?.data?.message &&
      setNotify({
        title: error?.response?.data?.message || '',
        options: {
          variant: error?.response?.data?.variant || 'error',
        },
      });

    handleError(error as AxiosError);
    onHandleError && onHandleError(error?.response?.data);
  }
};
