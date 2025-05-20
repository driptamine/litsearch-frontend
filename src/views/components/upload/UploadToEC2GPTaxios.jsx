// reference: https://chatgpt.com/c/aeb65a7c-94d4-41e5-b9cd-7bfa209b32ec

import React, { useState } from 'react';
import axios from 'axios';
import VideoProgress from "views/components/upload/progressGPT";

const UploadGPTaxios = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [videoId, setVideoId] = useState(null);
  const CHUNK_SIZE = 1024 * 1024; // 1MB

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadChunk = async (chunk, chunkIndex, totalChunks) => {
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('chunkIndex', chunkIndex);
    formData.append('fileName', file.name);
    formData.append('totalChunks', totalChunks);

    const url = 'http://localhost:8000/videos/upload/';

    const config = {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((chunkIndex + progressEvent.loaded / chunk.size) / totalChunks * 100);
        setProgress(percentCompleted);
      }
    }

    try {
      await axios.post(
        url,
        formData,
        config
      );
    } catch (error) {
      throw new Error('Failed to upload chunk');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(file.size, start + CHUNK_SIZE);
      const chunk = file.slice(start, end);

      try {
        await uploadChunk(chunk, i, totalChunks);
      } catch (error) {
        console.error('Error uploading chunk:', error);
        return;
      }
    }

    // Trigger combining chunks after all chunks are uploaded
    try {
      const headers = {
        'Access-Control-Allow-Origin': '*',
      }
      const formData = new FormData();
      formData.append('fileName', file.name);

      const response = await axios.post(
        'http://localhost:8000/videos/combine_chunks/',
        formData,

      );

      setVideoId(response.data.video_id)

      if (response.status !== 200) {
        throw new Error('Failed to combine chunks');
      }

      // if (response.ok) {
      //   const data = await response.json();
      //   if (data.video_id) {
      //       setVideoId(data.video_id);
      //   }
      // }


    } catch (error) {
      console.error('Error combining chunks:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <progress value={progress} max="100">{progress}%</progress>
      {videoId && (
           <p>Processing Video ID: <a href={`/video/${videoId}/`} target="_blank" rel="noopener noreferrer">{videoId}</a></p>
       )}
      <VideoProgress videoId={videoId} />
    </div>
  );
};

export default UploadGPTaxios;
