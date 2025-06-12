import React, { useState } from 'react';
import axios from 'axios';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per chunk

const UploadToS3 = () => {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
    setProgress(Array(e.target.files.length).fill(0)); // Reset progress for new files
  };

  const handleUpload = async () => {
    if (files.length === 0) return alert("Please select files first.");
    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map((file, index) => uploadFile(file, index));
      await Promise.all(uploadPromises);
      alert("All files uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const uploadFile = async (file, index) => {
    const fileKey = `${Date.now()}-${file.name}`; // Generate a unique file key for S3
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let uploadedParts = 0;

    // Step 1: Create multipart upload (initialization)
    const { data: { uploadId, presignedUrls } } = await axios.post('/create_presigned_url/', {
      fileKey,
      totalChunks
    });

    const uploadChunksPromises = [];
    for (let i = 0; i < totalChunks; i++) {
      const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      const presignedUrl = presignedUrls[i];

      uploadChunksPromises.push(uploadChunk(chunk, presignedUrl, i, fileKey, uploadId));
    }

    await Promise.all(uploadChunksPromises);

    // Step 2: Complete multipart upload after all chunks are uploaded
    await axios.post('/complete_upload/', {
      fileKey,
      uploadId
    });

    console.log(`File ${file.name} uploaded successfully`);
  };

  const uploadChunk = async (chunk, presignedUrl, partNumber, fileKey, uploadId) => {
    try {
      const formData = new FormData();
      formData.append("file", chunk);

      await axios.put(presignedUrl, formData, {
        headers: { "Content-Type": "application/octet-stream" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded / chunk.size) * 100);
          setProgress((prevProgress) => {
            const updatedProgress = [...prevProgress];
            updatedProgress[partNumber] = percent;
            return updatedProgress;
          });
        },
      });

      // Update upload progress for each chunk
      console.log(`Uploaded chunk ${partNumber + 1} of file ${fileKey}`);
    } catch (error) {
      console.error("Error uploading chunk", error);
      throw new Error(`Error uploading chunk ${partNumber + 1} of file ${fileKey}`);
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload Files"}
      </button>

      {progress.length > 0 && (
        <div>
          {Array.from(files).map((file, index) => (
            <div key={index}>
              <span>{file.name} - {progress[index]}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadToS3;
