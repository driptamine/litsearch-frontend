import React, { useState, useEffect, useCallback } from 'react';
import { styled } from '@linaria/react';
import axios from 'axios';
import ListSidebar from './components/ListSidebar';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import UploadInput from './components/UploadInput';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';

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
    try {
      const headers = authHeader();
      const [todosRes, listsRes] = await Promise.all([
        axios.get(`${LITLOOP_API_URL}/todos/all`, { headers }),
        axios.get(`${LITLOOP_API_URL}/todos/lists/`, { headers }),
      ]);
      setTodos(todosRes.data.todos || []);
      if (todosRes.data.background_image_url) {
        setBackgroundImage(todosRes.data.background_image_url);
      }
      setLists(listsRes.data || []);
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
    try {
      const res = await axios.post(
        `${LITLOOP_API_URL}/todos/lists/create/`,
        { name },
        { headers: authHeader() }
      );
      setLists([...lists, res.data]);
    } catch (err) {
      console.error('Failed to create list:', err);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      await axios.delete(`${LITLOOP_API_URL}/todos/lists/${listId}/delete/`, {
        headers: authHeader(),
      });
      setLists(lists.filter(l => l.id !== listId));
      if (activeListId === listId) setActiveListId(null);
    } catch (err) {
      console.error('Failed to delete list:', err);
    }
  };

  const handleUpdateList = async (listId, name) => {
    try {
      const res = await axios.put(
        `${LITLOOP_API_URL}/todos/lists/${listId}/update/`,
        { name },
        { headers: authHeader() }
      );
      setLists(lists.map(l => l.id === listId ? res.data : l));
    } catch (err) {
      console.error('Failed to update list:', err);
    }
  };

  const handleReorderTodos = async (reordered) => {
    setTodos(reordered);
    const items = reordered.map((t, i) => ({ id: t.id, order: i }));
    try {
      await axios.post(`${LITLOOP_API_URL}/todos/reorder/`, { items }, { headers: authHeader() });
    } catch (err) {
      console.error('Failed to reorder todos:', err);
    }
  };

  const handleReorderLists = async (reordered) => {
    setLists(reordered);
    const items = reordered.map((lst, i) => ({ id: lst.id, order: i }));
    try {
      await axios.post(`${LITLOOP_API_URL}/todos/lists/reorder/`, { items }, { headers: authHeader() });
    } catch (err) {
      console.error('Failed to reorder lists:', err);
    }
  };

  const addTodo = async (text) => {
    try {
      const res = await axios.post(
        `${LITLOOP_API_URL}/todos/create/`,
        { title: text, completed: false, todo_list: activeListId },
        { headers: authHeader() }
      );
      setTodos([...todos, res.data]);
    } catch (err) {
      console.error('Failed to create todo:', err);
    }
  };

  const handleUpdateTodo = async (id, title) => {
    try {
      const res = await axios.put(
        `${LITLOOP_API_URL}/todos/${id}/update/`,
        { title },
        { headers: authHeader() }
      );
      setTodos(todos.map(t => t.id === id ? res.data : t));
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const res = await axios.put(
        `${LITLOOP_API_URL}/todos/${id}/update/`,
        { completed: !completed },
        { headers: authHeader() }
      );
      setTodos(todos.map(t => t.id === id ? res.data : t));
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${LITLOOP_API_URL}/todos/${id}/delete/`, {
        headers: authHeader(),
      });
      setTodos(todos.filter(t => t.id !== id));
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
