import React, { useState } from 'react';
import styled from 'styled-components';
import MessageBubbleV1 from './MessageBubbleV1';


const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { from: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch(`http://localhost:8000/chats/gemini/?q=${encodeURIComponent(input)}`);
      const data = await res.json();

      const botMessage = {
        from: "bot",
        content: data.response || "No response from Gemini.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", content: `Error: ${err.message}` },
      ]);
    }
  };

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.map((msg, idx) => (
          <MessageBubbleV1 key={idx} from={msg.from} content={msg.content} />
        ))}
      </MessagesContainer>
      <InputContainer onSubmit={handleSubmit}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Gemini something..."
        />
        <Button type="submit">Send</Button>
      </InputContainer>
    </ChatContainer>
  );
}

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 90vh;
  max-width: 800px;
  margin: 0 auto;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #fafafa;
`;

const InputContainer = styled.form`
  display: flex;
  padding-bottom: 36px;
  background: #fff;
  border-top: 1px solid #ddd;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 12px 16px;
  margin-left: 8px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

export default ChatWindow;
