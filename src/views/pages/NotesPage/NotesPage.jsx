import React, { useState, useEffect } from 'react';
import { styled } from '@linaria/react';
import { db } from 'core/db/db';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    db.notes.toArray().then(setNotes);
  }, []);

  const save = async (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;
    const now = new Date().toISOString();

    if (editingId) {
      await db.notes.update(editingId, { title: title.trim(), content: content.trim(), updatedAt: now });
      setNotes(prev => prev.map(n => n.id === editingId ? { ...n, title: title.trim(), content: content.trim(), updatedAt: now } : n));
      setEditingId(null);
    } else {
      const id = await db.notes.add({ title: title.trim(), content: content.trim(), createdAt: now, updatedAt: now });
      setNotes(prev => [...prev, { id, title: title.trim(), content: content.trim(), createdAt: now, updatedAt: now }]);
    }
    setTitle('');
    setContent('');
  };

  const edit = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const remove = async (id) => {
    await db.notes.delete(id);
    setNotes(prev => prev.filter(n => n.id !== id));
    if (editingId === id) { setEditingId(null); setTitle(''); setContent(''); }
  };

  const cancel = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
  };

  return (
    <Container>
      <Header>{editingId ? 'Edit Note' : 'Notes'}</Header>
      <Form onSubmit={save}>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" />
        <TextArea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write something..." rows={5} />
        <ButtonRow>
          {editingId && <CancelBtn type="button" onClick={cancel}>Cancel</CancelBtn>}
          <SaveBtn type="submit">{editingId ? 'Update' : 'Add Note'}</SaveBtn>
        </ButtonRow>
      </Form>
      <NotesList>
        {notes.map(note => (
          <Note key={note.id}>
            <NoteHeader>
              <NoteTitle>{note.title}</NoteTitle>
              <Actions>
                <EditBtn onClick={() => edit(note)}>Edit</EditBtn>
                <DelBtn onClick={() => remove(note.id)}>×</DelBtn>
              </Actions>
            </NoteHeader>
            <NoteContent>{note.content}</NoteContent>
            <NoteDate>{new Date(note.updatedAt || note.createdAt).toLocaleDateString()}</NoteDate>
          </Note>
        ))}
      </NotesList>
    </Container>
  );
};

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.h1`
  color: var(--text);
  font-size: 24px;
  margin: 0 0 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
  background: var(--cardBg, #1e1e1e);
  padding: 16px;
  border-radius: 12px;
`;

const Input = styled.input`
  background: var(--inputBg, #2a2a2a);
  border: 1px solid var(--border, #444);
  border-radius: 8px;
  padding: 10px 12px;
  color: var(--text);
  font-size: 14px;
  outline: none;
  &:focus { border-color: var(--accent, #0084ff); }
`;

const TextArea = styled.textarea`
  background: var(--inputBg, #2a2a2a);
  border: 1px solid var(--border, #444);
  border-radius: 8px;
  padding: 10px 12px;
  color: var(--text);
  font-size: 14px;
  outline: none;
  resize: vertical;
  font-family: inherit;
  &:focus { border-color: var(--accent, #0084ff); }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const SaveBtn = styled.button`
  background: var(--accent, #0084ff);
  border: none;
  color: #fff;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  &:hover { opacity: 0.85; }
`;

const CancelBtn = styled.button`
  background: transparent;
  border: 1px solid var(--border, #444);
  color: var(--text);
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
`;

const NotesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Note = styled.div`
  background: var(--cardBg, #1e1e1e);
  padding: 14px;
  border-radius: 8px;
`;

const NoteHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const NoteTitle = styled.strong`
  color: var(--text);
  font-size: 15px;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EditBtn = styled.button`
  background: none;
  border: none;
  color: var(--accent, #0084ff);
  cursor: pointer;
  font-size: 13px;
  padding: 0;
`;

const DelBtn = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
`;

const NoteContent = styled.p`
  color: var(--textSecondary, #888);
  font-size: 13px;
  margin: 0 0 6px;
  white-space: pre-wrap;
`;

const NoteDate = styled.span`
  color: var(--textSecondary, #888);
  font-size: 11px;
`;

export default NotesPage;
