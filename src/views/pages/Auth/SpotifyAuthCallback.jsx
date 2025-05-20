import React, { useEffect, useState, useCallback, useContext } from 'react';
import styled from "styled-components";
import { useSetRecoilState } from 'recoil';

import { AddCookie, getCookie } from 'views/utils';
import LoadingIndicator from 'views/components/LoadingIndicator';
import SpotifyAPI from './spotify/API';
import litloopAPI from './navigation/API';
import { SpotifyContext } from './spotify/useToken';
// import Alert from 'views/pages/alert';
import { footerVisibleAtom, navigationBarVisibleAtom } from './navigation/atoms';
const Alert = styled.div`

`;
const SpotifyAuthCallback = () => {
  const [error, setError] = useState();
  const { setSpotifyAccessToken, setSpotifyRefreshToken, setSpotifyUserId, setSpotifyUsername, setSpotifyProfileImage, } = useContext(SpotifyContext) || {};
  const setNavigationBarVisible = useSetRecoilState(navigationBarVisibleAtom);
  const setFooterVisible = useSetRecoilState(footerVisibleAtom);

  const getAccessToken = useCallback(
    async (url) => {
      const authCode = url.searchParams.get('code');

      const requestAccessToken = await litloopAPI.getSpotifyAccessToken(authCode);

      const accessToken = requestAccessToken.data.access_token;
      const refreshToken = requestAccessToken.data.refresh_token;
      if (setSpotifyAccessToken) setSpotifyAccessToken(accessToken);
      if (setSpotifyRefreshToken) setSpotifyRefreshToken(refreshToken);

      const MySpotify = await SpotifyAPI.getMe({ accessToken: accessToken }).then(async (res) => {
        const user = res?.data?.data?.[0];
        setSpotifyUserId(user.id);
        setSpotifyUsername(user.login);
        setSpotifyProfileImage(user.profile_image_url);

        await litloopAPI.updateSpotifyUserData(
          {
            Username: user.login,
            Id: user.id,
            Profile: user.profile_image_url,
          },
          accessToken,
          refreshToken
        );

        return {
          Username: user.login,
          ProfileImg: user.profile_image_url,
          userId: user.id,
        };
      });

      return { token: accessToken, refresh_token: refreshToken, ...MySpotify };
    },
    [
      setSpotifyAccessToken,
      setSpotifyRefreshToken,
      setSpotifyUserId,
      setSpotifyUsername,
      setSpotifyProfileImage,
    ]
  );

  useEffect(() => {
    setNavigationBarVisible(false);
    if (setFooterVisible) setFooterVisible(false);
    (async function () {
      try {
        const url = new URL(window.location.href);
        if (url.pathname === '/auth/spotify/callback') {
          if (url.searchParams.get('state') === getCookie('Spotify-myState')) {
            await getAccessToken(url)
              .then((res) => {
                console.log('successfully authenticated to Spotify.');
                if (res.token) AddCookie('Spotify-access_token', res.token);

                window.opener.postMessage(
                  {
                    service: 'spotify',
                    token: res.token,
                    refresh_token: res.refresh_token,
                    username: res.Username,
                    profileImg: res.ProfileImg,
                    userId: res.userId,
                  },
                  '*'
                );

                if (res.token) {
                  setTimeout(() => window.close(), 1);
                }
              })
              .catch((error) => {
                console.log('getAccessToken() failed');
                setError(error);
              });
          } else {
            setError({
              title: 'Spotify authentication failed.',
              message: "Request didn't come from this website.!",
            });
          }
        } else {
          setError({
            title: 'Spotify authentication failed.',
            message: 'Authenticate to Spotify failed.',
          });
        }
      } catch (error) {
        setError(error);
      }
    })();
  }, [getAccessToken, setNavigationBarVisible, setFooterVisible]);

  console.log('spotify auth callback error:', error);
  if (error) return <Alert data={error} />;
  return (
    <LoadingIndicator
      height={150}
      width={150}
      text={'Authenticating..'}
      smallText={'Talking with Spotify..'}
    />
  );
};

export default SpotifyAuthCallback;
