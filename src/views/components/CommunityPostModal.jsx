import React, { useState, useRef } from 'react';
import { styled } from '@linaria/react';
import { FaMusic, FaImage, FaFilm, FaUpload } from 'react-icons/fa';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';
import { useMediaUpload } from 'views/components/upload/uploader/posts/useMediaUpload';
import TrackPickerModal from 'views/components/upload/uploader/posts/TrackPickerModal';
import PhotoPickerModal from 'views/components/upload/uploader/posts/PhotoPickerModal';
import VideoPickerModal from 'views/components/upload/uploader/posts/VideoPickerModal';

const CommunityPostModal = ({ communityId, isAdminOrMod, onClose, onSaved }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photoIds, setPhotoIds] = useState([]);
  const [videoIds, setVideoIds] = useState([]);
  const [trackIds, setTrackIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [showVideoPicker, setShowVideoPicker] = useState(false);
  const [showTrackPicker, setShowTrackPicker] = useState(false);
  const { uploadFiles, isUploading, progress } = useMediaUpload();

  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const trackInputRef = useRef(null);

  const handleFileUpload = async (e, mediaType) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      const results = await uploadFiles(files, mediaType);
      const ids = results.map(r => r.id).filter(Boolean);
      if (mediaType === 'photo') setPhotoIds(prev => [...prev, ...ids]);
      if (mediaType === 'video') setVideoIds(prev => [...prev, ...ids]);
      if (mediaType === 'track') setTrackIds(prev => [...prev, ...ids]);
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
    }

    e.target.value = '';
  };

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
        {
          title: title.trim(),
          description: description.trim(),
          photo_ids: photoIds,
          video_ids: videoIds,
          track_ids: trackIds,
        },
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
          <Title>{isAdminOrMod ? 'Create Post' : 'Request Post'}</Title>
          <CloseBtn onClick={onClose}>&times;</CloseBtn>
        </Header>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMsg>{error}</ErrorMsg>}

          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" />

          <Label>Description</Label>
          <TextArea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's on your mind?" rows={4} />

          <MediaBar>
            <AddMediaBtn type="button" onClick={() => photoInputRef.current?.click()} accent="#f0c040" title="Upload photo">
              <FaUpload size={10} /> <FaImage />
            </AddMediaBtn>
            <AddMediaBtn type="button" onClick={() => videoInputRef.current?.click()} accent="#a855f7" title="Upload video">
              <FaUpload size={10} /> <FaFilm />
            </AddMediaBtn>
            <AddMediaBtn type="button" onClick={() => trackInputRef.current?.click()} accent="#1db954" title="Upload track">
              <FaUpload size={10} /> <FaMusic />
            </AddMediaBtn>
            <Divider />
            <PickBtn type="button" onClick={() => setShowPhotoPicker(true)} accent="#f0c040" title="Pick photo">
              <FaImage /> <span>Pick</span>
            </PickBtn>
            <PickBtn type="button" onClick={() => setShowVideoPicker(true)} accent="#a855f7" title="Pick video">
              <FaFilm /> <span>Pick</span>
            </PickBtn>
            <PickBtn type="button" onClick={() => setShowTrackPicker(true)} accent="#1db954" title="Pick track">
              <FaMusic /> <span>Pick</span>
            </PickBtn>
            <MediaCount>
              {photoIds.length > 0 && <span>📷 {photoIds.length}</span>}
              {videoIds.length > 0 && <span>🎬 {videoIds.length}</span>}
              {trackIds.length > 0 && <span>🎵 {trackIds.length}</span>}
            </MediaCount>
          </MediaBar>

          {isUploading && (
            <ProgressTrack>
              <ProgressFill style={{ width: `${progress}%` }} />
            </ProgressTrack>
          )}

          <HiddenInput ref={photoInputRef} type="file" accept="image/*" multiple onChange={(e) => handleFileUpload(e, 'photo')} />
          <HiddenInput ref={videoInputRef} type="file" accept="video/*" multiple onChange={(e) => handleFileUpload(e, 'video')} />
          <HiddenInput ref={trackInputRef} type="file" accept="audio/*" multiple onChange={(e) => handleFileUpload(e, 'track')} />

          <ButtonRow>
            <CancelBtn type="button" onClick={onClose}>Cancel</CancelBtn>
            <SubmitBtn type="submit" disabled={saving || isUploading}>{saving ? 'Submitting...' : isAdminOrMod ? 'Create' : 'Submit for Review'}</SubmitBtn>
          </ButtonRow>
        </Form>

        {showPhotoPicker && (
          <PhotoPickerModal
            onSelect={(ids) => { setPhotoIds(prev => [...new Set([...prev, ...ids])]); setShowPhotoPicker(false); }}
            onClose={() => setShowPhotoPicker(false)}
          />
        )}
        {showVideoPicker && (
          <VideoPickerModal
            onSelect={(ids) => { setVideoIds(prev => [...new Set([...prev, ...ids])]); setShowVideoPicker(false); }}
            onClose={() => setShowVideoPicker(false)}
          />
        )}
        {showTrackPicker && (
          <TrackPickerModal
            onSelect={(trackObjects) => {
              const ids = trackObjects.map(t => t.pk || t.id).filter(Boolean);
              setTrackIds(prev => [...new Set([...prev, ...ids])]);
              setShowTrackPicker(false);
            }}
            onClose={() => setShowTrackPicker(false)}
          />
        )}
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

const MediaBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const AddMediaBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  background: transparent;
  color: ${({ accent }) => accent || '#888'};
  border: 1px solid ${({ accent }) => accent || '#444'};
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;

  &:hover {
    background: ${({ accent }) => accent ? `${accent}1a` : 'rgba(255,255,255,0.05)'};
  }
`;

const MediaCount = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
  font-size: 12px;
  color: var(--textSecondary, #888);
`;

const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: var(--border, #444);
  margin: 0 4px;
`;

const PickBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 6px 8px;
  background: transparent;
  color: ${({ accent }) => accent || '#888'};
  border: 1px solid ${({ accent }) => accent || '#444'};
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;

  &:hover {
    background: ${({ accent }) => accent ? `${accent}1a` : 'rgba(255,255,255,0.05)'};
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ProgressTrack = styled.div`
  height: 4px;
  background: var(--border, #444);
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: var(--accent, #0084ff);
  border-radius: 2px;
  transition: width 0.3s ease;
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
