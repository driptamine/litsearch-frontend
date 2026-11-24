import React, { useState, useEffect, useCallback, useRef } from 'react';
import { styled } from '@linaria/react';
import axios from 'axios';
import { FaImage, FaLock, FaGlobe, FaEyeSlash } from 'react-icons/fa';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';
import { useMediaUpload } from './useMediaUpload';

function VideoEditModal({ video, onClose, onUpdate }) {
  const [title, setTitle] = useState(video.title || '');
  const [description, setDescription] = useState(video.description || '');
  const [visibility, setVisibility] = useState(video.visibility || 'private');
  const [thumbnail, setThumbnail] = useState(video.thumbnail || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounter = useRef(0);
  const fileInputRef = useRef(null);
  const { uploadFiles, isUploading, progress } = useMediaUpload();

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.put(
        `${LITLOOP_API_URL}/videos/${video.id}/`,
        {
          title,
          description,
          visibility,
          ...(thumbnail ? { thumbnail } : {}),
        },
        { headers: { 'Content-Type': 'application/json', ...authHeader() } }
      );
      if (onUpdate) onUpdate(res.data);
      onClose();
    } catch (err) {
      console.error('Error updating video:', err);
      setError('Failed to update video.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleThumbnailUpload = async (files) => {
    if (!files.length) return;
    const results = await uploadFiles(files, 'photo');
    const newThumbnail = results[0]?.location || results[0]?.url;
    if (newThumbnail) {
      setThumbnail(newThumbnail);
    }
  };

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    dragCounter.current = 0;

    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (!files.length) return;
    await handleThumbnailUpload(files);
  }, [handleThumbnailUpload]);

  const handleFileSelect = useCallback(async (e) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
    e.target.value = '';
    if (!files.length) return;
    await handleThumbnailUpload(files);
  }, [handleThumbnailUpload]);

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          Edit Video
          <CloseBtn onClick={onClose}>&times;</CloseBtn>
        </Header>
        <Body>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <div style={{ marginBottom: '16px' }}>
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Video title"
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Label>Description</Label>
            <TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Video description"
              rows={3}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Label>Visibility</Label>
            <VisibilitySelect value={visibility} onChange={(e) => setVisibility(e.target.value)}>
              <option value="private"><FaLock /> Private</option>
              <option value="unlisted"><FaEyeSlash /> Unlisted</option>
              <option value="public"><FaGlobe /> Public</option>
            </VisibilitySelect>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Label>Thumbnail</Label>
            <ThumbnailArea
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              isDragOver={isDragOver}
            >
              {thumbnail ? (
                <ThumbnailPreview src={thumbnail} alt="Current thumbnail" />
              ) : (
                <>
                  <ThumbnailPlaceholder>Click or drag to upload thumbnail</ThumbnailPlaceholder>
                </>
              )}
              {isUploading && (
                <ProgressSection>
                  <ProgressLabel>Uploading thumbnail... {progress}%</ProgressLabel>
                  <ProgressTrack>
                    <ProgressFill style={{ width: `${progress}%` }} />
                  </ProgressTrack>
                </ProgressSection>
              )}
            </ThumbnailArea>
          </div>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Body>
        <Footer>
          <CancelBtn onClick={onClose}>Cancel</CancelBtn>
          <SaveBtn disabled={isLoading} onClick={handleSave}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </SaveBtn>
        </Footer>
      </Modal>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const Modal = styled.div`
  background: #1a1a1a;
  border-radius: 16px;
  width: 90%;
  max-width: 480px;
  max-height: 80vh;
  border: 1px solid #333;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  border-bottom: 1px solid #333;
`;

const CloseBtn = styled.button`
  background: none; border: none; color: #888;
  font-size: 1.5rem; cursor: pointer; padding: 0; line-height: 1;
  &:hover { color: white; }
`;

const Body = styled.div`
  padding: 16px 20px;
  overflow-y: auto;
  flex: 1;
`;

const Footer = styled.div`
  display: flex; gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #333;
`;

const Label = styled.label`
  display: block;
  color: #aaa;
  font-size: 0.85rem;
  margin-bottom: 6px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  background: #222;
  border: 1px solid #333;
  border-radius: 8px;
  color: white;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  &:focus { border-color: #0084ff; }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  background: #222;
  border: 1px solid #333;
  border-radius: 8px;
  color: white;
  font-size: 0.95rem;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s;
  &:focus { border-color: #0084ff; }
`;

const VisibilitySelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  background: #222;
  border: 1px solid #333;
  border-radius: 8px;
  color: white;
  font-size: 0.95rem;
  outline: none;
  cursor: pointer;
  &:focus { border-color: #0084ff; }
`;

const ThumbnailArea = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  border: 2px dashed ${({ isDragOver }) => (isDragOver ? '#009688' : '#444')};
  background: ${({ isDragOver }) => (isDragOver ? 'rgba(0, 150, 136, 0.1)' : '#222')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
`;

const ThumbnailPlaceholder = styled.div`
  color: #666;
  font-size: 0.9rem;
  text-align: center;
  padding: 20px;
`;

const ThumbnailPreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProgressSection = styled.div`
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 12px;
  background: linear-gradient(transparent, rgba(0,0,0,0.9));
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProgressLabel = styled.span`
  color: #aaa;
  font-size: 0.8rem;
  text-align: center;
`;

const ProgressTrack = styled.div`
  height: 4px;
  background: #333;
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #009688;
  border-radius: 2px;
  transition: width 0.3s ease;
`;

const ErrorMessage = styled.p`
  color: #ff4d4d;
  font-size: 0.85rem;
  text-align: center;
  margin-top: 8px;
`;

const CancelBtn = styled.button`
  flex: 1; padding: 10px;
  background: transparent; color: #aaa;
  border: 1px solid #444; border-radius: 8px;
  font-size: 0.95rem; cursor: pointer;
  &:hover { background: #222; }
`;

const SaveBtn = styled.button`
  flex: 1; padding: 10px;
  background: #0084ff; color: white;
  border: none; border-radius: 8px;
  font-size: 0.95rem; font-weight: 600; cursor: pointer;
  &:disabled { opacity: 0.4; cursor: not-allowed; }
  &:hover:not(:disabled) { background: #0073e6; }
`;

export default VideoEditModal;