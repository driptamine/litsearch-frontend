import React from 'react';
import { styled } from '@linaria/react';

const lastSeenFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export default function PresenceStatus({ online, lastSeenAt }) {
  const timestamp = Date.parse(lastSeenAt);
  const label = online
    ? 'Online'
    : Number.isFinite(timestamp) ? `Last seen ${lastSeenFormat.format(timestamp)}` : 'Last seen unknown';
  return (
    <Status title={label}>
      <Dot data-online={online === true} aria-hidden="true" />
      {label}
    </Status>
  );
}

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--mutedText, #888);
  font-size: 0.75rem;
`;

const Dot = styled.span`
  width: 7px;
  height: 7px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #888;

  &[data-online='true'] {
    background: #4caf50;
  }
`;
