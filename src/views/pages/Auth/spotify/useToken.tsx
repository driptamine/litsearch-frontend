import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

import useCookieState from 'core/hooks2/useCookieState';
import useLocalStorageState from 'core/hooks2/useLocalStorageState';
import useSyncedLocalState from 'core/hooks2/useSyncedLocalState';

import { askForBrowserNotificationPermission, getLocalstorage } from 'views/utils';
import AccountContext from 'views/pages/account/AccountContext';
import API from '../navigation/API';
import validateToken from './validateToken'
import litloopAPI from '../litloop/API';

interface SpotifyContextValue {
  validationOfToken: (NoAuthNeddedAndFallbackToAppToken?: boolean) => Promise<string | null>;
  autoRefreshEnabled: boolean;
  setAutoRefreshEnabled: () => void;
  spotifyVideoHoverEnable: boolean;
  setSpotifyVideoHoverEnable: () => void;
  isEnabledOfflineNotifications: boolean;
  setIsEnabledOfflineNotifications: () => void;
  isEnabledUpdateNotifications: boolean;
  setIsEnabledUpdateNotifications: () => void;
  setEnableVodVolumeOverlay: () => void;
  enableVodVolumeOverlay: boolean;
  spotifyAccessToken: string | null;
  setSpotifyAccessToken: (value: string | null) => void;
  spotifyRefreshToken: string | null;
  setSpotifyRefreshToken: (value: string | null) => void;
  spotifyUserId: string | null;
  setSpotifyUserId: (value: string | null) => void;
  spotifyUsername: string | null;
  setSpotifyUsername: (value: string | null) => void;
  spotifyProfileImage: string | null;
  setSpotifyProfileImage: (value: string | null) => void;
  updateNotischannels: unknown[];
  setUpdateNotischannels: (value: unknown[]) => void;
  favStreams: unknown[];
  setFavStreams: (value: unknown[]) => void;
  fetchSpotifyContextData: () => Promise<void>;
}

export const SpotifyContext = React.createContext<SpotifyContextValue | undefined>(undefined);

interface SpotifyProviderProps {
  children: React.ReactNode;
}

interface SpotifyDataResponse {
  access_token?: string;
  channel_update_notis?: unknown[];
  favorite_streams?: unknown[];
  refresh_token?: string;
  user?: {
    Id?: string;
    Profile?: string;
    Username?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export const SpotifyProvider = ({ children }: SpotifyProviderProps) => {
  const { user }: any = useContext(AccountContext as any) || {};
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

  const toggle = (i: string, v?: boolean) => {
    setPref((c: Record<string, unknown>) => ({ ...c, [i]: v ?? !c[i] }));
  };

  const fetchSpotifyContextData = useCallback(async () => {
    const {
      access_token,
      channel_update_notis,
      favorite_streams,
      refresh_token,
      user: { Id, Profile, Username } = {},
    } = await litloopAPI.getSpotifyData()
      .then((res: any) => res?.data?.Item || {})
      .catch((e: any) => {
        console.error('Spotify usetoken useEffect error: ', e?.message);
        return {};
      })

    setSpotifyAccessToken(access_token || null);
    setSpotifyRefreshToken(refresh_token || null);
    setSpotifyUserId(Id || null);
    setSpotifyUsername(Username || null);
    setSpotifyProfileImage(Profile || null);

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
  const context = useContext(SpotifyContext);
  const validationOfToken = context?.validationOfToken;

  return useCallback(async () => {
    const validPromise = await validationOfToken?.();
    return Promise.resolve(validPromise);
  }, [validationOfToken]);
};

export default useToken;