import React, { useState, useEffect, useCallback, useRef } from 'react';
import { styled } from '@linaria/react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';
import { useMediaUpload } from './useMediaUpload';

function PhotoPickerModal({ onSelect, onClose }) {
  const username = useSelector((state) => state.users?.username);
  const [photos, setPhotos] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounter = useRef(0);
  const { uploadFiles, isUploading, progress } = useMediaUpload();

  const fetchPhotos = useCallback(async () => {
    if (!username) return;
    try {
      const res = await axios.get(
        `${LITLOOP_API_URL}/users/${username}/photos/`,
        { headers: authHeader() }
      );
      const data = res.data;
      const photosData = data.results || data.photos || data;
      setPhotos(Array.isArray(photosData) ? photosData : []);
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError('Failed to load photos.');
    }
  }, [username]);

  useEffect(() => {
    if (!username) {
      setError('User not found.');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    fetchPhotos().finally(() => setIsLoading(false));
  }, [username, fetchPhotos]);

  const toggle = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAdd = () => {
    onSelect(Array.from(selectedIds));
    onClose();
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

    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;

    const results = await uploadFiles(files, 'photo');
    const newIds = results.map(r => r.id).filter(Boolean);
    if (newIds.length) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        newIds.forEach(id => next.add(id));
        return next;
      });
      fetchPhotos();
    }
  }, [uploadFiles, fetchPhotos]);

  return (
    <Overlay onClick={onClose}>
      <Modal
        onClick={e => e.stopPropagation()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Header>
          Select Photos
          <CloseBtn onClick={onClose}>&times;</CloseBtn>
        </Header>
        <Body>
          {isDragOver && (
            <DropOverlay>
              <DropIcon>+</DropIcon>
              <DropText>Drop photos to upload</DropText>
            </DropOverlay>
          )}
          {isUploading && (
            <ProgressSection>
              <ProgressLabel>Uploading photos... {progress}%</ProgressLabel>
              <ProgressTrack>
                <ProgressFill style={{ width: `${progress}%` }} />
              </ProgressTrack>
            </ProgressSection>
          )}
          {isLoading && <Message>Loading photos...</Message>}
          {error && <Message error>{error}</Message>}
          {!isLoading && !error && !isUploading && photos.length === 0 && (
            <EmptyState>
              <EmptyIcon>📷</EmptyIcon>
              <EmptyTitle>No photos yet</EmptyTitle>
              <EmptyHint>Drag & drop photos here to upload</EmptyHint>
            </EmptyState>
          )}
          {!isLoading && !error && photos.length > 0 && (
            <Grid>
              {photos.map((photo, i) => {
                const id = photo.id || photo.pk || i;
                const src = photo.gcs_url || photo.image || photo.url || photo.file_path;
                const selected = selectedIds.has(id);
                return (
                  <PhotoCard key={id} selected={selected} onClick={() => toggle(id)}>
                    {src ? (
                      <Thumb src={src} alt="" />
                    ) : (
                      <Placeholder>No Image</Placeholder>
                    )}
                    <CheckBadge selected={selected}>
                      {selected && '✓'}
                    </CheckBadge>
                  </PhotoCard>
                );
              })}
            </Grid>
          )}
        </Body>
        <Footer>
          <CancelBtn onClick={onClose}>Cancel</CancelBtn>
          <AddBtn disabled={selectedIds.size === 0} onClick={handleAdd}>
            Add Selected ({selectedIds.size})
          </AddBtn>
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
  max-width: 560px;
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
  padding: 16px;
  overflow-y: auto;
  flex: 1;
  position: relative;
`;

const Footer = styled.div`
  display: flex; gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #333;
`;

const DropOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 150, 136, 0.12);
  backdrop-filter: blur(3px);
  z-index: 10;
  border-radius: 8px;
  gap: 8px;
`;

const DropIcon = styled.span`
  font-size: 2.5rem;
  color: #009688;
  font-weight: 300;
`;

const DropText = styled.span`
  color: #009688;
  font-size: 1rem;
  font-weight: 600;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
`;

const PhotoCard = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${({ selected }) => (selected ? '#0084ff' : 'transparent')};
  background: #222;

  &:hover {
    opacity: 0.85;
  }
`;

const Thumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  font-size: 0.8rem;
`;

const CheckBadge = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${({ selected }) => (selected ? '#0084ff' : 'rgba(0,0,0,0.5)')};
  color: white;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProgressSection = styled.div`
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const ProgressLabel = styled.span`
  color: #aaa;
  font-size: 0.95rem;
`;

const ProgressTrack = styled.div`
  width: 80%;
  max-width: 300px;
  height: 6px;
  background: #333;
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #009688;
  border-radius: 3px;
  transition: width 0.3s ease;
`;

const Message = styled.p`
  text-align: center;
  padding: 40px 20px;
  color: ${({ error }) => (error ? '#ff4d4d' : '#888')};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
  gap: 12px;
`;

const EmptyIcon = styled.span`
  font-size: 3rem;
`;

const EmptyTitle = styled.p`
  color: #aaa;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const EmptyHint = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin: 0;
`;

const CancelBtn = styled.button`
  flex: 1; padding: 10px;
  background: transparent; color: #aaa;
  border: 1px solid #444; border-radius: 8px;
  font-size: 0.95rem; cursor: pointer;
  &:hover { background: #222; }
`;

const AddBtn = styled.button`
  flex: 1; padding: 10px;
  background: #0084ff; color: white;
  border: none; border-radius: 8px;
  font-size: 0.95rem; font-weight: 600; cursor: pointer;
  &:disabled { opacity: 0.4; cursor: not-allowed; }
  &:hover:not(:disabled) { background: #0073e6; }
`;

export default PhotoPickerModal;
