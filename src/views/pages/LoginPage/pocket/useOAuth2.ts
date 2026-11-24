import { useCallback, useState, useRef } from 'react';

const OAUTH_STATE_KEY = 'react-use-oauth2-state-key';
const POPUP_HEIGHT = 700;
const POPUP_WIDTH = 600;
const OAUTH_RESPONSE = 'react-use-oauth2-response';

const generateState = (): string => {
  const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let array = new Uint8Array(40);
  window.crypto.getRandomValues(array);
  array = array.map((x) => validChars.codePointAt(x % validChars.length) || 0);
  const randomState = String.fromCharCode.apply(null, Array.from(array));
  return randomState;
};

const saveState = (state: string): void => {
  sessionStorage.setItem(OAUTH_STATE_KEY, state);
};

const removeState = (): void => {
  sessionStorage.removeItem(OAUTH_STATE_KEY);
};

const openPopup = (url: string): Window | null => {
  const top = window.outerHeight / 2 + window.screenY - POPUP_HEIGHT / 2;
  const left = window.outerWidth / 2 + window.screenX - POPUP_WIDTH / 2;
  return window.open(
    url,
    'OAuth2 Popup',
    `height=${POPUP_HEIGHT},width=${POPUP_WIDTH},top=${top},left=${left}`
  );
};

const closePopup = (popupRef: React.MutableRefObject<Window | null>): void => {
  popupRef.current?.close();
};

const cleanup = (
  intervalRef: React.MutableRefObject<number | null>,
  popupRef: React.MutableRefObject<Window | null>,
  handleMessageListener: (message: MessageEvent) => void
): void => {
  clearInterval(intervalRef.current || undefined);
  closePopup(popupRef);
  removeState();
  window.removeEventListener('message', handleMessageListener);
};

const enhanceAuthorizeUrl = (
  authorizeUrl: string,
  clientId: string,
  redirectUri: string,
  scope: string,
  state: string
): string => {
  return `${authorizeUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
};

const objectToQuery = (object: Record<string, string>): string => {
  return new URLSearchParams(object).toString();
};

const formatExchangeCodeForTokenServerURL = (
  serverUrl: string,
  clientId: string,
  code: string,
  redirectUri: string
): string => {
  return `${serverUrl}?${objectToQuery({
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
  })}`;
};

interface UseOAuth2Props {
  authorizeUrl: string;
  clientId: string;
  redirectUri: string;
  scope?: string;
}

interface UseOAuth2State {
  loading: boolean;
  error: string | null;
}

interface TokenResponse {
  access_token?: string;
  [key: string]: unknown;
}

const useOAuth2 = ({ authorizeUrl, clientId, redirectUri, scope = '' }: UseOAuth2Props) => {
  const popupRef = useRef<Window | null>(null);
  const intervalRef = useRef<number | null>(null);
  const [{ loading, error }, setUI] = useState<UseOAuth2State>({ loading: false, error: null });
  const [data, setData] = useState<TokenResponse | null>(null);

  const getAuth = useCallback(() => {
    setUI({
      loading: true,
      error: null,
    });

    const state = generateState();
    saveState(state);

    popupRef.current = openPopup(
      enhanceAuthorizeUrl(authorizeUrl, clientId, redirectUri, scope, state)
    );

    async function handleMessageListener(message: MessageEvent) {
      try {
        const type = message && message.data && message.data.type;
        if (type === OAUTH_RESPONSE) {
          const errorMaybe = message && message.data && message.data.error;
          if (errorMaybe) {
            setUI({
              loading: false,
              error: errorMaybe || 'Unknown Error',
            });
          } else {
            const code = message && message.data && message.data.payload && message.data.payload.code;
            const response = await fetch(
              formatExchangeCodeForTokenServerURL(
                'https://your-server.com/token',
                clientId,
                code,
                redirectUri
              )
            );
            if (!response.ok) {
              setUI({
                loading: false,
                error: 'Failed to exchange code for token',
              });
            } else {
              const payload = await response.json() as TokenResponse;
              setUI({
                loading: false,
                error: null,
              });
              setData(payload);
            }
          }
        }
      } catch (genericError) {
        console.error(genericError);
        setUI({
          loading: false,
          error: (genericError as Error).toString(),
        });
      } finally {
        cleanup(intervalRef, popupRef, handleMessageListener);
      }
    }
    window.addEventListener('message', handleMessageListener);

    intervalRef.current = setInterval(() => {
      const popupClosed = !popupRef.current || !popupRef.current.window || popupRef.current.window.closed;
      if (popupClosed) {
        setUI((ui) => ({
          ...ui,
          loading: false,
        }));
        console.warn('Warning: Popup was closed before completing authentication.');
        clearInterval(intervalRef.current || undefined);
        removeState();
        window.removeEventListener('message', handleMessageListener);
      }
    }, 250);

    return () => {
      window.removeEventListener('message', handleMessageListener);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [authorizeUrl, clientId, redirectUri, scope]);

  return {
    loading,
    error,
    data,
    getAuth,
  };
};

export default useOAuth2;