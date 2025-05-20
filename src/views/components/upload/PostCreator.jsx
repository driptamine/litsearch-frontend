// https://chatgpt.com/c/66f1ffb6-9578-800c-be4f-8b7bd1d2517e
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './modal/portal.css';
import styled from "styled-components";

const VideoAttachmentModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userVideos, setUserVideos] = useState([]);
  const [videoFile, setVideoFile] = useState(null);

  // Fetch user's videos (mock function, replace with real API call)
  const fetchUserVideos = async () => {
    try {
      const response = await axios.get('/api/user/videos');
      setUserVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleVideoSelect = (video) => {
    // Do something when user selects a video from their library
    console.log('Selected video:', video);
  };

  const handleVideoUpload = async () => {
    if (!videoFile) return;

    const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB chunk size
    const totalChunks = Math.ceil(videoFile.size / CHUNK_SIZE);
    let uploadedChunks = 0;

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
        uploadedChunks++;
      } catch (error) {
        console.error('Chunk upload failed:', error);
        break;
      }
    }

    if (uploadedChunks === totalChunks) {
      console.log('File uploaded successfully');
      onUploadSuccess();
    }
  };

  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        
        {/* File Upload */}
        <input className="UploadInput" type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
        <button onClick={handleVideoUpload}>Upload Video</button>

        {/* Search Bar */}
        <input
          className="SearchInput"
          type="text"
          placeholder="Search videos..."
          value={searchTerm}
          onChange={handleSearch}
        />

        {/* User's Video Library */}
        <div className="video-library">
          {userVideos
            .filter((video) => video.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((video) => (
              <div key={video.id} onClick={() => handleVideoSelect(video)}>
                <video width="200" controls>
                  <source src={video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <p>{video.title}</p>
              </div>
            ))}
        </div>


      </div>
    </div>,
    document.getElementById("modal-root") // Using portal to render modal outside root div
  );
};


const CreatePostWithVideoAttachment = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleUploadSuccess = () => {
    // Refetch videos after successful upload or take another action
    console.log('Upload successful');
    closeModal();
  };

  return (
    <div>
      <button onClick={openModal}>Attach Video</button>
      <VideoAttachmentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onUploadSuccess={handleUploadSuccess}
      />
      {/*<PhotoAttachmentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onUploadSuccess={handleUploadSuccess}
      />*/}
      {/*<TrackAttachmentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onUploadSuccess={handleUploadSuccess}
      />*/}
    </div>
  );

  // return (
  //   <div>
  //     <button onClick={openModal}>Open Modal</button>
  //     <Modal isOpen={isModalOpen} onClose={closeModal} />
  //   </div>
  // );
};

const PostCreator = () => {
  const [postText, setPostText] = useState('');
  const [submittedPost, setSubmittedPost] = useState('');

  const handleChange = (e) => {
    setPostText(e.target.value);
  };

  const handleSubmit = async (e) => {
    const url = `http://localhost:8000/posts/create`
    e.preventDefault();
    if (postText.trim()) {
      console.log(postText);
      try {
        const response = await axios.post(url, { content: postText });
        if (response.status === 201) {
          console.log(response.data);
          setSubmittedPost(response.data.content);

          setPostText(''); // Clear the textarea after submission
        }
      } catch (error) {
        console.error('There was an error creating the post:', error);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}
        style={{ width: '400px' }}
        >
        <textarea
          value={postText}
          onChange={handleChange}
          placeholder="Write your post here..."
          rows="6"
          style={{ width: '100%', padding: '10px' }}
        />

      </form>
      <CreatePostWithVideoAttachment />
      <button type="submit">Submit Post</button>
      {postText && (
        <div style={{ whiteSpace: 'pre-wrap', marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
          {postText}
        </div>
      )}

      {submittedPost && (
        <div
          style={{
            marginTop: '20px',
            border: '1px solid #ccc',
            padding: '10px',
            whiteSpace: 'pre-wrap',
          }}
          dangerouslySetInnerHTML={{ __html: submittedPost }}
        />
      )}
    </div>
  );
};



export default PostCreator;
