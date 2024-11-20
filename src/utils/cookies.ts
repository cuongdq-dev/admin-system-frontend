export const getCookie = (cname: string) => {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

export const setCookie = (cname: string, cValue: string, expIns: string) => {
  const expires = `expires=${expIns}`;
  document.cookie = `${cname}=${cValue};${expires};path=/`;
};

export const removeCookie = (cname: string) => {
  document.cookie = `${cname} =; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};
