import React, { useEffect, useRef, useState, useCallback } from 'react';
import { styled } from '@linaria/react';
import { FaPhoneSlash, FaMicrophoneSlash, FaPhone, FaSpinner, FaVolumeUp, FaMicrophone } from 'react-icons/fa';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23333' rx='8'/%3E%3Ccircle cx='24' cy='18' r='8' fill='%23999'/%3E%3Cpath d='M8 44c0-8.84 7.16-16 16-16s16 7.16 16 16' fill='%23999'/%3E%3C/svg%3E";

const CallOverlay = ({ callState, callType, callerName, callerAvatar, localStream, remoteStream, callError, onEndCall, audioContextRef }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [micLevel, setMicLevel] = useState(0);
  const [playbackBlocked, setPlaybackBlocked] = useState(false);
  const isVideoCall = callType === 'video';
  const showVideo = isVideoCall && callState === 'connected' && !callError;

  useEffect(() => {
    if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
  }, [localStream, remoteStream, showVideo]);

  const playAudio = useCallback(async () => {
    const audio = remoteAudioRef.current;
    if (!audio?.srcObject) return;
    try {
      await audio.play();
    } catch (error) {
      if (error.name === 'NotAllowedError' && remoteAudioRef.current === audio) {
        setPlaybackBlocked(true);
      }
    }
  }, []);

  useEffect(() => {
    const audio = remoteAudioRef.current;
    if (!audio || !remoteStream) return;
    audio.srcObject = remoteStream;
    playAudio();
    return () => {
      audio.pause();
      audio.srcObject = null;
      setPlaybackBlocked(false);
    };
  }, [remoteStream, playAudio]);

  useEffect(() => {
    if (remoteAudioRef.current) remoteAudioRef.current.volume = volume;
  }, [volume, remoteStream]);

  useEffect(() => {
    if (callState !== 'connected') {
      setDuration(0);
      return;
    }
    const timer = setInterval(() => setDuration(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [callState]);

  useEffect(() => {
    const context = audioContextRef?.current;
    if (!localStream || !context || !localStream.getAudioTracks().length) {
      setMicLevel(0);
      return;
    }

    const source = context.createMediaStreamSource(localStream);
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    const samples = new Uint8Array(analyser.fftSize);
    let frame;

    const tick = () => {
      analyser.getByteTimeDomainData(samples);
      let sum = 0;
      for (const sample of samples) {
        const value = (sample - 128) / 128;
        sum += value * value;
      }
      setMicLevel(Math.min(1, Math.sqrt(sum / samples.length) * 3));
      frame = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      source.disconnect();
    };
  }, [localStream, audioContextRef]);

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (callState === 'idle') return null;

  const getLabel = () => {
    switch (callState) {
      case 'calling': return 'Calling...';
      case 'connecting': return 'Connecting...';
      case 'connected': return callType === 'video' ? 'Video Call' : 'Voice Call';
      default: return '';
    }
  };

  return (
    <Overlay>
      <OverlayContent>
        {remoteStream && (
          <audio ref={remoteAudioRef} autoPlay playsInline data-call-audio onPlaying={() => setPlaybackBlocked(false)} />
        )}
        <CallHeader>
          <Avatar
            src={callerAvatar || DEFAULT_AVATAR}
            alt={callerName || 'User'}
            onError={(e) => {
              if (e.target.src !== DEFAULT_AVATAR) e.target.src = DEFAULT_AVATAR;
            }}
          />
          <CallerName>{callerName || 'User'}</CallerName>
          <CallLabel>{getLabel()}</CallLabel>
        </CallHeader>

        {callError && (
          <CenterSection>
            <FaMicrophoneSlash size={40} />
            <ErrorText>Call error</ErrorText>
            <ErrorSubtext>{callError}</ErrorSubtext>
            <RetryButton onClick={onEndCall}>Close</RetryButton>
          </CenterSection>
        )}

        {!callError && callState === 'calling' && (
          <CenterSection>
            <Spinner>
              <FaSpinner />
            </Spinner>
            <StatusText>Waiting for an answer…</StatusText>
          </CenterSection>
        )}

        {!callError && callState === 'connecting' && (
          <CenterSection>
            <Spinner>
              <FaSpinner />
            </Spinner>
            <StatusText>Establishing connection...</StatusText>
          </CenterSection>
        )}

        {!callError && callState === 'connected' && (
          <CallContent>
            {isVideoCall ? (
              <VideoGrid>
                {remoteStream && (
                  <RemoteVideo ref={remoteVideoRef} autoPlay muted playsInline />
                )}
                {localStream && (
                  <LocalVideo ref={localVideoRef} autoPlay muted playsInline />
                )}
              </VideoGrid>
            ) : (
              <AudioIndicator>
                <FaPhone size={48} />
                <AudioLabel>Call in progress</AudioLabel>
              </AudioIndicator>
            )}
          </CallContent>
        )}

        <CallFooter>
          {playbackBlocked && <RetryButton onClick={playAudio}>Enable call audio</RetryButton>}
          {callState === 'connected' && (
            <>
              <DurationText>{formatDuration(duration)}</DurationText>
              <VolumeRow>
                <FaVolumeUp size={14} />
                <VolumeSlider
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                />
              </VolumeRow>
              <MicRow>
                <FaMicrophone size={14} />
                <MicLevelBar>
                  <MicLevelFill style={{ width: `${micLevel * 100}%` }} />
                </MicLevelBar>
              </MicRow>
            </>
          )}
          <EndCallButton onClick={onEndCall} title="End call">
            <FaPhoneSlash />
          </EndCallButton>
        </CallFooter>
      </OverlayContent>
    </Overlay>
  );
};

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
  padding: 32px;
  width: 480px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  border: 1px solid #333;
`;

const CallHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const CallIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #009688;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
`;

const Avatar = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #009688;
`;

const CallerName = styled.h2`
  margin: 0;
  color: white;
  font-size: 1.2rem;
  text-align: center;
`;

const CallLabel = styled.p`
  margin: 0;
  color: #888;
  font-size: 0.95rem;
`;

const CenterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px 0;
`;

const Spinner = styled.div`
  font-size: 2.5rem;
  color: #009688;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const StatusText = styled.p`
  color: #888;
  margin: 0;
  font-size: 1rem;
`;

const ErrorText = styled.p`
  color: #ff6b6b;
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
`;

const ErrorSubtext = styled.p`
  color: #666;
  margin: 0;
  font-size: 0.85rem;
  text-align: center;
`;

const RetryButton = styled.button`
  background: none;
  border: 1px solid #555;
  color: white;
  padding: 8px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background: #333;
  }
`;

const CallContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const VideoGrid = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RemoteVideo = styled.video`
  width: 100%;
  max-height: 240px;
  border-radius: 12px;
  background: #000;
  object-fit: cover;
`;

const LocalVideo = styled.video`
  width: 160px;
  max-height: 120px;
  border-radius: 8px;
  background: #222;
  object-fit: cover;
  align-self: flex-end;
  border: 1px solid #444;
`;

const AudioIndicator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 0;
  color: #009688;
`;

const AudioLabel = styled.p`
  color: #888;
  margin: 0;
  font-size: 0.9rem;
`;

const CallFooter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const DurationText = styled.p`
  color: #888;
  margin: 0;
  font-size: 0.9rem;
  font-family: monospace;
`;

const VolumeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #888;
  width: 100%;
  max-width: 200px;
`;

const MicRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #888;
  width: 100%;
  max-width: 200px;
`;

const MicLevelBar = styled.div`
  flex: 1;
  height: 4px;
  background: #444;
  border-radius: 2px;
  overflow: hidden;
`;

const MicLevelFill = styled.div`
  height: 100%;
  background: #009688;
  border-radius: 2px;
  transition: width 60ms linear;
`;

const VolumeSlider = styled.input`
  flex: 1;
  height: 4px;
  appearance: none;
  background: #444;
  border-radius: 2px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #009688;
    cursor: pointer;
  }
`;

const EndCallButton = styled.button`
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

export default CallOverlay;
