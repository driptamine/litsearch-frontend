// Note.js
import React from 'react';
import styled from 'styled-components';

const NoteContainer = styled.div`
  background: #fff8c6;
  padding: 15px;
  border-radius: 8px;
  position: relative;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ff5c5c;
  border: none;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  width: 24px;
  height: 24px;
  line-height: 0;
  font-weight: bold;

  &:hover {
    background: #e04b4b;
  }
`;

export default function Note({ note, deleteNote }) {
  return (
    <NoteContainer>
      {note.text}
      <DeleteButton onClick={() => deleteNote(note.id)}>×</DeleteButton>
    </NoteContainer>
  );
}
