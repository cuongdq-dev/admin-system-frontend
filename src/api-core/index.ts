import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { default as queryString } from 'query-string';
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

export const invokeRequest = async (options: RequestProps) => {
  const {
    baseURL,
    params: body,
    method = HttpMethod.GET,
    onSuccess,
    onHandleError,
    config,
  } = options;
  const endpointRequest = baseURL;
  try {
    let response: AxiosResponse;
    if (method === HttpMethod.DELETE)
      response = await ApiCore.delete(endpointRequest, { data: body, timeout: 120000 });
    else if (method === HttpMethod.PATCH)
      response = await ApiCore.patch(endpointRequest, body, { timeout: 120000 });
    else if (method === HttpMethod.POST)
      response = await ApiCore.post(endpointRequest, body, { ...config, timeout: 120000 });
    else response = await ApiCore.get(endpointRequest, { params: body });
    onSuccess(response.data);
  } catch (error) {
    handleError(error as AxiosError);
    onHandleError && onHandleError(error?.response?.data);
  }
};
