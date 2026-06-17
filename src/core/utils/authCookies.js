import { AddCookie, RemoveCookie, getCookie } from '../../views/utils';

const COOKIE_OPTIONS = { 'max-age': 86400 * 30 };

export const saveAuthCookies = (data) => {
  const access_token = data?.access_token || data?.token;
  const refresh_token = data?.refresh_token;

  if (access_token && typeof access_token === 'string') {
    AddCookie('access_token', access_token, COOKIE_OPTIONS);
  }
  if (refresh_token && typeof refresh_token === 'string') {
    AddCookie('refresh_token', refresh_token, COOKIE_OPTIONS);
  }
};

export const clearAuthCookies = () => {
  RemoveCookie('access_token');
  RemoveCookie('refresh_token');
};

export const getAuthTokensFromCookies = () => {
  const access_token = getCookie('access_token');
  const refresh_token = getCookie('refresh_token');
  if (access_token && typeof access_token === 'string') {
    return { access_token, refresh_token };
  }
  return null;
};
