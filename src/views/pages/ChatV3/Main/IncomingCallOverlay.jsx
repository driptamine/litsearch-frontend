import React from 'react';
import { styled } from '@linaria/react';
import { FaPhone, FaPhoneSlash } from 'react-icons/fa';

const IncomingCallOverlay = ({ callType, callerName, callerAvatar, onAccept, onDecline }) => {
  return (
    <Overlay>
      <OverlayContent>
        <Avatar
          src={callerAvatar}
          alt={callerName || 'Caller'}
          onError={(e) => {
            if (e.target.src !== DEFAULT_AVATAR) e.target.src = DEFAULT_AVATAR;
          }}
        />
        <CallerName>{callerName || 'Incoming Call'}</CallerName>
        <CallLabel>Incoming {callType === 'video' ? 'Video' : 'Voice'} Call</CallLabel>

        <Actions>
          <DeclineButton onClick={onDecline} title="Decline">
            <FaPhoneSlash />
          </DeclineButton>
          <AcceptButton onClick={onAccept} title="Accept">
            <FaPhone />
          </AcceptButton>
        </Actions>
      </OverlayContent>
    </Overlay>
  );
};

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23333' rx='8'/%3E%3Ccircle cx='24' cy='18' r='8' fill='%23999'/%3E%3Cpath d='M8 44c0-8.84 7.16-16 16-16s16 7.16 16 16' fill='%23999'/%3E%3C/svg%3E";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const OverlayContent = styled.div`
  background: #1a1a1a;
  border-radius: 16px;
  padding: 40px;
  width: 360px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  border: 1px solid #333;
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #009688;
`;

const CallerName = styled.h2`
  margin: 0;
  color: white;
  font-size: 1.3rem;
  text-align: center;
`;

const CallLabel = styled.p`
  color: #888;
  margin: 0;
  font-size: 0.95rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 32px;
  margin-top: 8px;
`;

const AcceptButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: #009688;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  transition: all 0.2s;

  &:hover {
    background: #00796b;
    transform: scale(1.05);
  }
`;

const DeclineButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: #ff4444;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  transition: all 0.2s;

  &:hover {
    background: #cc0000;
    transform: scale(1.05);
  }
`;

export default IncomingCallOverlay;
