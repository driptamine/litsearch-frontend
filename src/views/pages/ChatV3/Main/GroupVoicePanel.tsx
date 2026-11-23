import React, { useEffect, useRef, useState } from 'react';
import { styled } from '@linaria/react';
import { voicePeerKey } from 'core/hooks/useGroupVoice';

function ParticipantAudio({ stream }) {
  const audioRef = useRef(null);
  const [blocked, setBlocked] = useState(false);
  const play = () => audioRef.current?.play().catch(() => setBlocked(true));

  useEffect(() => {
    const audio = audioRef.current;
    audio.srcObject = stream;
    audio.play().catch(() => setBlocked(true));
    return () => {
      audio.pause();
      audio.srcObject = null;
    };
  }, [stream]);

  return (
    <>
      <audio data-group-voice-audio ref={audioRef} autoPlay playsInline onPlaying={() => setBlocked(false)} />
      {blocked && <Control onClick={play}>Play audio</Control>}
    </>
  );
}

export default function GroupVoicePanel({ voice, account }) {
  return (
    <Panel aria-label="Group voice chat">
      <Title>{voice.session.name || 'Group voice chat'}</Title>
      {voice.error ? <p role="status">{voice.error}</p> : !voice.room && <p role="status">Joining group voice…</p>}
      {voice.room && (
        <Participants aria-label="Voice participants">
          {voice.room.members.map(member => {
            const id = voicePeerKey(member);
            return (
              <Participant key={id}>
                <span>{member.username}{member.user_id === account && ' (you)'}</span>
                {voice.streams[id] && <ParticipantAudio stream={voice.streams[id]} />}
              </Participant>
            );
          })}
        </Participants>
      )}
      <Actions>
        {voice.room && <Control onClick={voice.toggleMute}>{voice.muted ? 'Unmute microphone' : 'Mute microphone'}</Control>}
        <Leave onClick={voice.leave}>Leave voice</Leave>
      </Actions>
    </Panel>
  );
}

const Panel = styled.section`
  position: fixed;
  z-index: 1300;
  right: 16px;
  top: calc(84px + env(safe-area-inset-top));
  width: min(320px, calc(100vw - 32px));
  box-sizing: border-box;
  padding: 16px;
  border: 1px solid #50535b;
  border-radius: 14px;
  background: #202229;
  color: #fff;
  box-shadow: 0 8px 30px #0005;

  p { margin: 8px 0; }
`;

const Title = styled.h2`
  margin: 0 0 8px;
  font-size: 1rem;
  overflow-wrap: anywhere;
`;

const Participants = styled.ul`
  margin: 0 0 12px;
  padding: 0;
  list-style: none;
  max-height: 28vh;
  overflow-y: auto;
`;

const Participant = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 5px 0;
  font-size: 0.9rem;
  overflow-wrap: anywhere;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Control = styled.button`
  min-height: 36px;
  padding: 6px 10px;
  border: 1px solid #6a6d75;
  border-radius: 8px;
  background: #32343c;
  color: #fff;
  cursor: pointer;
`;

const Leave = styled(Control)`
  background: #a32d38;
  border-color: #c7414b;
`;
