import React, { useState } from 'react';
import styled from 'styled-components';


const AddTodo = ({ addTodo }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add new task..."
      />
      <Button type="submit">Add</Button>
    </Form>
  );
};


const Form = styled.form`
  display: flex;
  margin-bottom: 1rem;
  background: #00000040;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  margin-left: 1rem;
  background-color: #696eb7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export default AddTodo;
