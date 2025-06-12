import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import PostCreator from 'views/components/upload/PostCreator';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const VideoUploaderGPT = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [dragging, setDragging] = useState(false);

  const [mediaType, setMediaType] = useState(null);

  const inputRef = useRef();
  const visualProgressRef = useRef(0);

  const getMediaType = (file) => {
    if (file.type.startsWith("image/")) return "photo";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "track";
    return null;
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setProgress(0);
    visualProgressRef.current = 0;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setProgress(0);
      visualProgressRef.current = 0;
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

  const animateProgress = (target, speed = 100) => {
    if (target <= visualProgressRef.current) return;

    const step = () => {
      if (visualProgressRef.current < target) {
        visualProgressRef.current += 1;
        setProgress(visualProgressRef.current);
        setTimeout(step, speed);
      }
    };

    step();
  };

  const simulateInitialProgress = (target = 60, speed = 200) => {
    return new Promise((resolve) => {
      const step = () => {
        if (visualProgressRef.current < target) {
          visualProgressRef.current += 1;
          setProgress(visualProgressRef.current);
          setTimeout(step, speed);
        } else {
          resolve();
        }
      };
      step();
    });
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");
    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 100MB. Please upload a smaller file.");
      return;
    }

    setIsUploading(true);
    setProgress(0);
    visualProgressRef.current = 0;
    const fileName = `${file.name}-${Date.now()}`;

    try {
      // Start simulated progress in background
      const simulation = simulateInitialProgress();

      // Start actual upload setup
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

      // Begin uploading chunks immediately
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

        const realProgress = Math.round((partNumber / totalParts) * 40) + 60; // 60–100%
        if (realProgress > visualProgressRef.current) {
          animateProgress(realProgress);
        }
      }

      await simulation; // Ensure simulated progress finishes

      // Complete upload
      const completeRes = await axios.post(
        "http://localhost:8000/videos/complete_upload/",
        {
          upload_id,
          key,
          parts,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setVideoId(completeRes.data.location);
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
      <PostCreator />
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

      <button onClick={handleUpload} disabled={!file || isUploading}>
        {isUploading ? "Uploading..." : "Upload"}
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <progress value={progress} max="100" style={{ width: "100%" }} />
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

// Styled Components
const DropZone = styled.div`
  border: 2px dashed ${({ isDragging }) => (isDragging ? "#4a90e2" : "#ccc")};
  background: ${({ isDragging }) => (isDragging ? "#f0f8ff" : "#fafafa")};
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
