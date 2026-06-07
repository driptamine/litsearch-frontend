import React, { useState } from 'react';
import { styled } from '@linaria/react';
import { IoSend } from 'react-icons/io5';

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
      <SendButton onClick={handleSend} disabled={!message.trim()}>
        <IoSend size={20} />
      </SendButton>
    </ChatInputContainer>
  );
};


const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid #434343;
  background-color: #1a1a1a;
  border-radius: 0 0 10px 10px;
`;

const Input = styled.input`
  color: white;
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #333;
  border-radius: 24px;
  font-size: 15px;
  outline: none;
  background-color: #2a2a2a;
  transition: border-color 0.2s;

  &:focus {
    border-color: #009688;
  }

  &::placeholder {
    color: #888;
  }
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  margin-left: 12px;
  border: none;
  border-radius: 50%;
  background-color: #009688;
  color: white;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #00796b;
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    background-color: #444;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export default ChatInput;
