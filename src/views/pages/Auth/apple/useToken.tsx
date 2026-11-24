import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

import useCookieState from 'core/hooks2/useCookieState';
import useLocalStorageState from 'core/hooks2/useLocalStorageState';
import useSyncedLocalState from 'core/hooks2/useSyncedLocalState';

import { askForBrowserNotificationPermission, getLocalstorage } from 'views/utils';

import AccountContext from 'views/pages/account/AccountContext';
import API from 'views/pages/Auth/navigation/API';
import litloopAPI from 'views/pages/Auth/litloop/API';

interface AppleMusicContextValue {
  validationOfToken?: () => Promise<string | null>;
  autoRefreshEnabled: boolean;
  setAutoRefreshEnabled: () => void;
  appleMusicVideoHoverEnable: boolean;
  setAppleMusicVideoHoverEnable: () => void;
  isEnabledOfflineNotifications: boolean;
  setIsEnabledOfflineNotifications: () => void;
  isEnabledUpdateNotifications: boolean;
  setIsEnabledUpdateNotifications: () => void;
  setEnableVodVolumeOverlay: () => void;
  enableVodVolumeOverlay: boolean;
  appleMusicAccessToken: string | null;
  setAppleMusicAccessToken: (value: string | null) => void;
  appleMusicRefreshToken: string | null;
  setAppleMusicRefreshToken: (value: string | null) => void;
  appleMusicUserId: string | null;
  setAppleMusicUserId: (value: string | null) => void;
  appleMusicUsername: string | null;
  setAppleMusicUsername: (value: string | null) => void;
  appleMusicProfileImage: string | null;
  setAppleMusicProfileImage: (value: string | null) => void;
  updateNotischannels: unknown[];
  setUpdateNotischannels: (value: unknown[]) => void;
  favStreams: unknown[];
  setFavStreams: (value: unknown[]) => void;
  fetchAppleMusicContextData: () => Promise<void>;
}

export const AppleMusicContext = React.createContext<AppleMusicContextValue | undefined>(undefined);

interface AppleMusicProviderProps {
  children: React.ReactNode;
}

interface AppleMusicUser {
  Id?: string;
  Profile?: string;
  Username?: string;
  [key: string]: unknown;
}

interface AppleMusicDataResponse {
  access_token?: string;
  channel_update_notis?: unknown[];
  favorite_streams?: unknown[];
  refresh_token?: string;
  user?: AppleMusicUser;
  [key: string]: unknown;
}

export const AppleMusicProvider = ({ children }: AppleMusicProviderProps) => {
  const { user }: any = useContext(AccountContext as any) || {};
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

  const toggle = (i: string, v?: boolean) => {
    setPref((c: Record<string, unknown>) => ({ ...c, [i]: v ?? !c[i] }));
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
      .then((res: any) => res?.data?.Item || {})
      .catch((e: any) => {
        console.error('AppleMusic usetoken useEffect error: ', e?.message);
        return {};
      })

    setAppleMusicAccessToken(access_token || null);
    setAppleMusicRefreshToken(refresh_token || null);
    setAppleMusicUserId(Id || null);
    setAppleMusicUsername(Username || null);
    setAppleMusicProfileImage(Profile || null);

    setFavStreams(
      (favorite_streams || getLocalstorage('FavoriteStreams') || []).filter((i: unknown) => i),
      invoked.current
    );
    setUpdateNotischannels(
      (channel_update_notis || getLocalstorage('ChannelsUpdateNotifs') || []).filter((i: unknown) => i),
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

  return (
    <AppleMusicContext.Provider
      value={{
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
  const context = useContext(AppleMusicContext);
  const validationOfToken = context?.validationOfToken;

  return useCallback(async () => {
    const validPromise = await validationOfToken?.();
    return Promise.resolve(validPromise);
  }, [validationOfToken]);
};

export default useToken;