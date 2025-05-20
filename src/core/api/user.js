//@flow

import type { RESTAPIResponse } from '../types/data';
import { postReq, getHeaders, getReq } from './rest-helper';
import {
  ROOT_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  API_ROOT,
} from '../constants/service-info';


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
    `${GOOGLE_TOKEN}/token`,
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
