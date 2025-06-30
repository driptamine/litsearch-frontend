// NoteList.js
import React from 'react';
import styled from 'styled-components';
import Note from './Note';

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default function NoteList({ notes, deleteNote }) {
  return (
    <List>
      {notes.map((note) => (
        <Note key={note.id} note={note} deleteNote={deleteNote} />
      ))}
    </List>
  );
}
