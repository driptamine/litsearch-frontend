import React, { useState } from 'react';
import styled from 'styled-components';

const Bar = styled.div`
  border-top: 1px solid #ccc;
  padding: 12px;
  display: flex;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 24px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

const SendButton = styled.button`
  margin-left: 8px;
  padding: 10px 16px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 24px;
`;

function InputBar({ onSend }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <Bar>
      <Input
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <SendButton onClick={handleSubmit}>Send</SendButton>
    </Bar>
  );
}

export default InputBar;
