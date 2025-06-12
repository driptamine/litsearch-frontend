import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import VideoCard from 'views/pages/VideoFeedProfile/VideoCard';
import { api_data } from 'views/pages/VideoFeedProfile/data/api_data.jsx';

const videos_data = api_data;


export const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetch delay
    const timer = setTimeout(() => {
      setVideos(api_data);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const skeletonCount = 12;
  return (
    <Container>
      <Main>
        <Grid>
          {(loading ? Array.from({ length: skeletonCount }) : videos).map((video, i) => (
            <VideoCard key={video?.id ?? i} video={video} loading={loading} />
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
