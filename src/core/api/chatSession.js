import axios from 'axios';
import { fetchCurrentUser, setAccessToken } from 'core/actions';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { getState, store } from 'core/store';
import { getAuthTokensFromCookies, saveAuthCookies } from 'core/utils/authCookies';
import getAuthToken from 'core/utils/getAuthToken';

let refreshInFlight;

export function tokenUser(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload)).user_id;
  } catch {
    return null;
  }
}

function refreshTokenFor(access) {
  const cookies = getAuthTokensFromCookies();
  const users = getState().users;
  const refresh = cookies?.access_token === access
    ? cookies.refresh_token || users.refresh_token || users.refresh
    : users.refresh_token || users.refresh;
  const account = tokenUser(access);
  return account && account === tokenUser(refresh) ? refresh : null;
}

async function refreshAccess(access) {
  const current = getAuthToken();
  if (current !== access) {
    const account = tokenUser(access);
    return account && tokenUser(current) === account ? current : null;
  }
  if (refreshInFlight?.access === access) return refreshInFlight.promise;

  const refresh = refreshTokenFor(access);
  if (!refresh) return null;

  const promise = axios.post(`${LITLOOP_API_URL}/auth/refresh/`, { refresh }, { timeout: 10000 })
    .then(({ data }) => {
      if (getAuthToken() !== access) return null;
      const tokens = { access_token: data.access, refresh_token: data.refresh };
      if (!tokens.access_token || !tokens.refresh_token || tokenUser(tokens.access_token) !== tokenUser(access)) {
        return null;
      }
      saveAuthCookies(tokens);
      store.dispatch(setAccessToken(tokens));
      store.dispatch(fetchCurrentUser());
      return tokens.access_token;
    })
    .finally(() => {
      if (refreshInFlight?.promise === promise) refreshInFlight = null;
    });
  refreshInFlight = { access, promise };
  return promise;
}

export async function chatRequest(path, options = {}) {
  const access = getAuthToken();
  const request = token => axios({
    timeout: 12000,
    ...options,
    url: LITLOOP_API_URL + path,
    headers: { ...options.headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  try {
    return await request(access);
  } catch (error) {
    if (error.response?.status !== 401 || !access || options.signal?.aborted) throw error;
    const token = await refreshAccess(access);
    if (!token || options.signal?.aborted) throw error;
    return request(token);
  }
}
