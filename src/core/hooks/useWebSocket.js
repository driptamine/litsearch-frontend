import { useEffect, useRef, useCallback, useState } from 'react';
import { WS_URL } from 'core/constants/urls';
import { getState } from 'core/store';

const getToken = () => {
  const users = getState().users || {};
  return users.access_token || users.token?.access_token || (typeof users.token === 'string' ? users.token : users.token?.token);
};

const useWebSocket = (path, { onOpen, onMessage, onClose, onError, enabled = true } = {}) => {
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const onMessageRef = useRef(onMessage);
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);
  const onErrorRef = useRef(onError);

  onMessageRef.current = onMessage;
  onOpenRef.current = onOpen;
  onCloseRef.current = onClose;
  onErrorRef.current = onError;

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onmessage = null;
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close();
      }
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current) disconnect();

    const token = getToken();
    const query = token ? `?token=${encodeURIComponent(token)}` : '';
    const url = `${WS_URL}${path}${query}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      if (onOpenRef.current) onOpenRef.current();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (onMessageRef.current) onMessageRef.current(data);
      } catch {
        if (onMessageRef.current) onMessageRef.current(event.data);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      if (onCloseRef.current) onCloseRef.current();
      reconnectTimeoutRef.current = setTimeout(connect, 3000);
    };

    ws.onerror = () => {
      if (onErrorRef.current) onErrorRef.current();
    };
  }, [path, disconnect]);

  useEffect(() => {
    if (!enabled) {
      disconnect();
      return;
    }
    connect();
    return disconnect;
  }, [path, enabled, connect, disconnect]);

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
