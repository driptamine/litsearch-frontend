import React, { useContext } from 'react';
import styled from 'styled-components';
import uniqid from 'uniqid';

import { FaTwitch, FaYoutube, FaSpotify, FaApple, FaTwitter, FaUnsplash, FaSoundcloud, FaDeezer, FaInstagram } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { FiLogOut } from 'react-icons/fi';

import { StyledConnectTwitch, StyledConnectYoutube, StyledConnectGoogle, StyledConnectSpotify, StyledConnectApple, StyledConnectContainer, StyledReconnectIcon, } from './StyledComponents';
import { AddCookie } from 'views/utils';

import { TwitchContext } from './twitch/useToken';
import { YoutubeContext } from './youtube/useToken';
import { GoogleContext } from './google/useToken';
import { SpotifyContext } from './spotify/useToken';
import { AppleMusicContext } from './apple/useToken';

import ToolTip from 'views/pages/Auth/tooltip/ToolTip';


const TwitchBaseAuthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=ec5ywfa209khvmx6yqpsaytocmlzr3&redirect_uri=http://localhost:3001/auth/twitch/callback&scope=user:read:follows+clips:edit&response_type=code`;

const GoogleBaseAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=570066117191-b0ob663u6klf2a7v80381h570jsagkqe.apps.googleusercontent.com&redirect_uri=http://localhost:3001/auth/google/callback&response_type=code&scope=profile email`;

const SpotifyBaseAuthUrl = `https://accounts.spotify.com/authorize?client_id=c57cfe40c3a640449c4766ee61ec9d59&redirect_uri=http://localhost:3000/auth/spotify/callback&response_type=code&scope=&`;

const AppleBaseAuthUrl = `https://appleid.apple.com/auth/authorize?client_id=com.siliconrus.app.Siliconrus.service&redirect_uri=https://api.vc.ru/oauth/confirm/apple&response_type=code id_token&response_mode=form_post&scope=name email&state=eyJ1c2VyX3VybCI6Imh0dHBzOlwvXC9hcGkudmMucnVcL3YzLjBcL2F1dGhcL2FwcGxlP3N0YXRlPWprWGc2TVlGRVM1Q3RmVkdNUFBlOGR4Z0VzNVV1diJ9`;

const DeezerBaseAuthUrl = `https://connect.deezer.com/oauth/auth.php?
  app_id=YOUR_APP_ID&
  redirect_uri=http://localhost:3000/auth/deezer/callback&
  perms=basic_access,email
`;

//to unfollow: scope=https://www.googleapis.com/auth/youtube
//else  scope=https://www.googleapis.com/auth/youtube.readonly
const YoutubeBaseAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?
  client_id=570066117191-b0ob663u6klf2a7v80381h570jsagkqe.apps.googleusercontent.com&
  redirect_uri=http://localhost:3000/auth/youtube/callback&
  response_type=code&scope=https://www.googleapis.com/auth/youtube&
  access_type=offline`;


const authenticatePopup = async (domain, urlParam) => {
  const generateOrginState = async () => uniqid();

  const orginState = await generateOrginState();

  AddCookie(`${domain}-myState`, orginState);

  const url = urlParam + `&state=${orginState}`;
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

const ReAuthenticateButton = ({ disconnect, serviceName, style }) => {
  const { twitchUsername, twitchProfileImage } = useContext(TwitchContext) || {};
  const { youtubeUsername, setYoutubeProfileImage, youtubeAccessToken } = useContext(YoutubeContext) || {};

  const { googleUsername, googleProfileImage, googleAccessToken } = useContext(GoogleContext) || {};
  const { spotifyUsername, spotifyProfileImage, spotifyAccessToken } = useContext(SpotifyContext) || {};
  const { appleMusicUsername, appleMusicProfileImage, appleMusicAccessToken } = useContext(AppleMusicContext) || {};

  const AuthButton = {
    Twitch: !twitchUsername ? (

        <OAuthBtn
          id='connect'
          onClick={() => authenticatePopup('Twitch', `${TwitchBaseAuthUrl}&force_verify=true`)}
        >
          <FaTwitch size={24} />
          Connect Twitch
        </OAuthBtn>

    ) : (
      <>
        <div className='username' id='Twitch'>
          <div
            title='Re-authenticate'
            onClick={() => authenticatePopup('Twitch', `${TwitchBaseAuthUrl}`)}
          >
            <StyledReconnectIcon id='reconnectIcon' />
            <img title='Re-authenticate' src={twitchProfileImage} alt='' />
          </div>
          <p id='name'>{twitchUsername}</p>
        </div>
        {disconnect && (
          <StyledConnectTwitch id='disconnect' title='Disconnect' onClick={disconnect}>
            <FiLogOut size={24} />
          </StyledConnectTwitch>
        )}
      </>
    ),
    Youtube: !youtubeAccessToken ? (

        <OAuthBtn
          id='connect'
          title='Authenticate/Connect'
          onClick={() => authenticatePopup('Youtube', `${YoutubeBaseAuthUrl}&prompt=consent`)}
        >
          <FaYoutube size={30} />
          Connect Youtube
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
          id='connect'
          onClick={() => authenticatePopup('Google', `${GoogleBaseAuthUrl}`)}
        >
          <FcGoogle size={24} />
          Connect Google
        </OAuthBtn>

    ) : (
      <>
        <div className='username' id='Google'>
          <div
            title='Re-authenticate'
            onClick={() => authenticatePopup('Google', `${GoogleBaseAuthUrl}`)}
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
    Spotify: !spotifyUsername ? (

        <OAuthBtn
          id='connect'
          onClick={() => authenticatePopup('Spotify', `${SpotifyBaseAuthUrl}`)}
        >
          <FaSpotify size={24} />
          Connect Spotify
        </OAuthBtn>

    ) : (
      <>
        <div className='username' id='Spotify'>
          <div
            title='Re-authenticate'
            onClick={() => authenticatePopup('Spotify', `${SpotifyBaseAuthUrl}`)}
          >
            <StyledReconnectIcon id='reconnectIcon' />
            <img title='Re-authenticate' src={spotifyProfileImage} alt='' />
          </div>
          <p id='name'>{spotifyUsername}</p>
        </div>
        {disconnect && (
          <StyledConnectSpotify id='disconnect' title='Disconnect' onClick={disconnect}>
            <FiLogOut size={24} />
          </StyledConnectSpotify>
        )}
      </>
    ),
    AppleMusic: !appleMusicUsername ? (

        <OAuthBtn
          id='connect'
          onClick={() => authenticatePopup('AppleMusic', `${AppleBaseAuthUrl}`)}
        >
          <FaApple size={24} />
          Sign in with Apple
        </OAuthBtn>

    ) : (
      <>
        <div className='username' id='Apple'>
          <div
            title='Re-authenticate'
            onClick={() => authenticatePopup('Apple', `${AppleBaseAuthUrl}`)}
          >
            <StyledReconnectIcon id='reconnectIcon' />
            <img title='Re-authenticate' src={appleMusicProfileImage} alt='' />
          </div>
          <p id='name'>{appleMusicUsername}</p>
        </div>
        {disconnect && (
          <StyledConnectApple id='disconnect' title='Disconnect' onClick={disconnect}>
            <FiLogOut size={24} />
          </StyledConnectApple>
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
