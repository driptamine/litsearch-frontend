import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { styled } from '@linaria/react';
import uniqid from 'uniqid';

import { FRONTEND_CALLBACK_URL, GOOGLE_CALLBACK_URL } from 'core/constants/urls';
import { fetchCurrentUser, fetchOAuthUser } from 'core/actions';
import { GOOGLE_SIGN_IN_STATE_KEY, getAuthTokensFromCookies, googleSignInCookie, googleSignInResultKey } from 'core/utils/authCookies';

import { FaYoutube, FaVk } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { FiLogOut } from 'react-icons/fi';

import { StyledConnectYoutube, StyledConnectGoogle, StyledConnectContainer, StyledReconnectIcon, } from './StyledComponents';
import { AddCookie, RemoveCookie } from 'views/utils';

import { YoutubeContext } from './youtube/useToken';
import { GoogleContext } from './google/useToken';
import { VkContext } from './vk/useToken';

import ToolTip from 'views/pages/Auth/tooltip/ToolTip';


const googleAuthParams = new URLSearchParams({
  client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '570066117191-b0ob663u6klf2a7v80381h570jsagkqe.apps.googleusercontent.com',
  redirect_uri: GOOGLE_CALLBACK_URL,
  response_type: 'code',
  scope: 'openid email profile',
});
const GoogleBaseAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${googleAuthParams}`;

const startGoogleSignIn = (onSignIn) => {
  const state = window.crypto.randomUUID();
  const previousState = window.sessionStorage.getItem(GOOGLE_SIGN_IN_STATE_KEY);
  if (previousState) {
    RemoveCookie(googleSignInCookie(previousState));
    window.localStorage.removeItem(googleSignInResultKey(previousState));
  }
  const resultKey = googleSignInResultKey(state);
  const ttlSeconds = 600;
  const expiresAt = Date.now() + ttlSeconds * 1000;
  window.sessionStorage.setItem(GOOGLE_SIGN_IN_STATE_KEY, state);
  AddCookie(googleSignInCookie(state), 'pending', { 'max-age': ttlSeconds });

  const url = new URL(GoogleBaseAuthUrl);
  url.searchParams.set('state', state);
  const popup = window.open(url.href, 'Connect Google', 'popup,width=600,height=700,resizable,scrollbars');
  if (!popup) {
    RemoveCookie(googleSignInCookie(state));
    window.sessionStorage.removeItem(GOOGLE_SIGN_IN_STATE_KEY);
    window.alert('Allow popups for LitLoop to sign in with Google.');
    return;
  }

  // Google can detach the popup's opener during its cross-origin redirects.
  const timer = window.setInterval(() => {
    if (window.sessionStorage.getItem(GOOGLE_SIGN_IN_STATE_KEY) !== state) {
      window.clearInterval(timer);
      return;
    }
    if (Date.now() >= expiresAt) {
      window.clearInterval(timer);
      window.sessionStorage.removeItem(GOOGLE_SIGN_IN_STATE_KEY);
      window.localStorage.removeItem(resultKey);
      return;
    }
    const result = window.localStorage.getItem(resultKey);
    if (!result) return;
    window.clearInterval(timer);
    window.sessionStorage.removeItem(GOOGLE_SIGN_IN_STATE_KEY);
    window.localStorage.removeItem(resultKey);
    const tokens = getAuthTokensFromCookies();
    if (tokens) onSignIn(tokens, JSON.parse(result));
  }, 300);
};

const VkBaseAuthUrl = `https://oauth.vk.com/authorize?client_id=5390c4f2dd203dcdb31faceaef1878e76d14042e5352eebc33de97850c3ec02e&redirect_uri=${FRONTEND_CALLBACK_URL}/auth/vk/callback&response_type=code&scope=email`;

//to unfollow: scope=https://www.googleapis.com/auth/youtube
//else  scope=https://www.googleapis.com/auth/youtube.readonly
const YoutubeBaseAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?
  client_id=570066117191-b0ob663u6klf2a7v80381h570jsagkqe.apps.googleusercontent.com&
  redirect_uri=http://localhost:3000/auth/youtube/callback&
  response_type=code&scope=https://www.googleapis.com/auth/youtube&
  access_type=offline`;


const authenticatePopup = (domain, urlParam) => {
  const state = uniqid();
  AddCookie(`${domain}-myState`, state);

  const url = urlParam + `&state=${encodeURIComponent(state)}`;
  const LeftPosition = window.innerWidth ? (window.innerWidth - 700) / 2 : 0;
  const TopPosition = window.innerHeight ? (window.innerHeight - 850) / 2 : 0;
  const settings = `height=700,width=600,top=${TopPosition},left=50,scrollbars=yes,resizable`;

  try {
    window.open(url, `Connect ${domain}`, settings);
  } catch (e) {
    alert('Another Authendicate popup window might already be open.');
    console.error('Another Authendicate popup window might already be open.');
    console.error('Auth Popup error:', e);
  }
};

const OAuthBtn = styled.button`
  cursor: pointer;
  border: 0;
  padding: 10px;
`;

const ReAuthenticateButton = ({ disconnect, serviceName, style, title: customTitle }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { youtubeUsername, setYoutubeProfileImage, youtubeAccessToken } = useContext(YoutubeContext) || {};

  const { googleUsername, googleProfileImage, googleAccessToken } = useContext(GoogleContext) || {};

  const { vkUsername, vkProfileImage, vkAccessToken } = useContext(VkContext) || {};

  const openGooglePopup = () => startGoogleSignIn((tokens, user) => {
    dispatch(fetchOAuthUser({ ...tokens, service: 'google', userId: user.id, username: user.username, profileImg: user.avatar }));
    dispatch(fetchCurrentUser());
    if (history.location.pathname === '/login') history.replace('/feed');
    if (history.location.pathname === '/signup') history.replace('/');
  });

  const AuthButton = {
    Youtube: !youtubeAccessToken ? (

        <OAuthBtn
          type="button"
          id='connect'
          title='Authenticate/Connect'
          onClick={() => authenticatePopup('Youtube', `${YoutubeBaseAuthUrl}&prompt=consent`)}
        >
          <FaYoutube size={30} />
          {customTitle || 'Connect Youtube'}
        </OAuthBtn>

    ) : (
      <>
        <div className='username' id='Youtube'>
          <div
            title='Re-authenticate'
            onClick={() => authenticatePopup('Youtube', `${YoutubeBaseAuthUrl}&prompt=consent`)}
          >
            <StyledReconnectIcon id='reconnectIcon' />
            <img title='Re-authenticate' src={setYoutubeProfileImage} alt='' />
          </div>
          <p id='name'>{youtubeUsername}</p>
        </div>
        {disconnect && (
          <StyledConnectYoutube id='disconnect' title='Disconnect' onClick={disconnect}>
            <FiLogOut size={30} />
          </StyledConnectYoutube>
        )}
      </>
    ),
    Google: !googleUsername ? (

        <OAuthBtn
          type="button"
          id='connect'
          onClick={openGooglePopup}
        >
          <FcGoogle size={24} />
          {customTitle || 'Connect Google'}
        </OAuthBtn>

    ) : (
      <>
        <div className='username' id='Google'>
          <div
            title='Re-authenticate'
            onClick={openGooglePopup}
          >
            <StyledReconnectIcon id='reconnectIcon' />
            <img title='Re-authenticate' src={googleProfileImage} alt='' />
          </div>
          <p id='name'>{googleUsername}</p>
        </div>
        {disconnect && (
          <StyledConnectGoogle id='disconnect' title='Disconnect' onClick={disconnect}>
            <FiLogOut size={24} />
          </StyledConnectGoogle>
        )}
      </>
    ),
    Vk: !vkUsername ? (

        <OAuthBtn
          type="button"
          id='connect'
          onClick={() => authenticatePopup('Vk', `${VkBaseAuthUrl}`)}
        >
          <FaVk size={24} />
          {customTitle || 'Connect VK'}
        </OAuthBtn>

    ) : (
      <>
        <div className='username' id='Vk'>
          <div
            title='Re-authenticate'
            onClick={() => authenticatePopup('Vk', `${VkBaseAuthUrl}`)}
          >
            <StyledReconnectIcon id='reconnectIcon' />
            <img title='Re-authenticate' src={vkProfileImage} alt='' />
          </div>
          <p id='name'>{vkUsername}</p>
        </div>
        {disconnect && (
          <StyledConnectGoogle id='disconnect' title='Disconnect' onClick={disconnect}>
            <FiLogOut size={24} />
          </StyledConnectGoogle>
        )}
      </>
    ),
  };

  return (
    <StyledConnectContainer style={{ ...style }}>
      {AuthButton[serviceName]}
    </StyledConnectContainer>
  );
};

export default ReAuthenticateButton;
