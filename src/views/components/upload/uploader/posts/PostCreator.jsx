import React, { useState } from 'react';
import { VideoUploader } from '../videos/VideoUploader';
import { PhotoUploader } from '../photos/PhotoUploader';
import { TrackUploader } from '../tracks/TrackUploader';
import { BaseMediaUploader } from '../base/BaseMediaUploader';
import { PostForm } from './PostForm';

const PostCreatorV2 = () => {
  const [photoIds, setPhotoIds] = useState([]);
  const [videoIds, setVideoIds] = useState([]);
  const [trackIds, setTrackIds] = useState([]);

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

  return (
    <div>


      <PostForm
        mediaIds={{
          photo_ids: photoIds,
          video_ids: videoIds,
          track_ids: trackIds
        }}
      />

      <BaseMediaUploader
        onUploadComplete={handleMediaUpload}
        mediaType={['photo', 'video', 'track']}
        label="Upload Photos, Videos, or Tracks"
        />
    </div>
  );
};

export default PostCreatorV2;
