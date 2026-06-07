import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { styled } from '@linaria/react';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader, getAxiosReq } from 'core/api/rest-helper';

import useSelectAuthUser from 'core/hooks/useSelectAuthUser';

const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/0?d=mp&f=y';

const ChatList = ({ emojiData }) => {
  const { authUser } = useSelectAuthUser();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const response = await getAxiosReq(`${LITLOOP_API_URL}/chats/me/`);
        // Use response.data.chats as per the provided structure
        const apiChats = response.data?.chats || [];
        
        console.log("ChatList: Fetched chats:", apiChats);
        setChats(apiChats);
      } catch (err) {
        console.error("Failed to fetch chats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  // Refetch when returning to the chat list view
  useEffect(() => {
    if (location.pathname === '/chat/im') {
      const fetchChats = async () => {
        try {
          const response = await getAxiosReq(`${LITLOOP_API_URL}/chats/me/`);
          const apiChats = response.data?.chats || [];
          setChats(apiChats);
        } catch (err) {
          console.error("Failed to refetch chats:", err);
        }
      };
      fetchChats();
    }
  }, [location.pathname]);

  const currentUserAvatar = authUser?.profileImg || authUser?.avatar || DEFAULT_AVATAR;
  const currentUsername = authUser?.username || authUser?.user?.username || authUser?.user__username || 'User';

  return (
    <ChatListContainer>
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
      </CurrentUserProfile>

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

      {chats?.map((chat) => {
        const otherUser = chat.target_user || chat.other_participant || {};
        const displayName = otherUser.username || "User";
        
        // Use chat.image_url if available (group chat), otherwise participant's avatar
        let avatarUrl = chat.image_url || otherUser.avatar;
        
        if (avatarUrl) {
          if (!avatarUrl.startsWith('http')) {
            avatarUrl = `${LITLOOP_API_URL}${avatarUrl.startsWith('/') ? '' : '/'}${avatarUrl}`;
          }
        } else {
          avatarUrl = DEFAULT_AVATAR;
        }

        const lastMsgText = chat.last_message?.text || "No messages yet";
        const unreadCount = chat.unread_count || 0;

        return (
          <LinkStyled key={chat.id} to={`/chat/${otherUser.id}`}
            onClick={() => setChats(prev => prev.map(c => 
              c.id === chat.id ? { ...c, unread_count: 0 } : c
            ))}>
            <HoverWrapper>
              <ImgWrap>
                <Avatar 
                  src={avatarUrl} 
                  alt={displayName}
                  onError={(e) => { 
                    if (e.target.src !== DEFAULT_AVATAR) e.target.src = DEFAULT_AVATAR; 
                  }}
                />
              </ImgWrap>
              <UserWrapper>
                <User>{displayName}</User>
                <LastMessage>{lastMsgText}</LastMessage>
              </UserWrapper>
              {unreadCount > 0 && <UnreadBadge>{unreadCount}</UnreadBadge>}
            </HoverWrapper>
          </LinkStyled>
        );
      })}

    </ChatListContainer>
  );
};
const CurrentUserProfile = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 20px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid #333;
  transition: background-color 0.2s;

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
  /* align-items: center; */
  flex-direction: column;
`;
const AllTabs = styled.div`
  margin: auto;
  cursor: pointer;
`;

const LastMessage = styled.div`
  font-size: 12px;
  font-family: Verdana;
  color: #999;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  height: calc(100vh - 5em); /* Matching Container.jsx padding-top */
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
  /* background-color: ${({ isActive }) => (isActive ? '#ddd' : '#f4f4f4')}; */

  /* background-color: var(--navBg); */
  color: var(--text, #fff);

  cursor: pointer;

`;

export default ChatList;
