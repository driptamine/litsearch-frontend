import axios from 'axios';
import validateToken from './validateToken';

export const SPOTIFY_INSTANCE = axios.create({
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
    Promise.reject(error);
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

export const pagination = async (response) => {
  if (response?.data?.nextPageToken) {
    const params = { ...response.config.params, pageToken: response?.data?.nextPageToken };

    return [
      ...(response?.data || []),
      ...((await pagination(await SPOTIFY_INSTANCE.get(response.config.url, { params }))) || []),
    ];
  }

  return response?.data;
};

// const controller = new AbortController();

const SpotifyAPI = {
  getVideoInfo: async (params) => {
    return await SPOTIFY_INSTANCE.get(`/videos`, {
      params,
    });
  },
  getMe: async () => {
    return await SPOTIFY_INSTANCE.get('/channels', {
      params: { part: 'snippet&mine=true' },
    });
  },
  getSubscriptions: async (params) => {
    return await SPOTIFY_INSTANCE.get('/subscriptions', {
      params,
    });
  },
  getActivities: async (params, headers) => {
    return await SPOTIFY_INSTANCE.get('/activities', {
      params,
      headers,
    });
  },
  unFollow: async (params, headers) => {
    return await SPOTIFY_INSTANCE.delete('/subscriptions', {
      params,
      headers,
    });
  },
};
export default SpotifyAPI;
