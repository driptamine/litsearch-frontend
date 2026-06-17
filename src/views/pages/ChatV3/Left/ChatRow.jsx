import React from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@linaria/react';
import { LITLOOP_API_URL } from 'core/constants/urls';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23333' rx='8'/%3E%3Ccircle cx='24' cy='18' r='8' fill='%23999'/%3E%3Cpath d='M8 44c0-8.84 7.16-16 16-16s16 7.16 16 16' fill='%23999'/%3E%3C/svg%3E";

const ChatRow = ({ chat, onClick }) => {
  const otherUser = chat.target_user || chat.other_participant || {};
  const displayName = otherUser.username || "User";

  let avatarUrl = chat.image_url || otherUser.avatar;

  if (avatarUrl) {
    if (!avatarUrl.startsWith('http')) {
      avatarUrl = `${LITLOOP_API_URL}${avatarUrl.startsWith('/') ? '' : '/'}${avatarUrl}`;
    }
  } else {
    avatarUrl = DEFAULT_AVATAR;
  }

  const lastMsg = chat.last_message;
  const lastMsgText = lastMsg?.text || (lastMsg?.attachments?.length ? '[Attachment]' : '') || "No messages yet";
  const unreadCount = chat.unread_count || 0;

  return (
    <LinkStyled to={`/chat/${otherUser.id}`} onClick={onClick}>
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
};

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

const UserWrapper = styled.div`
  display: flex;
  flex-direction: column;
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

const ImgWrap = styled.div`
  padding-right: 12px;
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 10px;
`;

const User = styled.div`
  font-size: 14px;
  font-family: Arial;
  color: var(--text, #fff);
  cursor: pointer;
`;

export default ChatRow;
