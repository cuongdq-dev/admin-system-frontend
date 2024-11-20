import { getCookie } from 'src/utils/cookies';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export const createHeaders = () => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  const token = getCookie('token');
  if (token) headers.append('Authorization', `Bearer ${token}`);
  return headers;
};

export const getApi = async (url: string) => {
  const res = await fetch(url, { method: HttpMethod.GET, headers: createHeaders() });
  if (res.ok) return res.json();
  if (res.status === 401) window.location.href = '/sign-in';
  return res.json();
};

export const postApi = async (url: string, body?: BodyInit | null) => {
  const res = await fetch(url, { method: HttpMethod.POST, headers: createHeaders(), body });

  console.log(res);
  if (res.ok) return res.json();
  return res.json();
};

export const patchApi = async (url: string, body?: BodyInit | null) => {
  const res = await fetch(url, { method: HttpMethod.PATCH, headers: createHeaders(), body });
  if (res.ok) return res.json();
  return res.json();
};

export const deleteApi = async (url: string) => {
  const res = await fetch(url, { method: HttpMethod.DELETE, headers: createHeaders() });
  if (res.ok) return res.json();
  return res.json();
};
