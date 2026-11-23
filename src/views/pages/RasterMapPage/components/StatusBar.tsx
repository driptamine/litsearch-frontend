import React from 'react';
import { styled } from '@linaria/react';

import { GEOLOCATION_STATUS } from '../hooks/useGeolocation';

const formatCoords = (position) => `${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}`;

// Small status pill shown at the top-left while tracking the user.
const StatusBar = ({ status, position }) => {
  if (status === GEOLOCATION_STATUS.TRACKING && position) {
    return (
      <Pill>
        <Dot />
        <span>
          {formatCoords(position)}
          <Accuracy>±{Math.round(position.accuracy)} м</Accuracy>
        </span>
      </Pill>
    );
  }

  if (status === GEOLOCATION_STATUS.WAITING) {
    return (
      <Pill>
        <Dot pulse />
        <span>Определяем местоположение...</span>
      </Pill>
    );
  }

  return null;
};

const Pill = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  background: var(--cardColor, #222);
  color: var(--text, #eaeaea);
  font-size: 12px;
  font-family: Helvetica, Arial, sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  white-space: nowrap;
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ pulse }) => (pulse ? '#f59e0b' : '#1d9bf0')};
  flex-shrink: 0;
  animation: ${({ pulse }) => (pulse ? 'litloop-pulse 1.2s ease-in-out infinite' : 'none')};

  @keyframes litloop-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.35; }
  }
`;

const Accuracy = styled.span`
  color: var(--textSecondary, #9ca3af);
  margin-left: 6px;
`;

export default StatusBar;
