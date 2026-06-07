import React from 'react';
import BaseGridList from 'views/components/BaseGridList';

const PostVideoList = ({ videos }) => {
  if (!videos || videos.length === 0) return null;

  return (
    <BaseGridList
      items={videos}
      renderItem={(video) => {
        const videoUrl = video.hls_file || video.url || video;
        return (
          <div style={{ width: '100%', marginBottom: '10px' }}>
            <video 
              src={videoUrl} 
              controls 
              style={{ width: '100%', borderRadius: '8px', backgroundColor: '#000' }}
              poster={video.thumbNail || video.thumbnail}
            />
          </div>
        );
      }}
    />
  );
};

export default PostVideoList;
