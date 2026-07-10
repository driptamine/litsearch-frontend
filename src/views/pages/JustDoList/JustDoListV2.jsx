import React, { useState, useEffect, useCallback } from 'react';
import { styled } from '@linaria/react';
import axios from 'axios';
import ListSidebar from './components/ListSidebar';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import UploadInput from './components/UploadInput';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';
import { db, dbReady } from 'core/db/db';

const JustDoListV2 = () => {
  const [todos, setTodos] = useState([]);
  const [lists, setLists] = useState([]);
  const [activeListId, setActiveListId] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedImage = localStorage.getItem('backgroundImage');
    if (savedImage) setBackgroundImage(savedImage);
  }, []);

  useEffect(() => {
    if (backgroundImage) {
      localStorage.setItem('backgroundImage', backgroundImage);
    }
  }, [backgroundImage]);

  const fetchData = useCallback(async () => {
    await dbReady;
    try {
      const cached = await db.todos.toArray();
      const cachedLists = await db.todolists.toArray();
      if (cached.length) setTodos(cached);
      if (cachedLists.length) setLists(cachedLists);
    } catch {}

    try {
      const headers = authHeader();
      const [todosRes, listsRes] = await Promise.all([
        axios.get(`${LITLOOP_API_URL}/todos/all`, { headers }),
        axios.get(`${LITLOOP_API_URL}/todos/lists/`, { headers }),
      ]);
      const todosData = todosRes.data.todos || [];
      if (todosRes.data.background_image_url) {
        setBackgroundImage(todosRes.data.background_image_url);
      }
      setTodos(todosData);
      setLists(listsRes.data || []);
      try {
        const now = new Date().toISOString();
        await db.todos.clear();
        await db.todolists.clear();
        await db.todos.bulkAdd(todosData.map(t => ({ ...t, apiId: t.id, createdAt: now, updatedAt: now })));
        await db.todolists.bulkAdd((listsRes.data || []).map(l => ({ ...l, apiId: l.id, createdAt: now, updatedAt: now })));
      } catch {}
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectList = (listId) => {
    setActiveListId(listId);
  };

  const handleUploadSuccess = (imageUrl) => {
    setBackgroundImage(imageUrl);
  };

  const handleCreateList = async (name) => {
    const now = new Date().toISOString();
    let tempId = null;
    let optimistic = null;
    try {
      tempId = await db.todolists.add({ title: name, name, apiId: null, createdAt: now, updatedAt: now });
      optimistic = { id: `temp_${tempId}`, title: name, name };
      setLists(prev => [...prev, optimistic]);
    } catch {}

    try {
      const res = await axios.post(
        `${LITLOOP_API_URL}/todos/lists/create/`,
        { name },
        { headers: authHeader() }
      );
      setLists(prev => prev.map(l => l.id === optimistic?.id ? res.data : l));
      try { if (tempId) await db.todolists.update(tempId, { apiId: res.data.id, title: res.data.name, name: res.data.name, updatedAt: now }); } catch {}
    } catch (err) {
      console.error('Failed to create list:', err);
    }
  };

  const handleDeleteList = async (listId) => {
    setLists(prev => prev.filter(l => l.id !== listId));
    if (activeListId === listId) setActiveListId(null);
    try {
      const record = await db.todolists.where('apiId').equals(listId).first();
      if (record) await db.todolists.delete(record.id);
    } catch {}
    try {
      await axios.delete(`${LITLOOP_API_URL}/todos/lists/${listId}/delete/`, {
        headers: authHeader(),
      });
    } catch (err) {
      console.error('Failed to delete list:', err);
    }
  };

  const handleUpdateList = async (listId, name) => {
    const now = new Date().toISOString();
    setLists(prev => prev.map(l => l.id === listId ? { ...l, name } : l));
    try {
      const record = await db.todolists.where('apiId').equals(listId).first();
      if (record) await db.todolists.update(record.id, { title: name, name, updatedAt: now });
    } catch {}
    try {
      const res = await axios.put(
        `${LITLOOP_API_URL}/todos/lists/${listId}/update/`,
        { name },
        { headers: authHeader() }
      );
      setLists(prev => prev.map(l => l.id === listId ? res.data : l));
    } catch (err) {
      console.error('Failed to update list:', err);
    }
  };

  const handleReorderTodos = async (reordered) => {
    setTodos(reordered);
    try {
      const now = new Date().toISOString();
      for (let i = 0; i < reordered.length; i++) {
        const record = await db.todos.where('apiId').equals(reordered[i].id).first();
        if (record) await db.todos.update(record.id, { order: i, updatedAt: now });
      }
    } catch {}
    const items = reordered.map((t, i) => ({ id: t.id, order: i }));
    try {
      await axios.post(`${LITLOOP_API_URL}/todos/reorder/`, { items }, { headers: authHeader() });
    } catch (err) {
      console.error('Failed to reorder todos:', err);
    }
  };

  const handleReorderLists = async (reordered) => {
    setLists(reordered);
    try {
      const now = new Date().toISOString();
      for (let i = 0; i < reordered.length; i++) {
        const record = await db.todolists.where('apiId').equals(reordered[i].id).first();
        if (record) await db.todolists.update(record.id, { order: i, updatedAt: now });
      }
    } catch {}
    const items = reordered.map((lst, i) => ({ id: lst.id, order: i }));
    try {
      await axios.post(`${LITLOOP_API_URL}/todos/lists/reorder/`, { items }, { headers: authHeader() });
    } catch (err) {
      console.error('Failed to reorder lists:', err);
    }
  };

  const addTodo = async (text) => {
    const now = new Date().toISOString();
    let tempId = null;
    let optimistic = null;
    try {
      tempId = await db.todos.add({ title: text, completed: false, todolistId: activeListId, apiId: null, createdAt: now, updatedAt: now });
      optimistic = { id: `temp_${tempId}`, title: text, completed: false, todo_list: activeListId };
      setTodos(prev => [...prev, optimistic]);
    } catch {}

    try {
      const res = await axios.post(
        `${LITLOOP_API_URL}/todos/create/`,
        { title: text, completed: false, todo_list: activeListId },
        { headers: authHeader() }
      );
      setTodos(prev => prev.map(t => t.id === optimistic?.id ? res.data : t));
      try { if (tempId) await db.todos.update(tempId, { apiId: res.data.id, title: res.data.title, completed: res.data.completed, updatedAt: now }); } catch {}
    } catch (err) {
      console.error('Failed to create todo:', err);
    }
  };

  const handleUpdateTodo = async (id, title) => {
    const now = new Date().toISOString();
    setTodos(prev => prev.map(t => t.id === id ? { ...t, title } : t));
    try {
      const record = await db.todos.where('apiId').equals(id).first();
      if (record) await db.todos.update(record.id, { title, updatedAt: now });
    } catch {}
    try {
      const res = await axios.put(
        `${LITLOOP_API_URL}/todos/${id}/update/`,
        { title },
        { headers: authHeader() }
      );
      setTodos(prev => prev.map(t => t.id === id ? res.data : t));
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  };

  const toggleTodo = async (id, completed) => {
    const now = new Date().toISOString();
    const nextCompleted = !completed;
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: nextCompleted } : t));
    try {
      const record = await db.todos.where('apiId').equals(id).first();
      if (record) await db.todos.update(record.id, { completed: nextCompleted, updatedAt: now });
    } catch {}
    try {
      const res = await axios.put(
        `${LITLOOP_API_URL}/todos/${id}/update/`,
        { completed: nextCompleted },
        { headers: authHeader() }
      );
      setTodos(prev => prev.map(t => t.id === id ? res.data : t));
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  };

  const deleteTodo = async (id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
    try {
      const record = await db.todos.where('apiId').equals(id).first();
      if (record) await db.todos.delete(record.id);
    } catch {}
    try {
      await axios.delete(`${LITLOOP_API_URL}/todos/${id}/delete/`, {
        headers: authHeader(),
      });
    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  };

  const filteredTodos = activeListId === 'completed'
    ? todos.filter(t => t.completed)
    : activeListId
      ? todos.filter(t => t.todo_list === activeListId)
      : todos;

  if (loading) return null;

  return (
    <AppWrapper backgroundImage={backgroundImage}>
      <ContentContainer>
        <AddTodo addTodo={addTodo} />
        <TodoList todos={filteredTodos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} onUpdateTodo={handleUpdateTodo} onReorderTodos={handleReorderTodos} />
      </ContentContainer>
      <ListSidebar
        lists={lists}
        activeListId={activeListId}
        onSelectList={handleSelectList}
        onCreateList={handleCreateList}
        onDeleteList={handleDeleteList}
        onUpdateList={handleUpdateList}
        onReorderLists={handleReorderLists}
      >
        <UploadInput onUploadSuccess={handleUploadSuccess} />
      </ListSidebar>
    </AppWrapper>
  );
};

const AppWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background-image: ${({ backgroundImage }) => backgroundImage ? `url(${backgroundImage})` : 'none'};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  width: 95%;
  max-width: 800px;
  margin: 20px auto;
  padding: 1.5rem;
  border-radius: 8px;

  @media screen and (max-width: 480px) {
    padding: 1rem;
    margin: 10px auto;
  }
`;

export default JustDoListV2;
