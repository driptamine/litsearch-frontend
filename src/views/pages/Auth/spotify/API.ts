import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import validateToken from './validateToken';

interface SpotifyAPIResponse {
  data: unknown;
  config: AxiosRequestConfig;
  [key: string]: unknown;
}

interface SpotifyPaginationResponse {
  data: {
    nextPageToken?: string;
    [key: string]: unknown;
  };
  config: AxiosRequestConfig;
}

export const SPOTIFY_INSTANCE: AxiosInstance = axios.create({
  baseURL: 'https://www.SpotifyAPIs.com/youtube/v3',
  timeout: 5000,
});

SPOTIFY_INSTANCE.interceptors.request.use(
  async (config) => {
    const token = await validateToken();
    config.headers['Authorization'] = `Bearer ${token}`;
    config.headers['Accept'] = 'application/json';
    config.params = { ...(config.params || {}), key: import.meta.env.REACT_APP_GOOGLE_API_KEY };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

SPOTIFY_INSTANCE.interceptors.response.use(
  async function (response) {
    return response;
  },
  function (error) {
    console.log('GOOGLE_INSTANCE error:', error);
    return Promise.reject(error);
  }
);

interface SpotifyVideoData {
  [key: string]: unknown;
}

export const pagination = async (response: SpotifyPaginationResponse): Promise<SpotifyVideoData[]> => {
  if (response?.data?.nextPageToken) {
    const params = { ...response.config.params, pageToken: response.data.nextPageToken };

    const nextPage = await SPOTIFY_INSTANCE.get(response.config.url || '', { params });
    const nextData = nextPage.data as SpotifyPaginationResponse | undefined;

    const processedNext = nextData ? await pagination(nextData) : [];

    return [
      ...(response.data as SpotifyVideoData[]),
      ...(processedNext || []),
    ];
  }

  return response?.data as unknown as SpotifyVideoData[];
};

interface SpotifyAPIParams {
  [key: string]: unknown;
}

interface SpotifyAPIHeaders {
  [key: string]: string;
}

const SpotifyAPI = {
  getVideoInfo: async (params: SpotifyAPIParams): Promise<AxiosResponse> => {
    return await SPOTIFY_INSTANCE.get('/videos', {
      params,
    });
  },
  getMe: async (): Promise<AxiosResponse> => {
    return await SPOTIFY_INSTANCE.get('/channels', {
      params: { part: 'snippet&mine=true' },
    });
  },
  getSubscriptions: async (params: SpotifyAPIParams): Promise<AxiosResponse> => {
    return await SPOTIFY_INSTANCE.get('/subscriptions', {
      params,
    });
  },
  getActivities: async (params: SpotifyAPIParams, headers: SpotifyAPIHeaders): Promise<AxiosResponse> => {
    return await SPOTIFY_INSTANCE.get('/activities', {
      params,
      headers,
    });
  },
  unFollow: async (params: SpotifyAPIParams, headers: SpotifyAPIHeaders): Promise<AxiosResponse> => {
    return await SPOTIFY_INSTANCE.delete('/subscriptions', {
      params,
      headers,
    });
  },
};

export default SpotifyAPI;