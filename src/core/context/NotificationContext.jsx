import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useSelectAuthUser from 'core/hooks/useSelectAuthUser';
import useWebSocket from 'core/hooks/useWebSocket';

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};

export const NotificationProvider = ({ children }) => {
  const { isSignedIn, authUser } = useSelectAuthUser();
  const rehydrated = useSelector(state => state._persist?.rehydrated);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [chatUpdateTick, setChatUpdateTick] = useState(0);
  const [incomingCall, setIncomingCall] = useState(null);

  const handleMessage = useCallback((data) => {
    switch (data.type) {
      case 'new_message': {
        const { chat_user_id, preview, unread_count } = data;
        setUnreadChatCount(unread_count);
        setNotifications(prev => [{
          id: Date.now(),
          type: 'new_message',
          chat_user_id,
          preview,
          timestamp: new Date().toISOString(),
        }, ...prev.slice(0, 19)]);
        setChatUpdateTick(t => t + 1);
        break;
      }
      case 'unread_update': {
        setUnreadChatCount(data.unread_count);
        break;
      }
      case 'incoming_call': {
        setIncomingCall({
          chatId: data.chat_id,
          callerId: data.caller_id,
          callerName: data.caller_name,
          callType: data.call_type,
        });
        break;
      }
    }
  }, []);

  const clearIncomingCall = useCallback(() => {
    setIncomingCall(null);
  }, []);

  const enabled = rehydrated && isSignedIn && !!authUser;
  const { send, isConnected } = useWebSocket('/ws/notifications/', {
    onMessage: handleMessage,
    onError: useCallback(() => {
      console.warn('Notification WebSocket error - will auto-reconnect');
    }, []),
    enabled,
  });

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
      clearIncomingCall,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
