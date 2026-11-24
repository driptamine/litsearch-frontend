import axios from 'axios';
import validateToken from './validateToken';

export const GOOGLE_INSTANCE = axios.create({
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
    Promise.reject(error);
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

export const pagination = async (response) => {
  if (response?.data?.nextPageToken) {
    const params = { ...response.config.params, pageToken: response?.data?.nextPageToken };

    return [
      ...(response?.data || []),
      ...((await pagination(await GOOGLE_INSTANCE.get(response.config.url, { params }))) || []),
    ];
  }

  return response?.data;
};

// const controller = new AbortController();

const GoogleAPI = {
  getVideoInfo: async (params) => {
    return await GOOGLE_INSTANCE.get(`/videos`, {
      params,
    });
  },
  getMe: async () => {
    return await GOOGLE_INSTANCE.get('/channels', {
      params: { part: 'snippet&mine=true' },
    });
  },
  getSubscriptions: async (params) => {
    return await GOOGLE_INSTANCE.get('/subscriptions', {
      params,
    });
  },
  getActivities: async (params, headers) => {
    return await GOOGLE_INSTANCE.get('/activities', {
      params,
      headers,
    });
  },
  unFollow: async (params, headers) => {
    return await GOOGLE_INSTANCE.delete('/subscriptions', {
      params,
      headers,
    });
  },
};
export default GoogleAPI;
