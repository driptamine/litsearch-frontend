import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';

export const PostForm = ({ mediaIds, onPostSuccess }) => {
  const [description, setDescription] = useState('');
  const [photoIds, setPhotoIds] = useState([]);
  const [videoIds, setVideoIds] = useState([]);
  const [trackIds, setTrackIds] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
        style={{
          width: '100%',
          height: '100px',
          marginBottom: 10,
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #333',
          background: '#222',
          color: 'white',
          resize: 'vertical'
        }}
      />
      {(photoIds.length > 0 || videoIds.length > 0 || trackIds.length > 0) && (
        <div style={{ marginBottom: 10, color: '#aaa', fontSize: '0.9rem' }}>
          <strong>Attached Media:</strong><br />
          {photoIds.length > 0 && <>Photos: {photoIds.join(', ')}<br /></>}
          {videoIds.length > 0 && <>Videos: {videoIds.join(', ')}<br /></>}
          {trackIds.length > 0 && <>Tracks: {trackIds.join(', ')}<br /></>}
        </div>
      )}
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
      {message && <p style={{ marginTop: 10, color: message.startsWith('✅') ? '#4caf50' : '#f44336' }}>{message}</p>}
    </form>
  );
}

// export default PostForm;
