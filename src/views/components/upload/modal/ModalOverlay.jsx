import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './portal.css';

const ModalOverlay = ({ isOpen, onClose, onUploadSuccess }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userVideos, setUserVideos] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchUserVideos = async () => {
      try {
        const response = await axios.get('/api/user/videos');
        setUserVideos(response.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    if (isOpen) {
      fetchUserVideos();
      document.addEventListener("mousedown", handleClickOutside);
    }

    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleVideoUpload = async () => {
    if (!videoFile) return;

    const CHUNK_SIZE = 1 * 1024 * 1024;
    const totalChunks = Math.ceil(videoFile.size / CHUNK_SIZE);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, videoFile.size);
      const blob = videoFile.slice(start, end);

      const formData = new FormData();
      formData.append('chunk', blob);
      formData.append('fileName', videoFile.name);
      formData.append('chunkNumber', i + 1);
      formData.append('totalChunks', totalChunks);

      try {
        await axios.post('/api/upload/chunk', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } catch (error) {
        console.error('Chunk upload failed:', error);
        return;
      }
    }

    console.log('File uploaded successfully');
    onUploadSuccess();
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
        <button onClick={handleVideoUpload}>Upload Video</button>

        <input
          type="text"
          placeholder="Search videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="video-library">
          {userVideos
            .filter((video) => video.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((video) => (
              <div key={video.id}>
                <video width="200" controls>
                  <source src={video.url} type="video/mp4" />
                </video>
                <p>{video.title}</p>
              </div>
            ))}
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default ModalOverlay;
