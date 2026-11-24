import { useCallback, useEffect, useRef } from 'react';
import { LINKEDIN_OAUTH2_STATE } from './utils';

interface PopupPosition {
  width?: number;
  height?: number;
}

interface GoogleOAuthMessage {
  errorMessage?: string;
  from: string;
  state?: string;
  access_token?: string;
}

interface UseGoogleOptions {
  redirectUri?: string;
  clientId: string;
  onSuccess?: (accessToken: string) => void;
  onError?: (data: GoogleOAuthMessage | { error: string; errorMessage: string }) => void;
  scope?: string;
  state?: string;
  closePopupMessage?: string;
}

const getPopupPositionProperties = ({ width = 600, height = 600 }: PopupPosition = {}): string => {
  const left = screen.width / 2 - width / 2;
  const top = screen.height / 2 - height / 2;
  return `left=${left},top=${top},width=${width},height=${height}`;
};

export function useGoogle({
  clientId,
  onSuccess,
  onError,
  closePopupMessage = 'User closed the popup',
}: UseGoogleOptions) {
  const popupRef = useRef<Window | null>(null);
  const popUpIntervalRef = useRef<number | null>(null);

  const receiveMessage = useCallback(
    (event: MessageEvent) => {
      const savedState = localStorage.getItem(LINKEDIN_OAUTH2_STATE);
      if (event.origin === window.location.origin) {
        if (event.data.errorMessage && event.data.from === 'Linked In') {
          if (event.data.state !== savedState) {
            popupRef.current && popupRef.current.close();
            return;
          }
          onError && onError(event.data);
          popupRef.current && popupRef.current.close();
        } else if (event.data.access_token && event.data.from === 'Linked In') {
          onSuccess && onSuccess(event.data.access_token);
          popupRef.current && popupRef.current.close();
        }
      }
    },
    [onError, onSuccess],
  );

  useEffect(() => {
    return () => {
      window.removeEventListener('message', receiveMessage, false);

      if (popupRef.current) {
        popupRef.current.close();
        popupRef.current = null;
      }
      if (popUpIntervalRef.current) {
        window.clearInterval(popUpIntervalRef.current);
        popUpIntervalRef.current = null;
      }
    };
  }, [receiveMessage]);

  useEffect(() => {
    window.addEventListener('message', receiveMessage, false);
    return () => {
      window.removeEventListener('message', receiveMessage, false);
    };
  }, [receiveMessage]);

  const getUrl = (): string => {
    const query = {
      client_id: clientId,
      redirect_uri: 'http://localhost:8000/auth/google/callback',
      response_type: 'code',
      scope: 'email profile',
    };
    const basic_url = 'https://accounts.google.com/o/oauth2/auth?';
    const queryString = new URLSearchParams(query);
    const googleOauthurl = basic_url + queryString.toString();

    return googleOauthurl;
  };

  const googleLogin = () => {
    popupRef.current?.close();
    popupRef.current = window.open(
      getUrl(),
      '_blank',
      getPopupPositionProperties({ width: 600, height: 600 }),
    );

    if (popUpIntervalRef.current) {
      window.clearInterval(popUpIntervalRef.current);
      popUpIntervalRef.current = null;
    }

    popUpIntervalRef.current = window.setInterval(() => {
      try {
        if (popupRef.current && popupRef.current.closed) {
          window.clearInterval(popUpIntervalRef.current);
          popUpIntervalRef.current = null;
          if (onError) {
            onError({
              error: 'user_closed_popup',
              errorMessage: closePopupMessage,
            });
          }
        }
      } catch (error) {
        console.error(error);
        window.clearInterval(popUpIntervalRef.current);
        popUpIntervalRef.current = null;
      }
    }, 1000);
  };

  return {
    googleLogin,
  };
}