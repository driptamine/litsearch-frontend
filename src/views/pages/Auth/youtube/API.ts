import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import validateToken from './validateToken';

interface YoutubeAPIResponse {
  data: unknown;
  config: AxiosRequestConfig;
  [key: string]: unknown;
}

interface YoutubePaginationResponse {
  data: {
    nextPageToken?: string;
    [key: string]: unknown;
  };
  config: AxiosRequestConfig;
}

export const YOUTUBE_INSTANCE: AxiosInstance = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  timeout: 5000,
});

YOUTUBE_INSTANCE.interceptors.request.use(
  async (config) => {
    const token = await validateToken();
    config.headers['Authorization'] = `Bearer ${token}`;
    config.headers['Accept'] = 'application/json';
    config.params = { ...(config.params || {}), key: import.meta.env.REACT_APP_YOUTUBE_API_KEY };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

YOUTUBE_INSTANCE.interceptors.response.use(
  async function (response) {
    return response;
  },
  function (error) {
    console.log('YOUTUBE_INSTANCE error:', error);
    return Promise.reject(error);
  }
);

interface YoutubeVideoData {
  [key: string]: unknown;
}

export const pagination = async (response: YoutubePaginationResponse): Promise<YoutubeVideoData[]> => {
  if (response?.data?.nextPageToken) {
    const params = { ...response.config.params, pageToken: response.data.nextPageToken };

    const nextPage = await YOUTUBE_INSTANCE.get(response.config.url || '', { params });
    const nextData = nextPage.data as YoutubePaginationResponse | undefined;

    const processedNext = nextData ? await pagination(nextData) : [];

    return [
      ...(response.data as YoutubeVideoData[]),
      ...(processedNext || []),
    ];
  }

  return response?.data as unknown as YoutubeVideoData[];
};

interface YoutubeAPIParams {
  [key: string]: unknown;
}

interface YoutubeAPIHeaders {
  [key: string]: string;
}

const YoutubeAPI = {
  getVideoInfo: async (params: YoutubeAPIParams): Promise<AxiosResponse> => {
    return await YOUTUBE_INSTANCE.get('/videos', {
      params,
    });
  },
  getMe: async (): Promise<AxiosResponse> => {
    return await YOUTUBE_INSTANCE.get('/channels', {
      params: { part: 'snippet&mine=true' },
    });
  },
  getSubscriptions: async (params: YoutubeAPIParams): Promise<AxiosResponse> => {
    return await YOUTUBE_INSTANCE.get('/subscriptions', {
      params,
    });
  },
  getActivities: async (params: YoutubeAPIParams, headers: YoutubeAPIHeaders): Promise<AxiosResponse> => {
    return await YOUTUBE_INSTANCE.get('/activities', {
      params,
      headers,
    });
  },
  unFollow: async (params: YoutubeAPIParams, headers: YoutubeAPIHeaders): Promise<AxiosResponse> => {
    return await YOUTUBE_INSTANCE.delete('/subscriptions', {
      params,
      headers,
    });
  },
};

export default YoutubeAPI;