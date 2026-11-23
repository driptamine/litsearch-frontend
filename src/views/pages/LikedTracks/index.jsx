import React, { useState, useEffect, useCallback } from 'react';
import { styled } from '@linaria/react';
import { FaPlay } from 'react-icons/fa';
import { chatRequest } from 'core/api/chatSession';
import TrackRow from 'views/components/TrackRow';
import { usePlayer } from 'core/context/PlayerContext';

function LikedTracksPage() {
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const player = usePlayer();

  const fetchLiked = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await chatRequest('/tracks/liked/');
      setTracks(Array.isArray(data?.tracks) ? data.tracks : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching liked tracks:', err);
      setError('Failed to load library.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiked();
  }, [fetchLiked]);

  return (
    <Wrapper>
      <Header>
        <Title>My Library</Title>
        {tracks.length > 0 && (
          <PlayAllBtn onClick={() => player?.playQueue(tracks, 0)} title="Play all">
            <FaPlay size={12} /> Play all
          </PlayAllBtn>
        )}
      </Header>
      {isLoading && <Message>Loading library...</Message>}
      {error && <Message error>{error}</Message>}
      {!isLoading && !error && tracks.length === 0 && (
        <Empty>Tap the heart in the player to save tracks here.</Empty>
      )}
      {!isLoading && !error && tracks.length > 0 && (
        <TrackList>
          {tracks.map((track, i) => (
            <TrackRow
              key={track.pk || track.id || i}
              track={track}
              index={i}
              queue={tracks}
            />
          ))}
        </TrackList>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding-bottom: 120px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 4px;
`;

const Title = styled.h2`
  margin: 0;
  color: white;
  font-size: 1.3rem;
`;

const PlayAllBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  background: #e91e63;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  &:hover { background: #d81b60; }
`;

const TrackList = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
`;

const Message = styled.p`
  text-align: center;
  padding: 40px 20px;
  color: ${({ error }) => (error ? '#ff4d4d' : '#888')};
`;

const Empty = styled.div`
  text-align: center;
  padding: 50px 20px;
  color: #666;
  background-color: #1a1a1a;
  border-radius: 12px;
  border: 1px dashed #444;
`;

export default LikedTracksPage;
