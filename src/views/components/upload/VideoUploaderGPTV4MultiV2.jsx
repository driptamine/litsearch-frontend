// https://chatgpt.com/c/6832c06f-3110-800c-bd4d-a84a93eb9fc6
import React, { useState, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import PostCreator from "views/components/upload/PostCreator";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const VideoUploaderGPT = () => {
  const [files, setFiles] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [videoIdMap, setVideoIdMap] = useState({});
  const [dragging, setDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const inputRef = useRef();

  const updateProgress = (fileName, value) => {
    setProgressMap(prev => ({ ...prev, [fileName]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
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

  const handleUpload = async () => {
    if (files.length === 0) return;
    setIsUploading(true);

    const uploadSingleFile = async (file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name} exceeds 100MB. Skipping.`);
        return;
      }

      const fileName = `${file.name}-${Date.now()}`;
      updateProgress(file.name, 0);
      const visualRef = { current: 0 };

      const simulateInitialProgress = (target = 60, speed = 200) => {
        return new Promise((resolve) => {
          const step = () => {
            if (visualRef.current < target) {
              visualRef.current += 1;
              updateProgress(file.name, visualRef.current);
              setTimeout(step, speed);
            } else resolve();
          };
          step();
        });
      };

      const animateProgress = (target, speed = 100) => {
        if (target <= visualRef.current) return;
        const step = () => {
          if (visualRef.current < target) {
            visualRef.current += 1;
            updateProgress(file.name, visualRef.current);
            setTimeout(step, speed);
          }
        };
        step();
      };

      try {
        const simulation = simulateInitialProgress();

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

          const realProgress = Math.round((partNumber / totalParts) * 40) + 60;
          if (realProgress > visualRef.current) {
            animateProgress(realProgress);
          }
        }

        await simulation;

        const completeRes = await axios.post(
          "http://localhost:8000/videos/complete_upload/",
          {
            upload_id,
            key,
            parts,
            media_type: 'video',
          },
          { headers: { "Content-Type": "application/json" } }
        );

        const { video_id, url } = completeRes.data;

        setVideoIdMap((prev) => ({
          ...prev,
          [file.name]: { video_id, url },
        }));
      } catch (err) {
        console.error(`Upload failed for ${file.name}:`, err);
        alert(`Upload failed for ${file.name}`);
      }
    };

    await Promise.all(files.map(file => uploadSingleFile(file)));
    setIsUploading(false);
  };

  // Select the latest uploaded video to attach to PostCreator
  const uploadedVideos = Object.values(videoIdMap);
  const latestVideoId = uploadedVideos.length > 0 ? uploadedVideos[uploadedVideos.length - 1].video_id : null;

  return (
    <div>
      {/* PostCreator at the top with the latest uploaded video */}
      <PostCreator videoId={latestVideoId} />

      <DropZone
        isDragging={dragging}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <p>Drag & drop video files here, or click to browse</p>
        <HiddenInput type="file" ref={inputRef} onChange={handleFileChange} multiple />
      </DropZone>

      <button onClick={handleUpload} disabled={files.length === 0 || isUploading}>
        {isUploading ? "Uploading..." : "Upload All"}
      </button>

      {files.map((file) => (
        <div key={file.name} style={{ marginBottom: "16px" }}>
          <p>{file.name}</p>
          <progress value={progressMap[file.name] || 0} max="100" style={{ width: "100%" }} />
          <div>{progressMap[file.name] || 0}%</div>

          {videoIdMap[file.name] && (
            <>
              <p>
                <a href={videoIdMap[file.name].url} target="_blank" rel="noopener noreferrer">
                  View Video
                </a>
              </p>
              <video src={videoIdMap[file.name].url} controls width="300" height="300" />
            </>
          )}
        </div>
      ))}
    </div>
  );
};

// Styled Components
const DropZone = styled.div`
  border: 2px dashed ${({ isDragging }) => (isDragging ? "#4a90e2" : "#ccc")};
  background: ${props => props.theme.cardColor};
  color: ${props => props.theme.text};
  height: 160px;
  max-width: 620px;
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
