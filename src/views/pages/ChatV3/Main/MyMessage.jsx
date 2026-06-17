import React from 'react';
import { styled } from '@linaria/react';
import themeVars from 'views/styles/theme-vars';
import { LITLOOP_API_URL } from 'core/constants/urls';
import VoiceMessagePlayer from './VoiceMessagePlayer';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23333' rx='8'/%3E%3Ccircle cx='24' cy='18' r='8' fill='%23999'/%3E%3Cpath d='M8 44c0-8.84 7.16-16 16-16s16 7.16 16 16' fill='%23999'/%3E%3C/svg%3E";

const resolveUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${LITLOOP_API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const MyMessage = ({ message, authUser, formatTime }) => {
  const msgData = message;
  const messageText = msgData.text || msgData.content || msgData.body || '';
  const currentUserName = authUser?.username || authUser?.user?.username || 'You';
  const senderAvatar = resolveUrl(msgData.avatar) || resolveUrl(authUser?.profileImg) || resolveUrl(authUser?.avatar) || DEFAULT_AVATAR;
  const attachments = msgData.attachments || [];

  return (
    <MessageRow>
      <Message>
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
                {att.type === 'track' && (
                  <TrackAtt>
                    <TrackName>{att.name}</TrackName>
                    <audio src={resolveUrl(att.url)} controls preload="none" />
                  </TrackAtt>
                )}
              </AttachmentItem>
            ))}
          </AttachmentsWrap>
        )}
        {msgData.voice_message && (
          <VoiceMsgWrap>
            <VoiceMessagePlayer url={resolveUrl(msgData.voice_message.url)} duration={msgData.voice_message.duration} />
          </VoiceMsgWrap>
        )}
        {messageText && <MessageText>{messageText}</MessageText>}
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

const TrackAtt = styled.div`
  background: rgba(0,0,0,0.15);
  border-radius: 10px;
  padding: 8px;
  min-width: 200px;
  audio {
    width: 100%;
    height: 36px;
  }
`;

const TrackName = styled.div`
  font-size: 0.8rem;
  margin-bottom: 4px;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default MyMessage;
