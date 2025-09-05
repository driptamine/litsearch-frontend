import React, { useState } from 'react';
import { FaImage } from 'react-icons/fa';
import ModalOverlay from '../modal/ModalOverlay';
import { WrapperContent, Button } from '../styles';

const PhotoAttachment = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <WrapperContent>
      <Button onClick={() => setModalOpen(true)}>
        <FaImage />
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

export default PhotoAttachment;
