// BaseMediaUploader.jsx
import React, { useState, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const CHUNK_SIZE = 5 * 1024 * 1024;
const MAX_FILE_SIZE = 100 * 1024 * 1024;

const BaseMediaUploader = ({ mediaType, onUploadComplete, label = "Upload" }) => {
  const [files, setFiles] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [fileLinks, setFileLinks] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleUpload = async () => {
    setIsUploading(true);

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) continue;

      const fileName = `${file.name}-${Date.now()}`;

      const initRes = await axios.post("/videos/create_presigned_url/", {
        filename: fileName,
        content_type: file.type,
        media_type: mediaType
      });

      const { upload_id, key } = initRes.data;
      const totalParts = Math.ceil(file.size / CHUNK_SIZE);
      const parts = [];

      for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
        const start = (partNumber - 1) * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const blob = file.slice(start, end);

        const presignRes = await axios.post("/videos/get_presigned_url/", {
          upload_id,
          key,
          part_number: partNumber,
        });

        const { url } = presignRes.data;

        const uploadRes = await axios.put(url, blob, {
          headers: { "Content-Type": file.type },
        });

        const etag = uploadRes.headers.etag.replace(/"/g, "");
        parts.push({ PartNumber: partNumber, ETag: etag });
        const progress = Math.round((partNumber / totalParts) * 100);
        setProgressMap(prev => ({ ...prev, [file.name]: progress }));
      }

      const completeRes = await axios.post("/videos/complete_upload/", {
        upload_id,
        key,
        parts,
        media_type: mediaType,
      });

      const { id, location } = completeRes.data;
      setFileLinks(prev => ({ ...prev, [file.name]: location }));
      onUploadComplete?.(id);
    }

    setIsUploading(false);
  };

  return (
    <Wrapper>
      <h4>{label}</h4>
      <input type="file" ref={inputRef} onChange={handleFileChange} multiple />
      <button onClick={handleUpload} disabled={files.length === 0 || isUploading}>
        {isUploading ? "Uploading..." : "Upload"}
      </button>
      {files.map((file) => (
        <div key={file.name}>
          <p>{file.name}</p>
          <progress value={progressMap[file.name] || 0} max="100" />
        </div>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  border: 1px solid gray;
  margin-bottom: 20px;
`;

export default BaseMediaUploader;
