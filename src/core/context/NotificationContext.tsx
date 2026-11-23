import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { v4 as newSessionId } from 'uuid';
import useWebSocket, { type WebSocketMessage } from 'core/hooks/useWebSocket';
import { getAuthToken } from 'core/utils/getAuthToken';
import { chatRequest, refreshAccess, tokenUser } from 'core/api/chatSession';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { playMessageSound } from 'core/utils/messageSound';
import { enablePushNotifications } from 'core/utils/webPush';

type SocketData = Record<string, unknown>;

interface PresenceEntry {
  online?: boolean;
  lastSeenAt?: string;
}

type PresenceMap = Record<string, PresenceEntry>;

interface ChatNotification {
  id: number | string;
  type: string;
  chat_id?: unknown;
  chat_user_id?: unknown;
  preview?: unknown;
  timestamp: string;
}

interface IncomingCall {
  chatId?: unknown;
  id?: unknown;
  callerId?: unknown;
  callerName?: unknown;
  callType?: unknown;
  expiresAt?: unknown;
}

type MessageListener = (message: Record<string, unknown>) => void;
type CallListener = (event: Record<string, unknown>) => void;

interface NotificationContextValue {
  unreadChatCount: number;
  notifications: ChatNotification[];
  chatUpdateTick: number;
  isConnected: boolean;
  isOnline: boolean;
  selfPresence: { online: boolean; lastSeenAt: string | null };
  presence: PresenceMap;
  requestPresence: () => void;
  subscribeToMessages: (chatId: string | number, listener: MessageListener) => () => void;
  subscribeToCalls: (listener: CallListener) => () => void;
  receiveIncomingCall: (event: Record<string, unknown>) => void;
  clearNotifications: () => void;
  setUnreadChatCount: React.Dispatch<React.SetStateAction<number>>;
  incomingCall: IncomingCall | null;
  closedCall: { id: unknown; chatId: unknown } | null;
  clearIncomingCall: (call: IncomingCall | null) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const useNotifications = (): NotificationContextValue => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const rehydrated = useSelector((state: { _persist?: { rehydrated?: boolean } }) => state._persist?.rehydrated);
  const storeToken = useSelector((state: { users?: { access_token?: string } }) => state.users?.access_token);
  const accessToken = storeToken || getAuthToken();
  const account = tokenUser(accessToken);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);
  const [chatUpdateTick, setChatUpdateTick] = useState(0);
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [closedCall, setClosedCall] = useState<{ id: unknown; chatId: unknown } | null>(null);
  const [authenticatedAccount, setAuthenticatedAccount] = useState<number | null>(null);
  const [presence, setPresence] = useState<PresenceMap>({});
  const [httpPresence, setHTTPPresence] = useState(false);
  const [selfLastSeenAt, setSelfLastSeenAt] = useState<string | null>(null);
  const messageListeners = useRef(new Map<string, Set<MessageListener>>());
  const callListeners = useRef(new Set<CallListener>());
  const lastClosedCall = useRef<{ id: unknown } | null>(null);

  useEffect(() => {
    setIncomingCall(null);
    setClosedCall(null);
    setUnreadChatCount(0);
    setNotifications([]);
    setPresence({});
    setHTTPPresence(false);
    setSelfLastSeenAt(null);
    lastClosedCall.current = null;
  }, [account]);

  const subscribeToMessages = useCallback((chatId: string | number, listener: MessageListener) => {
    const listeners = messageListeners.current;
    const key = String(chatId);
    const subscribers = listeners.get(key) || new Set<MessageListener>();
    subscribers.add(listener);
    listeners.set(key, subscribers);
    return () => {
      subscribers.delete(listener);
      if (subscribers.size === 0) listeners.delete(key);
    };
  }, []);

  const subscribeToCalls = useCallback((listener: CallListener) => {
    const listeners = callListeners.current;
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  const receiveIncomingCall = useCallback((event: Record<string, unknown>) => {
    if (event?.call_id == null || lastClosedCall.current?.id === event.call_id) return;
    setIncomingCall({
      chatId: event.chat_id, id: event.call_id, callerId: event.caller_id,
      callerName: event.caller_name, callType: event.call_type, expiresAt: event.expires_at,
    });
  }, []);

  const applyPresence = useCallback((users: Record<string, boolean> = {}, timestamps: Record<string, string> = {}) => {
    setPresence(previous => {
      const next = { ...previous };
      for (const [id, online] of Object.entries(users || {})) {
        const at = timestamps[id];
        const old = previous[id];
        if (at && old?.lastSeenAt && Date.parse(at) < Date.parse(old.lastSeenAt)) continue;
        next[id] = { online, lastSeenAt: at || old?.lastSeenAt };
      }
      return next;
    });
  }, []);

  const handleMessage = useCallback((data: WebSocketMessage) => {
    if (!data || typeof data !== 'object') return;
    const msg = data as SocketData;
    if (!msg?.type) return;
    if (msg?.message && (msg.type === 'new_message' || msg.type === 'chat_updated')) {
      messageListeners.current.get(String(msg.chat_id))?.forEach(listener => listener(msg.message as Record<string, unknown>));
    }
    switch (msg.type) {
      case 'new_message': {
        const { chat_id, chat_user_id, message_id, preview, unread_count } = msg;
        setUnreadChatCount(unread_count as number);
        setNotifications(prev => [{
          id: (message_id as number | string) ?? Date.now(),
          type: 'new_message',
          chat_id,
          chat_user_id,
          preview,
          timestamp: new Date().toISOString(),
        }, ...prev.slice(0, 19)]);
        setChatUpdateTick(t => t + 1);
        if (String(chat_user_id) !== String(tokenUser(getAuthToken()))) {
          const listeners = messageListeners.current.get(String(chat_id));
          if (!listeners || listeners.size === 0 || document.hidden) {
            playMessageSound();
          }
        }
        break;
      }
      case 'unread_update': {
        setUnreadChatCount(msg.unread_count as number);
        if (msg.chat_id != null) setChatUpdateTick(t => t + 1);
        break;
      }
      case 'auth_ok': {
        setAuthenticatedAccount(tokenUser(getAuthToken()));
        setSelfLastSeenAt(new Date().toISOString());
        setChatUpdateTick(t => t + 1);
        break;
      }
      case 'chat_updated': {
        setChatUpdateTick(t => t + 1);
        break;
      }
      case 'presence_snapshot': {
        applyPresence(msg.users as Record<string, boolean>, msg.last_seen_at as Record<string, string>);
        break;
      }
      case 'presence_update': {
        applyPresence({ [String(msg.user_id)]: msg.online as boolean }, { [String(msg.user_id)]: msg.last_seen_at as string });
        break;
      }
      case 'incoming_call': {
        receiveIncomingCall(msg);
        break;
      }
      case 'call_closed': {
        const closed = { id: msg.call_id, chatId: msg.chat_id };
        lastClosedCall.current = closed;
        setClosedCall(closed);
        break;
      }
      case 'call_accepted':
      case 'voip_webrtc_signal': {
        callListeners.current.forEach(listener => listener(msg));
        break;
      }
      case 'error': {
        if (msg.message === 'Invalid token') refreshAccess(getAuthToken()).catch(() => {});
        break;
      }
    }
  }, [applyPresence, receiveIncomingCall]);

  const clearIncomingCall = useCallback((call: IncomingCall | null) => {
    setIncomingCall(current => current === call ? null : current);
  }, []);

  const enabled = rehydrated && !!accessToken;
  const resetAuthentication = useCallback(() => setAuthenticatedAccount(null), []);
  const handleClose = useCallback(() => {
    if (authenticatedAccount) setSelfLastSeenAt(new Date().toISOString());
    resetAuthentication();
  }, [authenticatedAccount, resetAuthentication]);
  const { send, isConnected } = useWebSocket('/ws/notifications/', {
    onOpen: resetAuthentication,
    onClose: handleClose,
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

  // Ask once per browser for Web Push (direct messages arrive even with the
  // tab closed). The backend serves subscribers from /push/subscribe/.
  useEffect(() => {
    if (!enabled || !account) return;
    try {
      if (window.localStorage.getItem('push-prompted')) return;
      window.localStorage.setItem('push-prompted', '1');
    } catch (_) {
      return;
    }
    enablePushNotifications().catch(() => {});
  }, [enabled, account]);

  const isOnline = Boolean(isConnected && account && authenticatedAccount === account);
  const requestPresence = useCallback(() => {
    if (!account) return;
    chatRequest('/chats/presence/').then(({ data }) => {
      if (tokenUser(getAuthToken()) === account) applyPresence((data as { users?: Record<string, boolean> }).users, (data as { last_seen_at?: Record<string, string> }).last_seen_at);
    }).catch(() => {});
  }, [account, applyPresence]);

  useEffect(() => {
    if (!enabled || !account || isOnline) return;
    const sessionId = newSessionId();
    let stopped = false;
    let inFlight = false;
    let registered = false;
    let expiryTimer: ReturnType<typeof setTimeout> | undefined;

    const release = () => {
      if (registered && tokenUser(getAuthToken()) === account) {
        chatRequest('/chats/presence/', { method: 'delete', params: { session_id: sessionId } }).catch(() => {});
      }
    };
    const releaseOnPageHide = (event: PageTransitionEvent) => {
      const access = getAuthToken();
      if (event.persisted || !registered || tokenUser(access) !== account) return;
      const url = new URL(`${LITLOOP_API_URL}/chats/presence/`);
      url.searchParams.set('session_id', sessionId);
      fetch(url, { method: 'DELETE', keepalive: true, headers: { Authorization: `Bearer ${access}` } }).catch(() => {});
    };
    const heartbeat = async () => {
      if (stopped || inFlight || document.visibilityState !== 'visible') return;
      inFlight = true;
      try {
        const { data } = await chatRequest('/chats/presence/', {
          method: 'post', data: { session_id: sessionId },
        });
        registered = true;
        if (stopped || tokenUser(getAuthToken()) !== account) return;
        const body = data as { users?: Record<string, boolean>; last_seen_at?: Record<string, string> };
        applyPresence(body.users, body.last_seen_at);
        setHTTPPresence(true);
        setSelfLastSeenAt(new Date().toISOString());
        clearTimeout(expiryTimer);
        expiryTimer = setTimeout(() => setHTTPPresence(false), 35000);
      } catch {
        // The next heartbeat retries when HTTPS is reachable again.
      } finally {
        inFlight = false;
        if (stopped) release();
      }
    };
    const firstHeartbeat = setTimeout(heartbeat, 2500);
    const interval = setInterval(heartbeat, 10000);
    document.addEventListener('visibilitychange', heartbeat);
    window.addEventListener('pagehide', releaseOnPageHide);
    return () => {
      stopped = true;
      setHTTPPresence(false);
      clearTimeout(firstHeartbeat);
      clearTimeout(expiryTimer);
      clearInterval(interval);
      document.removeEventListener('visibilitychange', heartbeat);
      window.removeEventListener('pagehide', releaseOnPageHide);
      if (!inFlight) release();
    };
  }, [account, applyPresence, enabled, isOnline]);

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
      selfPresence: { online: isOnline || httpPresence, lastSeenAt: selfLastSeenAt },
      presence,
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
