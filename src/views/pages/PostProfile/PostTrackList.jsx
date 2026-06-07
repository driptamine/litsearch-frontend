import React from 'react';
import BaseGridList from 'views/components/BaseGridList';

const PostTrackList = ({ tracks }) => {
  if (!tracks || tracks.length === 0) return null;

  return (
    <BaseGridList
      items={tracks}
      renderItem={(track) => {
        const trackUrl = track.preview_url || track.url || track;
        return (
          <div style={{ width: '100%', marginBottom: '10px', padding: '10px', backgroundColor: '#1e1e1e', borderRadius: '8px' }}>
             <p style={{ color: 'white', marginBottom: '8px', fontSize: '14px' }}>{track.name || "Track"}</p>
             <audio 
              src={trackUrl} 
              controls 
              style={{ width: '100%' }}
            />
          </div>
        );
      }}
    />
  );
};

export default PostTrackList;
