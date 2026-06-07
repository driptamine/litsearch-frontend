import React, { useState, useRef } from 'react';
import { styled } from '@linaria/react';
import { VideoUploader } from '../videos/VideoUploader';
import { PhotoUploader } from '../photos/PhotoUploader';
import { TrackUploader } from '../tracks/TrackUploader';
import { BaseMediaUploader } from '../base/BaseMediaUploader';
import { PostForm } from './PostForm';

const PostCreatorV2 = ({ onPostSuccess }) => {
  const [photoIds, setPhotoIds] = useState([]);
  const [videoIds, setVideoIds] = useState([]);
  const [trackIds, setTrackIds] = useState([]);
  const [showDropZone, setShowDropZone] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState([]);
  const dragCounter = useRef(0);

  const resetMedia = (newPost) => {
    setPhotoIds([]);
    setVideoIds([]);
    setTrackIds([]);
    if (onPostSuccess) onPostSuccess(newPost);
  };

  const handleMediaUpload = (id, type) => {
   switch (type) {
     case 'photo':
       setPhotoIds(prev => [...prev, id]);
       break;
     case 'video':
       setVideoIds(prev => [...prev, id]);
       break;
     case 'track':
       setTrackIds(prev => [...prev, id]);
       break;
     default:
       console.warn('Unknown media type uploaded:', type);
   }
 };

 const handleDragEnter = (e) => {
  e.preventDefault();
  dragCounter.current += 1;
  setShowDropZone(true);
};

const handleDragLeave = (e) => {
  e.preventDefault();
  dragCounter.current -= 1;
  if (dragCounter.current <= 0) {
    setShowDropZone(false);
  }
};

const handleDragOver = (e) => {
  e.preventDefault();
};

const handleDrop = (e) => {
  e.preventDefault();
  dragCounter.current = 0;
  setShowDropZone(false);
  const files = Array.from(e.dataTransfer.files);
  if (files.length > 0) {
    setDroppedFiles(files);
  }
};

  const uploaderRef = useRef();

  return (
    <Wrapper
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <PostForm
        mediaIds={{
          photo_ids: photoIds,
          video_ids: videoIds,
          track_ids: trackIds
        }}
        onPostSuccess={resetMedia}
      />

      <BaseMediaUploader
        ref={uploaderRef}
        onUploadComplete={handleMediaUpload}
        mediaType={['photo', 'video', 'track']}
        label="Upload Photos, Videos, or Tracks (Optional)"
        droppedFiles={droppedFiles}
        hideUI={true}
        autoUpload={false}
        />

      {showDropZone && (
        <DropZone>
          <p>Drop files to upload</p>
        </DropZone>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
`;

const DropZone = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(240, 248, 255, 0.85);
  border: 2px dashed #4a90e2;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  color: #333;
  pointer-events: none;
  border-radius: 20px;
  transition: all 0.2s ease;
`;

export default PostCreatorV2;
