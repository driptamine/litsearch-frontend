import React, { useState, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import PostCreator from "views/components/upload/PostCreator";

const CHUNK_SIZE = 5 * 1024 * 1024;
const MAX_FILE_SIZE = 100 * 1024 * 1024;

const VideoUploaderGPT = () => {
  const [files, setFiles] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [videoLinks, setVideoLinks] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [showDropZone, setShowDropZone] = useState(false);
  const dragCounter = useRef(0);
  const inputRef = useRef();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    setShowDropZone(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    dragCounter.current += 1;
    setShowDropZone(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      setShowDropZone(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary for onDrop to fire
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
      const visualRef = { current: 0 };

      const simulateInitialProgress = (target = 60, speed = 200) => {
        return new Promise((resolve) => {
          const step = () => {
            if (visualRef.current < target) {
              visualRef.current += 1;
              setProgressMap(prev => ({ ...prev, [file.name]: visualRef.current }));
              setTimeout(step, speed);
            } else resolve();
          };
          step();
        });
      };

      const animateProgress = (target, speed = 100) => {
        const step = () => {
          if (visualRef.current < target) {
            visualRef.current += 1;
            setProgressMap(prev => ({ ...prev, [file.name]: visualRef.current }));
            setTimeout(step, speed);
          }
        };
        step();
      };

      try {
        const simulation = simulateInitialProgress();

        const initRes = await axios.post("http://localhost:8000/videos/create_presigned_url/", {
          filename: fileName,
          content_type: file.type
        }, { headers: { "Content-Type": "application/json" } });

        const { upload_id, key } = initRes.data;
        const totalParts = Math.ceil(file.size / CHUNK_SIZE);
        const parts = [];

        for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
          const start = (partNumber - 1) * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, file.size);
          const blob = file.slice(start, end);

          const presignRes = await axios.post("http://localhost:8000/videos/get_presigned_url/", {
            upload_id,
            key,
            part_number: partNumber,
          }, { headers: { "Content-Type": "application/json" } });

          const { url } = presignRes.data;

          const uploadRes = await axios.put(url, blob, {
            headers: { "Content-Type": file.type },
          });

          const etag = uploadRes.headers.etag.replace(/"/g, "");
          parts.push({ PartNumber: partNumber, ETag: etag });

          const realProgress = Math.round((partNumber / totalParts) * 40) + 60;
          animateProgress(realProgress);
        }

        await simulation;

        const completeRes = await axios.post("http://localhost:8000/videos/complete_upload/", {
          upload_id,
          key,
          parts,
          media_type: 'video',
        }, { headers: { "Content-Type": "application/json" } });

        setVideoLinks(prev => ({ ...prev, [file.name]: completeRes.data.location }));
      } catch (err) {
        console.error(`Upload failed for ${file.name}:`, err);
        alert(`Upload failed for ${file.name}`);
      }
    };

    await Promise.all(files.map(file => uploadSingleFile(file)));
    setIsUploading(false);
  };

  return (
    <div>
      <Wrapper
        className="DROPPP"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <PostCreator />

        {showDropZone && (
          <DropZone onClick={() => inputRef.current.click()}>
            <p>Drop files to upload</p>
          </DropZone>
        )}
      </Wrapper>
      <HiddenInput type="file" ref={inputRef} onChange={handleFileChange} multiple />

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
    </div>
  );
};

// Styled Components
const Wrapper = styled.div`
  /* position: relative; */
  border: 1px solid black;
  width: 600px;
`;

const DropZone = styled.div`
  position: fixed;
  /* top: 0; */
  /* left: 0; */
  width: 300px;
  /* height: 300px; */
  background: rgba(240, 248, 255, 0.85);
  border: 2px dashed #4a90e2;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  color: #333;
  pointer-events: all;
  transition: all 0.2s ease;
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
