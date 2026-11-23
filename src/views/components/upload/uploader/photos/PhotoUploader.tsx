import React from 'react';
import { BaseMediaUploader } from '../base/BaseMediaUploader';

export const PhotoUploader = ({ onPhotoUpload }) => (
  <BaseMediaUploader
    mediaType={['photo']}
    onUploadComplete={onPhotoUpload}
    label="Upload Photos"
  />
);

// export default PhotoUploader;
