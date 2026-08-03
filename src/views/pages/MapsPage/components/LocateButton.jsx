import React from 'react';
import { styled } from '@linaria/react';
import { FaLocationArrow } from 'react-icons/fa';

// Floating action button that centers the map on the user's location.
const LocateButton = ({ onLocate, active, disabled }) => (
  <Button
    onClick={onLocate}
    active={active}
    disabled={disabled}
    title="Мое местоположение"
    aria-label="Мое местоположение"
  >
    <FaLocationArrow size={16} />
  </Button>
);

const Button = styled.button`
  position: absolute;
  right: 16px;
  bottom: 48px;
  z-index: 5;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ active }) => (active ? '#fff' : 'var(--text, #eaeaea)')};
  background: ${({ active }) => (active ? '#1d9bf0' : 'var(--cardColor, #222)')};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  transition: transform 0.15s ease, background 0.15s ease;

  &:hover:not(:disabled) {
    transform: scale(1.08);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }

  @media screen and (max-width: 768px) {
    bottom: 84px;
  }
`;

export default LocateButton;
