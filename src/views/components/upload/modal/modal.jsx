// https://chatgpt.com/c/66f1ffb6-9578-800c-be4f-8b7bd1d2517e
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './modal/portal.css';
import styled from 'styled-components';


// Modal Component
const Modal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);

  // Detect clicks outside the modal
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

  // If modal is not open, return null
  if (!isOpen) return null;

  // Render modal in portal
  return ReactDOM.createPortal(
    <ModalOverlay>
      <ModalContent ref={modalRef}>
        <h2>Modal Title</h2>
        <p>Modal Content Here</p>
        <button onClick={onClose}>Close Modal</button>
      </ModalContent>
    </ModalOverlay>,
    document.getElementById("modal-root")
  );
};

// Styled Components for Modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  width: 400px;
  max-width: 100%;
`;
