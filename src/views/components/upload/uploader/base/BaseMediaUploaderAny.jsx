// https://chatgpt.com/c/684046fa-ef1c-800c-821a-fb3cf84056e6
import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { IoIosCloseCircle } from 'react-icons/io';

const CHUNK_SIZE = 5 * 1024 * 1024;
const MAX_FILE_SIZE = 100 * 1024 * 1024;

export const BaseMediaUploader = ({ mediaType, onUploadComplete, label }) => {
  const [files, setFiles] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [fileLinks, setFileLinks] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [showDropZone, setShowDropZone] = useState(false);
  const dragCounter = useRef(0);
  const inputRef = useRef();

  const allowedMediaTypes =
    mediaType === "any" || mediaType == null
      ? null
      : Array.isArray(mediaType)
      ? mediaType
      : [mediaType];

  const getMediaType = (mimeType) => {
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("image/")) return "photo";
    if (mimeType.startsWith("audio/")) return "track";
    return "other";
  };

  const filterValidVideos = async (fileList) => {
    const results = await Promise.all(
      fileList.map(
        (file) =>
          new Promise((resolve) => {
            if (file.type.startsWith("video/")) {
              const url = URL.createObjectURL(file);
              const video = document.createElement("video");
              video.preload = "metadata";
              video.onloadedmetadata = () => {
                URL.revokeObjectURL(url);
                if (video.duration <= 900) {
                  resolve(file);
                } else {
                  alert(`${file.name} is longer than 15 minutes and will be skipped.`);
                  resolve(null);
                }
              };
              video.src = url;
            } else {
              resolve(file);
            }
          })
      )
    );
    return results.filter(Boolean);
  };

  const filterAllowedMedia = (fileList) => {
    if (!allowedMediaTypes) return fileList;

    const accepted = [];
    const rejected = [];

    fileList.forEach((file) => {
      const type = getMediaType(file.type);
      if (allowedMediaTypes.includes(type)) {
        accepted.push(file);
      } else {
        rejected.push(file.name);
      }
    });

    if (rejected.length > 0) {
      alert(`These files are not allowed: ${rejected.join(", ")}`);
    }

    return accepted;
  };

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    const filteredByVideo = await filterValidVideos(selectedFiles);
    const validFiles = filterAllowedMedia(filteredByVideo);
    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    setShowDropZone(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const filteredByVideo = await filterValidVideos(droppedFiles);
    const validFiles = filterAllowedMedia(filteredByVideo);
    setFiles((prev) => [...prev, ...validFiles]);
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
    e.preventDefault();
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
              setProgressMap((prev) => ({ ...prev, [file.name]: visualRef.current }));
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
            setProgressMap((prev) => ({ ...prev, [file.name]: visualRef.current }));
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
            media_type: getMediaType(file.type),
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
            { upload_id, key, part_number: partNumber },
            { headers: { "Content-Type": "application/json" } }
          );

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

        const completeRes = await axios.post(
          "http://localhost:8000/videos/complete_upload/",
          { upload_id, key, parts, media_type: getMediaType(file.type) },
          { headers: { "Content-Type": "application/json" } }
        );

        const { id, location } = completeRes.data;
        setFileLinks((prev) => ({ ...prev, [file.name]: location }));
        onUploadComplete?.(id);
      } catch (err) {
        console.error(`Upload failed for ${file.name}:`, err);
        alert(`Upload failed for ${file.name}`);
      }
    };

    await Promise.all(files.map((file) => uploadSingleFile(file)));
    setIsUploading(false);
  };

  const handleRemoveFile = (fileName) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
    setProgressMap((prev) => {
      const newMap = { ...prev };
      delete newMap[fileName];
      return newMap;
    });
    setFileLinks((prev) => {
      const newLinks = { ...prev };
      delete newLinks[fileName];
      return newLinks;
    });
  };

  const renderMediaPreview = (fileName, url, type) => {
    if (type.startsWith("image/")) {
      return <img src={url} alt={fileName} style={{ maxWidth: "300px", maxHeight: "300px" }} />;
    }
    if (type.startsWith("audio/")) {
      return <audio controls src={url} style={{ width: "300px" }} />;
    }
    if (type.startsWith("video/")) {
      return <video controls src={url} width="auto" height="300" />;
    }
    return <p>Unsupported media type</p>;
  };

  return (
    <div>
      <Wrapper
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {label} Here
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

      <PreviewFiles>
        {files.map((file) => (
          <div key={file.name} style={{ marginBottom: "16px", marginLeft: "16px" }}>
            <p>
              <button>{file.name}</button>{" "}
              <button onClick={() => handleRemoveFile(file.name)} style={{ cursor: "pointer", marginTop: "8px" }}>
                <IoIosCloseCircle size={15} />
              </button>
            </p>
            <progress value={progressMap[file.name] || 0} max="100" style={{ width: "100%" }} />
            <div>{progressMap[file.name] || 0}%</div>
            {fileLinks[file.name] && (
              <>
                {renderMediaPreview(file.name, fileLinks[file.name], file.type)}
                <p>
                  <a href={fileLinks[file.name]} target="_blank" rel="noopener noreferrer">
                    View File
                  </a>
                </p>
              </>
            )}
          </div>
        ))}
      </PreviewFiles>
    </div>
  );
};

// Styled Components
const Wrapper = styled.div`
  border: 1px solid black;
  width: 600px;
  height: 100px;
`;

const DropZone = styled.div`
  position: fixed;
  width: 300px;
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
  user-select: none;
`;

const PreviewFiles = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
