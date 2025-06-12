import React from 'react';
import { BaseMediaUploader } from '../base/BaseMediaUploader';

export const TrackUploader = ({ onTrackUpload }) => (
  <BaseMediaUploader
    mediaType={['track']}
    onUploadComplete={onTrackUpload}
    label="Upload Tracks"
  />
);

// export default TrackUploader;
