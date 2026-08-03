import React from 'react';
import { styled } from '@linaria/react';

// Centered banner for geolocation errors and map-load failures.
// `onRetry` renders an optional "Повторить" button.
const ErrorBanner = ({ message, onRetry }) => (
  <Banner role="alert">
    <WarningIcon>!</WarningIcon>
    <Text>{message}</Text>
    {onRetry && <RetryButton onClick={onRetry}>Повторить</RetryButton>}
  </Banner>
);

const Banner = styled.div`
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  max-width: calc(100% - 24px);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-radius: 10px;
  background: rgba(180, 42, 42, 0.92);
  color: #fff;
  font-size: 13px;
  font-family: Helvetica, Arial, sans-serif;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
`;

const WarningIcon = styled.span`
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  color: #b42a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
`;

const Text = styled.span`
  line-height: 1.35;
`;

const RetryButton = styled.button`
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.7);
  background: transparent;
  color: #fff;
  font-size: 12px;
  font-family: Helvetica, Arial, sans-serif;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

export default ErrorBanner;
