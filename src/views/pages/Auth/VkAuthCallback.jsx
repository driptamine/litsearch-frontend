import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useSetRecoilState } from 'recoil';
import { styled } from '@linaria/react';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';

import { AddCookie, getCookie } from 'views/utils';
import LoadingIndicatorz from 'views/pages/LoadingIndicatorz';
import { VkContext } from './vk/useToken';
import Alert from 'views/pages/Alert';
import { footerVisibleAtom, navigationBarVisibleAtom } from 'views/pages/Auth/navigation/atoms';

const VK_CLIENT_ID = "5390c4f2dd203dcdb31faceaef1878e76d14042e5352eebc33de97850c3ec02e";

const VkAuthCallback = () => {
  const [error, setError] = useState();
  const { setVkEmail, setVkAccessToken, setVkRefreshToken, setVkUserId, setVkUsername, setVkProfileImage } = useContext(VkContext) || {};

  const getAccessToken = useCallback(
    async (url) => {
      const authCode = url.searchParams.get('code');
      const res = await axios.post(`${LITLOOP_API_URL}/auth/vk/token/`, { code: authCode });

      const accessToken = res.data.access;
      const refreshToken = res.data.refresh;
      const user = res.data.user;

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: user,
      };
    },
    [
      setVkAccessToken,
      setVkRefreshToken,
      setVkUserId,
      setVkUsername,
      setVkProfileImage,
    ]
  );

  const handleRes = (res) => {
    console.log('successfully authenticated to VK.');
    if (res.access_token) AddCookie('Vk-access_token', res.access_token);
    if (res.refresh_token) AddCookie('Vk-refresh_token', res.refresh_token);

    window.opener.postMessage(
      {
        service: 'vk',
        access_token: res.access_token,
        refresh_token: res.refresh_token,
        username: res.user?.username,
        avatar: res.user?.avatar,
        email: res.user?.email,
        userId: res.user?.id,
      },
      '*'
    );

    if (res.access_token) {
      window.close()
    }
  }

  useEffect(() => {
    (async function () {
      try {
        const url = new URL(window.location.href);
        if (url.pathname === '/auth/vk/callback') {
          if (url.searchParams.get('state') === getCookie('Vk-myState')) {
            await getAccessToken(url).then((res) => { handleRes(res) })
          } else {
            setError({
              title: 'VK authentication failed.',
              message: "Request didn't come from this website.!",
            });
          }
        } else {
          setError({
            title: 'VK authentication failed.',
            message: 'Authenticate to VK failed.',
          });
        }
      } catch (error) {
        setError(error);
      }
    })();
  }, [getAccessToken]);

  if (error) {
    return (
      <Alert data={error} />
    )
  }
  return (
    <div>
      <LoadingIndicatorz
        height={150}
        width={150}
        text={'Authenticating..'}
        smallText={'Talking with VK..'}
      />
    </div>
  );
};

export default VkAuthCallback;
