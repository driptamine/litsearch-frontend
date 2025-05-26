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
  const [isUploading, setIsUploading] = useState(false);
  const [showDropZone, setShowDropZone] = useState(false);
  const dragCounter = useRef(0);

  const inputRef = useRef();

  const updateProgress = (fileName, value) => {
    setProgressMap(prev => ({ ...prev, [fileName]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    dragCounter.current += 1;
    setShowDropZone(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setShowDropZone(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // necessary to allow drop
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    setShowDropZone(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
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
            content_type: file.type
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

    await Promise.all(files.map(file => uploadSingleFile(file)));
    setIsUploading(false);
  };

  return (
    <Container>
      <PostCreatorWrapper
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <PostCreator />
      </PostCreatorWrapper>

      {showDropZone && (
        <DropZone
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
        >
          <p>Drop video here or click to browse</p>
        </DropZone>
      )}

      <HiddenInput
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        multiple
      />

      <UploadButton onClick={handleUpload} disabled={files.length === 0 || isUploading}>
        {isUploading ? "Uploading..." : "Upload All"}
      </UploadButton>

      <PreviewVideos>
        {files.map((file) => (
          <div key={file.name} style={{ marginBottom: "16px", marginLeft: "16px" }}>
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
      </PreviewVideos>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  position: relative;
`;

const PostCreatorWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const DropZone = styled.div`
  pointer-events: all;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 160px;
  background: rgba(255, 255, 255, 0.95);
  border: 2px dashed #4a90e2;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  cursor: pointer;
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  margin-top: 20px;
`;

const PreviewVideos = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export default VideoUploaderGPT;
