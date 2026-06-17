import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { styled } from '@linaria/react';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';
import { FaTimes, FaPlus, FaCloudUploadAlt } from 'react-icons/fa';
import { useMediaUpload } from 'src/views/components/upload/uploader/posts/useMediaUpload';

const PhotoAlbumOverlay = ({ album, username, onClose }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pickerMode, setPickerMode] = useState(false);
  const [userPhotos, setUserPhotos] = useState([]);
  const [loadingUserPhotos, setLoadingUserPhotos] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);
  const { uploadFiles, isUploading, progress } = useMediaUpload();

  const fetchAlbumPhotos = async () => {
    if (!album?.friendly_token) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${LITLOOP_API_URL}/photos/album/${album.friendly_token}/`,
        { headers: authHeader() }
      );
      setPhotos(res.data.photos || []);
    } catch (err) {
      console.error('Failed to fetch album photos:', err);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = useCallback(async (files) => {
    const results = await uploadFiles(files, 'photo', album?.id);
    if (results.length > 0) {
      await fetchAlbumPhotos();
    }
  }, [uploadFiles, album?.id, fetchAlbumPhotos]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length) handleUpload(files);
  }, [handleUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length) handleUpload(files);
  }, [handleUpload]);

  useEffect(() => {
    fetchAlbumPhotos();
  }, [album?.friendly_token]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (album) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [album, onClose]);

  useEffect(() => {
    if (album) {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [album]);

  const openPicker = async () => {
    setPickerMode(true);
    if (userPhotos.length) return;
    try {
      setLoadingUserPhotos(true);
      const res = await axios.get(
        `${LITLOOP_API_URL}/users/${username}/photos/`,
        { headers: authHeader() }
      );
      const data = res.data;
      setUserPhotos(data.photos || data.results || []);
    } catch (err) {
      console.error('Failed to fetch user photos:', err);
      setUserPhotos([]);
    } finally {
      setLoadingUserPhotos(false);
    }
  };

  const addPhoto = async (photoId) => {
    if (addingId) return;
    try {
      setAddingId(photoId);
      await axios.post(
        `${LITLOOP_API_URL}/photos/album/${album.id}/add/`,
        { photo_id: photoId },
        { headers: authHeader() }
      );
      await fetchAlbumPhotos();
      setPickerMode(false);
    } catch (err) {
      console.error('Failed to add photo:', err);
      alert(err.response?.data?.error || 'Failed to add photo');
    } finally {
      setAddingId(null);
    }
  };

  if (!album) return null;

  return ReactDOM.createPortal(
    <Overlay>
      <Modal ref={modalRef}>
        <Header>
          <Title>{pickerMode ? 'Add Photos to Album' : album.title}</Title>
          <HeaderActions>
            {!pickerMode && (
              <AddButton onClick={openPicker}><FaPlus size={14} /> Add Photos</AddButton>
            )}
            {pickerMode && (
              <BackButton onClick={() => setPickerMode(false)}>Back</BackButton>
            )}
            <CloseButton onClick={onClose}><FaTimes size={20} /></CloseButton>
          </HeaderActions>
        </Header>
        {!pickerMode && album.description && <Description>{album.description}</Description>}

        {pickerMode ? (
          <>
            <UploadZone
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              dragOver={dragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleFileSelect}
              />
              {isUploading ? (
                <>
                  <FaCloudUploadAlt size={40} />
                  <UploadText>Uploading... {progress}%</UploadText>
                  <ProgressBar>
                    <ProgressFill style={{ width: `${progress}%` }} />
                  </ProgressBar>
                </>
              ) : (
                <>
                  <FaCloudUploadAlt size={40} />
                  <UploadText>Drop photos here or click to upload</UploadText>
                </>
              )}
            </UploadZone>
            <Divider />
            <SectionLabel>Or pick from your photos</SectionLabel>
            <Grid>
              {loadingUserPhotos
                ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)
                : userPhotos.filter(
                    up => !photos.some(p => p.id === up.id)
                  ).map(photo => (
                    <PhotoItem
                      key={photo.id}
                      onClick={() => addPhoto(photo.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <PhotoImg src={photo.image || photo.gcs_url} alt={photo.title} />
                      <AddOverlay>
                        {addingId === photo.id ? <Spinner /> : <FaPlus size={24} />}
                      </AddOverlay>
                    </PhotoItem>
                  ))}
              {!loadingUserPhotos && userPhotos.filter(
                up => !photos.some(p => p.id === up.id)
              ).length === 0 && (
                <EmptyMsg>All your photos are already in this album.</EmptyMsg>
              )}
            </Grid>
          </>
        ) : (
          <Grid>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)
              : photos.map(photo => (
                  <PhotoItem key={photo.id}>
                    <PhotoImg src={photo.image || photo.gcs_url} alt={photo.title} />
                  </PhotoItem>
                ))}
          </Grid>
        )}
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
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 12px;
`;

const Title = styled.h2`
  color: var(--text);
  margin: 0;
  font-size: 20px;
  flex-shrink: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
`;

const AddButton = styled.button`
  background: var(--primary, #6c5ce7);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  &:hover { opacity: 0.85; }
`;

const BackButton = styled.button`
  background: none;
  border: 1px solid var(--text);
  color: var(--text);
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  &:hover { opacity: 0.7; }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  padding: 4px;
  &:hover { opacity: 0.7; }
`;

const Description = styled.p`
  color: var(--text);
  opacity: 0.7;
  margin: 0 0 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
`;

const PhotoItem = styled.div`
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

const PhotoImg = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
`;

const AddOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  color: #fff;
  ${PhotoItem}:hover & { opacity: 1; }
`;

const Spinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const UploadZone = styled.div`
  border: 2px dashed ${({ dragOver }) => dragOver ? 'var(--primary, #bb86fc)' : 'var(--text)'};
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  color: var(--text);
  opacity: ${({ dragOver }) => dragOver ? '0.8' : '0.6'};
  background: ${({ dragOver }) => dragOver ? 'rgba(187, 134, 252, 0.1)' : 'transparent'};
  transition: all 0.2s;
  margin-bottom: 16px;
  &:hover {
    opacity: 0.8;
    border-color: var(--primary, #bb86fc);
  }
`;

const UploadText = styled.p`
  margin: 8px 0 0;
  font-size: 14px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: var(--cardColor, #333);
  border-radius: 3px;
  margin-top: 12px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: var(--primary, #bb86fc);
  border-radius: 3px;
  transition: width 0.3s ease;
`;

const Divider = styled.div`
  height: 1px;
  background: var(--text);
  opacity: 0.15;
  margin: 16px 0;
`;

const SectionLabel = styled.p`
  color: var(--text);
  opacity: 0.5;
  font-size: 13px;
  margin: 0 0 12px;
`;

const EmptyMsg = styled.p`
  color: var(--text);
  opacity: 0.6;
  text-align: center;
  grid-column: 1 / -1;
  padding: 40px 0;
`;

const Skeleton = styled.div`
  aspect-ratio: 1;
  border-radius: 8px;
  background: var(--cardColor);
  animation: pulse 1.5s infinite;
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
`;

export default PhotoAlbumOverlay;
