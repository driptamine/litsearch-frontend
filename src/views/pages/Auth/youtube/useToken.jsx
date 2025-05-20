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

export const YoutubeContext = React.createContext();

export const YoutubeProvider = ({ children }) => {
  const { user } = useContext(AccountContext);
  // const { user } = useContext(AccountContext) || {};
  const [pref, setPref] = useLocalStorageState('YoutubePreferences', {}) || {};
  const [youtubeAccessToken, setYoutubeAccessToken] = useCookieState('Youtube-access_token');
  const [youtubeRefreshToken, setYoutubeRefreshToken] = useCookieState('Youtube-refresh_token');
  const [youtubeUserId, setYoutubeUserId] = useCookieState('Youtube-userId');
  const [youtubeUsername, setYoutubeUsername] = useCookieState('Youtube-username');
  const [youtubeProfileImage, setYoutubeProfileImage] = useCookieState('Youtube-profileImg');
  const [updateNotischannels, setUpdateNotischannels] = useSyncedLocalState(
    'ChannelsUpdateNotifs',
    []
  );
  const [favStreams, setFavStreams] = useSyncedLocalState('FavoriteStreams', []);
  const invoked = useRef(false);

  const toggle = (i, v) => {
    setPref((c) => ({ ...c, [i]: v ?? !c[i] }));
  };
  const fetchYoutubeContextData = useCallback(async () => {
    const {
      access_token,
      channel_update_notis,
      favorite_streams,
      refresh_token,
      user: { Id, Profile, Username } = {},
    } = await API.getYoutubeData()
      .then((res) => res?.data?.Item || {})
      .catch((e) => {
        console.error('Youtube usetoken useEffect error: ', e);
        toast.error(e.message);
        return {};
      });

    setYoutubeAccessToken(access_token);
    setYoutubeRefreshToken(refresh_token);
    setYoutubeUserId(Id);
    setYoutubeUsername(Username);
    setYoutubeProfileImage(Profile);

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
    setYoutubeAccessToken,
    setYoutubeRefreshToken,
    setYoutubeUserId,
    setYoutubeUsername,
    setYoutubeProfileImage,
    setFavStreams,
    setUpdateNotischannels,
  ]);

  useEffect(() => {
    if (user && !invoked.current) fetchYoutubeContextData();
  }, [fetchYoutubeContextData, user]);

  // const promise = useRef();

  // const validationOfToken = useCallback(() => {
  //   if (!promise.current?.promise || Date.now() > promise.current?.ttl) {
  //     promise.current = { promise: validateToken(), ttl: Date.now() + TTL };
  //   }
  //   return promise.current.promise;
  // }, []);

  return (
    <YoutubeContext.Provider
      value={{
        validationOfToken: validateToken,
        autoRefreshEnabled: Boolean(pref.auto_refresh),
        setAutoRefreshEnabled: () => toggle('auto_refresh'),
        youtubeVideoHoverEnable: Boolean(pref.video_hover),
        setYoutubeVideoHoverEnable: () => toggle('video_hover'),
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
        youtubeAccessToken,
        setYoutubeAccessToken,
        youtubeRefreshToken,
        setYoutubeRefreshToken,
        youtubeUserId,
        setYoutubeUserId,
        youtubeUsername,
        setYoutubeUsername,
        youtubeProfileImage,
        setYoutubeProfileImage,
        updateNotischannels,
        setUpdateNotischannels,
        favStreams,
        setFavStreams,
        fetchYoutubeContextData,
      }}
    >
      {children}
    </YoutubeContext.Provider>
  );
};

const useToken = () => {
  const { validationOfToken } = useContext(YoutubeContext);

  return useCallback(async () => {
    const validPromise = await validationOfToken();
    return Promise.resolve(validPromise);
  }, [validationOfToken]);
};
export default useToken;
