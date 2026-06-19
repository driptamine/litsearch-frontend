import { useEffect, useRef, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { WS_URL } from 'core/constants/urls';
import getAuthToken from 'core/utils/getAuthToken';

const buildWsUrl = (path, token) => {
  const query = token ? `?token=${encodeURIComponent(token)}` : '';
  return `${WS_URL}${path}${query}`;
};

const useWebSocket = (path, { onOpen, onMessage, onClose, onError, enabled = true, requireAuth = false } = {}) => {
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const activeUrlRef = useRef(null);
  const allowReconnectRef = useRef(false);
  const enabledRef = useRef(false);
  const [isConnected, setIsConnected] = useState(false);
  const onMessageRef = useRef(onMessage);
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);
  const onErrorRef = useRef(onError);
  const rehydrated = useSelector(state => state._persist?.rehydrated === true);
  const accessToken = useSelector(state => {
    const users = state.users || {};
    return users.access_token || users.access || (typeof users.token === 'string' ? users.token : users.token?.access_token);
  });

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
    setIsConnected(false);

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

    const url = buildWsUrl(path, token);
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
      setIsConnected(true);
      if (onOpenRef.current) onOpenRef.current();
    };

    ws.onmessage = (event) => {
      if (wsRef.current !== ws) return;
      try {
        const data = JSON.parse(event.data);
        if (onMessageRef.current) onMessageRef.current(data);
      } catch {
        if (onMessageRef.current) onMessageRef.current(event.data);
      }
    };

    ws.onclose = () => {
      if (wsRef.current !== ws) return;
      wsRef.current = null;
      activeUrlRef.current = null;
      setIsConnected(false);
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
    return disconnect;
  }, [path, canConnect, connect, disconnect, accessToken]);

  const send = useCallback((data) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, []);

  return { send, isConnected, disconnect };
};

export default useWebSocket;
