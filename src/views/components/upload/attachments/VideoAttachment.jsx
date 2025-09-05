import React, { useState } from 'react';
import { FaFilm } from 'react-icons/fa';
import ModalOverlay from '../modal/ModalOverlay';
import { WrapperContent, Button } from '../styles';

const VideoAttachment = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <WrapperContent>
      <Button onClick={() => setModalOpen(true)}>
        <FaFilm />
      </Button>
      <ModalOverlay
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onUploadSuccess={() => {
          console.log('Upload successful');
          setModalOpen(false);
        }}
      />
    </WrapperContent>
  );
};

export default VideoAttachment;
