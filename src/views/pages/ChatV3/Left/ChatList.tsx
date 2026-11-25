import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { styled } from '@linaria/react';
import { FaBookmark, FaPlus, FaEllipsisV, FaEdit, FaCheck } from 'react-icons/fa';
import { chatRequest } from 'core/api/chatSession';

import useSelectAuthUser from 'core/hooks/useSelectAuthUser';
import { useNotifications } from 'core/context/NotificationContext';
import ChatRow from './ChatRow';
import { AppleEmoji } from '../AppleEmoji';
import CreateGroupModal from './CreateGroupModal';
import PresenceStatus from '../PresenceStatus';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23333' rx='8'/%3E%3Ccircle cx='24' cy='18' r='8' fill='%23999'/%3E%3Cpath d='M8 44c0-8.84 7.16-16 16-16s16 7.16 16 16' fill='%23999'/%3E%3C/svg%3E";

const EMOJI_PALETTE = ['❤️', '🔥', '⭐', '📌', '💼', '📚', '🎮', '🎵', '🎬', '⚽', '💰', '📰', '👥', '📢', '🤖', '🎨', '✈️', '🍔', '💡', '🔔', '💬', '📁', '🌙', '☀️', '🐱', '🌹', '🎯', '💎'];

const tabsStorageKey = (username) => `chat-tabs:${username || 'guest'}`;

const defaultTabs = (emojiData) => (
  (emojiData?.emojis || []).map((emoji) => ({
    id: `e-${emoji.unicode}`,
    emoji: emoji.emoji,
    chatIds: [],
  }))
);

const loadTabs = (username, emojiData) => {
  const defaults = defaultTabs(emojiData);
  try {
    const raw = localStorage.getItem(tabsStorageKey(username));
    if (!raw) return defaults;
    const stored = JSON.parse(raw);
    if (!Array.isArray(stored)) return defaults;
    const byId = new Map(stored.map(tab => [tab.id, tab]));
    return defaults.map(tab => ({
      ...tab,
      emoji: byId.get(tab.id)?.emoji || tab.emoji,
      chatIds: Array.isArray(byId.get(tab.id)?.chatIds) ? byId.get(tab.id).chatIds : [],
    }));
  } catch (_) {
    return defaults;
  }
};

const ChatList = ({ emojiData }) => {
  const { authUser, isSignedIn } = useSelectAuthUser();
  const { unreadChatCount, setUnreadChatCount, chatUpdateTick, selfPresence, presence, requestPresence } = useNotifications();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const location = useLocation();
  const [chatTabs, setChatTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState('all');
  const [editingTabId, setEditingTabId] = useState(null);
  const longPressTimer = useRef(null);

  const fetchChats = useCallback(async () => {
    try {
      const response = await chatRequest('/chats/me/');
      const apiChats = response.data?.chats || [];
      setChats(apiChats);
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    }
  }, []);

  useEffect(() => {
    if (!isSignedIn) return;
    if (initialLoadDone) return;
    const load = async () => {
      setLoading(true);
      await fetchChats();
      setLoading(false);
      setInitialLoadDone(true);
    };
    load();
  }, [isSignedIn, initialLoadDone, fetchChats]);

  useEffect(() => {
    if (isSignedIn && initialLoadDone && location.pathname === '/chat/im') {
      fetchChats();
    }
  }, [initialLoadDone, isSignedIn, location.pathname, fetchChats]);

  useEffect(() => {
    if (isSignedIn && chatUpdateTick > 0) {
      fetchChats();
    }
  }, [chatUpdateTick, isSignedIn, fetchChats]);

  useEffect(() => {
    if (isSignedIn && initialLoadDone) requestPresence();
  }, [initialLoadDone, isSignedIn, requestPresence]);

  const currentUserAvatar = authUser?.profileImg || authUser?.avatar || DEFAULT_AVATAR;
  const currentUsername = authUser?.username || authUser?.user?.username || authUser?.user__username || 'User';
  const savedChat = chats?.find(c => c.is_saved_messages);

  useEffect(() => {
    setChatTabs(loadTabs(currentUsername, emojiData));
    setActiveTabId('all');
    setEditingTabId(null);
  }, [currentUsername, emojiData]);

  const pushTabsTimer = useRef(null);
  useEffect(() => () => {
    if (pushTabsTimer.current) clearTimeout(pushTabsTimer.current);
  }, []);

  const pushTabsToServer = useCallback((tabs) => {
    if (!isSignedIn) return;
    if (pushTabsTimer.current) clearTimeout(pushTabsTimer.current);
    pushTabsTimer.current = setTimeout(() => {
      chatRequest('/chats/tabs/', {
        method: 'put',
        data: { tabs: tabs.map(tab => ({ emoji: tab.emoji, chat_ids: tab.chatIds })) },
      }).catch(() => {});
    }, 800);
  }, [isSignedIn]);

  // Server is the source of truth when signed in: adopt backend tabs, or
  // migrate local customizations up once when the server has none yet.
  useEffect(() => {
    if (!isSignedIn) return;
    let cancelled = false;
    chatRequest('/chats/tabs/').then(({ data }) => {
      if (cancelled || !Array.isArray(data?.tabs)) return;
      if (data.tabs.length > 0) {
        setChatTabs(data.tabs.map(tab => ({
          id: `srv-${tab.id}`,
          emoji: tab.emoji,
          chatIds: (tab.chat_ids || []).map(Number).filter(n => n > 0),
        })));
      } else {
        const current = tabsSnapshotRef.current;
        const defaults = defaultTabs(emojiData);
        const customized = current.some(tab => {
          const original = defaults.find(d => d.id === tab.id);
          return tab.chatIds.length > 0 || (original && tab.emoji !== original.emoji);
        });
        if (customized && current.length) {
          pushTabsToServer(current);
        }
      }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [isSignedIn, emojiData, pushTabsToServer]);

  const tabsSnapshotRef = useRef([]);
  useEffect(() => {
    if (!chatTabs.length) return;
    tabsSnapshotRef.current = chatTabs;
    try {
      localStorage.setItem(tabsStorageKey(currentUsername), JSON.stringify(chatTabs));
    } catch (_) {}
    pushTabsToServer(chatTabs);
  }, [chatTabs, currentUsername, pushTabsToServer]);

  const activeTab = chatTabs.find(tab => tab.id === activeTabId);
  const editingTab = chatTabs.find(tab => tab.id === editingTabId);

  const visibleChats = (chats || []).filter(chat => {
    if (chat.is_saved_messages) return false;
    if (editingTabId) return true;
    if (activeTabId === 'all' || !activeTab) return true;
    return activeTab.chatIds.includes(chat.id);
  });

  const setTabEmoji = useCallback((tabId, emoji) => {
    setChatTabs(prev => prev.map(tab => tab.id === tabId ? { ...tab, emoji } : tab));
  }, []);

  const toggleChatInTab = useCallback((tabId, chatId) => {
    setChatTabs(prev => prev.map(tab => {
      if (tab.id !== tabId) return tab;
      const has = tab.chatIds.includes(chatId);
      return { ...tab, chatIds: has ? tab.chatIds.filter(id => id !== chatId) : [...tab.chatIds, chatId] };
    }));
  }, []);

  const startTabEdit = useCallback((tabId) => {
    setEditingTabId(tabId);
    setActiveTabId(tabId);
  }, []);

  const cancelLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const bindTabLongPress = useCallback((tabId) => ({
    onTouchStart: () => {
      cancelLongPress();
      longPressTimer.current = setTimeout(() => {
        if (navigator.vibrate) {
          try { navigator.vibrate(15); } catch (_) {}
        }
        startTabEdit(tabId);
      }, 550);
    },
    onTouchMove: cancelLongPress,
    onTouchEnd: cancelLongPress,
    onTouchCancel: cancelLongPress,
    onContextMenu: (e) => {
      e.preventDefault();
      startTabEdit(tabId);
    },
  }), [cancelLongPress, startTabEdit]);

  return (
    <ChatListContainer>
      <ProfileRow>
        <CurrentUserProfile to={currentUsername !== 'User' ? `/${currentUsername}` : '/login'}>
          <ImgWrap>
            <Avatar
              src={currentUserAvatar}
              alt={currentUsername}
              onError={(e) => {
                if (e.target.src !== DEFAULT_AVATAR) e.target.src = DEFAULT_AVATAR;
              }}
            />
          </ImgWrap>
          <UserWrapper>
            <User>{currentUsername}</User>
            {isSignedIn && <PresenceStatus {...selfPresence} />}
          </UserWrapper>
          {unreadChatCount > 0 && (
            <GlobalUnreadBadge>{unreadChatCount}</GlobalUnreadBadge>
          )}
        </CurrentUserProfile>
        <KebabButton>
          <FaEllipsisV />
        </KebabButton>
      </ProfileRow>

      <TabsHeader>
        <TabsTitle>Chat Tabs</TabsTitle>
        {editingTab ? (
          <EditTabsBtn onClick={() => setEditingTabId(null)} title="Done">
            <FaCheck size={13} /> Done
          </EditTabsBtn>
        ) : (
          <EditTabsBtn onClick={() => startTabEdit(activeTabId === 'all' ? (chatTabs[0]?.id || 'all') : activeTabId)} title="Edit tabs">
            <FaEdit size={13} /> Edit
          </EditTabsBtn>
        )}
      </TabsHeader>
      <ChatTabs>
        <AllTabs active={activeTabId === 'all'} onClick={() => { setActiveTabId('all'); setEditingTabId(null); }}>All</AllTabs>
        {chatTabs.map((tab) => (
          <EmojiTab
            key={tab.id}
            active={activeTabId === tab.id}
            editing={editingTabId === tab.id}
            onClick={() => {
              setActiveTabId(tab.id);
              if (editingTabId && editingTabId !== tab.id) setEditingTabId(tab.id);
            }}
            {...bindTabLongPress(tab.id)}
          >
            <AppleEmoji char={tab.emoji} />
          </EmojiTab>
        ))}
      </ChatTabs>
      {editingTab && (
        <TabEditor>
          <EditorTitle>
            <AppleEmoji char={editingTab.emoji} /> tab — {editingTab.chatIds.length} chats
          </EditorTitle>
          <EditorHint>Pick an emoji, then tap chats below to add or remove them.</EditorHint>
          <EmojiPalette>
            {EMOJI_PALETTE.map((emoji) => (
              <EmojiChoice
                key={emoji}
                selected={editingTab.emoji === emoji}
                onClick={() => setTabEmoji(editingTab.id, emoji)}
              >
                <AppleEmoji char={emoji} />
              </EmojiChoice>
            ))}
          </EmojiPalette>
        </TabEditor>
      )}

      <SavedMessagesRow>
        {savedChat ? (
          <ChatRow chat={savedChat} />
        ) : (
          <LinkStyledSaved to="/chat/saved" onClick={() => {}}>
            <SavedIconWrap>
              <FaBookmark />
            </SavedIconWrap>
            <SavedLabel>Saved Messages</SavedLabel>
          </LinkStyledSaved>
        )}
      </SavedMessagesRow>

      {!isSignedIn && <Link to="/login">Log in to see your chats</Link>}

      {isSignedIn && loading && chats.length === 0 && (
        <div style={{ padding: '20px', color: '#888' }}>Loading chats...</div>
      )}

      {isSignedIn && !loading && chats.length === 0 && (
        <div style={{ padding: '20px', color: '#888' }}>No conversations yet.</div>
      )}

      {activeTabId !== 'all' && visibleChats.length === 0 && !loading && (
        <EmptyTabHint>
          No chats in this tab yet.
          {!editingTab && ' Tap Edit above, pick the tab, then tap chats to add them.'}
        </EmptyTabHint>
      )}
      {visibleChats.map((chat) => (
        <ChatRowWrap
          key={chat.id}
          onClickCapture={(e) => {
            if (editingTab) {
              e.preventDefault();
              e.stopPropagation();
              toggleChatInTab(editingTab.id, chat.id);
            }
          }}
        >
          {editingTab && (
            <TabCheck selected={editingTab.chatIds.includes(chat.id)}>
              {editingTab.chatIds.includes(chat.id) && '✓'}
            </TabCheck>
          )}
          <ChatRow
            chat={chat}
            presence={presence[chat.other_participant?.id]}
            onClick={() => {
              const clickedUnread = chat.unread_count || 0;
              setChats(prev => prev.map(c =>
                c.id === chat.id ? { ...c, unread_count: 0 } : c
              ));
              if (clickedUnread > 0) {
                setUnreadChatCount(prev => Math.max(0, (prev || 0) - clickedUnread));
              }
            }}
          />
        </ChatRowWrap>
      ))}

      <CircleBtn onClick={() => setShowCreateGroup(true)}>
        <FaPlus />
      </CircleBtn>

      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onCreated={(chat) => {
            fetchChats();
          }}
        />
      )}

    </ChatListContainer>
  );
};

const CircleBtn = styled.button`
  position: absolute;
  bottom: 24px;
  right: 24px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: #686cb9;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  z-index: 10;
  transition: background 0.2s;
  &:hover { background: #686cb9; }
`;

const CurrentUserProfile = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid #333;
  transition: background-color 0.2s;
  position: relative;
  flex: 1;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const UserWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const AllTabs = styled.div`
  margin: auto 0;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 14px;
  color: ${({ active }) => (active ? '#fff' : '#888')};
  background: ${({ active }) => (active ? '#0084ff' : 'transparent')};
  font-size: 0.9rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const TabsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 -20px 4px;
  padding: 0 20px;
`;

const TabsTitle = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #666;
`;

const EditTabsBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #4db6ac;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  &:hover {
    background: rgba(77, 182, 172, 0.12);
  }
`;

const EmojiTab = styled.button`
  background: ${({ active }) => (active ? 'rgba(0, 132, 255, 0.18)' : 'transparent')};
  border: 1px solid ${({ editing }) => (editing ? '#4db6ac' : 'transparent')};
  border-radius: 14px;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 1.15rem;
  line-height: 1;
  flex-shrink: 0;
  outline: ${({ editing }) => (editing ? '2px solid rgba(77, 182, 172, 0.5)' : 'none')};
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const TabEditor = styled.div`
  margin: 0 -20px;
  padding: 10px 20px 12px;
  border-bottom: 1px solid #333;
  background: #161616;
`;

const EditorTitle = styled.div`
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 2px;
`;

const EditorHint = styled.div`
  color: #888;
  font-size: 0.78rem;
  margin-bottom: 8px;
`;

const EmojiPalette = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const EmojiChoice = styled.button`
  background: ${({ selected }) => (selected ? 'rgba(77, 182, 172, 0.25)' : 'transparent')};
  border: 1px solid ${({ selected }) => (selected ? '#4db6ac' : 'transparent')};
  border-radius: 8px;
  font-size: 1.2rem;
  line-height: 1;
  padding: 5px;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const ChatRowWrap = styled.div`
  position: relative;
`;

const TabCheck = styled.div`
  position: absolute;
  left: 2px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${({ selected }) => (selected ? '#4db6ac' : '#666')};
  background: ${({ selected }) => (selected ? '#4db6ac' : 'rgba(0, 0, 0, 0.5)')};
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  pointer-events: none;
`;

const EmptyTabHint = styled.div`
  padding: 24px 16px;
  color: #888;
  font-size: 0.85rem;
  text-align: center;
  line-height: 1.5;
`;

const UnreadBadge = styled.div`
  background-color: #0084ff;
  color: white;
  font-size: 11px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  margin-left: auto;
  align-self: center;
  flex-shrink: 0;
`;

const ProfileRow = styled.div`
  display: none;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
`;

const GlobalUnreadBadge = styled(UnreadBadge)`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
`;

const KebabButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
  &:hover {
    color: #fff;
    background: rgba(255,255,255,0.08);
  }
`;

const ChatTabs = styled.div`
  display: flex;
  overflow: auto;
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--navBg, #000);
  margin: -20px -20px 0;
  padding: 20px 20px 0;

  @media screen and (max-width: 768px) {
    top: 60px;
  }
`;

const ImgWrap = styled.div`
  padding-right: 12px;
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 10px;
`;

const ChatListContainer = styled.div`
  width: 30%;
  background-color: var(--navBg, #000);
  border-right: 1px solid #404040;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  height: calc(100vh - 5em);
  overflow-y: auto;

  @media screen and (max-width: 768px) {
    width: 100%;
    position: relative;
    border-right: none;
    border-bottom: 1px solid #404040;
    height: auto;
    overflow-y: visible;
  }
`;

const User = styled.div`
  font-size: 14px;
  font-family: Arial;
  color: var(--text, #fff);
  cursor: pointer;
`;

const SavedMessagesRow = styled.div`
  padding: 6px 0;
  margin-bottom: 8px;
  border-bottom: 1px solid #333;
`;

const LinkStyledSaved = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;
  &:hover {
    background-color: var(--chatHoverText, #2e2e2e);
  }
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
  font-size: 20px;
`;

const SavedLabel = styled.div`
  font-size: 15px;
  font-family: Arial;
  color: var(--text, #fff);
  font-weight: 500;
`;

export default ChatList;
