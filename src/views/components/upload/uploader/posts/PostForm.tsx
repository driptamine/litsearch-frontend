import React, { useState, useEffect } from 'react';
import { styled } from '@linaria/react';
import { FaMusic, FaImage, FaFilm } from 'react-icons/fa';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';
import TrackRow from 'views/components/TrackRow';
import TrackPickerModal from './TrackPickerModal';
import PhotoPickerModal from './PhotoPickerModal';
import VideoPickerModal from './VideoPickerModal';

export const PostForm = ({ mediaIds, tracks = [], onPostSuccess, onTracksAdded, onPhotosAdded, onVideosAdded }) => {
  const [description, setDescription] = useState('');
  const [photoIds, setPhotoIds] = useState([]);
  const [videoIds, setVideoIds] = useState([]);
  const [trackIds, setTrackIds] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTrackPicker, setShowTrackPicker] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [showVideoPicker, setShowVideoPicker] = useState(false);

  useEffect(() => {
    if (mediaIds) {
      setPhotoIds(mediaIds.photo_ids || []);
      setVideoIds(mediaIds.video_ids || []);
      setTrackIds(mediaIds.track_ids || []);
    }
  }, [mediaIds]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const url = `${LITLOOP_API_URL}/posts/create/`;
    const postData = {
      description: description,
      photo_ids: photoIds,
      video_ids: videoIds,
      track_ids: trackIds
    };

    try {
      const response = await axios.post(url, postData, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        }
      });

      const result = response.data;
      setMessage(`✅ Post created (ID: ${result.id || result.post_id})`);
      setDescription('');
      if (onPostSuccess) onPostSuccess(result);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setMessage(`❌ Error: ${err.response.data.error}`);
      } else {
        setMessage(`❌ Error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
      <h3>Create Post</h3>

      <TextArea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      {tracks.length > 0 && (
        <PreviewList>
          {tracks.map((track, i) => (
            <TrackRow key={track.pk || track.id || i} track={track} index={i} />
          ))}
        </PreviewList>
      )}
      {(photoIds.length > 0 || videoIds.length > 0) && (
        <div style={{ marginBottom: 10, color: '#aaa', fontSize: '0.9rem' }}>
          <strong>Attached:</strong><br />
          {photoIds.length > 0 && <>Photos: {photoIds.join(', ')}<br /></>}
          {videoIds.length > 0 && <>Videos: {videoIds.join(', ')}<br /></>}
        </div>
      )}
      <ActionsRow>
        <LeftActions>
          <AddMediaBtn type="button" onClick={() => setShowPhotoPicker(true)} accent="#f0c040">
            <FaImage />
          </AddMediaBtn>
          <AddMediaBtn type="button" onClick={() => setShowVideoPicker(true)} accent="#a855f7">
            <FaFilm />
          </AddMediaBtn>
          <AddMediaBtn type="button" onClick={() => setShowTrackPicker(true)} accent="#1db954">
            <FaMusic />
          </AddMediaBtn>
        </LeftActions>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            background: isLoading ? '#555' : '#0084ff',
            color: 'white',
            fontWeight: 'bold',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Creating...' : 'Submit Post'}
        </button>
      </ActionsRow>
      {showPhotoPicker && (
        <PhotoPickerModal
          onSelect={(ids) => { onPhotosAdded?.(ids); setShowPhotoPicker(false); }}
          onClose={() => setShowPhotoPicker(false)}
        />
      )}
      {showVideoPicker && (
        <VideoPickerModal
          onSelect={(ids) => { onVideosAdded?.(ids); setShowVideoPicker(false); }}
          onClose={() => setShowVideoPicker(false)}
        />
      )}
      {showTrackPicker && (
        <TrackPickerModal
          onSelect={(trackObjects) => { onTracksAdded?.(trackObjects); setShowTrackPicker(false); }}
          onClose={() => setShowTrackPicker(false)}
        />
      )}
      {message && <p style={{ marginTop: 10, color: message.startsWith('✅') ? '#4caf50' : '#f44336' }}>{message}</p>}
    </form>
  );
}

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid var(--darkGrey);
  background: var(--cardColor);
  color: var(--text);
  resize: vertical;
`;

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftActions = styled.div`
  display: flex;
  gap: 6px;
`;

const PreviewList = styled.div`
  margin-bottom: 10px;
  background: #111;
  border-radius: 8px;
  overflow: hidden;
`;

const AddMediaBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  background: transparent;
  color: ${({ accent }) => accent || '#888'};
  border: 1px solid ${({ accent }) => accent || '#444'};
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;

  &:hover {
    background: ${({ accent }) => accent ? `${accent}1a` : 'rgba(255,255,255,0.05)'};
  }
`;
