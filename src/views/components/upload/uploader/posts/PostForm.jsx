import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';

export const PostForm = ({ mediaIds }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photoIds, setPhotoIds] = useState([]);
  const [videoIds, setVideoIds] = useState([]);
  const [trackIds, setTrackIds] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (mediaIds) {
      setPhotoIds(mediaIds.photo_ids || []);
      setVideoIds(mediaIds.video_ids || []);
      setTrackIds(mediaIds.track_ids || []);
    }
  }, [mediaIds]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${LITLOOP_API_URL}/posts/create_post_api/`;
    const postData = {
      description: description,
      photo_ids: photoIds,
      video_ids: videoIds,
      track_ids: trackIds,
    };

    try {
      const response = await axios.post(url, postData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = response.data;
      setMessage(`✅ Post created (ID: ${result.post_id})`);

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setMessage(`❌ Error: ${err.response.data.error}`);
      } else {
        setMessage(`❌ Error: ${err.message}`);
      }
    }
  };


  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
      <h3>Create Post</h3>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Body"
        required
        style={{
          width: '100%',
          marginBottom: 10,
          // background: `${props => props.theme.cardColor}`,
          // background: `black`
        }}
      />
      <div style={{ marginBottom: 10 }}>
        <strong>Attached:</strong><br />
        {photoIds.length > 0 && <>Photos: {photoIds.join(', ')}<br /></>}
        {videoIds.length > 0 && <>Videos: {videoIds.join(', ')}<br /></>}
        {trackIds.length > 0 && <>Tracks: {trackIds.join(', ')}<br /></>}
      </div>
      <button onClick={handleSubmit}>Submit Post</button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </form>
  );
}

// export default PostForm;
