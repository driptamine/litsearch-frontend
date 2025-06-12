// https://chatgpt.com/c/6806b14f-2990-800c-9d8d-9fd25f20630a
import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const SHORT_VIDEO = 10 * 1024 * 1024; // 10MB


const VideoUploaderGPT = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setProgress(0);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setProgress(0);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  const animateProgress = (current, target) => {
    const step = () => {
      if (current < target) {
        current += 1;
        setProgress(current);
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");

    if (file.size > MAX_FILE_SIZE) {
      alert('File size exceeds 100MB. Please upload a smaller file.');
      return;
    }

    setIsUploading(true);
    const fileName = `${file.name}-${Date.now()}`;

    try {
      // Step 1: Initiate multipart upload
      const initRes = await axios.post(
        "http://localhost:8000/videos/create_presigned_url/",
        {
          filename: fileName,
          content_type: file.type,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const { upload_id, key } = initRes.data;
      const totalParts = Math.ceil(file.size / CHUNK_SIZE);
      const parts = [];
      let visualProgress = 60;

      const simulateInitialProgress = (target = 60, speed = 100) => {
        return new Promise((resolve) => {
          const step = () => {
            if (visualProgress < target) {
              visualProgress += 1;
              setProgress(visualProgress);
              setTimeout(step, speed);
            } else {
              resolve();
            }
          };
          step();
        });
      };

      // if (file.size < SHORT_VIDEO) {
      //   simulateInitialProgress();
      // }
      await simulateInitialProgress();

      // Step 2: Upload each chunk
      for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
        const start = (partNumber - 1) * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const blob = file.slice(start, end);

        const presignRes = await axios.post(
          "http://localhost:8000/videos/get_presigned_url/",
          {
            upload_id,
            key,
            part_number: partNumber,
          },
          { headers: { "Content-Type": "application/json" } }
        );

        const { url } = presignRes.data;

        const uploadRes = await axios.put(url, blob, {
          headers: { "Content-Type": file.type },
        });

        const etag = uploadRes.headers.etag.replace(/"/g, "");
        parts.push({ PartNumber: partNumber, ETag: etag });

        const realProgress = Math.round((partNumber / totalParts) * 100);
        // Only update if real progress > visual progress
        if (realProgress > visualProgress) {
          animateProgress(visualProgress, realProgress);
          visualProgress = realProgress;
        }
      }

      // Step 3: Complete multipart upload
      const response = await axios.post(
        "http://localhost:8000/videos/complete_upload/",
        {
          upload_id,
          key,
          parts,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setVideoId(response.data.location);
      setFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <DropZone
        isDragging={dragging}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {file ? <p>{file.name}</p> : <p>Drag & drop a video file here, or click to browse</p>}
        <HiddenInput type="file" ref={inputRef} onChange={handleFileChange} />
      </DropZone>

      {/*{file && file.type.startsWith("video/") && (
        <Preview>
          <video src={URL.createObjectURL(file)} controls width="300" height="300" />
        </Preview>
      )}*/}
      <button onClick={handleUpload} disabled={!file || isUploading}>
        {isUploading ? "Uploading..." : "Upload"}
      </button>

      <div style={{'display': 'flex'}}>
        <progress value={progress} max="100">{progress}%</progress>
        <div>{progress}%</div>
      </div>

      {videoId && (
        <>
          <p>
            Processing Video ID:{" "}
            <a href={`${videoId}`} target="_blank" rel="noopener noreferrer">
              {videoId}
            </a>
          </p>
          <video src={videoId} controls width="300" height="300" />
        </>
      )}
    </div>
  );
};

const Preview = styled.div`
  margin: 20px 0;

  video {
    width: 100%;
    max-width: 500px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

// Styled Components
const DropZone = styled.div`
  border: 2px dashed ${({ isDragging }) => (isDragging ? '#4a90e2' : '#ccc')};
  background: ${({ isDragging }) => (isDragging ? '#f0f8ff' : '#fafafa')};
  padding: 40px;
  text-align: center;
  border-radius: 10px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
`;

const HiddenInput = styled.input`
  display: none;
`;

export default VideoUploaderGPT;
