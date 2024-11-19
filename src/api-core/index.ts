export const createHeaders = (token?: string) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  if (token) headers.append('Authorization', `Bearer ${token}`);
  return headers;
};

export const getApi = async (url: string, token?: string) => {
  const res = await fetch(url, { method: 'GET', headers: createHeaders(token) });
  if (res.ok) return res.json();
  if (res.status === 401) window.location.href = '/sign-in';
  throw await res.json();
};

export const postApi = async (url: string, body?: BodyInit | null, token?: string) => {
  console.log('%csrc/api-core/index.ts:17 body', 'color: #007acc;', body);
  const res = await fetch(url, { method: 'POST', headers: createHeaders(token), body });
  if (res.ok) return res.json();
  throw await res.json();
};

export const patchApi = async (url: string, body?: BodyInit | null, token?: string) => {
  const res = await fetch(url, { method: 'PATCH', headers: createHeaders(token), body });
  if (res.ok) return res.json();
  throw await res.json();
};

export const deleteApi = async (url: string, token?: string) => {
  const res = await fetch(url, { method: 'DELETE', headers: createHeaders(token) });
  if (res.ok) return res.json();
  throw await res.json();
};
