import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@linaria/react';
import { PhotoCard } from 'views/pages/PhotosPage/PhotoCard';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';
export const PhotosPage = () => {
  const { username } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${LITLOOP_API_URL}/users/${username}/photos/`,
          { headers: authHeader() }
        );
        const data = response.data;
        const photosList = data.photos || data.results || [];
        setPhotos(photosList.map(p => ({
          ...p,
          thumbNail: p.image || p.gcs_url || p.url || p.file_path,
        })));
      } catch (err) {
        console.error('Failed to fetch photos:', err);
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [username]);

  const skeletonCount = 12;
  return (
    <Container>
      <Main>
        <Grid>
          {(loading ? Array.from({ length: skeletonCount }) : photos).map((photo, i) => (
            <PhotoCard key={photo?.id ?? i} photo={photo} loading={loading} />
          ))}
        </Grid>
      </Main>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
`;

const Main = styled.main`
  flex: 1;
  padding: 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
`;
