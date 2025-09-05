import React from 'react';
import styled, { css } from 'styled-components';


const TodoItem = ({ todo, index, toggleTodo, deleteTodo }) => {
  return (
    <Item>
      <LeftSide>
        <Checkbox
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(index)}
        />
        <Text completed={todo.completed}>{todo.text}</Text>
      </LeftSide>
      <DeleteButton onClick={() => deleteTodo(index)}>×</DeleteButton>
    </Item>
  );
};


const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: #ffffffa6;
  margin-bottom: 9px;
  border-radius: 8px;
`;

const LeftSide = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  cursor: pointer;
  transform: scale(1.2);
`;

const Text = styled.span`

  color: #595959;
  ${(props) =>
    props.completed &&
    css`
      text-decoration: line-through;
      color: #595959;
    `}

`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #595959;
  font-weight: bold;
  cursor: pointer;
  font-size: 1.2rem;
`;

export default TodoItem;
