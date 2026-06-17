import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@linaria/react';
import { FaMusic } from 'react-icons/fa';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';
import TrackRow from 'views/components/TrackRow';
import { TrackUploader } from 'views/components/upload/uploader/tracks/TrackUploader';
import TrackPickerModal from 'views/components/upload/uploader/posts/TrackPickerModal';

const UserTracks = ({ username }) => {
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrackPicker, setShowTrackPicker] = useState(false);

  const fetchUserTracks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${LITLOOP_API_URL}/users/${username}/tracks/`,
        { headers: authHeader() }
      );
      const data = response.data;
      const tracksData = data.results || data.tracks || data;
      setTracks(Array.isArray(tracksData) ? tracksData : []);
    } catch (err) {
      console.error('Error fetching user tracks:', err);
      setError('Failed to load tracks.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchUserTracks();
    }
  }, [username]);

  if (isLoading) return <Message>Loading tracks...</Message>;
  if (error) return <Message error>{error}</Message>;
  if (!tracks || tracks.length === 0) return <NoTracks>No tracks yet.</NoTracks>;

  const handleTrackUpdated = (updatedTrack) => {
    setTracks(prev => prev.map(t =>
      (t.pk || t.uri || t.id) === (updatedTrack.pk || updatedTrack.uri || updatedTrack.id) ? updatedTrack : t
    ));
  };

  const handleTrackDeleted = (trackId) => {
    setTracks(prev => prev.filter(t => (t.pk || t.uri || t.id) !== trackId));
  };

  const handleTrackUpload = () => {
    fetchUserTracks();
  };

  const handleTracksAdded = (selectedTracks) => {
    setTracks(prev => {
      const existing = new Set(prev.map(t => t.pk || t.id));
      const newOnes = selectedTracks.filter(t => !existing.has(t.pk || t.id));
      return [...newOnes, ...prev];
    });
  };

  return (
    <Wrapper>
      <Toolbar>
        <Header>Tracks ({tracks.length})</Header>
        <Actions>
          <TrackUploader onTrackUpload={handleTrackUpload} />
          <AddBtn onClick={() => setShowTrackPicker(true)}>
            <FaMusic />
          </AddBtn>
        </Actions>
      </Toolbar>
      <TrackList>
        {tracks.map((track, i) => (
          <TrackRow
            key={track.pk || track.id || i}
            track={track}
            index={i}
            showEdit={true}
            onTrackUpdated={handleTrackUpdated}
            onTrackDeleted={handleTrackDeleted}
          />
        ))}
      </TrackList>
      {showTrackPicker && (
        <TrackPickerModal
          onSelect={handleTracksAdded}
          onClose={() => setShowTrackPicker(false)}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Header = styled.h3`
  color: white;
  font-family: Verdana;
  margin: 20px 0;
  padding: 0 10px;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AddBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  background: transparent;
  color: #1db954;
  border: 1px solid #1db954;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  &:hover {
    background: rgba(29, 185, 84, 0.1);
  }
`;

const TrackList = styled.div`
  background: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
`;

const Message = styled.div`
  text-align: center;
  padding: 20px;
  color: ${({ error }) => (error ? '#ff4d4d' : '#888')};
`;

const NoTracks = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  background-color: #1a1a1a;
  border-radius: 12px;
  border: 1px dashed #444;
  width: 100%;
`;

export default UserTracks;
