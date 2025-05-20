import React, { useState, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import PostCreator from "views/components/upload/PostCreator";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const VideoUploaderGPT = () => {
  const [files, setFiles] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [videoLinks, setVideoLinks] = useState({});
  const [dragging, setDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const inputRef = useRef();

  const getMediaType = (file) => {
    if (file.type.startsWith("image/")) return "photo";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "track";
    return null;
  };

  const updateProgress = (fileName, value) => {
    setProgressMap(prev => ({ ...prev, [fileName]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    // .map(file => {
    //   const mediaType = getMediaType(file);
    //   return mediaType ? { file, mediaType} : null;
    // }).filter(Boolean)

    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files)
    // .map(file => {
    //   const mediaType = getMediaType(file);
    //   console.log(`MEDIATYPE - ${mediaType}`);
    //   return mediaType ? { file, mediaType } : null;
    // }).filter(Boolean);


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

        // const mediaType = getMediaType(file);

        const initRes = await axios.post(
          "http://localhost:8000/videos/create_presigned_url/",
          {
            filename: fileName,
            content_type: file.type
            // media_type: mediaType
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

        setVideoLinks((prev) => ({
          ...prev,
          [file.name]: completeRes.data.location,
        }));
      } catch (err) {
        console.error(`Upload failed for ${file.name}:`, err);
        alert(`Upload failed for ${file.name}`);
      }
    };

    // Launch all uploads in parallel
    await Promise.all(files.map(file => uploadSingleFile(file)));

    setIsUploading(false);
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
          {videoLinks[file.name] && (
            <>
              <p>
                <a href={videoLinks[file.name]} target="_blank" rel="noopener noreferrer">
                  View Video
                </a>
              </p>
              <video src={videoLinks[file.name]} controls width="300" height="300" />
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
