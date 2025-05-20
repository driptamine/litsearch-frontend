// https://chatgpt.com/c/6806b14f-2990-800c-9d8d-9fd25f20630a
import React, { useState } from "react";
import axios from "axios";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const SHORT_VIDEO = 10 * 1024 * 1024; // 100MB

const VideoUploaderGPT = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [videoId, setVideoId] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setProgress(0);
  };

  // Smoothly animate from current progress to target
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

    if (file && file.size > MAX_FILE_SIZE) {
      alert('File size exceeds 100MB. Please upload a smaller file.');
      event.target.value = ''; // Clear the file input
      return;
    }

    setIsUploading(true);

    const fileName = `${file.name}-${Date.now()}`;

    try {
      // Step 1: Initiate multipart upload
      const initRes = await axios({
        method: "POST",
        url: "http://localhost:8000/videos/create_presigned_url/",
        headers: { "Content-Type": "application/json" },
        data: {
          filename: fileName,
          content_type: file.type,
        },
      });

      const { upload_id, key } = initRes.data;
      const totalParts = Math.ceil(file.size / CHUNK_SIZE);
      const parts = [];
      let visualProgress = 0;

      const simulateInitialProgress = (target = 60, speed=100) => {
        const step = () => {
          if (visualProgress < target) {
            visualProgress += 1;
            setProgress(visualProgress);
            // requestAnimationFrame(step);
            setTimeout(step, speed);
          }
        };
        step();
      };

      // if (file && file.size < SHORT_VIDEO) {
      //   simulateInitialProgress();
      // }
      simulateInitialProgress();

      // Step 2: Upload each chunk
      for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
        const start = (partNumber - 1) * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const blob = file.slice(start, end);

        const presignRes = await axios({
          method: "POST",
          url: "http://localhost:8000/videos/get_presigned_url/",
          headers: { "Content-Type": "application/json" },
          data: {
            upload_id,
            key,
            part_number: partNumber,
          },
        });

        const { url } = presignRes.data;

        const uploadRes = await axios({
          method: "PUT",
          url,
          data: blob,
          headers: { "Content-Type": file.type },
        });

        const etag = uploadRes.headers.etag.replace(/"/g, "");
        parts.push({ PartNumber: partNumber, ETag: etag });

        // setProgress(Math.round((partNumber / totalParts) * 100));

        const realProgress = Math.round((partNumber / totalParts) * 100);
        animateProgress(visualProgress, realProgress);
        visualProgress = realProgress;
      }

      // Step 3: Complete multipart upload
      const response = await axios({
        method: "POST",
        url: "http://localhost:8000/videos/complete_upload/",
        headers: { "Content-Type": "application/json" },
        data: {
          upload_id,
          key,
          parts,
        },
      });
      setVideoId(response.data.location)
      // alert("Upload complete!");
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
      <input type="file" onChange={handleFileChange} />
      {/*<button onClick={handleUpload} disabled={!file || isUploading}>
        {isUploading ? "Uploading..." : "Upload"}
      </button>*/}
      <button onClick={handleUpload}>Upload</button>
      <div style={{'display': 'flex'}}>
        <progress value={progress} max="100">{progress}%</progress>
        <div>{progress}%</div>
      </div>

      {videoId && (
        <>
          <p>Processing Video ID: <a href={`${videoId}`} target="_blank" rel="noopener noreferrer">{videoId}</a></p>
          <video src={videoId} controls width="300" height="300" />
        </>
      )}
    </div>
  );
};

export default VideoUploaderGPT;
