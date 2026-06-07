//@flow

import { postReq, getHeaders, getReq, postReqFormData } from './rest-helper';
import { LITLOOP_API_URL } from '../constants/urls';

// Note: service-info.js is missing. Providing placeholders for OAuth constants.
export const API_ROOT = LITLOOP_API_URL;
export const ROOT_URL = LITLOOP_API_URL;
export const CLIENT_ID = '';
export const CLIENT_SECRET = '';
export const REDIRECT_URI = '';


export const getAccessToken = (code) =>
  postReq(
    `${ROOT_URL}/oauth/token`,
    {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      code,
      grant_type: 'authorization_code',
    },
    getHeaders()
  );


const GOOGLE_TOKEN_ONE = "https://oauth2.googleapis.com";
const GOOGLE_TOKEN_TWO = "https://accounts.google.com/o/oauth2";

export const getGoogleAccessToken = (code) =>
  postReq(
    `${GOOGLE_TOKEN_ONE}/token`,
    {
      client_id: CLIENT_ID,
      client_secret: "AIzaSyBtOSg6OOJc8F_LWPiVUdQjeKb5XKF3UWk",
      redirect_uri: "https://localhost:3000/auth/callback",
      code,
      grant_type: 'authorization_code',
    },
    getHeaders()
  );

export const getUserProfile = () =>
  getReq(`${API_ROOT}/me`);

export const uploadAvatar = (formData) =>
  postReqFormData(`${LITLOOP_API_URL}/users/me/avatar/`, formData);
