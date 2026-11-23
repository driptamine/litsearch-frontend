import React from 'react';
import { styled } from '@linaria/react';
import { FaReply, FaCheck } from 'react-icons/fa';
import { useLongPressMenu } from './MessageContextMenu';
import { LITLOOP_API_URL } from 'core/constants/urls';
import ChatTrackAttachment, { isTrackAttachment } from './ChatTrackAttachment';
import VoiceMessagePlayer from './VoiceMessagePlayer';
import { renderAppleEmojis } from '../AppleEmoji';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23333' rx='8'/%3E%3Ccircle cx='24' cy='18' r='8' fill='%23999'/%3E%3Cpath d='M8 44c0-8.84 7.16-16 16-16s16 7.16 16 16' fill='%23999'/%3E%3C/svg%3E";

const resolveUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${LITLOOP_API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const MyMessage = ({ message, authUser, formatTime, quote, flash, onReply, onQuoteClick, onMenu, selectMode, selected, onToggleSelect }) => {
  const msgData = message;
  const messageText = msgData.text || msgData.content || msgData.body || '';
  const currentUserName = authUser?.username || authUser?.user?.username || 'You';
  const senderAvatar = resolveUrl(msgData.avatar) || resolveUrl(authUser?.profileImg) || resolveUrl(authUser?.avatar) || DEFAULT_AVATAR;
  const attachments = msgData.attachments || [];
  const press = useLongPressMenu(onMenu || (() => {}), message);

  return (
    <MessageRow
      id={msgData.id != null ? `chat-msg-${msgData.id}` : undefined}
      onDoubleClick={selectMode ? undefined : onReply}
      onClick={selectMode && msgData.id != null ? onToggleSelect : undefined}
      title={selectMode ? 'Toggle selection' : (onReply ? 'Double-click to reply' : undefined)}
      style={selectMode && selected ? { background: 'rgba(77, 182, 172, 0.12)', borderRadius: '12px' } : undefined}
      {...(selectMode ? {} : press)}
    >
      {selectMode ? (
        <SelectBox checked={selected}>
          {selected && <FaCheck size={11} />}
        </SelectBox>
      ) : (
        onReply && (
          <ReplyBtn className="msg-reply-btn" onClick={onReply} title="Reply">
            <FaReply size={13} />
          </ReplyBtn>
        )
      )}
      <Message style={flash ? { outline: '2px solid #4db6ac', outlineOffset: '2px' } : undefined}>
        {quote && (
          <QuoteBlock onClick={() => onQuoteClick && onQuoteClick(quote.id)} title="Go to quoted message">
            <QuoteName>{quote.username || 'User'}</QuoteName>
            <QuoteText>{quote.text || 'Attachment'}</QuoteText>
          </QuoteBlock>
        )}
        {attachments.length > 0 && (
          <AttachmentsWrap>
            {attachments.map((att, idx) => (
              <AttachmentItem key={idx}>
                {att.type === 'photo' && (
                  <PhotoAtt
                    src={resolveUrl(att.url)}
                    alt={att.name}
                    onClick={() => window.open(resolveUrl(att.url), '_blank')}
                  />
                )}
                {att.type === 'video' && (
                  <VideoAtt src={resolveUrl(att.url)} controls preload="metadata" />
                )}
                {isTrackAttachment(att) && (
                  <ChatTrackAttachment attachment={att} inMessage />
                )}
              </AttachmentItem>
            ))}
          </AttachmentsWrap>
        )}
        {msgData.voice_message && (
          <VoiceMsgWrap>
            <VoiceMessagePlayer
              url={resolveUrl(msgData.voice_message.url)}
              duration={msgData.voice_message.duration}
              voiceMsgId={msgData.voice_message.id}
              transcription={msgData.voice_message.transcription}
              transcriptionStatus={msgData.voice_message.transcription_status}
              transcriptionLanguage={msgData.voice_message.transcription_language}
            />
          </VoiceMsgWrap>
        )}
        {messageText && <MessageText>{renderAppleEmojis(messageText)}</MessageText>}
        <MessageTime>
          {formatTime(msgData.created_at)}
          {msgData.is_read && <ReadMark> Seen</ReadMark>}
        </MessageTime>
      </Message>
      <SmallAvatar
        src={senderAvatar}
        alt={currentUserName}
        onError={(e) => {
          if (e.target.src !== DEFAULT_AVATAR) e.target.src = DEFAULT_AVATAR;
        }}
      />
    </MessageRow>
  );
};

const MessageRow = styled.div`
  display: flex;
  align-items: flex-end;
  margin: 4px 0;
  justify-content: flex-end;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;

  &:hover .msg-reply-btn {
    opacity: 1;
  }
`;

const SelectBox = styled.button`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid ${({ checked }) => (checked ? '#4db6ac' : '#666')};
  background: ${({ checked }) => (checked ? '#4db6ac' : 'transparent')};
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 8px;
  align-self: center;
  padding: 0;
`;

const ReplyBtn = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  margin-right: 4px;
  opacity: 0;
  transition: opacity 0.15s, color 0.15s, background 0.15s;
  &:hover {
    color: #4db6ac;
    background: rgba(255, 255, 255, 0.08);
  }
  @media (hover: none) {
    opacity: 1;
  }
`;

const QuoteBlock = styled.div`
  border-left: 3px solid rgba(255, 255, 255, 0.7);
  background: rgba(0, 0, 0, 0.18);
  border-radius: 6px;
  padding: 6px 10px;
  margin-bottom: 6px;
  cursor: pointer;
  max-width: 100%;
`;

const QuoteName = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  color: #c8e6c9;
  margin-bottom: 2px;
`;

const QuoteText = styled.div`
  font-size: 0.8rem;
  opacity: 0.85;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
`;

const SmallAvatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-left: 8px;
  object-fit: cover;
  flex-shrink: 0;
  align-self: flex-end;
  margin-bottom: 4px;
`;

const Message = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: white;
  padding: 10px 16px;
  background-color: #0084ff;
  border-radius: 18px;
  max-width: 75%;
  box-shadow: 0 1px 1px rgba(0,0,0,0.1);
  word-wrap: break-word;
`;

const MessageText = styled.div`
  font-size: 0.95rem;
  line-height: 1.35;
`;

const MessageTime = styled.div`
  font-size: 0.65rem;
  opacity: 0.6;
  margin-top: 4px;
  text-align: right;
`;

const VoiceMsgWrap = styled.div`
  margin-bottom: 4px;
`;

const ReadMark = styled.span`
  color: #34b7f1;
  font-weight: 600;
`;

const AttachmentsWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 6px;
`;

const AttachmentItem = styled.div``;

const PhotoAtt = styled.img`
  max-width: 220px;
  max-height: 220px;
  border-radius: 10px;
  cursor: pointer;
  object-fit: cover;
  display: block;
`;

const VideoAtt = styled.video`
  max-width: 260px;
  max-height: 260px;
  border-radius: 10px;
  display: block;
`;

export default MyMessage;
