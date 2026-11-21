import React from 'react';
import { styled } from '@linaria/react';

export default function PresenceStatus({ online, compact = false }) {
  const label = online == null ? 'Status unavailable' : online ? 'Online' : 'Offline';
  return (
    <Status title={label} role={compact ? 'img' : undefined} aria-label={compact ? label : undefined}>
      <Dot data-online={online === true} aria-hidden="true" />
      {!compact && label}
    </Status>
  );
}

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--mutedText, #888);
  font-size: 0.75rem;
  white-space: nowrap;
`;

const Dot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #888;

  &[data-online='true'] {
    background: #4caf50;
  }
`;
