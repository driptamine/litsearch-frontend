// NoteApp.js
import React, { useState } from 'react';
import styled from 'styled-components';
import NoteList from './NoteList';
import AddNoteForm from './AddNoteForm';

const AppContainer = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: #fefefe;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

export default function NoteApp() {
  const [notes, setNotes] = useState([]);

  const addNote = (text) => {
    setNotes([{ id: Date.now(), text }, ...notes]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <AppContainer>
      <h1>My Notes</h1>
      <AddNoteForm addNote={addNote} />
      <NoteList notes={notes} deleteNote={deleteNote} />
    </AppContainer>
  );
}
