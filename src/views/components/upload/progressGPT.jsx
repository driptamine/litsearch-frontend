import React, { useState, useEffect } from 'react';

const VideoProgress = ({ videoId }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Function to fetch progress from API
    const fetchProgress = async () => {
      const response = await axios.get(`/api/video-progress/${videoId}/`);
      const data = await response.json();
      setProgress(data.progress);
    };

    // Polling every second
    const interval = setInterval(fetchProgress, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [videoId]);

  return (
    <div>
      <h3>Video Processing Progress: {progress}%</h3>
      <progress value={progress} max="100" />
    </div>
  );
};

export default VideoProgress;
