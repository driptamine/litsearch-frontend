import React, { useState, useEffect } from 'react';
import { styled } from '@linaria/react';
import { db } from 'core/db/db';

const TodosPage = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    db.todos.toArray().then(setTodos);
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const now = new Date().toISOString();
    const id = await db.todos.add({ title: title.trim(), completed: 0, createdAt: now, updatedAt: now });
    setTodos(prev => [...prev, { id, title: title.trim(), completed: 0, createdAt: now, updatedAt: now }]);
    setTitle('');
  };

  const toggle = async (todo) => {
    const completed = todo.completed ? 0 : 1;
    await db.todos.update(todo.id, { completed, updatedAt: new Date().toISOString() });
    setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, completed } : t));
  };

  const remove = async (id) => {
    await db.todos.delete(id);
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  return (
    <Container>
      <Header>To-Dos</Header>
      <Form onSubmit={addTodo}>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a todo..." />
        <AddBtn type="submit">Add</AddBtn>
      </Form>
      <List>
        {todos.map(todo => (
          <Item key={todo.id}>
            <Checkbox type="checkbox" checked={!!todo.completed} onChange={() => toggle(todo)} />
            <Title done={!!todo.completed}>{todo.title}</Title>
            <DeleteBtn onClick={() => remove(todo.id)}>×</DeleteBtn>
          </Item>
        ))}
      </List>
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
  margin-bottom: 20px;
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
  &:hover { opacity: 0.85; }
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

const DeleteBtn = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
`;

export default TodosPage;
