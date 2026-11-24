import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import validateToken from './validateToken';

interface GoogleAPIResponse {
  data: unknown;
  config: AxiosRequestConfig;
  [key: string]: unknown;
}

interface GooglePaginationResponse {
  data: {
    nextPageToken?: string;
    [key: string]: unknown;
  };
  config: AxiosRequestConfig;
}

export const GOOGLE_INSTANCE: AxiosInstance = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  timeout: 5000,
});

GOOGLE_INSTANCE.interceptors.request.use(
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

GOOGLE_INSTANCE.interceptors.response.use(
  async function (response) {
    return response;
  },
  function (error) {
    console.log('GOOGLE_INSTANCE error:', error);
    return Promise.reject(error);
  }
);

interface VideoData {
  [key: string]: unknown;
}

export const pagination = async (response: GooglePaginationResponse): Promise<VideoData[]> => {
  if (response?.data?.nextPageToken) {
    const params = { ...response.config.params, pageToken: response.data.nextPageToken };

    const nextPage = await GOOGLE_INSTANCE.get(response.config.url || '', { params });
    const nextData = nextPage.data as
      | GooglePaginationResponse
      | undefined;

    const processedNext = nextData ? await pagination(nextData) : [];

    return [
      ...(response.data as VideoData[]),
      ...(processedNext || []),
    ];
  }

  return response?.data as unknown as VideoData[];
};

interface GoogleAPIParams {
  [key: string]: unknown;
}

interface GoogleAPIHeaders {
  [key: string]: string;
}

const GoogleAPI = {
  getVideoInfo: async (params: GoogleAPIParams): Promise<AxiosResponse> => {
    return await GOOGLE_INSTANCE.get('/videos', {
      params,
    });
  },
  getMe: async (): Promise<AxiosResponse> => {
    return await GOOGLE_INSTANCE.get('/channels', {
      params: { part: 'snippet&mine=true' },
    });
  },
  getSubscriptions: async (params: GoogleAPIParams): Promise<AxiosResponse> => {
    return await GOOGLE_INSTANCE.get('/subscriptions', {
      params,
    });
  },
  getActivities: async (params: GoogleAPIParams, headers: GoogleAPIHeaders): Promise<AxiosResponse> => {
    return await GOOGLE_INSTANCE.get('/activities', {
      params,
      headers,
    });
  },
  unFollow: async (params: GoogleAPIParams, headers: GoogleAPIHeaders): Promise<AxiosResponse> => {
    return await GOOGLE_INSTANCE.delete('/subscriptions', {
      params,
      headers,
    });
  },
};

export default GoogleAPI;