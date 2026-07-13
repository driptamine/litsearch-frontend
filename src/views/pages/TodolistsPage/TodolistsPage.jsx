import React, { useState, useEffect } from 'react';
import { styled } from '@linaria/react';
import { db } from 'core/db/db';

const TodolistsPage = () => {
  const [lists, setLists] = useState([]);
  const [todos, setTodos] = useState([]);
  const [newListTitle, setNewListTitle] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [activeListId, setActiveListId] = useState(null);

  useEffect(() => {
    db.todolists.toArray().then(setLists);
    db.todos.toArray().then(setTodos);
  }, []);

  const addList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    const now = new Date().toISOString();
    const id = await db.todolists.add({ title: newListTitle.trim(), createdAt: now, updatedAt: now });
    setLists(prev => [...prev, { id, title: newListTitle.trim(), createdAt: now, updatedAt: now }]);
    setNewListTitle('');
  };

  const deleteList = async (id) => {
    await db.todolists.delete(id);
    setLists(prev => prev.filter(l => l.id !== id));
    if (activeListId === id) setActiveListId(null);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim() || !activeListId) return;
    const now = new Date().toISOString();
    const id = await db.todos.add({ title: newTodoTitle.trim(), completed: 0, todolistId: activeListId, createdAt: now, updatedAt: now });
    setTodos(prev => [...prev, { id, title: newTodoTitle.trim(), completed: 0, todolistId: activeListId, createdAt: now, updatedAt: now }]);
    setNewTodoTitle('');
  };

  const toggle = async (todo) => {
    const completed = todo.completed ? 0 : 1;
    await db.todos.update(todo.id, { completed, updatedAt: new Date().toISOString() });
    setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, completed } : t));
  };

  const deleteTodo = async (id) => {
    await db.todos.delete(id);
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const activeTodos = todos.filter(t => t.todolistId === activeListId);
  const activeList = lists.find(l => l.id === activeListId);

  return (
    <Container>
      <Header>To-Do Lists</Header>

      <Form onSubmit={addList}>
        <Input value={newListTitle} onChange={(e) => setNewListTitle(e.target.value)} placeholder="New list name..." />
        <AddBtn type="submit">Add List</AddBtn>
      </Form>

      <ListsRow>
        {lists.map(list => (
          <ListTab key={list.id} active={activeListId === list.id} onClick={() => setActiveListId(list.id)}>
            {list.title}
            <ListDel onClick={(e) => { e.stopPropagation(); deleteList(list.id); }}>×</ListDel>
          </ListTab>
        ))}
      </ListsRow>

      {activeList ? (
        <>
          <ListHeader>{activeList.title}</ListHeader>
          <Form onSubmit={addTodo}>
            <Input value={newTodoTitle} onChange={(e) => setNewTodoTitle(e.target.value)} placeholder="Add a todo..." />
            <AddBtn type="submit">Add</AddBtn>
          </Form>
          <List>
            {activeTodos.map(todo => (
              <Item key={todo.id}>
                <Checkbox type="checkbox" checked={!!todo.completed} onChange={() => toggle(todo)} />
                <Title done={!!todo.completed}>{todo.title}</Title>
                <DelBtn onClick={() => deleteTodo(todo.id)}>×</DelBtn>
              </Item>
            ))}
          </List>
        </>
      ) : (
        <Placeholder>Select or create a list to get started</Placeholder>
      )}
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
  gap: 8px;
  margin-bottom: 16px;
`;

const Input = styled.input`
  flex: 1;
  background: var(--inputBg, #2a2a2a);
  border: 1px solid var(--border, #444);
  border-radius: 8px;
  padding: 10px 12px;
  color: var(--text);
  font-size: 14px;
  outline: none;
  &:focus { border-color: var(--accent, #0084ff); }
`;

const AddBtn = styled.button`
  background: var(--accent, #0084ff);
  border: none;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
  &:hover { opacity: 0.85; }
`;

const ListsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 20px;
`;

const ListTab = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 20px;
  border: 1px solid var(--border, #444);
  background: ${({ active }) => active ? 'var(--accent, #0084ff)' : 'transparent'};
  color: ${({ active }) => active ? '#fff' : 'var(--text)'};
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  &:hover { opacity: 0.85; }
`;

const ListDel = styled.span`
  font-size: 16px;
  line-height: 1;
  color: inherit;
  opacity: 0.6;
  &:hover { opacity: 1; }
`;

const ListHeader = styled.h2`
  color: var(--text);
  font-size: 18px;
  margin: 0 0 12px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--cardBg, #1e1e1e);
  padding: 10px 12px;
  border-radius: 8px;
`;

const Checkbox = styled.input`
  accent-color: var(--accent, #0084ff);
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const Title = styled.span`
  flex: 1;
  color: var(--text);
  font-size: 14px;
  text-decoration: ${({ done }) => done ? 'line-through' : 'none'};
  opacity: ${({ done }) => done ? 0.5 : 1};
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

const Placeholder = styled.p`
  text-align: center;
  color: var(--textSecondary, #888);
  padding: 40px;
`;

export default TodolistsPage;
