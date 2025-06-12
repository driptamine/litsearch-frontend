import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {PhotoCard} from 'views/pages/PhotosPage/PhotoCard';
import { api_data } from 'views/pages/PhotosPage/data/api_data.jsx';

const videos_data = api_data;


export const PhotosPage = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetch delay
    const timer = setTimeout(() => {
      setPhotos(api_data);
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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
  )
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


// export default VideoFeed;
