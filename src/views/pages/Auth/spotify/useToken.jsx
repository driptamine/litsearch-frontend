import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

// CORE
import useCookieState from 'core/hooks2/useCookieState';
import useLocalStorageState from 'core/hooks2/useLocalStorageState';
import useSyncedLocalState from 'core/hooks2/useSyncedLocalState';

import { askForBrowserNotificationPermission, getLocalstorage } from 'views/utils';
import AccountContext from 'views/pages/account/AccountContext';
import API from '../navigation/API';
import validateToken from './validateToken';

// const TTL = 100000;

export const SpotifyContext = React.createContext();

export const SpotifyProvider = ({ children }) => {
  const { user } = useContext(AccountContext);
  // const { user } = useContext(AccountContext) || {};
  const [pref, setPref] = useLocalStorageState('SpotifyPreferences', {}) || {};
  const [spotifyAccessToken, setSpotifyAccessToken] = useCookieState('Spotify-access_token');
  const [spotifyRefreshToken, setSpotifyRefreshToken] = useCookieState('Spotify-refresh_token');
  const [spotifyUserId, setSpotifyUserId] = useCookieState('Spotify-userId');
  const [spotifyUsername, setSpotifyUsername] = useCookieState('Spotify-username');
  const [spotifyProfileImage, setSpotifyProfileImage] = useCookieState('Spotify-profileImg');
  const [updateNotischannels, setUpdateNotischannels] = useSyncedLocalState(
    'ChannelsUpdateNotifs',
    []
  );
  const [favStreams, setFavStreams] = useSyncedLocalState('FavoriteStreams', []);
  const invoked = useRef(false);

  const toggle = (i, v) => {
    setPref((c) => ({ ...c, [i]: v ?? !c[i] }));
  };
  const fetchSpotifyContextData = useCallback(async () => {
    const {
      access_token,
      channel_update_notis,
      favorite_streams,
      refresh_token,
      user: { Id, Profile, Username } = {},
    } = await API.getSpotifyData()
      .then((res) => res?.data?.Item || {})
      .catch((e) => {
        console.error('Spotify usetoken useEffect error: ', e);
        toast.error(e.message);
        return {};
      });

    setSpotifyAccessToken(access_token);
    setSpotifyRefreshToken(refresh_token);
    setSpotifyUserId(Id);
    setSpotifyUsername(Username);
    setSpotifyProfileImage(Profile);

    setFavStreams(
      (favorite_streams || getLocalstorage('FavoriteStreams') || []).filter((i) => i),
      invoked.current
    );
    setUpdateNotischannels(
      (channel_update_notis || getLocalstorage('ChannelsUpdateNotifs') || []).filter((i) => i),
      invoked.current
    );
    invoked.current = true;
  }, [
    setSpotifyAccessToken,
    setSpotifyRefreshToken,
    setSpotifyUserId,
    setSpotifyUsername,
    setSpotifyProfileImage,
    setFavStreams,
    setUpdateNotischannels,
  ]);

  useEffect(() => {
    if (user && !invoked.current) fetchSpotifyContextData();
  }, [fetchSpotifyContextData, user]);

  // const promise = useRef();

  // const validationOfToken = useCallback(() => {
  //   if (!promise.current?.promise || Date.now() > promise.current?.ttl) {
  //     promise.current = { promise: validateToken(), ttl: Date.now() + TTL };
  //   }
  //   return promise.current.promise;
  // }, []);

  return (
    <SpotifyContext.Provider
      value={{
        validationOfToken: validateToken,
        autoRefreshEnabled: Boolean(pref.auto_refresh),
        setAutoRefreshEnabled: () => toggle('auto_refresh'),
        spotifyVideoHoverEnable: Boolean(pref.video_hover),
        setSpotifyVideoHoverEnable: () => toggle('video_hover'),
        isEnabledOfflineNotifications: Boolean(pref.offline_notis),
        setIsEnabledOfflineNotifications: () => {
          askForBrowserNotificationPermission();
          toggle('offline_notis');
        },
        isEnabledUpdateNotifications: Boolean(pref.update_notis),
        setIsEnabledUpdateNotifications: () => {
          askForBrowserNotificationPermission();
          toggle('update_notis');
        },
        setEnableVodVolumeOverlay: () => toggle('vod_volume_overlay'),
        enableVodVolumeOverlay: Boolean(pref.vod_volume_overlay),
        spotifyAccessToken,
        setSpotifyAccessToken,
        spotifyRefreshToken,
        setSpotifyRefreshToken,
        spotifyUserId,
        setSpotifyUserId,
        spotifyUsername,
        setSpotifyUsername,
        spotifyProfileImage,
        setSpotifyProfileImage,
        updateNotischannels,
        setUpdateNotischannels,
        favStreams,
        setFavStreams,
        fetchSpotifyContextData,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};

const useToken = () => {
  const { validationOfToken } = useContext(SpotifyContext);

  return useCallback(async () => {
    const validPromise = await validationOfToken();
    return Promise.resolve(validPromise);
  }, [validationOfToken]);
};
export default useToken;
