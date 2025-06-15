// https://chatgpt.com/c/66f1ffb6-9578-800c-be4f-8b7bd1d2517e
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './modal/portal.css';
import styled from 'styled-components';
import { LITLOOP_API_URL } from 'core/constants/urls';

import { FaFilm } from 'react-icons/fa';
import { FaImage } from 'react-icons/fa';
import { FaMusic } from 'react-icons/fa';


const PostCreator = ({ mediaIds, showDropZone }) => {
  const [postText, setPostText] = useState('');
  const [submittedPost, setSubmittedPost] = useState('');

  const [description, setDescription] = useState('');
  const [photoIds, setPhotoIds] = useState([]);
  const [videoIds, setVideoIds] = useState([]);
  const [trackIds, setTrackIds] = useState([]);

  // const handleChange = (e) => {
  //   setPostText(e.target.value);
  // };
  const handleChange = (e) => {
    setDescription(e.target.value);
  };

  useEffect(() => {
    if (mediaIds) {
      setPhotoIds(mediaIds.photo_ids || []);
      setVideoIds(mediaIds.video_ids || []);
      setTrackIds(mediaIds.track_ids || []);
    }
  }, [mediaIds]);

  const handleSubmit = async (e) => {
    const url = `http://localhost:8000/posts/create`
    e.preventDefault();
    if (description.trim()) {
      console.log(description);
      try {
        const postData = {
          // title,
          description: description,

          photo_ids: photoIds,
          video_ids: videoIds,
          track_ids: trackIds,
        };

        const response = await axios.post(`${LITLOOP_API_URL}/posts/create_post_api/`, postData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

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

  const textareaRef = useRef(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set to scroll height
    }
  };
  const showAttachment = photoIds.length > 0 || videoIds.length > 0 ||  trackIds.length > 0
  return (
    <div>
      {/*<form onSubmit={handleSubmit}>*/}

        <TextArea
          ref={textareaRef}
          onInput={handleInput}

          value={description}
          onChange={handleChange}
          placeholder="Write your post here..."
          rows="6"
          style={{  }}
        />

      {/*</form>*/}
      <FlexBoxWrapper>
        <FlexBoxAttachments>
          <PhotoAttachment />
          <TrackAttachment />
          <VideoAttachment />

        </FlexBoxAttachments>

        <CreatePostButton onClick={handleSubmit}>Create Post</CreatePostButton>
      </FlexBoxWrapper>

      {showDropZone && (
        <DropZone onClick={() => inputRef.current.click()}>
          <p>Drop files to upload</p>
        </DropZone>
      )}

      {/*<PreviewPost
        postText={postText}
      />*/}

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

      <Attachments
        className="attachments"
        >
        {showAttachment && (
          <>
          <strong>Attached:</strong><br />
          </>
        )}

        {photoIds.length > 0 && <>Photos: {photoIds.join(', ')}<br /></>}
        {videoIds.length > 0 && <>Videos: {videoIds.join(', ')}<br /></>}
        {trackIds.length > 0 && <>Tracks: {trackIds.join(', ')}<br /></>}
      </Attachments>

    </div>
  );
};

const ModalOverlay = ({ isOpen, onClose, onUploadSuccess }) => {
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


const VideoAttachment = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleUploadSuccess = () => {
    // Refetch videos after successful upload or take another action
    console.log('Upload successful');
    closeModal();
  };

  return (
    <WrapperContent>

      <Button onClick={openModal}>
        <FaFilm />
      </Button>
      <ModalOverlay
        isOpen={isModalOpen}
        onClose={closeModal}
        onUploadSuccess={handleUploadSuccess}
      />

    </WrapperContent>
  );
};

const PhotoAttachment = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleUploadSuccess = () => {
    // Refetch videos after successful upload or take another action
    console.log('Upload successful');
    closeModal();
  };

  return (
    <WrapperContent>

      <Button onClick={openModal}>
        <FaImage />
      </Button>
      <ModalOverlay
        isOpen={isModalOpen}
        onClose={closeModal}
        onUploadSuccess={handleUploadSuccess}
      />

    </WrapperContent>
  );
};

const TrackAttachment = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleUploadSuccess = () => {
    // Refetch videos after successful upload or take another action
    console.log('Upload successful');
    closeModal();
  };

  return (
    <WrapperContent>

      <Button onClick={openModal}>
        <FaMusic />
      </Button>
      <ModalOverlay
        isOpen={isModalOpen}
        onClose={closeModal}
        onUploadSuccess={handleUploadSuccess}
      />

    </WrapperContent>
  );
};

const PreviewPost = ({postText}) => {
 //  const handlePhotoChange = (e) => {
 //   const files = Array.from(e.target.files);
 //   setPhotos(files);
 //
 //   // Generate previews
 //   const urls = files.map(file => URL.createObjectURL(file));
 //   setPreviewUrls(urls);
 // };
 //
  return (
    <>
      {postText && (
        <div style={{ whiteSpace: 'pre-wrap', marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
          {postText}
        </div>
      )}


    </>
  )
}

const FlexBoxAttachments = styled.div`
  display: flex;

`;
const Attachments = styled.div`


`;

const FlexBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 600px;

  background: ${props => props.theme.cardColor};
`;
// const Button = styled.button`
//   cursor: pointer;
// `

const DropZone = styled.div`
  /* position: fixed; */
  /* top: 0; */
  /* left: 0; */

  position: absolute;
  top: 81px;
  width: 597px;
  height: 142px;

  /* width: 300px; */
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

const Button = styled.div`
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const CreatePostButton = styled.button`
  cursor: pointer;
  //margin: auto;
  margin-left: auto;
  color: white;
  height: 40px;
  right: 0;
  background: #7886c9;
  border-radius: 5px;
  border: none;

  user-select: none;
`
const WrapperContent = styled.div`
  cursor: pointer;
  margin-left: 10px;
  margin: auto;


  border-radius: 5px;

  &:hover {

    background-color: ${props => props.theme.attachmentColor};
  }

`;
const WrapperVideo = styled.div`
  cursor: pointer;
  margin-left: 10px;
  margin: auto;
  padding: 10px;
  border-radius: 5px;

  &:hover {

    background-color: ${props => props.theme.attachmentColor};
  }
`;

const TextArea = styled.textarea`
  box-sizing: border-box;
  display: block;
  background: ${props => props.theme.cardColor};
  color: ${props => props.theme.text};

  width: 100%;

  padding-left: 10px;
  padding-top: 10px;
  padding-right: 0;
  resize: none;

  outline: none;
  border-bottom: 1px solid ${props => props.theme.textareaBorderColor};

  border-left: none;
  border-top: none;
  border-right: none;

  &:focus {
    outline: none;
    border-bottom: 1px solid ${props => props.theme.textareaBorderColor};

    border-left: none;
    border-top: none;
    border-right: none;
  }
`

export default PostCreator;
