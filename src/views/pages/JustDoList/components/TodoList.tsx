import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TodoItem from './TodoItem';

const TodoList = ({ todos, toggleTodo, deleteTodo, onUpdateTodo, onReorderTodos }) => {
  return (
    <DragDropContext onDragEnd={(result) => {
      if (!result.destination) return;
      const reordered = Array.from(todos);
      const [removed] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, removed);
      onReorderTodos(reordered);
    }}>
      <Droppable droppableId="todo-droppable">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {todos.map((todo, index) => (
              <Draggable key={todo.id} draggableId={String(todo.id)} index={index}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps}>
                    <TodoItem
                      todo={todo}
                      toggleTodo={toggleTodo}
                      deleteTodo={deleteTodo}
                      onUpdateTodo={onUpdateTodo}
                      dragHandleProps={provided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TodoList;
