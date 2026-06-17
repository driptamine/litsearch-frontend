import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { styled } from '@linaria/react';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';
import PhotoAlbumCreatorModal from './PhotoAlbumCreatorModal';

function PhotoAlbumPage() {
  const { username } = useParams();
  const history = useHistory();
  const [photoAlbums, setPhotoAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreator, setShowCreator] = useState(false);

  useEffect(() => {
    if (!username) return;
    const fetchPhotoAlbums = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${LITLOOP_API_URL}/users/${username}/albums/`,
          { headers: authHeader() }
        );
        const data = response.data;
        setPhotoAlbums(data.albums || data.results || []);
      } catch (err) {
        console.error('Failed to fetch albums:', err);
        setPhotoAlbums([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotoAlbums();
  }, [username]);

  const handlePhotoAlbumCreated = (newPhotoAlbum) => {
    setPhotoAlbums(prev => [{ ...newPhotoAlbum, thumbnail_url: null }, ...prev]);
  };

  return (
    <Container>
      <Main>
        <HeaderRow>
          <Header>{username}'s Photo Albums</Header>
          <AddButton onClick={() => setShowCreator(true)}>+ New Album</AddButton>
        </HeaderRow>
        <Grid>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <PhotoAlbumSkeleton key={i} />)
            : photoAlbums.map(photoAlbum => (
                <PhotoAlbumCard key={photoAlbum.id} onClick={() => history.push(`/${username}/albums/${photoAlbum.id}`)}>
                  <PhotoAlbumThumb
                    src={photoAlbum.thumbnail_url || 'https://via.placeholder.com/240'}
                    alt={photoAlbum.title}
                  />
                  <PhotoAlbumInfo>
                    <PhotoAlbumTitle>{photoAlbum.title}</PhotoAlbumTitle>
                    <PhotoAlbumMeta>{photoAlbum.photo_count} photos</PhotoAlbumMeta>
                  </PhotoAlbumInfo>
                </PhotoAlbumCard>
              ))}
        </Grid>
      </Main>
      {showCreator && (
        <PhotoAlbumCreatorModal
          username={username}
          onClose={() => setShowCreator(false)}
          onCreated={handlePhotoAlbumCreated}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
`;

const Main = styled.main`
  flex: 1;
  padding: 16px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Header = styled.h1`
  color: var(--text);
  font-size: 24px;
  margin: 0;
`;

const AddButton = styled.button`
  background: var(--primary, #bb86fc);
  color: #000;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  &:hover { opacity: 0.9; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
`;

const PhotoAlbumCard = styled.div`
  border-radius: 8px;
  overflow: hidden;
  background: var(--cardColor);
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.02);
  }
`;

const PhotoAlbumThumb = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
`;

const PhotoAlbumInfo = styled.div`
  padding: 12px;
`;

const PhotoAlbumTitle = styled.h3`
  color: var(--text);
  margin: 0 0 4px;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PhotoAlbumMeta = styled.p`
  color: var(--text);
  opacity: 0.6;
  margin: 0;
  font-size: 13px;
`;

const PhotoAlbumSkeleton = styled.div`
  border-radius: 8px;
  background: var(--cardColor);
  aspect-ratio: 1;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
`;

export default PhotoAlbumPage;
