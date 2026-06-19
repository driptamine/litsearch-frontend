import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { styled } from '@linaria/react';
import { FaPlus, FaEllipsisV } from 'react-icons/fa';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader, getAxiosReq } from 'core/api/rest-helper';

import useSelectAuthUser from 'core/hooks/useSelectAuthUser';
import { useNotifications } from 'core/context/NotificationContext';
import ChatRow from './ChatRow';
import CreateGroupModal from './CreateGroupModal';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23333' rx='8'/%3E%3Ccircle cx='24' cy='18' r='8' fill='%23999'/%3E%3Cpath d='M8 44c0-8.84 7.16-16 16-16s16 7.16 16 16' fill='%23999'/%3E%3C/svg%3E";

const ChatList = ({ emojiData }) => {
  const { authUser, isSignedIn } = useSelectAuthUser();
  const { unreadChatCount, setUnreadChatCount, chatUpdateTick } = useNotifications();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const location = useLocation();

  const fetchChats = useCallback(async () => {
    try {
      const response = await getAxiosReq(`${LITLOOP_API_URL}/chats/me/`);
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
  }, [isSignedIn, initialLoadDone]);

  useEffect(() => {
    if (location.pathname === '/chat/im') {
      fetchChats();
    }
  }, [location.pathname]);

  useEffect(() => {
    if (chatUpdateTick > 0) {
      fetchChats();
    }
  }, [chatUpdateTick]);

  const currentUserAvatar = authUser?.profileImg || authUser?.avatar || DEFAULT_AVATAR;
  const currentUsername = authUser?.username || authUser?.user?.username || authUser?.user__username || 'User';

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
            <Status>Online</Status>
          </UserWrapper>
          {unreadChatCount > 0 && (
            <GlobalUnreadBadge>{unreadChatCount}</GlobalUnreadBadge>
          )}
        </CurrentUserProfile>
        <KebabButton>
          <FaEllipsisV />
        </KebabButton>
      </ProfileRow>

      <Tabs>
        <AllTabs>All Tabs</AllTabs>
        {emojiData?.emojis?.map((emoji) => (
          <LinkStyled key={emoji.unicode} to="#">
            <HoverWrapper>
              <>{emoji.emoji}</>
            </HoverWrapper>
          </LinkStyled>
        ))}
      </Tabs>

      {loading && chats.length === 0 && (
        <div style={{ padding: '20px', color: '#888' }}>Loading chats...</div>
      )}

      {!loading && chats.length === 0 && (
        <div style={{ padding: '20px', color: '#888' }}>No conversations yet.</div>
      )}

      {chats?.map((chat) => (
        <div key={chat.id}>
          <ChatRow
            chat={chat}
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
        </div>
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

const Status = styled.div`
  font-size: 11px;
  color: #4caf50;
  font-weight: 600;
`;

const UserWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const AllTabs = styled.div`
  margin: auto;
  cursor: pointer;
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
  display: flex;
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

const Tabs = styled.div`
  display: flex;
  overflow: auto;
`;

const ImgWrap = styled.div`
  padding-right: 12px;
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 10px;
`;

const LinkStyled = styled(Link)`
  text-decoration: none;
  display: flex;
  cursor: pointer;
  padding: 0.5625rem;
  &:hover {
    background-color: var(--chatHoverText, #2e2e2e);
    border-radius: 10px;
  }
`;

const HoverWrapper = styled.div`
  display: flex;
  &:hover {
    background-color: var(--chatHoverText, #2e2e2e);
  }
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
  }
`;

const User = styled.div`
  font-size: 14px;
  font-family: Arial;
  color: var(--text, #fff);
  cursor: pointer;
`;

export default ChatList;
