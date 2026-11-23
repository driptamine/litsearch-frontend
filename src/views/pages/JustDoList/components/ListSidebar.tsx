import React, { useState } from 'react';
import { styled } from '@linaria/react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';


const ListSidebar = ({ lists, activeListId, onSelectList, onCreateList, onDeleteList, onUpdateList, onReorderLists, children }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [menuListId, setMenuListId] = useState(null);
  const [editList, setEditList] = useState(null);
  const [editListName, setEditListName] = useState('');

  React.useEffect(() => {
    if (menuListId === null) return;
    const handler = () => setMenuListId(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [menuListId]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    onCreateList(newListName.trim());
    setNewListName('');
    setModalOpen(false);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (!editListName.trim()) return;
    onUpdateList(editList.id, editListName.trim());
    setEditList(null);
    setEditListName('');
  };

  const openEdit = (lst) => {
    setMenuListId(null);
    setEditList(lst);
    setEditListName(lst.name);
  };

  return (
    <SidebarContainer>
      <TopSection>
        <SectionLabel>Filters</SectionLabel>
        <NavItem active={activeListId === null} onClick={() => onSelectList(null)}>
          All
        </NavItem>
        <NavItem active={activeListId === 'completed'} onClick={() => onSelectList('completed')}>
          Completed
        </NavItem>

        <SectionLabel>Lists</SectionLabel>
        <DragDropContext onDragEnd={(result) => {
          if (!result.destination) return;
          const reordered = Array.from(lists);
          const [removed] = reordered.splice(result.source.index, 1);
          reordered.splice(result.destination.index, 0, removed);
          onReorderLists(reordered);
        }}>
          <Droppable droppableId="list-droppable">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {lists.map((lst, index) => (
                  <Draggable key={lst.id} draggableId={String(lst.id)} index={index}>
                    {(provided) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <NavItem active={activeListId === lst.id} onClick={() => onSelectList(lst.id)}>
                          {lst.name}
                        </NavItem>
                        <MenuBtn onClick={(e) => { e.stopPropagation(); setMenuListId(menuListId === lst.id ? null : lst.id); }}>⋮</MenuBtn>
                        {menuListId === lst.id && (
                          <Dropdown onClick={(e) => e.stopPropagation()}>
                            <DropdownItem onClick={() => openEdit(lst)}>Edit</DropdownItem>
                            <DropdownItem onClick={() => { onDeleteList(lst.id); setMenuListId(null); }}>Delete</DropdownItem>
                          </Dropdown>
                        )}
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </TopSection>

      <BottomSection>
        <PlusButton onClick={() => setModalOpen(true)}>+</PlusButton>
        {children}
      </BottomSection>

      {modalOpen && (
        <Overlay onClick={() => setModalOpen(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Create List</ModalTitle>
            <Form onSubmit={handleCreate}>
              <Input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="List name..."
                autoFocus
              />
              <ModalActions>
                <CancelBtn type="button" onClick={() => setModalOpen(false)}>Cancel</CancelBtn>
                <CreateBtn type="submit">Create</CreateBtn>
              </ModalActions>
            </Form>
          </Modal>
        </Overlay>
      )}

      {editList && (
        <Overlay onClick={() => { setEditList(null); setEditListName(''); }}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Edit List</ModalTitle>
            <Form onSubmit={handleEdit}>
              <Input
                type="text"
                value={editListName}
                onChange={(e) => setEditListName(e.target.value)}
                placeholder="List name..."
                autoFocus
              />
              <ModalActions>
                <CancelBtn type="button" onClick={() => { setEditList(null); setEditListName(''); }}>Cancel</CancelBtn>
                <CreateBtn type="submit">Save</CreateBtn>
              </ModalActions>
            </Form>
          </Modal>
        </Overlay>
      )}
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  width: 220px;
  position: sticky;
  top: 0;
  height: 90vh;
  // background-color: #3f51b5;
  background-color: #38489e14;
  color: #fff;
  padding: 2rem 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 768px) {
    width: 100%;
    height: auto;
    padding: 1rem;
    position: static;
  }
`;

const TopSection = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
`;

const BottomSection = styled.div`
  padding-top: 1rem;
  border-top: 1px solid rgba(255,255,255,0.2);
  flex-shrink: 0;
`;

const Logo = styled.h2`
  margin-bottom: 2rem;
  font-weight: bold;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: grab;
  position: relative;
`;

const NavItem = styled.div`
  flex: 1;
  padding: 0.3rem 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  background: ${({ active }) => active ? 'rgba(255,255,255,0.2)' : 'transparent'};
  &:hover {
    background: rgba(255,255,255,0.1);
  }
`;

const MenuBtn = styled.button`
  background: none;
  border: none;
  color: rgba(255,255,255,0.5);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  letter-spacing: 0;
  &:hover {
    color: #fff;
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

const SectionLabel = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.7;
  margin: 1rem 0 0.5rem;
`;

const PlusButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  background: #5c6bc0;
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  margin: 0.5rem 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  &:hover {
    background: #7986cb;
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

export default ListSidebar;
