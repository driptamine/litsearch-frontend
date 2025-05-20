import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

// CORE
import useCookieState from 'core/hooks2/useCookieState';
import useLocalStorageState from 'core/hooks2/useLocalStorageState';
import useSyncedLocalState from 'core/hooks2/useSyncedLocalState';

import { askForBrowserNotificationPermission, getLocalstorage } from 'views/utils';

import AccountContext from 'views/pages/account/AccountContext';
import API from 'views/pages/Auth/navigation/API';
import litloopAPI from 'views/pages/Auth/litloop/API';

// import validateToken from './validateToken';

// const TTL = 100000;

export const AppleMusicContext = React.createContext();

export const AppleMusicProvider = ({ children }) => {
  const { user } = useContext(AccountContext);
  // const { user } = useContext(AccountContext) || {};
  const [pref, setPref] = useLocalStorageState('AppleMusicPreferences', {}) || {};
  const [appleMusicAccessToken, setAppleMusicAccessToken] = useCookieState('AppleMusic-access_token');
  const [appleMusicRefreshToken, setAppleMusicRefreshToken] = useCookieState('AppleMusic-refresh_token');
  const [appleMusicUserId, setAppleMusicUserId] = useCookieState('AppleMusic-userId');

  const [appleMusicUsername, setAppleMusicUsername] = useCookieState('AppleMusic-username', {}) || {};
  const [appleMusicProfileImage, setAppleMusicProfileImage] = useCookieState('AppleMusic-profileImg');

  const [updateNotischannels, setUpdateNotischannels] = useSyncedLocalState(
    'ChannelsUpdateNotifs',
    []
  );
  const [favStreams, setFavStreams] = useSyncedLocalState('FavoriteStreams', []);
  const invoked = useRef(false);

  const toggle = (i, v) => {
    setPref((c) => ({ ...c, [i]: v ?? !c[i] }));
  };
  const fetchAppleMusicContextData = useCallback(async () => {

    const {
      access_token,
      channel_update_notis,
      favorite_streams,
      refresh_token,
      user: {
        Id, Profile, Username
      } = {},
    } = await litloopAPI.getAppleMusicData()
      .then((res) => res?.data?.Item || {})
      .catch((e) => {
        console.error('AppleMusic usetoken useEffect error: ', e);
        toast.error(e.message);
        return {};
      });

    setAppleMusicAccessToken(access_token);
    setAppleMusicRefreshToken(refresh_token);
    setAppleMusicUserId(Id);
    setAppleMusicUsername(Username);
    setAppleMusicProfileImage(Profile);

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
    setAppleMusicAccessToken,
    setAppleMusicRefreshToken,
    setAppleMusicUserId,
    setAppleMusicUsername,
    setAppleMusicProfileImage,
    setFavStreams,
    setUpdateNotischannels,
  ]);

  useEffect(() => {
    if (user && !invoked.current) fetchAppleMusicContextData();
  }, [fetchAppleMusicContextData, user]);

  // const promise = useRef();

  // const validationOfToken = useCallback(() => {
  //   if (!promise.current?.promise || Date.now() > promise.current?.ttl) {
  //     promise.current = { promise: validateToken(), ttl: Date.now() + TTL };
  //   }
  //   return promise.current.promise;
  // }, []);

  return (
    <AppleMusicContext.Provider
      value={{
        // validationOfToken: validateToken,
        autoRefreshEnabled: Boolean(pref.auto_refresh),
        setAutoRefreshEnabled: () => toggle('auto_refresh'),
        appleMusicVideoHoverEnable: Boolean(pref.video_hover),
        setAppleMusicVideoHoverEnable: () => toggle('video_hover'),
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
        appleMusicAccessToken,
        setAppleMusicAccessToken,
        appleMusicRefreshToken,
        setAppleMusicRefreshToken,
        appleMusicUserId,
        setAppleMusicUserId,
        appleMusicUsername,
        setAppleMusicUsername,
        appleMusicProfileImage,
        setAppleMusicProfileImage,
        updateNotischannels,
        setUpdateNotischannels,
        favStreams,
        setFavStreams,
        fetchAppleMusicContextData,
      }}
    >
      {children}
    </AppleMusicContext.Provider>
  );
};

const useToken = () => {
  const { validationOfToken } = useContext(AppleMusicContext);

  return useCallback(async () => {
    const validPromise = await validationOfToken();
    return Promise.resolve(validPromise);
  }, [validationOfToken]);
};
export default useToken;
