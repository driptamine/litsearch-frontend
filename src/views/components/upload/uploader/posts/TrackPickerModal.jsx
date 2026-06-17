import React, { useState, useEffect, useCallback, useRef } from 'react';
import { styled } from '@linaria/react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';
import { useMediaUpload } from './useMediaUpload';

function TrackPickerModal({ onSelect, onClose }) {
  const username = useSelector((state) => state.users?.username);
  const [tracks, setTracks] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounter = useRef(0);
  const { uploadFiles, isUploading, progress } = useMediaUpload();

  const fetchTracks = useCallback(async () => {
    if (!username) return [];
    try {
      const res = await axios.get(
        `${LITLOOP_API_URL}/users/${username}/tracks/`,
        { headers: authHeader() }
      );
      const data = res.data;
      const tracksData = data.results || data.tracks || data;
      const list = Array.isArray(tracksData) ? tracksData : [];
      setTracks(list);
      return list;
    } catch (err) {
      console.error('Error fetching tracks:', err);
      setError('Failed to load tracks.');
      return [];
    }
  }, [username]);

  useEffect(() => {
    if (!username) {
      setError('User not found.');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    fetchTracks().finally(() => setIsLoading(false));
  }, [username, fetchTracks]);

  const toggle = (track) => {
    const pk = track.pk || track.id;
    setSelectedTracks(prev => {
      const exists = prev.find(t => (t.pk || t.id) === pk);
      if (exists) return prev.filter(t => (t.pk || t.id) !== pk);
      return [...prev, track];
    });
  };

  const handleAdd = () => {
    onSelect(selectedTracks);
    onClose();
  };

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    dragCounter.current = 0;

    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;

    const results = await uploadFiles(files, 'track');
    const newTrackIds = new Set(results.map(r => r.id).filter(Boolean));
    if (newTrackIds.size) {
      const refreshed = await fetchTracks();
      const toAdd = refreshed.filter(t => newTrackIds.has(t.pk || t.id));
      setSelectedTracks(prev => {
        const existing = new Set(prev.map(t => t.pk || t.id));
        return [...prev, ...toAdd.filter(t => !existing.has(t.pk || t.id))];
      });
    }
  }, [uploadFiles, fetchTracks]);

  return (
    <Overlay onClick={onClose}>
      <Modal
        onClick={e => e.stopPropagation()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Header>
          Select Tracks
          <CloseBtn onClick={onClose}>&times;</CloseBtn>
        </Header>
        <Body>
          {isDragOver && (
            <DropOverlay>
              <DropIcon>+</DropIcon>
              <DropText>Drop tracks to upload</DropText>
            </DropOverlay>
          )}
          {isUploading && (
            <ProgressSection>
              <ProgressLabel>Uploading tracks... {progress}%</ProgressLabel>
              <ProgressTrack>
                <ProgressFill style={{ width: `${progress}%` }} />
              </ProgressTrack>
            </ProgressSection>
          )}
          {isLoading && <Message>Loading tracks...</Message>}
          {error && <Message error>{error}</Message>}
          {!isLoading && !error && !isUploading && tracks.length === 0 && (
            <EmptyState>
              <EmptyIcon>🎵</EmptyIcon>
              <EmptyTitle>No tracks yet</EmptyTitle>
              <EmptyHint>Drag & drop audio files here to upload</EmptyHint>
            </EmptyState>
          )}
          {!isLoading && !error && tracks.length > 0 && (
            <TrackList>
              {tracks.map((track, i) => {
                const pk = track.pk || track.id || i;
                const name = track.name || `Track ${i + 1}`;
                const artist = Array.isArray(track.artists)
                  ? track.artists.map(a => a.name || a).join(', ')
                  : track.artist || '';
                const selected = selectedTracks.some(t => (t.pk || t.id) === pk);
                return (
                  <TrackRow key={pk} selected={selected} onClick={() => toggle(track)}>
                    <TrackNum>{i + 1}</TrackNum>
                    <TrackInfo>
                      <TrackName>{name}</TrackName>
                      {artist && <TrackArtist>{artist}</TrackArtist>}
                    </TrackInfo>
                    <Checkbox selected={selected}>
                      {selected && <CheckMark>✓</CheckMark>}
                    </Checkbox>
                  </TrackRow>
                );
              })}
            </TrackList>
          )}
        </Body>
        <Footer>
          <CancelBtn onClick={onClose}>Cancel</CancelBtn>
          <AddBtn disabled={selectedTracks.length === 0} onClick={handleAdd}>
            Add Selected ({selectedTracks.length})
          </AddBtn>
        </Footer>
      </Modal>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const Modal = styled.div`
  background: #1a1a1a;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  border: 1px solid #333;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  border-bottom: 1px solid #333;
`;

const CloseBtn = styled.button`
  background: none; border: none; color: #888;
  font-size: 1.5rem; cursor: pointer; padding: 0; line-height: 1;
  &:hover { color: white; }
`;

const Body = styled.div`
  padding: 0;
  overflow-y: auto;
  flex: 1;
  position: relative;
`;

const Footer = styled.div`
  display: flex; gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #333;
`;

const DropOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 150, 136, 0.12);
  backdrop-filter: blur(3px);
  z-index: 10;
  gap: 8px;
`;

const DropIcon = styled.span`
  font-size: 2.5rem;
  color: #009688;
  font-weight: 300;
`;

const DropText = styled.span`
  color: #009688;
  font-size: 1rem;
  font-weight: 600;
`;

const TrackList = styled.div`
  display: flex;
  flex-direction: column;
`;

const TrackRow = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  cursor: pointer;
  background: ${({ selected }) => (selected ? '#2a2a2a' : 'transparent')};

  &:hover {
    background: ${({ selected }) => (selected ? '#2a2a2a' : '#222')};
  }
`;

const TrackNum = styled.span`
  font-family: Verdana;
  color: #888;
  width: 24px;
  flex-shrink: 0;
  font-size: 14px;
`;

const TrackInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  margin-left: 10px;
`;

const TrackName = styled.span`
  font-family: Verdana;
  font-size: 15px;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtist = styled.span`
  font-family: Verdana;
  font-size: 13px;
  color: #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Checkbox = styled.div`
  width: 22px; height: 22px;
  border-radius: 50%;
  border: 2px solid ${({ selected }) => (selected ? '#0084ff' : '#555')};
  background: ${({ selected }) => (selected ? '#0084ff' : 'transparent')};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 10px;
  transition: all 0.15s;
`;

const CheckMark = styled.span`
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

const ProgressSection = styled.div`
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const ProgressLabel = styled.span`
  color: #aaa;
  font-size: 0.95rem;
`;

const ProgressTrack = styled.div`
  width: 80%;
  max-width: 300px;
  height: 6px;
  background: #333;
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #009688;
  border-radius: 3px;
  transition: width 0.3s ease;
`;

const Message = styled.p`
  text-align: center;
  padding: 40px 20px;
  color: ${({ error }) => (error ? '#ff4d4d' : '#888')};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
  gap: 12px;
`;

const EmptyIcon = styled.span`
  font-size: 3rem;
`;

const EmptyTitle = styled.p`
  color: #aaa;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const EmptyHint = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin: 0;
`;

const CancelBtn = styled.button`
  flex: 1; padding: 10px;
  background: transparent; color: #aaa;
  border: 1px solid #444; border-radius: 8px;
  font-size: 0.95rem; cursor: pointer;
  &:hover { background: #222; }
`;

const AddBtn = styled.button`
  flex: 1; padding: 10px;
  background: #0084ff; color: white;
  border: none; border-radius: 8px;
  font-size: 0.95rem; font-weight: 600; cursor: pointer;
  &:disabled { opacity: 0.4; cursor: not-allowed; }
  &:hover:not(:disabled) { background: #0073e6; }
`;

export default TrackPickerModal;
