import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
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

  useEffect(() => {
    setIncomingCall(null);
    setClosedCall(null);
    setUnreadChatCount(0);
    setNotifications([]);
  }, [account]);

  const handleMessage = useCallback((data) => {
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
      case 'chat_updated':
      case 'auth_ok': {
        setChatUpdateTick(t => t + 1);
        break;
      }
      case 'incoming_call': {
        setIncomingCall({
          chatId: data.chat_id,
          id: data.call_id,
          callerId: data.caller_id,
          callerName: data.caller_name,
          callType: data.call_type,
        });
        break;
      }
      case 'call_closed': {
        setClosedCall({ id: data.call_id, chatId: data.chat_id });
        break;
      }
      case 'error': {
        if (data.message === 'Invalid token') refreshAccess(getAuthToken()).catch(() => {});
        break;
      }
    }
  }, []);

  const clearIncomingCall = useCallback((call) => {
    setIncomingCall(current => current === call ? null : current);
  }, []);

  const enabled = rehydrated && !!accessToken;
  const { send, isConnected } = useWebSocket('/ws/notifications/', {
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

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{
      unreadChatCount,
      notifications,
      chatUpdateTick,
      isConnected,
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
