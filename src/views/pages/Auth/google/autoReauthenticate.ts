import { AddCookie } from 'views/utils';
import API from '../navigation/API';

const autoReauthenticate = async () => {
  return await API.getGoogleTokens().then(async (res) => {
    AddCookie('Google-access_token', res.access_token);
    return res;
  });
};

export default autoReauthenticate;
