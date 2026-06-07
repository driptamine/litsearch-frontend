// https://chatgpt.com/c/66f88cfe-b214-800c-90ee-b1b63e8d93ce
import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@linaria/react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader, getAxiosReq, postAxiosReq } from 'core/api/rest-helper';
import ChatInput from 'views/pages/ChatV3/Main/ChatInput';
import { SkeletonLine } from 'views/styles/Skeleton';
import useSelectAuthUser from 'core/hooks/useSelectAuthUser';

const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/0?d=mp&f=y';

const ChatWindow = () => {
  const { authUser } = useSelectAuthUser();
  const { userId } = useParams();
  const history = useHistory();
  
  const [messages, setMessages] = useState([]);
  const [chatInfo, setChatInfo] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Debug logs
  useEffect(() => {
    if (authUser) {
      console.log("ChatWindow: Current Auth User:", authUser);
    }
  }, [authUser]);

  useEffect(() => {
    if (messages.length > 0) {
      console.log("ChatWindow: First Message Data:", messages[0]);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!userId) {
      setChatInfo(null);
      setMessages([]);
      return;
    }

    const fetchChatDetail = async () => {
      setLoading(true);
      try {
        const url = `${LITLOOP_API_URL}/chats/u/${userId}/`;
        const response = await getAxiosReq(url);
        const data = response.data;
        
        const participantInfo = data.target_user || data.other_participant || data.other_user || {};
        setChatInfo({
          name: data.name,
          ...participantInfo
        });
        
        setMessages(data.messages || []);
        setActiveChatId(data.id);
        
        // Mark messages as read
        if (data.id) {
          try {
            await postAxiosReq(`${LITLOOP_API_URL}/chats/${data.id}/read/`, {});
          } catch (_) { /* ignore */ }
        }
      } catch (err) {
        console.error("Failed to fetch chat details:", err);
        try {
          const userRes = await getAxiosReq(`${LITLOOP_API_URL}/users/${userId}/`);
          setChatInfo(userRes.data);
        } catch (userErr) {
          console.error("Failed to fetch user fallback after chat error:", userErr);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchChatDetail();
  }, [userId]);

  const handleSendMessage = async (text) => {
    if (!userId) return;
    
    const messageText = text.trim();
    if (!messageText) return;

    const currentUserName = authUser?.username || authUser?.user?.username || 'You';
    const tempId = Date.now();
    const tempMessage = { 
      username: currentUserName, 
      text: messageText, 
      isTemp: true, 
      tempId: tempId,
      sentByMe: true,
      is_read: false
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const url = activeChatId 
        ? `${LITLOOP_API_URL}/chats/${activeChatId}/send/`
        : `${LITLOOP_API_URL}/chats/u/${userId}/send/`;

      const response = await postAxiosReq(url, {
        text: messageText,
        content: messageText
      });
      
      const newData = response.data;
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
      history.push('/chat/im');
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  };

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

  return (
    <ChatWindowContainer>
      {userId ? (
        <>
          <Header>
            <BackButton onClick={() => history.push('/chat/im')}>
              <FaArrowLeft />
            </BackButton>
            <Avatar 
              src={chatInfo?.avatar || DEFAULT_AVATAR} 
              alt={chatInfo?.name || 'Chat'} 
              onError={(e) => { 
                if (e.target.src !== DEFAULT_AVATAR) e.target.src = DEFAULT_AVATAR; 
              }}
            />
            <UserInfo>
              <Username>
                {chatInfo?.name || 
                 (chatInfo?.first_name ? `${chatInfo.first_name} ${chatInfo.last_name || ''}`.trim() : null) || 
                 chatInfo?.username || 
                 (loading ? 'Loading...' : 'New Message')}
              </Username>
              {chatInfo?.username && chatInfo?.name && <UserHandle>@{chatInfo.username}</UserHandle>}
            </UserInfo>
            {activeChatId && (
              <DeleteButton onClick={handleDeleteChat} title="Delete chat">
                <FaTrash />
              </DeleteButton>
            )}
          </Header>
          <MessagesContainer>
            {messages?.map((message, index) => {
              const msgData = message;
              
              const currentUserName = authUser?.username || authUser?.user?.username || authUser?.user__username || '';

              const isMe = message.isTemp || 
                           message.sentByMe ||
                           (currentUserName && msgData.username?.toLowerCase() === currentUserName.toLowerCase());

              const senderName = isMe ? (currentUserName || 'You') : (msgData.username || msgData.sender_name || 'User');

              const senderAvatar = msgData.avatar || (isMe 
                ? (authUser?.profileImg || authUser?.avatar || DEFAULT_AVATAR)
                : DEFAULT_AVATAR);

              const messageText = msgData.text || msgData.content || msgData.body || '';
              
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
              
              return (
                <MessageRow key={index} isMe={isMe}>
                  {!isMe && (
                    <SmallAvatar 
                      src={senderAvatar} 
                      alt={senderName} 
                      onError={(e) => { 
                        if (e.target.src !== DEFAULT_AVATAR) e.target.src = DEFAULT_AVATAR; 
                      }}
                    />
                  )}
                  <Message isMe={isMe}>
                    <SenderName isMe={isMe}>{senderName}</SenderName>
                    <MessageText>{messageText}</MessageText>
                    <MessageTime isMe={isMe}>
                      {formatTime(msgData.created_at)}
                      {isMe && msgData.is_read && <ReadMark> Seen</ReadMark>}
                    </MessageTime>
                  </Message>
                  {isMe && (
                    <SmallAvatar 
                      src={senderAvatar} 
                      alt={senderName} 
                      style={{ marginLeft: '8px', marginRight: 0 }} 
                      onError={(e) => { 
                        if (e.target.src !== DEFAULT_AVATAR) e.target.src = DEFAULT_AVATAR; 
                      }}
                    />
                  )}
                </MessageRow>
              );
            })}
            <div ref={messagesEndRef} />
          </MessagesContainer>
          <ChatInput onSendMessage={handleSendMessage} />
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

const SmallAvatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-right: 8px;
  object-fit: cover;
  flex-shrink: 0;
  align-self: flex-end;
  margin-bottom: 4px;
`;

const MessageRow = styled.div`
  display: flex;
  align-items: flex-end;
  margin: 4px 0;
  flex-direction: ${({ isMe }) => (isMe ? 'row' : 'row')};
  justify-content: ${({ isMe }) => (isMe ? 'flex-end' : 'flex-start')};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

import themeVars from 'views/styles/theme-vars';

const Username = styled.h2`
  margin: 0;
  color: ${themeVars.text};
  font-size: 1.1rem;
`;

const UserHandle = styled.span`
  color: #888;
  font-size: 0.85rem;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 8px;
  margin-left: auto;
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

const Message = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: white;
  padding: 10px 16px;
  background-color: ${({ isMe }) => (isMe ? '#0084ff' : '#3e4042')};
  border-radius: 18px;
  max-width: 75%;
  box-shadow: 0 1px 1px rgba(0,0,0,0.1);
  word-wrap: break-word;
`;

const SenderName = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  margin-bottom: 2px;
  opacity: 0.7;
  text-align: ${({ isMe }) => (isMe ? 'right' : 'left')};
`;

const MessageText = styled.div`
  font-size: 0.95rem;
  line-height: 1.35;
`;

const MessageTime = styled.div`
  font-size: 0.65rem;
  opacity: 0.6;
  margin-top: 4px;
  text-align: ${({ isMe }) => (isMe ? 'right' : 'left')};
`;

const ReadMark = styled.span`
  color: #34b7f1;
  font-weight: 600;
`;

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #333;
    border-radius: 10px;
  }
`;

export default ChatWindow;
