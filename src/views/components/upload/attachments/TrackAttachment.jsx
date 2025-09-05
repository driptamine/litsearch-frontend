import React, { useState } from 'react';
import { FaMusic } from 'react-icons/fa';
import ModalOverlay from '../modal/ModalOverlay';
import { WrapperContent, Button } from '../styles';

const TrackAttachment = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <WrapperContent>
      <Button onClick={() => setModalOpen(true)}>
        <FaMusic />
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

export default TrackAttachment;
