import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import useWebSocket from 'core/hooks/useWebSocket';
import { getAuthToken } from 'core/utils/getAuthToken';
import { refreshAccess, tokenUser } from 'core/api/chatSession';

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};

export const NotificationProvider = ({ children }) => {
  const rehydrated = useSelector(state => state._persist?.rehydrated);
  const storeToken = useSelector(state => state.users?.access_token);
  const accessToken = storeToken || getAuthToken();
  const account = tokenUser(accessToken);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [chatUpdateTick, setChatUpdateTick] = useState(0);
  const [incomingCall, setIncomingCall] = useState(null);
  const [closedCall, setClosedCall] = useState(null);
  const [authenticatedAccount, setAuthenticatedAccount] = useState(null);
  const [presence, setPresence] = useState({});
  const messageListeners = useRef(new Map());
  const callListeners = useRef(new Set());
  const lastClosedCall = useRef(null);

  useEffect(() => {
    setIncomingCall(null);
    setClosedCall(null);
    setUnreadChatCount(0);
    setNotifications([]);
    setPresence({});
    lastClosedCall.current = null;
  }, [account]);

  const subscribeToMessages = useCallback((chatId, listener) => {
    const listeners = messageListeners.current;
    const key = String(chatId);
    const subscribers = listeners.get(key) || new Set();
    subscribers.add(listener);
    listeners.set(key, subscribers);
    return () => {
      subscribers.delete(listener);
      if (subscribers.size === 0) listeners.delete(key);
    };
  }, []);

  const subscribeToCalls = useCallback(listener => {
    const listeners = callListeners.current;
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  const receiveIncomingCall = useCallback((event) => {
    if (event?.call_id == null || lastClosedCall.current?.id === event.call_id) return;
    setIncomingCall({
      chatId: event.chat_id, id: event.call_id, callerId: event.caller_id,
      callerName: event.caller_name, callType: event.call_type, expiresAt: event.expires_at,
    });
  }, []);

  const handleMessage = useCallback((data) => {
    if (!data?.type) return;
    if (data?.message && (data.type === 'new_message' || data.type === 'chat_updated')) {
      messageListeners.current.get(String(data.chat_id))?.forEach(listener => listener(data.message));
    }
    switch (data.type) {
      case 'new_message': {
        const { chat_id, chat_user_id, message_id, preview, unread_count } = data;
        setUnreadChatCount(unread_count);
        setNotifications(prev => [{
          id: message_id ?? Date.now(),
          type: 'new_message',
          chat_id,
          chat_user_id,
          preview,
          timestamp: new Date().toISOString(),
        }, ...prev.slice(0, 19)]);
        setChatUpdateTick(t => t + 1);
        break;
      }
      case 'unread_update': {
        setUnreadChatCount(data.unread_count);
        if (data.chat_id != null) setChatUpdateTick(t => t + 1);
        break;
      }
      case 'auth_ok': {
        setAuthenticatedAccount(tokenUser(getAuthToken()));
        setChatUpdateTick(t => t + 1);
        break;
      }
      case 'chat_updated': {
        setChatUpdateTick(t => t + 1);
        break;
      }
      case 'presence_snapshot': {
        setPresence(data.users || {});
        break;
      }
      case 'presence_update': {
        setPresence(previous => previous[data.user_id] === data.online
          ? previous
          : { ...previous, [data.user_id]: data.online });
        break;
      }
      case 'incoming_call': {
        receiveIncomingCall(data);
        break;
      }
      case 'call_closed': {
        const closed = { id: data.call_id, chatId: data.chat_id };
        lastClosedCall.current = closed;
        setClosedCall(closed);
        break;
      }
      case 'call_accepted':
      case 'voip_webrtc_signal': {
        callListeners.current.forEach(listener => listener(data));
        break;
      }
      case 'error': {
        if (data.message === 'Invalid token') refreshAccess(getAuthToken()).catch(() => {});
        break;
      }
    }
  }, [receiveIncomingCall]);

  const clearIncomingCall = useCallback((call) => {
    setIncomingCall(current => current === call ? null : current);
  }, []);

  const enabled = rehydrated && !!accessToken;
  const resetAuthentication = useCallback(() => setAuthenticatedAccount(null), []);
  const { send, isConnected } = useWebSocket('/ws/notifications/', {
    onOpen: resetAuthentication,
    onClose: resetAuthentication,
    onMessage: handleMessage,
    onError: useCallback(() => {
      console.warn('Notification WebSocket error - will auto-reconnect');
    }, []),
    enabled,
    connectionKey: account,
  });

  useEffect(() => {
    if (isConnected && accessToken) {
      send({ type: 'auth', token: accessToken });
    }
  }, [isConnected, send, accessToken]);

  const isOnline = Boolean(isConnected && account && authenticatedAccount === account);
  const requestPresence = useCallback(() => {
    if (isOnline) send({ type: 'presence' });
  }, [isOnline, send]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{
      unreadChatCount,
      notifications,
      chatUpdateTick,
      isConnected,
      isOnline,
      presence: isOnline ? presence : null,
      requestPresence,
      subscribeToMessages,
      subscribeToCalls,
      receiveIncomingCall,
      clearNotifications,
      setUnreadChatCount,
      incomingCall,
      closedCall,
      clearIncomingCall,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
