import React, { useState, useEffect, useCallback } from 'react';
import { styled } from '@linaria/react';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { chatRequest } from 'core/api/chatSession';
import { LITLOOP_API_URL } from 'core/constants/urls';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23333' rx='8'/%3E%3Ccircle cx='24' cy='18' r='8' fill='%23999'/%3E%3Cpath d='M8 44c0-8.84 7.16-16 16-16s16 7.16 16 16' fill='%23999'/%3E%3C/svg%3E";

const resolveUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${LITLOOP_API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const forwardableAttachments = (message) => (
  (message.attachments || [])
    .filter(att => att && att.url && att.type !== 'voice')
    .map(att => {
      const out = { url: att.url, type: att.type, name: att.name || 'file' };
      if (att.artist) out.artist = att.artist;
      if (att.artists) out.artists = att.artists;
      return out;
    })
);

const ForwardModal = ({ messages, onClose }) => {
  const [chats, setChats] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState(null);
  const [sentId, setSentId] = useState(null);
  const [error, setError] = useState(null);

  const forwardable = (messages || []).filter(m => m.id != null);
  const skippedVoice = forwardable.filter(m =>
    !((m.text || m.content || m.body || '').trim()) &&
    forwardableAttachments(m).length === 0 &&
    (m.voice_message || m.voice_message_id)
  ).length;

  useEffect(() => {
    let cancelled = false;
    chatRequest('/chats/me/').then(({ data }) => {
      if (!cancelled) {
        setChats(data?.chats || []);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) {
        setError('Could not load chats.');
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const chatName = (chat) => {
    if (chat.is_saved_messages) return 'Saved Messages';
    return chat.name ||
      ((chat.first_name ? `${chat.first_name} ${chat.last_name || ''}`.trim() : null)) ||
      chat.username || 'Chat';
  };

  const chatAvatar = (chat) => {
    const raw = chat.image_url || chat.avatar || chat.profile_image_url;
    if (!raw) return DEFAULT_AVATAR;
    if (raw.startsWith('http')) return raw;
    return `${LITLOOP_API_URL}${raw.startsWith('/') ? '' : '/'}${raw}`;
  };

  const forwardTo = useCallback(async (chat) => {
    if (sendingId) return;
    setSendingId(chat.id);
    setError(null);
    let sent = 0;
    let skipped = skippedVoice;
    try {
      for (const message of forwardable) {
        const text = (message.text || message.content || message.body || '').trim();
        const attachments = forwardableAttachments(message);
        if (!text && attachments.length === 0) {
          skipped += 1;
          continue;
        }
        await chatRequest(`/chats/${chat.id}/send/`, { method: 'post', data: { text, attachments } });
        sent += 1;
      }
      if (sent === 0) {
        setError(skipped > 0 ? 'Only voice messages — cannot forward those.' : 'Nothing to forward.');
      } else {
        setSentId(chat.id);
        setTimeout(onClose, 900);
      }
    } catch {
      setError(sent > 0 ? `Sent ${sent}, then failed.` : 'Forward failed.');
    } finally {
      setSendingId(null);
    }
  }, [forwardable, sendingId, skippedVoice, onClose]);

  const visible = chats.filter(chat =>
    !query || chatName(chat).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Backdrop onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Forward {forwardable.length > 1 ? `${forwardable.length} messages` : 'message'}</Title>
          <CloseBtn onClick={onClose} title="Close">
            <FaTimes size={15} />
          </CloseBtn>
        </Header>
        {skippedVoice > 0 && (
          <Hint>Voice messages cannot be forwarded and will be skipped.</Hint>
        )}
        <Search
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search chats..."
          autoFocus
        />
        <List>
          {loading && <Hint>Loading chats…</Hint>}
          {error && <ErrorText>{error}</ErrorText>}
          {!loading && visible.map(chat => (
            <ChatRow key={chat.id} onClick={() => forwardTo(chat)} disabled={sendingId != null}>
              <Avatar src={chatAvatar(chat)} alt="" onError={(e) => { e.target.src = DEFAULT_AVATAR; }} />
              <Name>{chatName(chat)}</Name>
              {sendingId === chat.id && <Sending>Sending…</Sending>}
              {sentId === chat.id && <SentMark><FaCheck size={13} /> Sent</SentMark>}
            </ChatRow>
          ))}
          {!loading && visible.length === 0 && !error && <Hint>No chats found.</Hint>}
        </List>
      </Panel>
    </Backdrop>
  );
};

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const Panel = styled.div`
  width: 100%;
  max-width: 380px;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  border: 1px solid #444;
  border-radius: 12px;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid #333;
`;

const Title = styled.div`
  color: #fff;
  font-weight: 600;
  font-size: 15px;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 4px;
  display: flex;
  &:hover { color: #fff; }
`;

const Hint = styled.div`
  padding: 10px 14px;
  color: #888;
  font-size: 13px;
`;

const ErrorText = styled.div`
  padding: 10px 14px;
  color: #ff5252;
  font-size: 13px;
`;

const Search = styled.input`
  margin: 10px 14px 4px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #444;
  background: #2a2a2a;
  color: #fff;
  font-size: 14px;
  &:focus { outline: none; border-color: #4db6ac; }
`;

const List = styled.div`
  overflow-y: auto;
  padding: 6px 8px 12px;
`;

const ChatRow = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  text-align: left;
  &:hover { background: ${({ disabled }) => (disabled ? 'transparent' : 'rgba(255, 255, 255, 0.06)')}; }
`;

const Avatar = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  background: #333;
  flex-shrink: 0;
`;

const Name = styled.div`
  flex: 1;
  color: #eee;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Sending = styled.div`
  color: #888;
  font-size: 12px;
  font-style: italic;
`;

const SentMark = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #4db6ac;
  font-size: 12px;
  font-weight: 600;
`;

export default ForwardModal;
