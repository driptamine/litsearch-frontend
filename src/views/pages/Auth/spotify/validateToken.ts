import axios, { AxiosResponse } from 'axios';
import { getCookie } from 'views/utils';
import API from '../navigation/API';
import litloopAPI from '../litloop/API';

interface TokenResponse {
  data: {
    access_token?: string;
    expires_in?: number;
    [key: string]: unknown;
  };
  config?: {
    headers?: {
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface TokenPromise {
  requestPromise: Promise<TokenResponse>;
  ttl: number;
}

let promise: TokenPromise | null = null;

const validateToken = async (NoAuthNeddedAndFallbackToAppToken?: boolean): Promise<string | null> => {
  const user_litloop = await litloopAPI.currentAuthenticatedUser();

  if (!NoAuthNeddedAndFallbackToAppToken && !user_litloop) {
    return null as any;
}


  const validPromise = await validationOfToken(NoAuthNeddedAndFallbackToAppToken);
  return validPromise?.data?.access_token || null;
};

const validationOfToken = async (NoAuthNeddedAndFallbackToAppToken?: boolean): Promise<TokenResponse> => {
  if (!promise?.requestPromise || Date.now() > promise.ttl) {
    const request = validateTokenFunc(NoAuthNeddedAndFallbackToAppToken);
    promise = {
      requestPromise: request,
      ttl: Date.now() + (((request as unknown as TokenResponse)?.data?.expires_in || 30) - 20) * 1000,
    };
  }

  return promise.requestPromise;
};

const validateTokenFunc = async (NoAuthNeddedAndFallbackToAppToken?: boolean): Promise<TokenResponse> => {
  const access_token = getCookie('Spotify-access_token');
  const refresh_token = getCookie('Spotify-refresh_token');

  try {
    if (access_token) {
      return await fullValidateFunc();
    } else if (refresh_token) {
      // Spotify token refresh logic - return a promise that resolves when token is valid
      // Token refresh handled elsewhere
      return {} as TokenResponse;
    } else {
      return {} as TokenResponse;
    }
  } catch (e) {
    console.log('validateTokenFunc catch e:', e);
    return {} as TokenResponse;
  }
};

const fullValidateFunc = async (): Promise<TokenResponse> => {
  const access_token = getCookie('Spotify-access_token') as string;
  const res = await validateFunction(access_token);
  // Token is valid if we got a response
  return res;
};

const validateFunction = async (token: string): Promise<TokenResponse> => {
  const res = await axios
    .get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .catch((e) => {
      if (axios.isCancel(e)) {
        return;
      }
      console.log('e:', e);
      return {} as AxiosResponse<TokenResponse>;
    });

  if (res?.data && !res?.data?.access_token) {
    // Token is valid if API returned user data
    return res as unknown as TokenResponse;
  }

  return {} as TokenResponse;
};

export default validateToken;