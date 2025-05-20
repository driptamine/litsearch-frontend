// https://chatgpt.com/c/66f88cfe-b214-800c-90ee-b1b63e8d93ce
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
// import chatsData from 'views/pages/ChatV3/chats.json';
import chatsData from 'views/pages/ChatV3/chatsV2.json';
import ChatInput from 'views/pages/ChatV3/Main/ChatInput';

const ChatWindow = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const user = chatsData.users.find((user) => user.id === parseInt(userId));

  useEffect(() => {
    if (userId) {
      setMessages(chatsData.messages[userId]);
    }
  }, [userId]);

  return (
    <ChatWindowContainer>
      {user ? (
        <>
          <h2>{user.first_name}</h2>
          <MessagesContainer>
            {messages?.map((message, index) => (
              <Message key={index} sender={message.sender}>
                <strong>{message.sender}: </strong>

                {message.text}
              </Message>
            ))}
          </MessagesContainer>
          <ChatInput />
        </>
      ) : (
        <h2>Select a user to start chatting</h2>
      )}

    </ChatWindowContainer>
  );
};


const ChatWindowContainer = styled.div`
  width: 70%;
  background-color: ${(props) => props.theme.navBg};;

  padding: 20px;
  box-sizing: border-box;
  padding-bottom: 10px;
`;

const Message = styled.div`
  font-family: system-ui;
  color: white;
  margin: 10px 0;
  padding: 10px;
  background-color: ${({ sender }) => (sender === 'You' ? '#3f51b5' : '#2f2f2f')};
  border-radius: 8px;
  max-width: 60%;
  align-self: ${({ sender }) => (sender === 'You' ? 'flex-end' : 'flex-start')};
`;

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default ChatWindow;
