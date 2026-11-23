import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { styled } from '@linaria/react';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';
import { FaTimes, FaArrowLeft, FaPlus } from 'react-icons/fa';

function PhotoAlbumModal() {
  const { username, photoAlbumId } = useParams();
  const history = useHistory();
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const goBack = () => history.push(`/${username}/albums`);

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

  return (
    <Page>
      <TopBar>
        <BackBtn onClick={goBack}><FaArrowLeft size={18} /></BackBtn>
        <Title>{album?.title || 'Album'}</Title>
        <CloseBtn onClick={goBack}><FaTimes size={20} /></CloseBtn>
      </TopBar>
      {album?.description && <Description>{album.description}</Description>}

      {loading ? (
        <LoadingState>Loading...</LoadingState>
      ) : album ? (
        <>
          <ActionBar>
            <AddButton onClick={() => history.push(`/${username}/albums/${photoAlbumId}/edit`)}>
              <FaPlus size={14} /> Add Photos
            </AddButton>
          </ActionBar>
          <Grid>
            {photos.length === 0 ? (
              <EmptyMsg>No photos in this album yet.</EmptyMsg>
            ) : (
              photos.map(photo => (
                <PhotoItem key={photo.id}>
                  <PhotoImg src={photo.r2_url || photo.image || photo.gcs_url} alt={photo.title} />
                </PhotoItem>
              ))
            )}
          </Grid>
        </>
      ) : (
        <LoadingState>Album not found</LoadingState>
      )}
    </Page>
  );
}

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

const Description = styled.p`
  color: var(--text);
  opacity: 0.7;
  padding: 12px 20px;
  margin: 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 12px 20px;
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

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: var(--text);
  opacity: 0.6;
  font-size: 16px;
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

const EmptyMsg = styled.p`
  color: var(--text);
  opacity: 0.6;
  text-align: center;
  grid-column: 1 / -1;
  padding: 60px 0;
`;

export default PhotoAlbumModal;
