import openSignInWindow from "views/pages/LoginPage/oauth_popup"
import queryString from "query-string";

const REACT_APP_SERVER_URL = "https://localhost:8000"


// Twitch OAuth Provider
const twitch_query = {
  client_id: "ec5ywfa209khvmx6yqpsaytocmlzr3",
  redirect_uri: "http://localhost:3001/auth/twitch/callback",
  response_type: 'code',
  scope: 'user:read:follows clips:edit',
};
const twitch_basic_url = "https://id.twitch.tv/oauth2/authorize?"
export const twitch_oauthurl = twitch_basic_url + queryString.stringify(twitch_query)
export const twitchSignInAction = () => () => {

  // openSignInWindow(twitch_oauthurl + "&scope=profile email", "SignIn");
  // openSignInWindow(REACT_APP_SERVER_URL + "/users/google", "SignIn");
  openSignInWindow( twitch_oauthurl, "SignIn");
};


// GOOGLE OAuth Provider
const google_query = {
  client_id: "570066117191-b0ob663u6klf2a7v80381h570jsagkqe.apps.googleusercontent.com",
  redirect_uri: "http://localhost:3001/auth/google/callback",
  response_type: 'code',
};
const GOOGLE_ROOT_OAUTH = "https://accounts.google.com/o/oauth2/auth?"
export const GOOGLE_OAUTH = GOOGLE_ROOT_OAUTH + queryString.stringify(google_query)

export const googleSignInAction = () => () => {
  openSignInWindow(GOOGLE_OAUTH + "&scope=profile email", "SignIn");
  // openSignInWindow(REACT_APP_SERVER_URL + "/users/google", "SignIn");
};




// SPOTIFY
const spotify_query = {
  client_id: "c57cfe40c3a640449c4766ee61ec9d59",
  redirect_uri: "http://localhost:3000/auth/spotify/callback",
  response_type: 'code',
  // state: csrfState,
};
const spotify_url = "https://accounts.spotify.com/authorize?"
export const spotifyOAuthurl = spotify_url + queryString.stringify(spotify_query)
export const spotifySignInAction = () => () => {
  openSignInWindow(spotifyOAuthurl + "&scope", "SignIn");
  // openSignInWindow(REACT_APP_SERVER_URL + "/auth/spotify", "SignIn");
};


// APPLE
const apple_query = {
  client_id: "com.siliconrus.app.Siliconrus.service",
  redirect_uri: "https://api.vc.ru/oauth/confirm/apple",
  response_type: 'code id_token',
  response_mode: 'form_post',
  scope: 'name email',
  state: 'eyJ1c2VyX3VybCI6Imh0dHBzOlwvXC9hcGkudmMucnVcL3YzLjBcL2F1dGhcL2FwcGxlP3N0YXRlPWprWGc2TVlGRVM1Q3RmVkdNUFBlOGR4Z0VzNVV1diJ9',
};
const apple_basic_url = `https://appleid.apple.com/auth/authorize?`;
export const apple_oauthurl = apple_basic_url + queryString.stringify(apple_query)
export const appleSignInAction = () => () => {
  // openSignInWindow(apple_oauthurl + "&scope=name email", "SignIn");
  openSignInWindow(apple_oauthurl, "SignIn");
  // openSignInWindow(REACT_APP_SERVER_URL + "/auth/apple", "SignIn");
};


// DEEZER
const deezer_query = {
  client_id: "567922",
  redirect_uri: "http://localhost:3001/auth/deezer/callback",
  response_type: 'code',
  dispatch_path: 'auth',
  // scope: 'public+read_photos+write_likes+read_collections+write_collections',
  // state: csrfState,
};
const deezer_basic_url = "https://connect.deezer.com/oauth/auth.php?"
export const deezer_oauthurl = deezer_basic_url + queryString.stringify(deezer_query)
export const deezerSignInAction = () => () => {
  openSignInWindow(deezer_oauthurl, "SignIn");
  // openSignInWindow(REACT_APP_SERVER_URL, "SignIn");
};

const DeezerBaseAuthUrl = `https://connect.deezer.com/oauth/auth.php?
  app_id=YOUR_APP_ID&
  redirect_uri=http://localhost:3000/auth/deezer/callback&
  perms=basic_access,email
`;

// UNSPLASH
const unsplash_query = {
  client_id: "eri4WEuuCAynz46CN1cwMf_ITGhTRFUgmDv1YhB5aYA",
  redirect_uri: "http://localhost:3000/auth/unsplash/callback",
  response_type: 'code',
  scope: 'public read_user',
  // scope: 'public read_photos write_likes read_collections write_collections',
};

const unsplash_basic_url = "https://unsplash.com/oauth/authorize?"
export const unsplash_oauthurl = unsplash_basic_url + queryString.stringify(unsplash_query)

export const unsplashSignInAction = () => () => {
  openSignInWindow(unsplash_oauthurl, "SignIn");
};

// INSTAGRAM
const instagram_query = {
  client_id: "444411567844399",
  redirect_uri: "https://localhost:3000/auth/instagram/callback",
  response_type: 'code',
  scope: 'user_profile,user_media',
  // state: csrfState,
};
const instagram_basic_url = "https://api.instagram.com/oauth/authorize?"
const instagram_oauthurl = instagram_basic_url + queryString.stringify(instagram_query)
export const instagramSignInAction = () => () => {
  openSignInWindow(instagram_oauthurl + "&scope=user_profile,user_media", "SignIn");
  // openSignInWindow(REACT_APP_SERVER_URL, "SignIn");
};

const InstagramBaseAuthUrl = `https://api.instagram.com/oauth/authorize
  ?client_id=444411567844399
  &redirect_uri=https://localhost:3000/auth/instagram/callback
  &response_type=code
  &scope=user_profile,user_media
`;

// VKONTAKTE
const vk_query = {
  client_id: "5390c4f2dd203dcdb31faceaef1878e76d14042e5352eebc33de97850c3ec02e",
  redirect_uri: "http://localhost:3000/auth/vk/callback",
  response_type: 'code',
  // scope: 'public+read_photos+write_likes+read_collections+write_collections',
  // state: csrfState,
};
const vk_basic_url = "https://oauth.vk.com/authorize?"
export const vk_oauthurl = vk_basic_url + queryString.stringify(vk_query)
export const vkSignInAction = () => () => {
  openSignInWindow(vk_oauthurl + "&scope=public+read_photos+write_likes+read_collections+write_collections", "SignIn");
  openSignInWindow(REACT_APP_SERVER_URL + "/auth/vk", "SignIn");
};
