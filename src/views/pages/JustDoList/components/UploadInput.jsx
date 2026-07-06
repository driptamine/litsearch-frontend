import React, { useState, useRef } from 'react';
import axios from 'axios';
import { styled } from '@linaria/react';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';

const UploadInput = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(
        `${LITLOOP_API_URL}/todos/background-image/`,
        formData,
        { headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' } }
      );

      const imageUrl = response.data.background_image;
      if (onUploadSuccess) {
        onUploadSuccess(imageUrl);
      }
    } catch (error) {
      console.error('Failed to upload background image:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <StyledWrapper>
      <StyledInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <UploadingText>Uploading...</UploadingText>}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  margin-bottom: 1rem;
`;

const StyledInput = styled.input`
  width: 100%;
  color: #fff;
  &::file-selector-button {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.4);
    color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
  }
`;

const UploadingText = styled.p`
  font-size: 0.8rem;
  margin-top: 4px;
  opacity: 0.8;
`;

export default UploadInput;
