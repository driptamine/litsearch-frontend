import { useEffect, useRef, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { WS_URL } from 'core/constants/urls';
import getAuthToken from 'core/utils/getAuthToken';

const buildWsUrl = (path: string, token: string | null): string => {
  const query = token ? `?token=${encodeURIComponent(token)}` : '';
  return `${WS_URL}${path}${query}`;
};

export type WebSocketMessage = Record<string, unknown> | string;

interface UseWebSocketOptions {
  onOpen?: () => void;
  onMessage?: (data: WebSocketMessage) => void;
  onClose?: () => void;
  onError?: () => void;
  enabled?: boolean;
  requireAuth?: boolean;
  connectionKey?: string | number | null;
}

const useWebSocket = (path: string | null, { onOpen, onMessage, onClose, onError, enabled = true, requireAuth = false, connectionKey }: UseWebSocketOptions = {}) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeUrlRef = useRef<string | null>(null);
  const allowReconnectRef = useRef(false);
  const enabledRef = useRef(false);
  const [connectedPath, setConnectedPath] = useState<string | null>(null);
  const onMessageRef = useRef(onMessage);
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);
  const onErrorRef = useRef(onError);
  const rehydrated = useSelector((state: { _persist?: { rehydrated?: boolean } }) => state._persist?.rehydrated === true);
  const storeToken = useSelector((state: { users?: { access_token?: string } }) => state.users?.access_token);
  const accessToken = storeToken || getAuthToken();

  onMessageRef.current = onMessage;
  onOpenRef.current = onOpen;
  onCloseRef.current = onClose;
  onErrorRef.current = onError;

  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const disconnect = useCallback(() => {
    allowReconnectRef.current = false;
    clearReconnectTimeout();

    const ws = wsRef.current;
    wsRef.current = null;
    activeUrlRef.current = null;
    setConnectedPath(null);

    if (!ws) return;

    ws.onopen = null;
    ws.onmessage = null;
    ws.onclose = null;
    ws.onerror = null;

    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      ws.close();
    }
  }, [clearReconnectTimeout]);

  const connect = useCallback(() => {
    if (!enabledRef.current || !path) return;

    const token = getAuthToken();
    if (requireAuth && !token) return;

    const url = buildWsUrl(path, requireAuth ? token : null);
    const existing = wsRef.current;

    if (
      existing &&
      activeUrlRef.current === url &&
      (existing.readyState === WebSocket.OPEN || existing.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    disconnect();

    allowReconnectRef.current = true;
    activeUrlRef.current = url;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (wsRef.current !== ws) return;
      setConnectedPath(path);
      if (onOpenRef.current) onOpenRef.current();
    };

    ws.onmessage = (event: MessageEvent) => {
      if (wsRef.current !== ws) return;
      try {
        const data = JSON.parse(event.data as string) as WebSocketMessage;
        if (onMessageRef.current) onMessageRef.current(data);
      } catch {
        if (onMessageRef.current) onMessageRef.current(event.data as string);
      }
    };

    ws.onclose = () => {
      if (wsRef.current !== ws) return;
      wsRef.current = null;
      activeUrlRef.current = null;
      setConnectedPath(null);
      if (onCloseRef.current) onCloseRef.current();

      if (allowReconnectRef.current && enabledRef.current) {
        clearReconnectTimeout();
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      }
    };

    ws.onerror = () => {
      if (wsRef.current !== ws) return;
      if (onErrorRef.current) onErrorRef.current();
    };
  }, [path, requireAuth, disconnect, clearReconnectTimeout]);

  const canConnect = Boolean(
    enabled &&
    path &&
    rehydrated &&
    (!requireAuth || !!getAuthToken())
  );

  useEffect(() => {
    enabledRef.current = canConnect;

    if (!canConnect) {
      disconnect();
      return;
    }

    connect();
    const reconnect = () => {
      disconnect();
      connect();
    };
    const connectWhenVisible = () => {
      if (document.visibilityState === 'visible') connect();
    };
    window.addEventListener('online', reconnect);
    document.addEventListener('visibilitychange', connectWhenVisible);
    return () => {
      window.removeEventListener('online', reconnect);
      document.removeEventListener('visibilitychange', connectWhenVisible);
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, canConnect, connect, disconnect, requireAuth ? accessToken : null, connectionKey]);

  const send = useCallback((data: unknown): boolean => {
    if (path && activeUrlRef.current === buildWsUrl(path, requireAuth ? getAuthToken() : null) &&
        wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, [path, requireAuth]);

  return { send, isConnected: connectedPath !== null && connectedPath === path, disconnect };
};

export default useWebSocket;
