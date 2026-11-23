import React, { useState, useEffect } from 'react';
import { styled } from '@linaria/react';
import { css } from '@linaria/core';


const TodoItem = ({ todo, toggleTodo, deleteTodo, onUpdateTodo, dragHandleProps }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    if (!menuOpen) return;
    const handler = () => setMenuOpen(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [menuOpen]);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    onUpdateTodo(todo.id, editTitle.trim());
    setEditOpen(false);
    setEditTitle('');
  };

  return (
    <>
      <Item {...dragHandleProps}>
        <LeftSide>
          <Checkbox
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id, todo.completed)}
          />
          <Text completed={todo.completed}>{todo.title}</Text>
        </LeftSide>
        <RightSide>
          <MenuBtn onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}>⋮</MenuBtn>
          {menuOpen && (
            <Dropdown onClick={(e) => e.stopPropagation()}>
              <DropdownItem onClick={() => { setEditTitle(todo.title); setEditOpen(true); setMenuOpen(false); }}>Edit</DropdownItem>
              <DropdownItem onClick={() => { deleteTodo(todo.id); setMenuOpen(false); }}>Delete</DropdownItem>
            </Dropdown>
          )}
        </RightSide>
      </Item>

      {editOpen && (
        <Overlay onClick={() => { setEditOpen(false); setEditTitle(''); }}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Edit Todo</ModalTitle>
            <Form onSubmit={handleEditSubmit}>
              <Input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Todo title..."
                autoFocus
              />
              <ModalActions>
                <CancelBtn type="button" onClick={() => { setEditOpen(false); setEditTitle(''); }}>Cancel</CancelBtn>
                <CreateBtn type="submit">Save</CreateBtn>
              </ModalActions>
            </Form>
          </Modal>
        </Overlay>
      )}
    </>
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
  cursor: grab;
`;

const LeftSide = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RightSide = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Checkbox = styled.input`
  cursor: pointer;
  transform: scale(1.2);
`;

const textStyles = props => props.completed ? css`
  text-decoration: line-through;
  color: #595959;
` : '';

const Text = styled.span`
  color: #595959;
  ${textStyles}
`;

const MenuBtn = styled.button`
  background: none;
  border: none;
  color: #595959;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  letter-spacing: 0;
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background: #fff;
  color: #333;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  z-index: 100;
  min-width: 100px;
  overflow: hidden;
`;

const DropdownItem = styled.div`
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover {
    background: #f0f0f0;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: #fff;
  color: #333;
  border-radius: 8px;
  padding: 1.5rem;
  width: 320px;
  max-width: 90vw;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
`;

const ModalTitle = styled.h3`
  margin: 0 0 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const CancelBtn = styled.button`
  padding: 0.4rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f5f5f5;
  cursor: pointer;
`;

const CreateBtn = styled.button`
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 4px;
  background: #3f51b5;
  color: #fff;
  cursor: pointer;
`;

export default TodoItem;
