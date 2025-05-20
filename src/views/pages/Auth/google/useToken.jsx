import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

// CORE
import useCookieState from 'core/hooks2/useCookieState';
import useLocalStorageState from 'core/hooks2/useLocalStorageState';
import useSyncedLocalState from 'core/hooks2/useSyncedLocalState';

import { askForBrowserNotificationPermission, getLocalstorage } from 'views/utils';

import AccountContext from 'views/pages/account/AccountContext';
import API from '../navigation/API';
import litloopAPI from 'views/pages/Auth/litloop/API';

import validateToken from './validateToken';

// const TTL = 100000;

export const GoogleContext = React.createContext();

export const GoogleProvider = ({ children }) => {
  // const { user } = useContext(AccountContext);
  const { user } = useContext(AccountContext) || {};
  const [pref, setPref] = useLocalStorageState('GooglePreferences', {}) || {};
  const [googleAccessToken, setGoogleAccessToken] = useCookieState('Google-access_token');
  const [googleRefreshToken, setGoogleRefreshToken] = useCookieState('Google-refresh_token');
  const [googleUserId, setGoogleUserId] = useCookieState('Google-userId');
  const [googleEmail, setGoogleEmail] = useCookieState('Google-email');

  const [googleUsername, setGoogleUsername] = useCookieState('Google-username') || {};
  const [googleProfileImage, setGoogleProfileImage] = useCookieState('Google-profileImg');

  const [updateNotischannels, setUpdateNotischannels] = useSyncedLocalState(
    'ChannelsUpdateNotifs',
    []
  );
  const [favStreams, setFavStreams] = useSyncedLocalState('FavoriteStreams', []);
  const invoked = useRef(false);

  const toggle = (i, v) => {
    setPref((c) => ({ ...c, [i]: v ?? !c[i] }));
  };
  const fetchGoogleContextData = useCallback(async () => {
    const {
      access_token,
      channel_update_notis,
      favorite_streams,
      refresh_token,
      user: { Id, Username, Profile, Email } = {},
    } = await litloopAPI.getGoogleData()
      .then((res) => res?.data?.Item || {})
      .catch((e) => {
        console.error('Google usetoken useEffect error: ', e);
        toast.error(e.message);
        return {};
      });

    setGoogleAccessToken(access_token);
    setGoogleRefreshToken(refresh_token);
    setGoogleUserId(Id);
    setGoogleUsername(Username);
    setGoogleEmail(Email);
    setGoogleProfileImage(Profile);

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
    setGoogleAccessToken,
    setGoogleRefreshToken,
    setGoogleUserId,
    setGoogleUsername,
    setGoogleEmail,
    setGoogleProfileImage,
    setFavStreams,
    setUpdateNotischannels,
  ]);

  useEffect(() => {
    if (user && !invoked.current) fetchGoogleContextData();
  }, [fetchGoogleContextData, user]);

  // const promise = useRef();

  // const validationOfToken = useCallback(() => {
  //   if (!promise.current?.promise || Date.now() > promise.current?.ttl) {
  //     promise.current = { promise: validateToken(), ttl: Date.now() + TTL };
  //   }
  //   return promise.current.promise;
  // }, []);

  return (
    <GoogleContext.Provider
      value={{
        validationOfToken: validateToken,
        autoRefreshEnabled: Boolean(pref.auto_refresh),
        setAutoRefreshEnabled: () => toggle('auto_refresh'),
        googleVideoHoverEnable: Boolean(pref.video_hover),
        setGoogleVideoHoverEnable: () => toggle('video_hover'),
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
        googleAccessToken,
        setGoogleAccessToken,
        googleRefreshToken,
        setGoogleRefreshToken,
        googleUserId,
        setGoogleUserId,
        googleUsername,
        setGoogleUsername,
        googleEmail,
        setGoogleEmail,
        googleProfileImage,
        setGoogleProfileImage,
        updateNotischannels,
        setUpdateNotischannels,
        favStreams,
        setFavStreams,
        fetchGoogleContextData,
      }}
    >
      {children}
    </GoogleContext.Provider>
  );
};

const useToken = () => {
  const { validationOfToken } = useContext(GoogleContext);

  return useCallback(async () => {
    const validPromise = await validationOfToken();
    return Promise.resolve(validPromise);
  }, [validationOfToken]);
};
export default useToken;
