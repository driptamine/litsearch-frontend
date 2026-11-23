import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { styled } from '@linaria/react';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';
import { FaTimes, FaArrowLeft, FaCloudUploadAlt, FaPlus, FaEdit } from 'react-icons/fa';
import { useMediaUpload } from 'src/views/components/upload/uploader/posts/useMediaUpload';

function PhotoAlbumEdit() {
  const { username, photoAlbumId } = useParams();
  const history = useHistory();
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPhotos, setUserPhotos] = useState([]);
  const [loadingUserPhotos, setLoadingUserPhotos] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [savingAlbum, setSavingAlbum] = useState(false);
  const { uploadFiles, isUploading, progress } = useMediaUpload();
  const fileInputRef = React.useRef(null);

  const goBack = () => history.push(`/${username}/albums/${photoAlbumId}`);

  const fetchAlbumPhotos = useCallback(async (friendly_token) => {
    if (!friendly_token) return;
    try {
      const res = await axios.get(
        `${LITLOOP_API_URL}/photos/album/${friendly_token}/`,
        { headers: authHeader() }
      );
      setPhotos(res.data.photos || []);
    } catch (err) {
      console.error('Failed to fetch album photos:', err);
      setPhotos([]);
    }
  }, []);

  useEffect(() => {
    if (!username || !photoAlbumId) return;
    let cancelled = false;
    const fetchAlbum = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${LITLOOP_API_URL}/users/${username}/albums/`,
          { headers: authHeader() }
        );
        const albums = res.data.albums || res.data.results || [];
        const match = albums.find(a => String(a.id) === String(photoAlbumId));
        if (!cancelled && match) {
          setAlbum(match);
          if (match.friendly_token) {
            const photoRes = await axios.get(
              `${LITLOOP_API_URL}/photos/album/${match.friendly_token}/`,
              { headers: authHeader() }
            );
            if (!cancelled) setPhotos(photoRes.data.photos || []);
          }
        }
      } catch (err) {
        console.error('Failed to fetch album:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchAlbum();
    return () => { cancelled = true; };
  }, [username, photoAlbumId]);

  useEffect(() => {
    if (!username || !album) return;
    const fetchUserPhotos = async () => {
      try {
        setLoadingUserPhotos(true);
        const res = await axios.get(
          `${LITLOOP_API_URL}/users/${username}/photos/`,
          { headers: authHeader() }
        );
        setUserPhotos(res.data.photos || res.data.results || []);
      } catch (err) {
        console.error('Failed to fetch user photos:', err);
        setUserPhotos([]);
      } finally {
        setLoadingUserPhotos(false);
      }
    };
    fetchUserPhotos();
  }, [username, album]);

  const handleUpload = useCallback(async (files) => {
    const results = await uploadFiles(files, 'photo', album?.id);
    if (results.length > 0 && album?.friendly_token) {
      await fetchAlbumPhotos(album.friendly_token);
    }
  }, [uploadFiles, album?.id, album?.friendly_token, fetchAlbumPhotos]);

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

  const addPhoto = async (photoId) => {
    if (addingId || !album) return;
    try {
      setAddingId(photoId);
      await axios.post(
        `${LITLOOP_API_URL}/photos/album/${album.id}/add/`,
        { photo_id: photoId },
        { headers: authHeader() }
      );
      if (album.friendly_token) await fetchAlbumPhotos(album.friendly_token);
    } catch (err) {
      console.error('Failed to add photo:', err);
      alert(err.response?.data?.error || 'Failed to add photo');
    } finally {
      setAddingId(null);
    }
  };

  const startEditingAlbum = () => {
    setEditTitle(album?.title || '');
    setEditDescription(album?.description || '');
    setEditingAlbum(true);
  };

  const saveAlbum = async () => {
    if (!album || !editTitle.trim()) return;
    try {
      setSavingAlbum(true);
      const res = await axios.patch(
        `${LITLOOP_API_URL}/photos/album/${album.id}/`,
        { title: editTitle.trim(), description: editDescription.trim() },
        { headers: { "Content-Type": "application/json", ...authHeader() } }
      );
      setAlbum(prev => ({ ...prev, ...res.data }));
      setEditingAlbum(false);
    } catch (err) {
      console.error('Failed to update album:', err);
      alert(err.response?.data?.error || 'Failed to update album');
    } finally {
      setSavingAlbum(false);
    }
  };

  return (
    <Page>
      <TopBar>
        <BackBtn onClick={goBack}><FaArrowLeft size={18} /></BackBtn>
        <Title>Edit Album</Title>
        <CloseBtn onClick={goBack}><FaTimes size={20} /></CloseBtn>
      </TopBar>

      {loading ? (
        <LoadingState>Loading...</LoadingState>
      ) : album ? (
        <>
          <AlbumInfoCard>
            {editingAlbum ? (
              <EditForm>
                <EditLabel>Title</EditLabel>
                <EditInput
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  placeholder="Album title"
                />
                <EditLabel>Description</EditLabel>
                <EditTextarea
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  placeholder="Album description (optional)"
                  rows={3}
                />
                <EditActions>
                  <CancelBtn onClick={() => setEditingAlbum(false)}>Cancel</CancelBtn>
                  <SaveBtn onClick={saveAlbum} disabled={savingAlbum || !editTitle.trim()}>
                    {savingAlbum ? 'Saving...' : 'Save'}
                  </SaveBtn>
                </EditActions>
              </EditForm>
            ) : (
              <InfoRow>
                <InfoText>
                  <InfoTitle>{album.title}</InfoTitle>
                  {album.description && <InfoDesc>{album.description}</InfoDesc>}
                </InfoText>
                <EditIconBtn onClick={startEditingAlbum}><FaEdit size={16} /></EditIconBtn>
              </InfoRow>
            )}
          </AlbumInfoCard>

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

          {photos.length > 0 && (
            <>
              <Divider />
              <SectionLabel>Photos in this album</SectionLabel>
              <Grid>
                {photos.map(photo => (
                  <PhotoItem key={photo.id}>
                    <PhotoImg src={photo.r2_url || photo.image || photo.gcs_url} alt={photo.title} />
                  </PhotoItem>
                ))}
              </Grid>
            </>
          )}

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
                    <PhotoImg src={photo.r2_url || photo.image || photo.gcs_url} alt={photo.title} />
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
        <LoadingState>Album not found</LoadingState>
      )}
    </Page>
  );
}

const AlbumInfoCard = styled.div`
  margin: 16px 20px;
  padding: 16px;
  background: var(--cardColor, #1a1a1a);
  border-radius: 10px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const InfoText = styled.div`
  flex: 1;
`;

const InfoTitle = styled.h2`
  color: var(--text);
  margin: 0 0 4px;
  font-size: 18px;
`;

const InfoDesc = styled.p`
  color: var(--text);
  opacity: 0.6;
  margin: 0;
  font-size: 13px;
`;

const EditIconBtn = styled.button`
  background: none;
  border: none;
  color: var(--text);
  opacity: 0.5;
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
  &:hover { opacity: 1; }
`;

const EditForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const EditLabel = styled.label`
  color: var(--text);
  font-size: 12px;
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const EditInput = styled.input`
  background: var(--bg, #0d0d0d);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 6px;
  padding: 10px 12px;
  color: var(--text);
  font-size: 14px;
  outline: none;
  &:focus { border-color: var(--primary, #6c5ce7); }
`;

const EditTextarea = styled.textarea`
  background: var(--bg, #0d0d0d);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 6px;
  padding: 10px 12px;
  color: var(--text);
  font-size: 14px;
  outline: none;
  resize: vertical;
  font-family: inherit;
  &:focus { border-color: var(--primary, #6c5ce7); }
`;

const EditActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
`;

const CancelBtn = styled.button`
  background: none;
  border: 1px solid rgba(255,255,255,0.2);
  color: var(--text);
  border-radius: 6px;
  padding: 7px 14px;
  font-size: 13px;
  cursor: pointer;
  &:hover { opacity: 0.8; }
`;

const SaveBtn = styled.button`
  background: var(--primary, #6c5ce7);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 7px 14px;
  font-size: 13px;
  cursor: pointer;
  font-weight: 600;
  &:disabled { opacity: 0.5; cursor: default; }
  &:hover:not(:disabled) { opacity: 0.85; }
`;

const Page = styled.div`
  min-height: 100vh;
  background: var(--bg, #0d0d0d);
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  padding: 4px;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  padding: 4px;
`;

const Title = styled.h1`
  color: var(--text);
  font-size: 18px;
  margin: 0;
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: var(--text);
  opacity: 0.6;
  font-size: 16px;
`;

const UploadZone = styled.div`
  border: 2px dashed ${({ dragOver }) => dragOver ? 'var(--primary, #bb86fc)' : 'var(--text)'};
  border-radius: 12px;
  padding: 32px;
  margin: 20px;
  text-align: center;
  cursor: pointer;
  color: var(--text);
  opacity: ${({ dragOver }) => dragOver ? '0.8' : '0.6'};
  background: ${({ dragOver }) => dragOver ? 'rgba(187, 134, 252, 0.1)' : 'transparent'};
  transition: all 0.2s;
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
  margin: 16px 20px;
`;

const SectionLabel = styled.p`
  color: var(--text);
  opacity: 0.5;
  font-size: 13px;
  margin: 0 20px 12px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  padding: 0 20px 20px;
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

const EmptyMsg = styled.p`
  color: var(--text);
  opacity: 0.6;
  text-align: center;
  grid-column: 1 / -1;
  padding: 60px 0;
`;

export default PhotoAlbumEdit;
