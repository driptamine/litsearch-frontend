import React, { useState, useRef, useEffect } from 'react';
import { styled } from '@linaria/react';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { getAxiosReq, postAxiosReq } from 'core/api/rest-helper';

const CreateGroupModal = ({ onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const searchRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        const res = await getAxiosReq(`${LITLOOP_API_URL}/users/search/?q=${encodeURIComponent(searchQuery)}`);
        const results = res.data?.results || [];
        setSearchResults(results.filter(u => !selectedUsers.some(s => s.id === u.id)));
      } catch (_) {
        setSearchResults([]);
      }
    }, 250);
    return () => clearTimeout(timerRef.current);
  }, [searchQuery, selectedUsers]);

  const addUser = (user) => {
    setSelectedUsers(prev => [...prev, user]);
    setSearchQuery('');
    setSearchResults([]);
    searchRef.current?.focus();
  };

  const removeUser = (userId) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    setError('');
    try {
      const res = await postAxiosReq(`${LITLOOP_API_URL}/chats/group/create/`, {
        name: name.trim(),
        description: description.trim(),
        participant_ids: selectedUsers.map(u => u.id),
      });
      onCreated(res.data?.chat);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to create group');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Title>New Group</Title>

        <Label>Group Name</Label>
        <Input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter group name..."
          maxLength={20}
          autoFocus
        />

        <Label>Description (optional)</Label>
        <Input
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="What's this group about?"
        />

        <Label>Add Members</Label>
        <SearchInput
          ref={searchRef}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search users..."
        />

        {searchResults.length > 0 && (
          <ResultsDropdown>
            {searchResults.map(user => (
              <ResultItem key={user.id} onClick={() => addUser(user)}>
                <ResultAvatar src={user.avatar || ''} alt="" />
                <ResultName>{user.username}</ResultName>
              </ResultItem>
            ))}
          </ResultsDropdown>
        )}

        {selectedUsers.length > 0 && (
          <SelectedList>
            {selectedUsers.map(user => (
              <SelectedChip key={user.id}>
                <ChipName>{user.username}</ChipName>
                <RemoveBtn onClick={() => removeUser(user.id)}>&times;</RemoveBtn>
              </SelectedChip>
            ))}
          </SelectedList>
        )}

        {error && <ErrorText>{error}</ErrorText>}

        <Actions>
          <CancelBtn onClick={onClose}>Cancel</CancelBtn>
          <CreateBtn onClick={handleCreate} disabled={!name.trim() || creating}>
            {creating ? 'Creating...' : 'Create Group'}
          </CreateBtn>
        </Actions>
      </Modal>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: #1e1e1e;
  border-radius: 12px;
  padding: 24px;
  width: 400px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  color: #fff;
`;

const Title = styled.h2`
  margin: 0 0 16px;
  font-size: 18px;
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
  margin-top: 12px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #333;
  background: #2a2a2a;
  color: #fff;
  font-size: 14px;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #009688; }
`;

const SearchInput = styled(Input)``;

const ResultsDropdown = styled.div`
  margin-top: 4px;
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 8px;
  max-height: 180px;
  overflow-y: auto;
`;

const ResultItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  cursor: pointer;
  &:hover { background: #333; }
`;

const ResultAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #444;
`;

const ResultName = styled.span`
  font-size: 14px;
`;

const SelectedList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`;

const SelectedChip = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: #009688;
  color: #fff;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 13px;
`;

const ChipName = styled.span``;

const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  padding: 0 2px;
  line-height: 1;
  opacity: 0.7;
  &:hover { opacity: 1; }
`;

const ErrorText = styled.div`
  color: #ff5252;
  font-size: 13px;
  margin-top: 8px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
`;

const CancelBtn = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #444;
  background: transparent;
  color: #ccc;
  cursor: pointer;
  font-size: 14px;
  &:hover { background: #2a2a2a; }
`;

const CreateBtn = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: #009688;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
  &:hover:not(:disabled) { background: #00796b; }
`;

export default CreateGroupModal;
