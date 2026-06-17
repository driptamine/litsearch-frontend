import React, { useContext } from 'react';
import { styled } from '@linaria/react';
import uniqid from 'uniqid';

import { FRONTEND_CALLBACK_URL } from 'core/constants/urls';

import { FaYoutube, FaVk } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { FiLogOut } from 'react-icons/fi';

import { StyledConnectYoutube, StyledConnectGoogle, StyledConnectContainer, StyledReconnectIcon, } from './StyledComponents';
import { AddCookie } from 'views/utils';

import { YoutubeContext } from './youtube/useToken';
import { GoogleContext } from './google/useToken';
import { VkContext } from './vk/useToken';

import ToolTip from 'views/pages/Auth/tooltip/ToolTip';


const GoogleBaseAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=570066117191-b0ob663u6klf2a7v80381h570jsagkqe.apps.googleusercontent.com&redirect_uri=${FRONTEND_CALLBACK_URL}/auth/google/callback&response_type=code&scope=profile email`;

const VkBaseAuthUrl = `https://oauth.vk.com/authorize?client_id=5390c4f2dd203dcdb31faceaef1878e76d14042e5352eebc33de97850c3ec02e&redirect_uri=${FRONTEND_CALLBACK_URL}/auth/vk/callback&response_type=code&scope=email`;

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

const ReAuthenticateButton = ({ disconnect, serviceName, style, title: customTitle }) => {
  const { youtubeUsername, setYoutubeProfileImage, youtubeAccessToken } = useContext(YoutubeContext) || {};

  const { googleUsername, googleProfileImage, googleAccessToken } = useContext(GoogleContext) || {};

  const { vkUsername, vkProfileImage, vkAccessToken } = useContext(VkContext) || {};

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
          onClick={() => authenticatePopup('Google', `${GoogleBaseAuthUrl}`)}
        >
          <FcGoogle size={24} />
          {customTitle || 'Connect Google'}
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
