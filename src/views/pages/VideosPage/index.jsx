import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { styled } from '@linaria/react';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';
import CustomPlayerV4 from 'views/components/video-player/web/CustomPlayerV4';

function UserVideosPage() {
  const { username } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${LITLOOP_API_URL}/users/${username}/videos/`,
          { headers: authHeader() }
        );
        const data = res.data;
        setVideos(data.results || data.videos || data || []);
      } catch (err) {
        console.error('Failed to fetch videos:', err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [username]);

  return (
    <Container>
      <Main>
        <Header>
          <Title>{username}'s Videos</Title>
        </Header>
        <Grid>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : videos.map(video => (
                <VideoCard key={video.id || video.pk}>
                  <CustomPlayerV4 url={video.r2_url || video.gcs_url || video.file_path || video.url} />
                  <VideoInfo>
                    <VideoTitle>{video.title || 'Untitled Video'}</VideoTitle>
                  </VideoInfo>
                </VideoCard>
              ))}
          {!loading && videos.length === 0 && (
            <EmptyMsg>No videos found.</EmptyMsg>
          )}
        </Grid>
      </Main>
    </Container>
  );
}

const Container = styled.div`
  display: flex;

  @media (min-width: 768px) {
    padding-left: 240px;
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 16px;
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: var(--text);
  font-size: 24px;
  margin: 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
`;

const VideoCard = styled.div`
  background: var(--cardColor, #1a1a1a);
  border-radius: 12px;
  overflow: hidden;
`;

const VideoInfo = styled.div`
  padding: 12px;
`;

const VideoTitle = styled.h3`
  color: var(--text);
  margin: 0;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SkeletonCard = styled.div`
  aspect-ratio: 16 / 10;
  border-radius: 12px;
  background: var(--cardColor, #1a1a1a);
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
  padding: 40px 0;
`;

export default UserVideosPage;
