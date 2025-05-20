import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useSetRecoilState } from 'recoil';
import styled from "styled-components";
import axios from 'axios';

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
      // const requestAccessToken = await litloopAPI.getGoogleAccessToken(authCode);
      const res = await axios.put('http://localhost:8000/auth/google/token', { code: authCode });

      console.log(res)
      const accessToken = res.data.access_token;
      const refreshToken = res.data.id_token;
      // if (setGoogleAccessToken) setGoogleAccessToken(accessToken);
      // if (setGoogleRefreshToken) setGoogleRefreshToken(refreshToken);

      const config = {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          // 'Client-ID': GOOGLE_CLIENT_ID
        }
      };

      // const MyGoogle = await GoogleAPI.getMe({ accessToken: accessToken }).then(async (res) => {
      // const MyGoogle = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', config).then(async (res) => {
      const MyGoogle = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', config).then(async (res) => {
        // const user = res?.data?.data?.[0];
        const user = res?.data;
        console.log(res.data);


        // setGoogleUsername(user.givenName);
        // setGoogleProfileImage(user.picture);
        // setGoogleUserId(user.sub);
        // setGoogleEmail(user.email);

        // await litloopAPI.updateGoogleUserData(
        //   {
        //     Username: user.login,
        //     Id: user.id,
        //     Profile: user.profile_image_url,
        //   },
        //   accessToken,
        //   refreshToken
        // );

        return {
          Email: user.email,
          // Username: user.givenName,
          picture: user.picture,
          userId: user.sub,
        };
      });

      // return { access_token: accessToken, refresh_token: refreshToken, ...MyGoogle };
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        ...MyGoogle
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

    window.opener.postMessage(
      {
        service: 'google',
        access_token: res.access_token,
        // refresh_token: res.refresh_token,
        // username: res.Username,
        profileImg: res.picture,
        // userId: res.userId,
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
