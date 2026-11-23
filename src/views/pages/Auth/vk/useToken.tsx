import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

import useCookieState from 'core/hooks2/useCookieState';
import useLocalStorageState from 'core/hooks2/useLocalStorageState';
import useSyncedLocalState from 'core/hooks2/useSyncedLocalState';

import { askForBrowserNotificationPermission, getLocalstorage } from 'views/utils';
import AccountContext from 'views/pages/account/AccountContext';
import API from '../navigation/API';
import litloopAPI from 'views/pages/Auth/litloop/API';

export const VkContext = React.createContext();

export const VkProvider = ({ children }) => {
  const { user } = useContext(AccountContext) || {};
  const [pref, setPref] = useLocalStorageState('VkPreferences', {}) || {};
  const [vkAccessToken, setVkAccessToken] = useCookieState('Vk-access_token');
  const [vkRefreshToken, setVkRefreshToken] = useCookieState('Vk-refresh_token');
  const [vkUserId, setVkUserId] = useCookieState('Vk-userId');
  const [vkEmail, setVkEmail] = useCookieState('Vk-email');
  const [vkUsername, setVkUsername] = useCookieState('Vk-username');
  const [vkProfileImage, setVkProfileImage] = useCookieState('Vk-profileImg');

  const [updateNotischannels, setUpdateNotischannels] = useSyncedLocalState(
    'ChannelsUpdateNotifs',
    []
  );
  const [favStreams, setFavStreams] = useSyncedLocalState('FavoriteStreams', []);
  const invoked = useRef(false);

  const toggle = (i, v) => {
    setPref((c) => ({ ...c, [i]: v ?? !c[i] }));
  };

  const fetchVkContextData = useCallback(async () => {
    const {
      access_token,
      channel_update_notis,
      favorite_streams,
      refresh_token,
      user: { Id, Username, Profile, Email } = {},
    } = await litloopAPI.getVkData()
      .then((res) => res?.data?.Item || {})
      .catch((e) => {
        console.error('Vk usetoken useEffect error: ', e);
        toast.error(e.message);
        return {};
      });

    setVkAccessToken(access_token);
    setVkRefreshToken(refresh_token);
    setVkUserId(Id);
    setVkUsername(Username);
    setVkEmail(Email);
    setVkProfileImage(Profile);

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
    setVkAccessToken,
    setVkRefreshToken,
    setVkUserId,
    setVkUsername,
    setVkEmail,
    setVkProfileImage,
    setFavStreams,
    setUpdateNotischannels,
  ]);

  useEffect(() => {
    if (user && !invoked.current) fetchVkContextData();
  }, [fetchVkContextData, user]);

  return (
    <VkContext.Provider
      value={{
        autoRefreshEnabled: Boolean(pref.auto_refresh),
        setAutoRefreshEnabled: () => toggle('auto_refresh'),
        vkVideoHoverEnable: Boolean(pref.video_hover),
        setVkVideoHoverEnable: () => toggle('video_hover'),
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
        vkAccessToken,
        setVkAccessToken,
        vkRefreshToken,
        setVkRefreshToken,
        vkUserId,
        setVkUserId,
        vkUsername,
        setVkUsername,
        vkEmail,
        setVkEmail,
        vkProfileImage,
        setVkProfileImage,
        updateNotischannels,
        setUpdateNotischannels,
        favStreams,
        setFavStreams,
        fetchVkContextData,
      }}
    >
      {children}
    </VkContext.Provider>
  );
};
