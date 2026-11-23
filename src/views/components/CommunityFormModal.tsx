import React, { useState, useRef } from 'react';
import { styled } from '@linaria/react';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';

const CommunityFormModal = ({ mode, community, onClose, onSaved }) => {
  const isEdit = mode === 'edit';
  const [name, setName] = useState(community?.name || '');
  const [handle, setHandle] = useState(community?.handle || '');
  const [description, setDescription] = useState(community?.description || '');
  const [icon, setIcon] = useState(community?.icon || '');
  const [banner, setBanner] = useState(community?.banner || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const iconInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const handleIconUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !isEdit) return;

    if (!file.type.startsWith('image/')) {
      setError('File must be an image');
      return;
    }

    setUploadingIcon(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('icon', file);
      const res = await axios.post(
        `${LITLOOP_API_URL}/communities/${community.id}/icon/r2/`,
        formData,
        { headers: authHeader() }
      );
      setIcon(res.data.icon);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploadingIcon(false);
      if (iconInputRef.current) iconInputRef.current.value = '';
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !isEdit) return;

    if (!file.type.startsWith('image/')) {
      setError('File must be an image');
      return;
    }

    setUploadingBanner(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('banner', file);
      const res = await axios.post(
        `${LITLOOP_API_URL}/communities/${community.id}/banner/r2/`,
        formData,
        { headers: authHeader() }
      );
      setBanner(res.data.banner);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isEdit && !name.trim()) {
      setError('Name is required');
      return;
    }

    setSaving(true);
    try {
      const payload = { name: name.trim(), handle: handle.trim() || undefined, description: description.trim(), icon: icon || null, banner: banner || null };

      let res;
      if (isEdit) {
        res = await axios.put(`${LITLOOP_API_URL}/communities/${community.id}/update/`, payload, { headers: authHeader() });
      } else {
        res = await axios.post(`${LITLOOP_API_URL}/communities/create/`, payload, { headers: authHeader() });
      }

      onSaved(res.data);
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
          <Title>{isEdit ? 'Edit Community' : 'Create Community'}</Title>
          <CloseBtn onClick={onClose}>&times;</CloseBtn>
        </Header>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMsg>{error}</ErrorMsg>}

          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Community name" disabled={isEdit} required={!isEdit} />

          <Label>Handle</Label>
          <Input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@handle (auto-generated if empty)" />

          <Label>Description</Label>
          <TextArea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's this community about?" rows={3} />

          <Label>Icon</Label>
          <IconRow>
            <IconInput value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="https://example.com/icon.jpg" />
            {isEdit && (
              <>
                <UploadBtn type="button" onClick={() => iconInputRef.current?.click()} disabled={uploadingIcon}>
                  {uploadingIcon ? 'Uploading...' : 'Upload'}
                </UploadBtn>
                <HiddenInput ref={iconInputRef} type="file" accept="image/*" onChange={handleIconUpload} />
              </>
            )}
          </IconRow>
          {icon && <IconPreview src={icon} alt="" />}

          <Label>Banner</Label>
          <IconRow>
            <IconInput value={banner} onChange={(e) => setBanner(e.target.value)} placeholder="https://example.com/banner.jpg" />
            {isEdit && (
              <>
                <UploadBtn type="button" onClick={() => bannerInputRef.current?.click()} disabled={uploadingBanner}>
                  {uploadingBanner ? 'Uploading...' : 'Upload'}
                </UploadBtn>
                <HiddenInput ref={bannerInputRef} type="file" accept="image/*" onChange={handleBannerUpload} />
              </>
            )}
          </IconRow>
          {banner && <BannerPreview src={banner} alt="" />}

          <ButtonRow>
            <CancelBtn type="button" onClick={onClose}>Cancel</CancelBtn>
            <SubmitBtn type="submit" disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Save' : 'Create'}</SubmitBtn>
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

  &:disabled {
    opacity: 0.5;
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

const IconRow = styled.div`
  display: flex;
  gap: 8px;
`;

const IconInput = styled.input`
  flex: 1;
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

const UploadBtn = styled.button`
  background: var(--accent, #0084ff);
  border: none;
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;

  &:disabled {
    opacity: 0.5;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const IconPreview = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 8px;
  object-fit: cover;
  margin-top: 4px;
`;

const BannerPreview = styled.img`
  width: 100%;
  max-height: 120px;
  border-radius: 8px;
  object-fit: cover;
  margin-top: 4px;
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

export default CommunityFormModal;
