import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { styled } from '@linaria/react';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';
import { FaTimes } from 'react-icons/fa';

const PhotoAlbumCreatorModal = ({ username, onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await axios.post(
        `${LITLOOP_API_URL}/photos/album/create/`,
        { title: title.trim(), description: description.trim() },
        { headers: authHeader() }
      );
      onCreated(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create album');
    } finally {
      setSaving(false);
    }
  };

  if (!username) return null;

  return ReactDOM.createPortal(
    <Overlay>
      <Modal ref={modalRef}>
        <Header>
          <Title>New Album</Title>
          <CloseButton onClick={onClose}><FaTimes size={20} /></CloseButton>
        </Header>
        <Form onSubmit={handleSubmit}>
          <Label>Title *</Label>
          <Input
            ref={inputRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Album name"
            maxLength={100}
            disabled={saving}
          />
          <Label>Description</Label>
          <TextArea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Optional description"
            rows={3}
            disabled={saving}
          />
          {error && <ErrorText>{error}</ErrorText>}
          <Button type="submit" disabled={saving || !title.trim()}>
            {saving ? 'Creating...' : 'Create Album'}
          </Button>
        </Form>
      </Modal>
    </Overlay>,
    document.body
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Modal = styled.div`
  background: var(--navBg, #141414);
  border-radius: 12px;
  max-width: 480px;
  width: 100%;
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: var(--text);
  margin: 0;
  font-size: 20px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  padding: 4px;
  &:hover { opacity: 0.7; }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  color: var(--text);
  font-size: 14px;
  font-weight: 600;
`;

const Input = styled.input`
  background: var(--inputBg, #222);
  border: 1px solid var(--inputBorderColor, #333);
  border-radius: 8px;
  color: var(--text);
  padding: 10px 12px;
  font-size: 15px;
  outline: none;
  &:focus { border-color: var(--primary, #bb86fc); }
  &:disabled { opacity: 0.5; }
`;

const TextArea = styled.textarea`
  background: var(--inputBg, #222);
  border: 1px solid var(--inputBorderColor, #333);
  border-radius: 8px;
  color: var(--text);
  padding: 10px 12px;
  font-size: 15px;
  outline: none;
  resize: vertical;
  font-family: inherit;
  &:focus { border-color: var(--primary, #bb86fc); }
  &:disabled { opacity: 0.5; }
`;

const ErrorText = styled.p`
  color: #ff4444;
  margin: 0;
  font-size: 13px;
`;

const Button = styled.button`
  background: var(--primary, #bb86fc);
  color: #000;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 4px;
  &:disabled { opacity: 0.5; cursor: default; }
  &:hover:not(:disabled) { opacity: 0.9; }
`;

export default PhotoAlbumCreatorModal;
