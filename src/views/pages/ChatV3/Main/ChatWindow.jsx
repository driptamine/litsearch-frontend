import React, { useState, useEffect, useRef, useCallback } from 'react';
import { styled } from '@linaria/react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaTrash, FaPhone, FaVideo, FaPhoneSlash } from 'react-icons/fa';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader, getAxiosReq, postAxiosReq } from 'core/api/rest-helper';
import ChatInput from 'views/pages/ChatV3/Main/ChatInput';
import { SkeletonLine } from 'views/styles/Skeleton';
import useSelectAuthUser from 'core/hooks/useSelectAuthUser';
import useChatSocket from 'core/hooks/useChatSocket';
import useVoip from 'core/hooks/useVoip';
import { useNotifications } from 'core/context/NotificationContext';
import MyMessage from 'views/pages/ChatV3/Main/MyMessage';
import TheirMessage from 'views/pages/ChatV3/Main/TheirMessage';
import CallOverlay from 'views/pages/ChatV3/Main/CallOverlay';
import IncomingCallOverlay from 'views/pages/ChatV3/Main/IncomingCallOverlay';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23333' rx='8'/%3E%3Ccircle cx='24' cy='18' r='8' fill='%23999'/%3E%3Cpath d='M8 44c0-8.84 7.16-16 16-16s16 7.16 16 16' fill='%23999'/%3E%3C/svg%3E";

const ChatWindow = () => {
  const { authUser } = useSelectAuthUser();
  const { userId } = useParams();
  const history = useHistory();
  const { setUnreadChatCount, notifications, incomingCall, clearIncomingCall } = useNotifications();

  const [messages, setMessages] = useState([]);
  const [chatInfo, setChatInfo] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [callState, setCallState] = useState('idle');
  const [callType, setCallType] = useState(null);
  const [demoDelay, setDemoDelay] = useState(false);
  const messagesEndRef = useRef(null);
  const voiceCacheRef = useRef(null);

  const getVoiceCache = () => {
    if (voiceCacheRef.current) return voiceCacheRef.current;
    try {
      const raw = sessionStorage.getItem('voice_cache');
      voiceCacheRef.current = raw ? JSON.parse(raw) : {};
    } catch (_) {
      voiceCacheRef.current = {};
    }
    return voiceCacheRef.current;
  };

  const persistVoiceCache = () => {
    try {
      sessionStorage.setItem('voice_cache', JSON.stringify(voiceCacheRef.current || {}));
    } catch (_) {}
  };

  const saveVoiceToCache = (id, data) => {
    const cache = getVoiceCache();
    cache[id] = data;
    persistVoiceCache();
  };

  const normalizeMessages = (msgs) => {
    const cache = getVoiceCache();
    return (msgs || []).map(msg => {
      if (msg.voice_message_id && !msg.voice_message) {
        const cached = cache[msg.voice_message_id];
        if (cached) msg = { ...msg, voice_message: cached };
      }
      return msg;
    });
  };

  const callTypeRef = useRef(null);
  const sendVoipWebRtcSignalRef = useRef(null);
  const audioContextRef = useRef(null);

  const delay = useCallback(async () => {
    if (demoDelay) await new Promise(r => setTimeout(r, 2000));
  }, [demoDelay]);

  const {
    localStream,
    remoteStream,
    mediaError: voipMediaError,
    connecting: voipConnecting,
    connected: voipConnected,
    createOffer,
    handleRemoteSignal,
    startCall: voipStartCall,
    acceptCall: voipAcceptCall,
    endCall: voipEndCall,
  } = useVoip({
    onSignal: (signalData) => {
      sendVoipWebRtcSignalRef.current?.(signalData);
    },
    callType: callTypeRef.current,
  });

  useEffect(() => {
    callTypeRef.current = callType;
  }, [callType]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewMessage = useCallback((message) => {
    setMessages((prev) => {
      if (prev.some(m => m.tempId === message.tempId || m.id === message.id)) return prev;
      const msg = { ...message, sentByMe: false };
      return [...prev, msg];
    });
    scrollToBottom();
  }, []);

  const handleTyping = useCallback((userId, isTyping) => {
    setPartnerTyping(isTyping);
  }, []);

  const handleReadReceipt = useCallback((readBy, messageIds) => {
    setMessages((prev) => prev.map(msg =>
      messageIds.includes(msg.id) ? { ...msg, is_read: true } : msg
    ));
  }, []);

  const handleVoipCallAccept = useCallback(async () => {
    if (!callTypeRef.current) {
      console.log('[ChatWindow] handleVoipCallAccept: no callType');
      return;
    }
    console.log('[ChatWindow] handleVoipCallAccept: creating offer...');
    await delay();
    const offer = await createOffer();
    if (offer) {
      console.log('[ChatWindow] handleVoipCallAccept: sending offer');
      await delay();
      sendVoipWebRtcSignalRef.current?.({ type: 'offer', sdp: offer.sdp });
      setCallState('connecting');
    } else {
      console.log('[ChatWindow] handleVoipCallAccept: createOffer returned null');
    }
  }, [createOffer, delay]);

  const handleVoipCallReject = useCallback(() => {
    console.log('[ChatWindow] call rejected');
    setCallState('idle');
    setCallType(null);
  }, []);

  const handleVoipCallEnd = useCallback(() => {
    console.log('[ChatWindow] call ended by remote');
    voipEndCall();
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setCallState('idle');
    setCallType(null);
  }, [voipEndCall]);

  const handleVoipWebRtcSignal = useCallback(async (signalData) => {
    const isOffer = signalData.type === 'offer' && signalData.sdp;
    console.log('[ChatWindow] handleVoipWebRtcSignal', signalData.type, isOffer ? '(offer)' : '');
    await delay();
    await handleRemoteSignal(signalData);
    if (isOffer) {
      await delay();
      setCallState('connecting');
    }
  }, [handleRemoteSignal, delay]);

  const {
    sendMessage: wsSendMessage,
    sendTyping,
    sendReadReceipt,
    sendVoipCallStart,
    sendVoipCallEnd,
    sendVoipWebRtcSignal,
    sendVoipCallAccept,
    sendVoipCallReject,
    isConnected,
  } = useChatSocket(activeChatId, {
    onNewMessage: handleNewMessage,
    onTyping: handleTyping,
    onReadReceipt: handleReadReceipt,
    onVoipCallStart: null,
    onVoipCallEnd: handleVoipCallEnd,
    onVoipCallAccept: handleVoipCallAccept,
    onVoipCallReject: handleVoipCallReject,
    onVoipWebRtcSignal: handleVoipWebRtcSignal,
    enabled: !!activeChatId,
  });

  sendVoipWebRtcSignalRef.current = sendVoipWebRtcSignal;

  useEffect(() => {
    if (!userId) {
      setChatInfo(null);
      setMessages([]);
      setActiveChatId(null);
      setPartnerTyping(false);
      return;
    }

    const fetchChatDetail = async () => {
      setLoading(true);
      try {
        const url = `${LITLOOP_API_URL}/chats/u/${userId}/`;
        const response = await getAxiosReq(url);
        const data = response.data;

        const participantInfo = data.target_user || data.other_participant || data.other_user || {};

        let mergedInfo = {
          name: data.name,
          ...participantInfo
        };

        if (!mergedInfo.avatar && !mergedInfo.profileImg && !mergedInfo.avatar_url) {
          try {
            const userRes = await getAxiosReq(`${LITLOOP_API_URL}/users/${userId}/`);
            mergedInfo = { ...mergedInfo, ...userRes.data };
          } catch (_) {}
        }

        setChatInfo(mergedInfo);
        setMessages(normalizeMessages(data.messages));
        setActiveChatId(data.id);

        if (data.id) {
          try {
            await postAxiosReq(`${LITLOOP_API_URL}/chats/${data.id}/read/`, {});
            setUnreadChatCount(0);
          } catch (_) {}
        }
      } catch (err) {
        console.error("Failed to fetch chat details:", err);
        try {
          const userRes = await getAxiosReq(`${LITLOOP_API_URL}/users/${userId}/`);
          setChatInfo(userRes.data);
        } catch (userErr) {
          console.error("Failed to fetch user fallback:", userErr);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchChatDetail();
  }, [userId]);

  useEffect(() => {
    if (!notifications?.length || !userId) return;
    const latest = notifications[0];
    if (latest.type === 'new_message' && String(latest.chat_user_id) === String(userId)) {
      const refetch = async () => {
        try {
          const url = `${LITLOOP_API_URL}/chats/u/${userId}/`;
          const response = await getAxiosReq(url);
          const data = response.data;
          if (data.id === activeChatId) {
            setMessages(normalizeMessages(data.messages));
          }
        } catch (_) {}
      };
      refetch();
    }
  }, [notifications, userId, activeChatId]);

  useEffect(() => {
    if (incomingCall && activeChatId && activeChatId === incomingCall.chatId) {
      setCallState('ringing');
    }
  }, [incomingCall, activeChatId]);

  useEffect(() => {
    if (voipConnected) setCallState('connected');
  }, [voipConnected]);

  const handleSendMessage = async (text, attachments = [], voiceMessageData = null) => {
    if (!userId) return;

    const messageText = (text || '').trim();
    const voiceMessageId = voiceMessageData?.id;
    if (!messageText && !attachments.length && !voiceMessageId) return;

    if (voiceMessageData) saveVoiceToCache(voiceMessageData.id, voiceMessageData);

    const currentUserName = authUser?.username || authUser?.user?.username || 'You';
    const tempId = Date.now();
    const tempMessage = {
      username: currentUserName,
      text: messageText,
      attachments,
      voice_message_id: voiceMessageId,
      voice_message: voiceMessageData || undefined,
      isTemp: true,
      tempId: tempId,
      sentByMe: true,
      is_read: false,
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const url = activeChatId
        ? `${LITLOOP_API_URL}/chats/${activeChatId}/send/`
        : `${LITLOOP_API_URL}/chats/u/${userId}/send/`;

      const body = { text: messageText, attachments };
      if (voiceMessageId != null) body.voice_message_id = voiceMessageId;
      const response = await postAxiosReq(url, body);

      const newData = response.data;
      if (newData.voice_message) saveVoiceToCache(newData.voice_message.id, newData.voice_message);
      setMessages((prev) => prev.map(msg =>
        (msg.tempId === tempId) ? { ...msg, ...newData, isTemp: false, sentByMe: true } : msg
      ));

      if (!activeChatId && response.data.chat_id) {
        setActiveChatId(response.data.chat_id);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => prev.filter(msg => msg.tempId !== tempId));
    }
  };

  const handleDeleteChat = async () => {
    if (!activeChatId) return;
    if (!window.confirm('Delete this conversation?')) return;
    try {
      await axios.delete(`${LITLOOP_API_URL}/chats/${activeChatId}/delete/`, { headers: authHeader() });
      setUnreadChatCount(prev => Math.max(0, prev - 1));
      history.push('/chat/im');
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  };

  const handleInputChange = (isTyping) => {
    sendTyping(isTyping);
  };

  const handleVoipCall = async (type) => {
    console.log('[ChatWindow] starting call:', type);
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    await ctx.resume();
    console.log('[ChatWindow] AudioContext created, state:', ctx.state);
    audioContextRef.current = ctx;
    await delay();
    sendVoipCallStart(type);
    setCallType(type);
    setCallState('calling');
    await delay();
    await voipStartCall();
  };

  const handleEndCall = () => {
    console.log('[ChatWindow] ending call');
    sendVoipCallEnd();
    voipEndCall();
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setCallState('idle');
    setCallType(null);
  };

  const handleAcceptCall = async () => {
    const type = incomingCall?.callType || 'video';
    console.log('[ChatWindow] accepting call:', type);
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    await ctx.resume();
    console.log('[ChatWindow] AudioContext created, state:', ctx.state);
    audioContextRef.current = ctx;
    setCallType(type);
    await delay();
    await voipAcceptCall();
    await delay();
    sendVoipCallAccept();
    clearIncomingCall();
  };

  const handleDeclineCall = () => {
    console.log('[ChatWindow] declining call');
    sendVoipCallReject();
    clearIncomingCall();
  };

  const targetAvatar = (() => {
    const raw = chatInfo?.avatar || chatInfo?.profileImg || chatInfo?.avatar_url || chatInfo?.profile_image_url || chatInfo?.picture;
    if (!raw) return DEFAULT_AVATAR;
    if (raw.startsWith('http')) return raw;
    return `${LITLOOP_API_URL}${raw.startsWith('/') ? '' : '/'}${raw}`;
  })();

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (isToday) return time;
    const date = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    return `${date} ${time}`;
  };

  const inCall = callState !== 'idle';

  if (loading) {
    return (
      <ChatWindowContainer>
        <Header>
          <SkeletonLine width="48px" height="48px" style={{ borderRadius: '50%', marginRight: '15px' }} />
          <UserInfo>
            <SkeletonLine width="150px" height="24px" mb="5px" />
            <SkeletonLine width="100px" height="16px" />
          </UserInfo>
        </Header>
        <MessagesContainer>
          <SkeletonLine width="60%" height="40px" mb="10px" style={{ alignSelf: 'flex-start' }} />
          <SkeletonLine width="40%" height="40px" mb="10px" style={{ alignSelf: 'flex-end' }} />
          <SkeletonLine width="50%" height="40px" mb="10px" style={{ alignSelf: 'flex-start' }} />
        </MessagesContainer>
      </ChatWindowContainer>
    );
  }

  const showIncomingOverlay = incomingCall && activeChatId && incomingCall.chatId === activeChatId && callState === 'ringing';

  return (
    <ChatWindowContainer>
      {userId ? (
        <>
          <Header>
            <BackButton onClick={() => history.push('/chat/im')}>
              <FaArrowLeft />
            </BackButton>
            <Avatar
              src={targetAvatar}
              alt={chatInfo?.name || 'Chat'}
              onError={(e) => {
                if (e.target.src !== DEFAULT_AVATAR) e.target.src = DEFAULT_AVATAR;
              }}
            />
            <UserInfo onClick={() => history.push(`/chat/${userId}/attachments`)}>
              <Username>
                {chatInfo?.name ||
                 (chatInfo?.first_name ? `${chatInfo.first_name} ${chatInfo.last_name || ''}`.trim() : null) ||
                 chatInfo?.username ||
                 (loading ? 'Loading...' : 'New Message')}
              </Username>
              <StatusRow>
                {chatInfo?.username && chatInfo?.name && <UserHandle>@{chatInfo.username}</UserHandle>}
                <ConnectionDot connected={isConnected} />
              </StatusRow>
            </UserInfo>
            <RightActions>
              {!showIncomingOverlay && (inCall ? (
                <EndCallButton onClick={handleEndCall} title="End call">
                  <FaPhoneSlash />
                </EndCallButton>
              ) : (
                <>
                  <CallButton onClick={() => handleVoipCall('audio')} title="Voice call">
                    <FaPhone />
                  </CallButton>
                  <CallButton onClick={() => handleVoipCall('video')} title="Video call">
                    <FaVideo />
                  </CallButton>
                </>
              ))}
              <DemoButton
                active={demoDelay}
                onClick={() => setDemoDelay(d => !d)}
                title={demoDelay ? 'Delay ON (2s)' : 'Delay OFF'}
              >
                {demoDelay ? '2s' : '1x'}
              </DemoButton>
              {activeChatId && !showIncomingOverlay && (
                <DeleteButton onClick={handleDeleteChat} title="Delete chat">
                  <FaTrash />
                </DeleteButton>
              )}
            </RightActions>
          </Header>
          <MessagesContainer>
            {messages?.map((message, index) => {
              const currentUserName = authUser?.username || authUser?.user?.username || authUser?.user__username || '';
              const isMe = message.isTemp ||
                           message.sentByMe ||
                           (currentUserName && (message.username || message.sender_name)?.toLowerCase() === currentUserName.toLowerCase());

              return isMe ? (
                <MyMessage key={message.id || message.tempId || index} message={message} authUser={authUser} formatTime={formatTime} />
              ) : (
                <TheirMessage key={message.id || message.tempId || index} message={message} formatTime={formatTime} />
              );
            })}
            {partnerTyping && (
              <TypingIndicator>
                <TypingDots>
                  <span>.</span><span>.</span><span>.</span>
                </TypingDots>
                <TypingLabel>typing</TypingLabel>
              </TypingIndicator>
            )}
            <div ref={messagesEndRef} />
          </MessagesContainer>
          <ChatInput onSendMessage={handleSendMessage} onTyping={handleInputChange} />
          <CallOverlay
            callState={callState}
            callType={callType}
            callerName={chatInfo?.name || chatInfo?.username}
            callerAvatar={targetAvatar}
            localStream={localStream}
            remoteStream={remoteStream}
            mediaError={voipMediaError}
            onEndCall={handleEndCall}
            audioContextRef={audioContextRef}
          />
          {showIncomingOverlay && (
            <IncomingCallOverlay
              callType={incomingCall.callType}
              callerName={incomingCall.callerName || chatInfo?.name || chatInfo?.username}
              callerAvatar={targetAvatar}
              onAccept={handleAcceptCall}
              onDecline={handleDeclineCall}
            />
          )}
        </>
      ) : (
        <CenteredContent>
          <h2>Select a chat to start messaging</h2>
        </CenteredContent>
      )}
    </ChatWindowContainer>
  );
};

const CenteredContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #888;
`;

const BackButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  margin-right: 15px;
  padding: 5px;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: 768px) {
    display: flex;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
`;

import themeVars from 'views/styles/theme-vars';

const Header = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #333;
  margin-bottom: 16px;
`;

const Avatar = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
  border: 1px solid #444;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ConnectionDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ connected }) => (connected ? '#4caf50' : '#888')};
  display: inline-block;
`;

const Username = styled.h2`
  margin: 0;
  color: ${themeVars.text};
  font-size: 1.1rem;
`;

const UserHandle = styled.span`
  color: #888;
  font-size: 0.85rem;
`;

const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
`;

const DemoButton = styled.button`
  background: none;
  border: 1px solid ${({ active }) => (active ? '#009688' : '#444')};
  color: ${({ active }) => (active ? '#009688' : '#666')};
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-family: monospace;
  transition: all 0.2s;

  &:hover {
    border-color: #009688;
    color: #009688;
  }
`;

const CallButton = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: #009688;
    background-color: rgba(0, 150, 136, 0.1);
  }
`;

const EndCallButton = styled.button`
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(255, 68, 68, 0.1);
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: #ff4444;
    background-color: rgba(255, 68, 68, 0.1);
  }
`;

const ChatWindowContainer = styled.div`
  width: 70%;
  background-color: ${themeVars.navBg};
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex: 1;
  height: calc(100vh - 5em);

  @media screen and (max-width: 768px) {
    width: 100%;
    padding: 10px;
    height: calc(100vh - 60px);
  }
`;

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #333;
    border-radius: 10px;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  margin: 4px 0;
  align-self: flex-start;
`;

const TypingDots = styled.div`
  display: flex;
  gap: 2px;
  font-size: 1.5rem;
  color: #888;
  letter-spacing: 2px;

  span {
    animation: blink 1.4s infinite both;
  }
  span:nth-child(2) {
    animation-delay: 0.2s;
  }
  span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes blink {
    0% { opacity: 0.2; }
    20% { opacity: 1; }
    100% { opacity: 0.2; }
  }
`;

const TypingLabel = styled.span`
  font-size: 0.8rem;
  color: #888;
  margin-left: 8px;
  font-style: italic;
`;

export default ChatWindow;
