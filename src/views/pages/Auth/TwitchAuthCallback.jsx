import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useSetRecoilState } from 'recoil';
import styled from "styled-components";
import axios from 'axios';

import { AddCookie, getCookie } from 'views/utils';
import LoadingIndicatorz from 'views/pages/LoadingIndicatorz';
import TwitchAPI from './twitch/API';
import litloopAPI from './litloop/API';
import { TwitchContext } from './twitch/useToken';
import Alert from 'views/pages/Alert';
import { footerVisibleAtom, navigationBarVisibleAtom } from 'views/pages/Auth/navigation/atoms';

const CLIENT_ID = "ec5ywfa209khvmx6yqpsaytocmlzr3";

const TwitchAuthCallback = () => {
  const [error, setError] = useState();
  const {
    setTwitchAccessToken,
    setTwitchRefreshToken,
    setTwitchUserId,
    setTwitchUsername,
    setTwitchProfileImage
  } = useContext(TwitchContext) || {};
  // const setNavigationBarVisible = useSetRecoilState(navigationBarVisibleAtom);
  // const setFooterVisible = useSetRecoilState(footerVisibleAtom);

  const getAccessToken = useCallback(
    async (url) => {
      const authCode = url.searchParams.get('code');
      console.log(authCode);
      // const requestAccessToken = await litloopAPI.getTwitchAccessToken(authCode);
      const res = await axios.put('http://localhost:8000/auth/twitch/token', { code: authCode });

      const accessToken = res.data.access_token;
      const refreshToken = res.data.refresh_token;
      // if (setTwitchAccessToken) setTwitchAccessToken(accessToken);
      // if (setTwitchRefreshToken) setTwitchRefreshToken(refreshToken);




      const config = {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Client-ID': CLIENT_ID
        }
      };


      // getMe()
      const MyTwitch = await axios.get('https://api.twitch.tv/helix/users', config).then(async (res) => {
        console.log(res);
        const user = res?.data?.data?.[0];

        // setTwitchUserId(user.id);
        // setTwitchUsername(user.login);
        // setTwitchProfileImage(user.profile_image_url);

        // await litloopAPI.updateTwitchUserData(
        //   {
        //     username: user.login,
        //     twitch_id: user.id,
        //     avatar: user.profile_image_url,
        //     email: user.email,
        //   },
        //   accessToken,
        //   refreshToken
        // );
        return {
          // Username: user.login,
          ProfileImg: user.profile_image_url,
          // userId: user.id,
        };
      });

      // const MyTwitch = await TwitchAPI.getMe({ accessToken: accessToken }).then(async (res) => {
      //   const user = res?.data?.data?.[0];
      //   setTwitchUserId(user.id);
      //   setTwitchUsername(user.login);
      //   setTwitchProfileImage(user.profile_image_url);
      //
      //   // await litloopAPI.updateTwitchUserData(
      //   //   {
      //   //     Username: user.login,
      //   //     Id: user.id,
      //   //     Profile: user.profile_image_url,
      //   //   },
      //   //   accessToken,
      //   //   refreshToken
      //   // );
      //
      //   return {
      //     Username: user.login,
      //     ProfileImg: user.profile_image_url,
      //     userId: user.id,
      //   };
      // });

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        ...MyTwitch
      };

      // return {
      //   access_token: accessToken,
      //   refresh_token: refreshToken,
      // };
    },
    [
      setTwitchAccessToken,
      setTwitchRefreshToken,
      setTwitchUserId,
      setTwitchUsername,
      setTwitchProfileImage,
    ]
  );

  const handleRes = (res) => {
    console.log('successfully authenticated to Twitch.');
    if (res.access_token) AddCookie('Twitch-access_token', res.access_token);

    window.opener.postMessage(
      {
        service: 'twitch',
        access_token: res.access_token,
        refresh_token: res.refresh_token,
        // username: res.Username,
        profileImg: res.ProfileImg,
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
        if (url.pathname === '/auth/twitch/callback') {
          console.log(`URL IS : CALLBACK `);

          if (url.searchParams.get('state') === getCookie('Twitch-myState')) {
            console.log(`URL IS : STATE COOKIE `);
            console.log(url);

            await getAccessToken(url).then((res) => { handleRes(res) })


          } else {
            setError({
              title: 'Twitch authentication failed.',
              message: "Request didn't come from this website.!",
            });
          }
        } else {
          setError({
            title: 'Twitch authentication failed.',
            message: 'Authenticate to Twitch failed.',
          });
        }

      } catch (error) {
        setError(error);
      }
    })();
  }, [getAccessToken ]);

  console.log('twitch auth callback error:', error);
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
        smallText={'Talking with Twitch..'}
      />
    </div>
  );
};

export default TwitchAuthCallback;
