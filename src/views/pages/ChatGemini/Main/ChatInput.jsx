import React, { useState } from 'react';
import styled from 'styled-components';

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <ChatInputContainer>
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
      />
      <SendButton onClick={handleSend}>Send</SendButton>
    </ChatInputContainer>
  );
};


const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #434343;
  background-color: #141414;
`;
const Input = styled.input`
  /* color: ${(props) => props.theme.text}; */
  color: white;
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  outline: none;
  background-color: #343539;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;
const SendButton = styled.button`
  padding: 10px 15px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  background-color: #009688;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

export default ChatInput;
