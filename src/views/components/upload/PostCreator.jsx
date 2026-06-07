// https://chatgpt.com/c/66f1ffb6-9578-800c-be4f-8b7bd1d2517e
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './modal/portal.css';
import { styled } from '@linaria/react';
import { LITLOOP_API_URL } from 'core/constants/urls';

import { FaFilm } from 'react-icons/fa';
import { FaImage } from 'react-icons/fa';
import { FaMusic } from 'react-icons/fa';


const PostCreator = ({ mediaIds, showDropZone, onAttachClick, onPostSuccess }) => {
  const [postText, setPostText] = useState('');
  const [submittedPost, setSubmittedPost] = useState('');

  const [description, setDescription] = useState('');
  const [photoIds, setPhotoIds] = useState([]);
  const [videoIds, setVideoIds] = useState([]);
  const [trackIds, setTrackIds] = useState([]);

  // ... rest of state ...

  const handleChange = (e) => {
    setDescription(e.target.value);
  };

  useEffect(() => {
    if (mediaIds) {
      setPhotoIds(mediaIds.photo_ids || []);
      setVideoIds(mediaIds.video_ids || []);
      setTrackIds(mediaIds.track_ids || []);
    }
  }, [mediaIds]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (description.trim()) {
      try {
        const postData = {
          description: description,
          photo_ids: photoIds,
          video_ids: videoIds,
          track_ids: trackIds,
          media_attachments: [
            ...photoIds.map(id => ({ id, type: 'photo' })),
            ...videoIds.map(id => ({ id, type: 'video' })),
            ...trackIds.map(id => ({ id, type: 'track' }))
          ]
        };

        const response = await axios.post(`${LITLOOP_API_URL}/posts/create_post_api/`, postData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 201) {
          setSubmittedPost(response.data);
          setDescription('');
          setPhotoIds([]);
          setVideoIds([]);
          setTrackIds([]);
          if (onPostSuccess) onPostSuccess(response.data);
        }
      } catch (error) {
        console.error('There was an error creating the post:', error);
      }
    }
  };

  const textareaRef = useRef(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
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
          <WrapperContent>
            <Button onClick={onAttachClick}>
              <FaImage />
            </Button>
          </WrapperContent>
          <WrapperContent>
            <Button onClick={onAttachClick}>
              <FaMusic />
            </Button>
          </WrapperContent>
          <WrapperContent>
            <Button onClick={onAttachClick}>
              <FaFilm />
            </Button>
          </WrapperContent>
        </FlexBoxAttachments>

        <CreatePostButton onClick={handleSubmit}>Create Post</CreatePostButton>
      </FlexBoxWrapper>

      {showDropZone && (
        <DropZone>
          <p>Drop files to upload</p>
        </DropZone>
      )}

      {submittedPost && (
        <div
          style={{
            marginTop: '20px',
            border: '1px solid #ccc',
            padding: '10px',
            whiteSpace: 'pre-wrap',
          }}
        >
          <p>{submittedPost.message}</p>
          <Link to={`/posts/${submittedPost.post_id}`}>
            View Post
          </Link>
        </div>
      )}

      <Attachments className="attachments">
        {showAttachment && (
          <>
            <strong>Attached:</strong><br />
          </>
        )}
        {photoIds.length > 0 && <>Photos: {photoIds.join(', ')}<br /></>}
        {videoIds.length > 0 && <>Videos: {videoIds.join(', ')}<br /></>}
        {trackIds.length > 0 && <>Tracks: {trackIds.join(', ')}<br /></>}
      </Attachments>
    </div>
  );
};

const FlexBoxAttachments = styled.div`
  display: flex;

`;
const Attachments = styled.div`


`;

const FlexBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 600px;

  background: var(--cardColor);
`;

const DropZone = styled.div`
  /* position: fixed; */
  /* top: 0; */
  /* left: 0; */

  position: absolute;
  top: 81px;
  width: 597px;
  height: 142px;

  /* width: 300px; */
  /* height: 300px; */
  background: rgba(240, 248, 255, 0.85);
  border: 2px dashed #4a90e2;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  color: #333;
  pointer-events: all;
  transition: all 0.2s ease;
`;

const Button = styled.div`
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const CreatePostButton = styled.button`
  cursor: pointer;
  //margin: auto;
  margin-left: auto;
  color: white;
  height: 40px;
  right: 0;
  background: #7886c9;
  border-radius: 5px;
  border: none;

  user-select: none;
`
const WrapperContent = styled.div`
  cursor: pointer;
  margin-left: 10px;
  margin: auto;


  border-radius: 5px;

  &:hover {

    background-color: var(--attachmentColor);
  }

`;
const WrapperVideo = styled.div`
  cursor: pointer;
  margin-left: 10px;
  margin: auto;
  padding: 10px;
  border-radius: 5px;

  &:hover {

    background-color: var(--attachmentColor);
  }
`;

const TextArea = styled.textarea`
  box-sizing: border-box;
  display: block;
  background: var(--cardColor);
  color: var(--text);

  width: 100%;

  padding-left: 10px;
  padding-top: 10px;
  padding-right: 0;
  resize: none;

  outline: none;
  border-bottom: 1px solid var(--textareaBorderColor);

  border-left: none;
  border-top: none;
  border-right: none;

  &:focus {
    outline: none;
    border-bottom: 1px solid var(--textareaBorderColor);

    border-left: none;
    border-top: none;
    border-right: none;
  }
`

export default PostCreator;
