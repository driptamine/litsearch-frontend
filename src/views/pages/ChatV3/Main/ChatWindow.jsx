import React, { useState, useEffect, useRef, useCallback } from 'react';
import { styled } from '@linaria/react';
import { Link, useParams, useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft, FaBookmark, FaTrash, FaPhone, FaVideo, FaPaperclip, FaEllipsisV } from 'react-icons/fa';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { fetchLogout } from 'core/actions';
import { getAxiosReq } from 'core/api/rest-helper';
import { chatRequest, tokenUser } from 'core/api/chatSession';
import { useCalls } from 'core/context/CallContext';
import getAuthToken from 'core/utils/getAuthToken';
import ChatInput from 'views/pages/ChatV3/Main/ChatInput';
import { SkeletonLine } from 'views/styles/Skeleton';
import useSelectAuthUser from 'core/hooks/useSelectAuthUser';
import useChatSocket from 'core/hooks/useChatSocket';
import { useNotifications } from 'core/context/NotificationContext';
import MyMessage from 'views/pages/ChatV3/Main/MyMessage';
import TheirMessage from 'views/pages/ChatV3/Main/TheirMessage';
import PresenceStatus from 'views/pages/ChatV3/PresenceStatus';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23333' rx='8'/%3E%3Ccircle cx='24' cy='18' r='8' fill='%23999'/%3E%3Cpath d='M8 44c0-8.84 7.16-16 16-16s16 7.16 16 16' fill='%23999'/%3E%3C/svg%3E";
const GROUP_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%232e7d32' rx='8'/%3E%3Ccircle cx='24' cy='16' r='7' fill='%23a5d6a7'/%3E%3Ccircle cx='14' cy='34' r='5' fill='%23a5d6a7'/%3E%3Ccircle cx='34' cy='34' r='5' fill='%23a5d6a7'/%3E%3C/svg%3E";

const ChatWindow = () => {
  const { authUser, isSignedIn } = useSelectAuthUser();
  const dispatch = useDispatch();
  const sessionRestored = useSelector(state => state._persist?.rehydrated === true);
  const { userId, chatId: groupChatId } = useParams();
  const isGroupMatch = useRouteMatch('/chat/group/:chatId');
  const isGroup = !!isGroupMatch;
  const isSavedMatch = useRouteMatch('/chat/saved');
  const isSaved = !!isSavedMatch;
  const chatTarget = isGroup ? groupChatId : userId;
  const chatDetailPath = isSaved ? '/chats/saved/' : /^[1-9]\d*$/.test(chatTarget || '')
    ? `/chats/${isGroup ? 'group' : 'direct'}/${chatTarget}/`
    : null;
  const history = useHistory();
  const { setUnreadChatCount, isOnline, presence, requestPresence, subscribeToMessages } = useNotifications();
  const { startCall, joinGroupVoice, busy: callBusy } = useCalls();

  const [messages, setMessages] = useState([]);
  const [chatInfo, setChatInfo] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [voiceRoom, setVoiceRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [retry, setRetry] = useState(0);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [demoDelay, setDemoDelay] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberResults, setMemberResults] = useState([]);
  const [addingMember, setAddingMember] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const messagesEndRef = useRef(null);
  const voiceCacheRef = useRef(null);
  const nextTempId = useRef(0);
  const historyRef = useRef(null);
  const typingTimeout = useRef(null);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewMessage = useCallback((message) => {
    const current = historyRef.current;
    if (!current || current.id !== activeChatId || message?.id == null ||
        (message.chat_id != null && message.chat_id !== activeChatId) || current.seen.has(message.id)) return;
    current.seen.add(message.id);
    const username = authUser?.username || authUser?.user?.username || authUser?.user__username;
    const sentByMe = message.user_id != null
      ? String(message.user_id) === String(tokenUser(getAuthToken()))
      : message.username === username;
    setMessages(previous => {
      const next = { ...message, sentByMe };
      const index = previous.findIndex(item => item.isTemp || item.id > message.id);
      return index === -1
        ? [...previous, next]
        : [...previous.slice(0, index), next, ...previous.slice(index)];
    });
    if (!isSaved && !sentByMe) {
      chatRequest(`/chats/${activeChatId}/read/`, { method: 'post', data: {} }).catch(() => {});
    }
  }, [activeChatId, authUser, isSaved]);

  const handleTyping = useCallback((userId, isTyping) => {
    if (String(userId) === String(tokenUser(getAuthToken()))) return;
    clearTimeout(typingTimeout.current);
    setPartnerTyping(isTyping);
    if (isTyping) typingTimeout.current = setTimeout(() => setPartnerTyping(false), 4000);
  }, []);

  const handleReadReceipt = useCallback((readBy, messageIds) => {
    setMessages((prev) => prev.map(msg =>
      messageIds.includes(msg.id) ? { ...msg, is_read: true } : msg
    ));
  }, []);

  const { sendTyping, isConnected } = useChatSocket(activeChatId, {
    onNewMessage: handleNewMessage,
    onTyping: handleTyping,
    onReadReceipt: handleReadReceipt,
  });

  useEffect(() => {
    if (activeChatId) requestPresence();
  }, [activeChatId, requestPresence]);

  useEffect(() => {
    if (activeChatId) return subscribeToMessages(activeChatId, handleNewMessage);
  }, [activeChatId, handleNewMessage, subscribeToMessages]);

  useEffect(() => () => clearTimeout(typingTimeout.current), [activeChatId]);

  useEffect(() => {
    setVoiceRoom(null);
    if (!isGroup || !activeChatId) return;
    const controller = new AbortController();
    let timer;
    const refreshRoom = async () => {
      try {
        const { data } = await chatRequest(`/chats/${activeChatId}/voice/`, { signal: controller.signal });
        if (!controller.signal.aborted) setVoiceRoom(data.room);
      } catch {
        // Starting or joining the room also fetches the latest state.
      }
      if (!controller.signal.aborted) timer = setTimeout(refreshRoom, 5000);
    };
    refreshRoom();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [activeChatId, isGroup]);

  useEffect(() => {
    historyRef.current = null;
    setChatInfo(null);
    setMessages([]);
    setActiveChatId(null);
    setPartnerTyping(false);
    setLoadError(null);
    if (!chatDetailPath || !isSignedIn || !sessionRestored) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const fetchChatDetail = async () => {
      setLoading(true);
      try {
        const response = await chatRequest(chatDetailPath, { signal: controller.signal });
        if (controller.signal.aborted) return;
        const data = response.data;

        setChatInfo(data);
        const messages = normalizeMessages(data.messages);
        historyRef.current = {
          id: data.id,
          cursor: messages.at(-1)?.id || 0,
          seen: new Set(messages.map(message => message.id)),
        };
        setMessages(messages);
        setActiveChatId(data.id);

        if (data.id && !isSaved) {
          chatRequest(`/chats/${data.id}/read/`, { method: 'post', data: {} }).catch(() => {});
        }
      } catch (err) {
        if (!controller.signal.aborted) setLoadError(err.response?.status || 0);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchChatDetail();
    return () => controller.abort();
  }, [chatDetailPath, isSaved, isSignedIn, sessionRestored, retry]);

  useEffect(() => {
    const history = historyRef.current;
    if (!history || history.id !== activeChatId) return;
    const controller = new AbortController();
    let syncing = false;
    const fetchMissedMessages = async () => {
      let hasMore;
      let shouldMarkRead = false;
      const account = String(tokenUser(getAuthToken()));
      do {
        const { data } = await chatRequest(`/chats/${history.id}/messages/`, {
          params: { after: history.cursor }, signal: controller.signal,
        });
        if (controller.signal.aborted || historyRef.current !== history) return;
        const messages = normalizeMessages(data.messages);
        if (messages.length === 0) break;
        for (const message of messages) history.seen.add(message.id);
        history.cursor = messages.at(-1).id;
        hasMore = data.has_more;
        if (messages.some(message => !message.is_read && String(message.user_id) !== account)) {
          shouldMarkRead = true;
        }
        setMessages(previous => {
          const existing = new Map(previous.filter(message => message.id != null).map(message => [message.id, message]));
          for (const message of messages) {
            const known = existing.get(message.id);
            existing.set(message.id, known ? { ...known, is_read: known.is_read || message.is_read } : message);
          }
          const ordered = [...existing.values()].sort((left, right) => left.id - right.id);
          return [...ordered, ...previous.filter(message => message.isTemp)];
        });
      } while (hasMore && !controller.signal.aborted);
      if (shouldMarkRead && !isSaved && !controller.signal.aborted) {
        await chatRequest(`/chats/${history.id}/read/`, {
          method: 'post', data: {}, signal: controller.signal,
        });
      }
    };
    const syncMessages = async () => {
      if (syncing || document.visibilityState !== 'visible') return;
      syncing = true;
      try {
        await fetchMissedMessages();
      } catch {
        // The next connection event or interval retries with the same cursor.
      } finally {
        syncing = false;
      }
    };
    syncMessages();
    const interval = setInterval(syncMessages, isConnected || isOnline ? 30000 : 4000);
    document.addEventListener('visibilitychange', syncMessages);
    window.addEventListener('online', syncMessages);
    return () => {
      controller.abort();
      clearInterval(interval);
      document.removeEventListener('visibilitychange', syncMessages);
      window.removeEventListener('online', syncMessages);
    };
  }, [activeChatId, chatDetailPath, isConnected, isOnline, isSaved]);

  // User search for adding group members
  const memberTimerRef = useRef(null);
  useEffect(() => {
    if (!memberSearch.trim() || !isGroup) {
      setMemberResults([]);
      return;
    }
    clearTimeout(memberTimerRef.current);
    memberTimerRef.current = setTimeout(async () => {
      try {
        const res = await getAxiosReq(`${LITLOOP_API_URL}/users/search/?q=${encodeURIComponent(memberSearch)}`);
        const results = res.data?.results || [];
        const existingIds = new Set(chatInfo?.participants?.map(p => p.id) || []);
        setMemberResults(results.filter(u => !existingIds.has(u.id)));
      } catch (_) { setMemberResults([]); }
    }, 250);
    return () => clearTimeout(memberTimerRef.current);
  }, [memberSearch, isGroup, chatInfo?.participants]);

  const handleAddMember = async (user) => {
    setAddingMember(true);
    try {
      await chatRequest(`/chats/group/${activeChatId}/add/`, { method: 'post', data: { user_id: user.id } });
      setChatInfo(prev => ({
        ...prev,
        participants: [...(prev?.participants || []), user],
      }));
      setMemberSearch('');
      setMemberResults([]);
      setAddMemberOpen(false);
    } catch (_) {}
    setAddingMember(false);
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMenu]);

  const handleSendMessage = async (text, attachments = [], voiceMessageData = null) => {
    const current = historyRef.current;
    if (!current || current.id !== activeChatId) return;

    const messageText = (text || '').trim();
    const voiceMessageId = voiceMessageData?.id;
    if (!messageText && !attachments.length && !voiceMessageId) return;

    if (voiceMessageData) saveVoiceToCache(voiceMessageData.id, voiceMessageData);

    const currentUserName = authUser?.username || authUser?.user?.username || 'You';
    const tempId = `pending-${++nextTempId.current}`;
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
      const body = { text: messageText, attachments };
      if (voiceMessageId != null) body.voice_message_id = voiceMessageId;
      const response = await chatRequest(`/chats/${activeChatId}/send/`, { method: 'post', data: body });

      if (historyRef.current !== current) return;
      const newData = response.data.message || response.data;
      current.seen.add(newData.id);
      if (newData.voice_message) saveVoiceToCache(newData.voice_message.id, newData.voice_message);
      setMessages(prev => {
        const received = prev.find(m => m.id === newData.id);
        if (received) return prev.filter(m => m.tempId !== tempId);
        return prev.map(m => m.tempId === tempId ? { ...m, ...newData, isTemp: false } : m);
      });
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => prev.filter(msg => msg.tempId !== tempId));
    }
  };

  const handleDeleteChat = async () => {
    if (!activeChatId) return;
    if (!window.confirm('Delete this conversation?')) return;
    try {
      await chatRequest(`/chats/${activeChatId}/delete/`, { method: 'delete' });
      setUnreadChatCount(prev => Math.max(0, prev - 1));
      history.push('/chat/im');
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  };

  const handleInputChange = (isTyping) => {
    if (isSaved) return;
    sendTyping(isTyping);
  };

  const handleAvatarClick = () => {
    if (isSaved || isGroup || !chatInfo?.username) return;
    history.push(`/${chatInfo.username}`);
  };

  const handleUserInfoClick = (e) => {
    if (isSaved) return;
    if (e.target.closest('input, button')) return;
    history.push(isGroup ? `/chat/group/${groupChatId}/attachments` : `/chat/${userId}/attachments`);
  };

  const handleVoipCall = callType => startCall({
    chatId: activeChatId,
    callType,
    callerName: chatInfo?.name || chatInfo?.username,
    callerAvatar: targetAvatar,
    delayMs: demoDelay ? 2000 : 0,
  });

  const targetAvatar = (() => {
    if (isGroup) {
      if (chatInfo?.image_url) {
        return chatInfo.image_url.startsWith('http') ? chatInfo.image_url : `${LITLOOP_API_URL}/${chatInfo.image_url}`;
      }
      return GROUP_AVATAR;
    }
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


  if (!sessionRestored || loading || (isSignedIn && chatDetailPath && !chatInfo && loadError === null)) {
    return (
      <ChatWindowContainer>
        <ChatHeader>
          <SkeletonLine width="48px" height="48px" style={{ borderRadius: '50%', marginRight: '15px' }} />
          <UserInfo>
            <SkeletonLine width="150px" height="24px" mb="5px" />
            <SkeletonLine width="100px" height="16px" />
          </UserInfo>
        </ChatHeader>
        <MessagesContainer>
          <SkeletonLine width="60%" height="40px" mb="10px" style={{ alignSelf: 'flex-start' }} />
          <SkeletonLine width="40%" height="40px" mb="10px" style={{ alignSelf: 'flex-end' }} />
          <SkeletonLine width="50%" height="40px" mb="10px" style={{ alignSelf: 'flex-start' }} />
        </MessagesContainer>
      </ChatWindowContainer>
    );
  }

  if (!chatInfo) {
    const needsLogin = !isSignedIn || loadError === 401;
    const unavailable = !chatDetailPath || loadError === 400 || loadError === 403 || loadError === 404;
    return (
      <ChatWindowContainer>
        <ChatStatus role="status">
          <p>{needsLogin ? 'Log in to open this conversation.' : unavailable
            ? 'This conversation is unavailable.' : 'Could not load this conversation.'}</p>
          {loadError === 401 ? <button type="button" onClick={() => dispatch(fetchLogout())}>Log in again</button>
            : needsLogin ? <Link to="/login">Log in</Link> : unavailable
            ? <Link to="/chat/im">Back to chats</Link>
            : <button type="button" onClick={() => setRetry(count => count + 1)}>Try again</button>}
        </ChatStatus>
      </ChatWindowContainer>
    );
  }


  return (
    <ChatWindowContainer>
      {(isSaved || (isGroup ? groupChatId : userId)) ? (
        <>
          <ChatHeader>
            <BackButton onClick={() => history.push('/chat/im')}>
              <FaArrowLeft />
            </BackButton>
          {isSaved ? (
            <SavedIconWrap>
              <FaBookmark size={22} />
            </SavedIconWrap>
          ) : (
          <Avatar
            src={targetAvatar}
            alt={chatInfo?.name || 'Chat'}
            onClick={handleAvatarClick}
            title={!isGroup && !isSaved && chatInfo?.username ? `View @${chatInfo.username}'s profile` : undefined}
            style={!isGroup && !isSaved && chatInfo?.username ? { cursor: 'pointer' } : undefined}
            onError={(e) => {
              if (e.target.src !== DEFAULT_AVATAR) e.target.src = DEFAULT_AVATAR;
            }}
          />
          )}
          <UserInfo onClick={handleUserInfoClick} title={isSaved ? undefined : 'View attachments'}>
            <Username>
              {isSaved
                ? 'Saved Messages'
                : isGroup
                  ? (chatInfo?.name || 'Group')
                  : (chatInfo?.first_name ? `${chatInfo.first_name} ${chatInfo.last_name || ''}`.trim() : null) ||
                    chatInfo?.username ||
                    (loading ? 'Loading...' : 'New Message')}
            </Username>
            {!isSaved && isGroup && chatInfo?.participants && (
              <MemberAvatars>
                {chatInfo.participants.slice(0, 5).map((p) => (
                  <MemberAvatar key={p.id} src={p.avatar || ''} alt={p.username} title={p.username} />
                ))}
                {chatInfo.participants.length > 5 && <ExtraCount>+{chatInfo.participants.length - 5}</ExtraCount>}
              </MemberAvatars>
            )}
            {!isSaved && (
            <StatusRow>
                {isGroup ? (
                  <GroupMeta>
                    <GroupBadge>Group</GroupBadge>
                    {chatInfo?.participants && (
                      <MemberCount>{chatInfo.participants.length} members</MemberCount>
                    )}
                    <AddMemberBtn onClick={() => setAddMemberOpen(o => !o)} title="Add member">+</AddMemberBtn>
                  </GroupMeta>
                ) : (
                  chatInfo?.username && (
                    <>
                      <UserHandle>@{chatInfo.username}</UserHandle>
                      <PresenceStatus
                        online={presence[chatInfo.other_participant?.id]?.online}
                        lastSeenAt={presence[chatInfo.other_participant?.id]?.lastSeenAt || chatInfo.other_participant?.last_seen_at}
                      />
                    </>
                  )
                )}
            </StatusRow>
            )}
            {!isSaved && isGroup && addMemberOpen && (
                <AddMemberWrap onClick={(e) => e.stopPropagation()}>
                  <MemberSearchInput
                    value={memberSearch}
                    onChange={e => setMemberSearch(e.target.value)}
                    placeholder="Search users..."
                    autoFocus
                  />
                  {memberResults.length > 0 && (
                    <MemberResults>
                      {memberResults.map(u => (
                        <MemberResultItem key={u.id} onClick={() => handleAddMember(u)}>
                          <MemberResultAvatar src={u.avatar || ''} alt="" />
                          <MemberResultName>{u.username}</MemberResultName>
                        </MemberResultItem>
                      ))}
                    </MemberResults>
                  )}
                  {memberSearch && memberResults.length === 0 && !addingMember && (
                    <NoResults>No users found</NoResults>
                  )}
                  {addingMember && <NoResults>Adding...</NoResults>}
                </AddMemberWrap>
              )}
          </UserInfo>
            <RightActions>
              {!isSaved && (
                <>
                  {isGroup ? (
                    <CallButton
                      onClick={() => joinGroupVoice({ chatId: activeChatId, name: chatInfo?.name })}
                      title={voiceRoom ? 'Join group voice' : 'Start group voice'}
                      disabled={!activeChatId || callBusy}
                    >
                      <FaPhone />{voiceRoom && <span>{voiceRoom.members.length}</span>}
                    </CallButton>
                  ) : (
                    <CallButton onClick={() => handleVoipCall('audio')} title="Voice call" disabled={!activeChatId || callBusy}>
                      <FaPhone />
                    </CallButton>
                  )}
                  <CallButton onClick={() => handleVoipCall('video')} title="Video call" disabled={!activeChatId || callBusy}>
                    <FaVideo />
                  </CallButton>
                </>
              )}
              <MenuWrap ref={menuRef}>
                <KebabBtn onClick={() => setShowMenu(s => !s)} title="More">
                  <FaEllipsisV />
                </KebabBtn>
                {showMenu && (
                  <Dropdown>
                    <DropItem onClick={() => { setShowMenu(false); history.push(isSaved ? '/chat/saved' : (isGroup ? `/chat/group/${groupChatId}/attachments` : `/chat/${userId}/attachments`)); }}>
                      <FaPaperclip /> {isSaved ? 'Saved Messages' : 'Attachments'}
                    </DropItem>
                    {!isSaved && (
                    <DropItem onClick={() => { setShowMenu(false); setDemoDelay(d => !d); }}>
                      {demoDelay ? '2s Delay ON' : '1x Delay OFF'}
                    </DropItem>
                    )}
                    {activeChatId && !callBusy && !isSaved && (
                      <DropItem danger onClick={() => { setShowMenu(false); handleDeleteChat(); }}>
                        <FaTrash /> Delete chat
                      </DropItem>
                    )}
                  </Dropdown>
                )}
              </MenuWrap>
            </RightActions>
          </ChatHeader>
          <MessagesContainer role="log" aria-label="Chat messages">
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
            {!isSaved && partnerTyping && (
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

const ChatStatus = styled.div`
  margin: auto;
  text-align: center;

  p { margin-bottom: 12px; }
  a { color: var(--titleColor); }
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

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #333;
  margin-bottom: 16px;
  position: sticky;
  top: 0;
  z-index: 20;
  flex-shrink: 0;
  background-color: ${themeVars.navBg};
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
  flex-wrap: wrap;
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

const GroupBadge = styled.span`
  font-size: 10px;
  color: #a5d6a7;
  background-color: rgba(46, 125, 50, 0.3);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
`;

const GroupMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MemberCount = styled.span`
  font-size: 11px;
  color: #888;
`;

const MemberAvatars = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  margin: 2px 0;
`;

const MemberAvatar = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #444;
  object-fit: cover;
  border: 1px solid #2a2a2a;
`;

const ExtraCount = styled.span`
  font-size: 10px;
  color: #888;
  margin-left: 2px;
`;

const AddMemberBtn = styled.button`
  background: none;
  border: 1px solid #444;
  color: #009688;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  &:hover { background: rgba(0, 150, 136, 0.15); border-color: #009688; }
`;

const AddMemberWrap = styled.div`
  margin-top: 4px;
  position: relative;
`;

const MemberSearchInput = styled.input`
  width: 100%;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #444;
  background: #2a2a2a;
  color: #fff;
  font-size: 13px;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #009688; }
`;

const MemberResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 6px;
  max-height: 160px;
  overflow-y: auto;
  z-index: 10;
`;

const MemberResultItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  cursor: pointer;
  &:hover { background: #333; }
`;

const MemberResultAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #444;
`;

const MemberResultName = styled.span`
  font-size: 13px;
`;

const NoResults = styled.div`
  padding: 8px 10px;
  color: #888;
  font-size: 12px;
`;

const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
`;

const KebabBtn = styled.button`
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

const MenuWrap = styled.div`
  position: relative;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  min-width: 180px;
  z-index: 100;
  overflow: hidden;
`;

const DropItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  border: none;
  background: transparent;
  color: ${p => p.danger ? '#ff5252' : '#ddd'};
  font-size: 14px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
  &:hover { background: rgba(255,255,255,0.06); }
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

const ChatWindowContainer = styled.div`
  width: 70%;
  background-color: ${themeVars.navBg};
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex: 1;
  height: calc(100vh - 5em);
  overflow: hidden;

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
  min-height: 0;
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

const SavedIconWrap = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #009688;
  flex-shrink: 0;
`;

export default ChatWindow;
