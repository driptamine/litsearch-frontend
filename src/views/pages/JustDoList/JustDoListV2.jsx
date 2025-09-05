import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';


const JustDoListV2 = () => {
  const [todos, setTodos] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);

  // Load saved wallpaper from localStorage on mount
  useEffect(() => {
    const savedImage = localStorage.getItem('backgroundImage');
    if (savedImage) {
      setBackgroundImage(savedImage);
    }
  }, []);

  // Save wallpaper to localStorage when it changes
  useEffect(() => {
    if (backgroundImage) {
      localStorage.setItem('backgroundImage', backgroundImage);
    }
  }, [backgroundImage]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(imageUrl);
    }
  };

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
    <AppWrapper backgroundImage={backgroundImage}>
      <ContentContainer>
      <AddTodo addTodo={addTodo} />
        {/*<Title>My Tasks</Title>*/}


        <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
      </ContentContainer>
      <Sidebar>
        <UploadInput
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </Sidebar>
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
`;

const ContentContainer = styled.div`
  flex: 1;
  max-width: 800px;
  margin: 50px auto;
  padding: 2rem;

  border-radius: 8px;
`;

const Title = styled.h1`
  color: #333;
`;

const UploadInput = styled.input`
  margin-bottom: 1rem;
`;

export default JustDoListV2;
