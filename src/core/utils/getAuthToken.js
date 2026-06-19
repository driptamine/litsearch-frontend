import { getState } from 'core/store';
import { getAuthTokensFromCookies } from 'core/utils/authCookies';

export const getAuthToken = () => {
  const users = getState().users || {};
  const fromStore =
    users.access_token ||
    users.token?.access_token ||
    (typeof users.token === 'string' ? users.token : users.token?.token) ||
    users.access;

  if (fromStore) return fromStore;

  const fromCookies = getAuthTokensFromCookies();
  return fromCookies?.access_token || null;
};

export default getAuthToken;
