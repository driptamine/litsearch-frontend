import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import styled from 'styled-components';

import PreviewPost from './PreviewPost';
import VideoAttachment from './attachments/VideoAttachment';
import PhotoAttachment from './attachments/PhotoAttachment';
import TrackAttachment from './attachments/TrackAttachment';

import {
  FlexBoxWrapper,
  FlexBoxAttachments,
  DropZone,
  CreatePostButton,
  Attachments,
  TextArea,
} from './styles';

const PostCreator = ({ mediaIds, showDropZone }) => {
  const [description, setDescription] = useState('');
  const [submittedPost, setSubmittedPost] = useState('');
  const [photoIds, setPhotoIds] = useState([]);
  const [videoIds, setVideoIds] = useState([]);
  const [trackIds, setTrackIds] = useState([]);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (mediaIds) {
      setPhotoIds(mediaIds.photo_ids || []);
      setVideoIds(mediaIds.video_ids || []);
      setTrackIds(mediaIds.track_ids || []);
    }
  }, [mediaIds]);

  const handleChange = (e) => {
    setDescription(e.target.value);
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    try {
      const postData = {
        description,
        photo_ids: photoIds,
        video_ids: videoIds,
        track_ids: trackIds,
      };

      const response = await axios.post(`${LITLOOP_API_URL}/posts/create_post_api/`, postData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 201) {
        setSubmittedPost(response.data);
        setDescription('');
      }
    } catch (error) {
      console.error('Error creating the post:', error);
    }
  };

  const showAttachment = photoIds.length > 0 || videoIds.length > 0 || trackIds.length > 0;

  return (
    <div>
      <TextArea
        ref={textareaRef}
        onInput={handleInput}
        value={description}
        onChange={handleChange}
        placeholder="Write your post here..."
        rows="6"
      />

      <FlexBoxWrapper>
        <FlexBoxAttachments>
          <PhotoAttachment />
          <TrackAttachment />
          <VideoAttachment />
        </FlexBoxAttachments>

        <CreatePostButton onClick={handleSubmit}>Create Post</CreatePostButton>
      </FlexBoxWrapper>

      {showDropZone && (
        <DropZone>
          <p>Drop files to upload</p>
        </DropZone>
      )}

      {submittedPost && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px', whiteSpace: 'pre-wrap' }}>
          <p>{submittedPost.message}</p>
          <Link to={`/posts/${submittedPost.post_id}`}>View Post</Link>
        </div>
      )}

      <Attachments>
        {showAttachment && <><strong>Attached:</strong><br /></>}
        {photoIds.length > 0 && <>Photos: {photoIds.join(', ')}<br /></>}
        {videoIds.length > 0 && <>Videos: {videoIds.join(', ')}<br /></>}
        {trackIds.length > 0 && <>Tracks: {trackIds.join(', ')}<br /></>}
      </Attachments>
    </div>
  );
};

export default PostCreator;
