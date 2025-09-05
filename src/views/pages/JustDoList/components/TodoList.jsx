import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ todos, toggleTodo, deleteTodo }) => {
  return (
    <div>
      {todos.map((todo, index) => (
        <TodoItem
          key={index}
          index={index}
          todo={todo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
        />
      ))}
    </div>
  );
};

export default TodoList;
