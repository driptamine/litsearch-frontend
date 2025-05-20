// https://chatgpt.com/c/86fdc306-ea01-4ae3-a1af-7ff40fde3408
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VideoEncodingProgress = ({ videoId, profileId }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Pending');

    useEffect(() => {
        const interval = setInterval(() => {
            axios.get(`/api/video-encoding-progress/${videoId}/${profileId}/`)
                .then(response => {
                    setProgress(response.data.progress);
                    setStatus(response.data.status);
                })
                .catch(error => {
                    console.error('Error fetching progress:', error);
                });
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [videoId, profileId]);

    return (
        <div>
            <p>Status: {status}</p>
            <progress value={progress} max="100">{progress}%</progress>
        </div>
    );
};

export default VideoEncodingProgress;
