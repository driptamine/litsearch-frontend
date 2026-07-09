import React, { useState } from 'react';
import { styled } from '@linaria/react';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';

const CommunityPostModal = ({ communityId, onClose, onSaved }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() && !description.trim()) {
      setError('Title or description is required');
      return;
    }

    setSaving(true);
    try {
      const res = await axios.post(
        `${LITLOOP_API_URL}/communities/${communityId}/posts/request/`,
        { title: title.trim(), description: description.trim() },
        { headers: authHeader() }
      );
      onSaved(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Request Post</Title>
          <CloseBtn onClick={onClose}>&times;</CloseBtn>
        </Header>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMsg>{error}</ErrorMsg>}

          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" />

          <Label>Description</Label>
          <TextArea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's on your mind?" rows={4} />

          <ButtonRow>
            <CancelBtn type="button" onClick={onClose}>Cancel</CancelBtn>
            <SubmitBtn type="submit" disabled={saving}>{saving ? 'Submitting...' : 'Submit for Review'}</SubmitBtn>
          </ButtonRow>
        </Form>
      </Modal>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background: var(--cardBg, #1e1e1e);
  border-radius: 12px;
  width: 90%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
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

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: var(--textSecondary, #888);
  font-size: 28px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  color: var(--text);
  font-size: 13px;
  font-weight: 600;
  margin-top: 4px;
`;

const Input = styled.input`
  background: var(--inputBg, #2a2a2a);
  border: 1px solid var(--border, #444);
  border-radius: 8px;
  padding: 10px 12px;
  color: var(--text);
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: var(--accent, #0084ff);
  }
`;

const TextArea = styled.textarea`
  background: var(--inputBg, #2a2a2a);
  border: 1px solid var(--border, #444);
  border-radius: 8px;
  padding: 10px 12px;
  color: var(--text);
  font-size: 14px;
  outline: none;
  resize: vertical;
  font-family: inherit;

  &:focus {
    border-color: var(--accent, #0084ff);
  }
`;

const ErrorMsg = styled.div`
  color: #e74c3c;
  font-size: 13px;
  background: rgba(231, 76, 60, 0.1);
  padding: 8px 12px;
  border-radius: 6px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
`;

const CancelBtn = styled.button`
  background: transparent;
  border: 1px solid var(--border, #444);
  color: var(--text);
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
`;

const SubmitBtn = styled.button`
  background: var(--accent, #0084ff);
  border: none;
  color: #fff;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;

  &:disabled {
    opacity: 0.5;
  }
`;

export default CommunityPostModal;
