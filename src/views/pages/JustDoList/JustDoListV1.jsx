import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';

const AppWrapper = styled.div`
  display: flex;
`;

const ContentContainer = styled.div`
  flex: 1;
  max-width: 800px;
  margin: 50px auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #333;
`;

const JustDoList = () => {
  const [todos, setTodos] = useState([]);

  const addTodo = (text) => {
    setTodos([...todos, { text, completed: false }]);
  };

  const toggleTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const deleteTodo = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  return (
    <AppWrapper>

      <ContentContainer>
        <Title>My Tasks</Title>
        <AddTodo addTodo={addTodo} />
        <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
      </ContentContainer>
      <Sidebar />
    </AppWrapper>
  );
};

export default JustDoList;
