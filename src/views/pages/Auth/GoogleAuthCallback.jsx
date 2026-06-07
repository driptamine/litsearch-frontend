import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useSetRecoilState } from 'recoil';
import { styled } from '@linaria/react';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';

import { AddCookie, getCookie } from 'views/utils';
import LoadingIndicatorz from 'views/pages/LoadingIndicatorz';
import GoogleAPI from './google/API';
import litloopAPI from './litloop/API';
import { GoogleContext } from './google/useToken';
import Alert from 'views/pages/Alert';
import { footerVisibleAtom, navigationBarVisibleAtom } from 'views/pages/Auth/navigation/atoms';


const GOOGLE_CLIENT_ID = "570066117191-b0ob663u6klf2a7v80381h570jsagkqe.apps.googleusercontent.com";

const GoogleAuthCallback = () => {
  const [error, setError] = useState();
  const { setGoogleEmail, setGoogleAccessToken, setGoogleRefreshToken, setGoogleUserId, setGoogleUsername, setGoogleProfileImage, } = useContext(GoogleContext) || {};
  // const setNavigationBarVisible = useSetRecoilState(navigationBarVisibleAtom);
  // const setFooterVisible = useSetRecoilState(footerVisibleAtom);

  const getAccessToken = useCallback(
    async (url) => {
      const authCode = url.searchParams.get('code');
      console.log(authCode);
      const res = await axios.post(`${LITLOOP_API_URL}/auth/google/token/`, { code: authCode });

      console.log(res)
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
      setGoogleAccessToken,
      setGoogleRefreshToken,
      setGoogleUserId,
      setGoogleUsername,
      setGoogleProfileImage,
    ]
  );

  const handleRes = (res) => {
    console.log('successfully authenticated to Google.');
    if (res.access_token) AddCookie('Google-access_token', res.access_token);
    if (res.refresh_token) AddCookie('Google-refresh_token', res.refresh_token);

    window.opener.postMessage(
      {
        service: 'google',
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
      // setTimeout(() => window.close(), 100);
      window.close()
    }
  }

  useEffect(() => {
    console.log("DAMNED");
    // setNavigationBarVisible(false);
    // if (setFooterVisible) setFooterVisible(false);
    (async function () {
      try {
        const url = new URL(window.location.href);
        console.log(`URL IS : `);
        if (url.pathname === '/auth/google/callback') {
          console.log(`URL IS : CALLBACK `);

          if (url.searchParams.get('state') === getCookie('Google-myState')) {
            console.log(`URL IS : STATE COOKIE `);
            console.log(url);

            await getAccessToken(url).then((res) => { handleRes(res) })


          } else {
            setError({
              title: 'Google authentication failed.',
              message: "Request didn't come from this website.!",
            });
          }
        } else {
          setError({
            title: 'Google authentication failed.',
            message: 'Authenticate to Google failed.',
          });
        }

      } catch (error) {
        setError(error);
      }
    })();
  }, [getAccessToken ]);

  console.log('google auth callback error:', error);
  if (error) {
    return (
      <Alert data={error} />
    )
  }
  return (
    <div>
      {console.log("AYO CONDUCTOR")}
      <LoadingIndicatorz
        height={150}
        width={150}
        text={'Authenticating..'}
        smallText={'Talking with Google..'}
      />
    </div>
  );
};

export default GoogleAuthCallback;
