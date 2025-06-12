import React from 'react';
import { BaseMediaUploader } from '../base/BaseMediaUploader';

export const VideoUploader = ({ onVideoUpload }) => (
  <BaseMediaUploader
    mediaType={['video']}
    onUploadComplete={onVideoUpload}
    label="Upload Videos"
  />
);

// export default VideoUploader;
