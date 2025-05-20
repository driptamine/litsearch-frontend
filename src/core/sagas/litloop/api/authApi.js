import axios from 'axios';

export const googleLoginApi = (token) => {
  return axios.post('/api/google-login/', { token })
    .then(response => response.data)
    .catch(error => { throw error.response.data });
};
