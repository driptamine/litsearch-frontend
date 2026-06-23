import React from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@linaria/react';
import { FaBookmark } from 'react-icons/fa';
import { LITLOOP_API_URL } from 'core/constants/urls';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23333' rx='8'/%3E%3Ccircle cx='24' cy='18' r='8' fill='%23999'/%3E%3Cpath d='M8 44c0-8.84 7.16-16 16-16s16 7.16 16 16' fill='%23999'/%3E%3C/svg%3E";
const GROUP_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%232e7d32' rx='8'/%3E%3Ccircle cx='24' cy='16' r='7' fill='%23a5d6a7'/%3E%3Ccircle cx='14' cy='34' r='5' fill='%23a5d6a7'/%3E%3Ccircle cx='34' cy='34' r='5' fill='%23a5d6a7'/%3E%3C/svg%3E";

const ChatRow = ({ chat, onClick }) => {
  const isSaved = chat.is_saved_messages;
  const isGroup = chat.chat_type === 'groupchat';

  const displayName = isSaved
    ? 'Saved Messages'
    : isGroup
      ? (chat.name || 'Group')
      : (chat.target_user?.username || chat.other_participant?.username || 'User');

  const linkTo = isSaved ? '/chat/saved' : (isGroup ? `/chat/group/${chat.id}` : `/chat/${(chat.target_user || chat.other_participant || {}).id}`);

  let avatarUrl = chat.image_url;
  if (!avatarUrl && !isGroup && !isSaved) {
    avatarUrl = (chat.target_user || chat.other_participant || {}).avatar;
  }

  if (avatarUrl) {
    if (!avatarUrl.startsWith('http')) {
      avatarUrl = `${LITLOOP_API_URL}${avatarUrl.startsWith('/') ? '' : '/'}${avatarUrl}`;
    }
  }

  const lastMsg = chat.last_message;
  const lastMsgText = lastMsg?.text || (lastMsg?.attachments?.length ? '[Attachment]' : '') || "No messages yet";
  const unreadCount = chat.unread_count || 0;

  return (
    <LinkStyled to={linkTo} onClick={onClick}>
      <HoverWrapper>
        <ImgWrap>
          {isSaved ? (
            <SavedIconWrap>
              <FaBookmark size={22} />
            </SavedIconWrap>
          ) : (
            <Avatar
              src={avatarUrl || (isGroup ? GROUP_AVATAR : DEFAULT_AVATAR)}
              alt={displayName}
              onError={(e) => {
                if (e.target.src !== DEFAULT_AVATAR && e.target.src !== GROUP_AVATAR) e.target.src = isGroup ? GROUP_AVATAR : DEFAULT_AVATAR;
              }}
            />
          )}
        </ImgWrap>
        <UserWrapper>
          <Row>
            <User>{displayName}</User>
            {isGroup && <GroupBadge>Group</GroupBadge>}
          </Row>
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

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const GroupBadge = styled.span`
  font-size: 10px;
  color: #a5d6a7;
  background-color: rgba(46, 125, 50, 0.3);
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
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

const SavedIconWrap = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #009688;
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
