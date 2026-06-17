import React, { useEffect, useRef, useState, useCallback } from 'react';
import { styled } from '@linaria/react';
import { FaPhoneSlash, FaMicrophoneSlash, FaVideo, FaPhone, FaSpinner, FaVolumeUp, FaMicrophone } from 'react-icons/fa';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23333' rx='8'/%3E%3Ccircle cx='24' cy='18' r='8' fill='%23999'/%3E%3Cpath d='M8 44c0-8.84 7.16-16 16-16s16 7.16 16 16' fill='%23999'/%3E%3C/svg%3E";

const CallOverlay = ({ callState, callType, callerName, callerAvatar, localStream, remoteStream, mediaError, onEndCall, audioContextRef }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [micLevel, setMicLevel] = useState(0);
  const timerRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);

  const playStream = useCallback((element, label) => {
    if (!element) return;
    element.play().then(() => {
      console.log(`[CallOverlay] ${label} play() succeeded`);
    }).catch(err => {
      console.warn(`[CallOverlay] ${label} play() failed:`, err.message);
    });
  }, []);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      console.log('[CallOverlay] attaching local stream to video');
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (!remoteStream) return;
    console.log('[CallOverlay] remoteStream effect, audio tracks:', remoteStream.getAudioTracks().length);
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.volume = volume;
      playStream(remoteVideoRef.current, 'remoteVideo');
    }
  }, [remoteStream, volume, playStream]);

  useEffect(() => {
    if (callState === 'connected') {
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setDuration(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [callState]);

  useEffect(() => {
    console.log('[CallOverlay] mic level effect running');
    const ctx = audioContextRef?.current;
    if (!localStream || !ctx) {
      console.log('[CallOverlay] mic level: no stream or no ctx', !!localStream, !!ctx);
      setMicLevel(0);
      return;
    }
    const audioTrack = localStream.getAudioTracks()[0];
    if (!audioTrack) {
      console.log('[CallOverlay] mic level: no audio track');
      return;
    }
    console.log('[CallOverlay] mic level: track enabled:', audioTrack.enabled, 'muted:', audioTrack.muted, 'readyState:', audioTrack.readyState);

    const source = ctx.createMediaStreamSource(localStream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      analyser.getByteTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const v = (dataArray[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / dataArray.length);
      setMicLevel(Math.min(1, rms * 3));
      if (Math.random() < 0.02) {
        console.log('[CallOverlay] mic rms:', rms.toFixed(4), 'sample:', dataArray[0], dataArray[64], dataArray[128]);
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      analyserRef.current = null;
      source.disconnect();
    };
  }, [localStream, audioContextRef]);

  useEffect(() => {
    console.log('[CallOverlay] remote audio effect running, remoteStream:', !!remoteStream, 'ctx:', !!audioContextRef?.current);
    const ctx = audioContextRef?.current;
    if (!remoteStream || !ctx) {
      console.log('[CallOverlay] remote audio: no stream or no ctx');
      return;
    }
    console.log('[CallOverlay] remote audio: ctx state:', ctx.state, 'volume:', volume);
    if (ctx.state === 'suspended') {
      console.log('[CallOverlay] remote audio: resuming suspended ctx');
      ctx.resume();
    }

    const source = ctx.createMediaStreamSource(remoteStream);
    const gain = ctx.createGain();
    gain.gain.value = volume;
    source.connect(gain);
    gain.connect(ctx.destination);
    console.log('[CallOverlay] remote audio: pipeline connected');

    if (remoteVideoRef.current) {
      remoteVideoRef.current.volume = volume;
    }

    return () => {
      source.disconnect();
      gain.disconnect();
    };
  }, [remoteStream, volume, playStream]);

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (callState === 'idle') return null;

  const getLabel = () => {
    switch (callState) {
      case 'calling': return 'Calling...';
      case 'ringing': return 'Incoming Call';
      case 'connecting': return 'Connecting...';
      case 'connected': return callType === 'video' ? 'Video Call' : 'Voice Call';
      default: return '';
    }
  };

  const isVideoCall = callType === 'video';

  return (
    <Overlay>
      <OverlayContent>
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

        {mediaError && (
          <CenterSection>
            <FaMicrophoneSlash size={40} />
            <ErrorText>Microphone access denied</ErrorText>
            <ErrorSubtext>{mediaError}</ErrorSubtext>
            <RetryButton onClick={onEndCall}>Close</RetryButton>
          </CenterSection>
        )}

        {!mediaError && (callState === 'calling' || callState === 'ringing') && (
          <CenterSection>
            <Spinner>
              <FaSpinner />
            </Spinner>
            <StatusText>
              {callState === 'calling' ? 'Ringing...' : ''}
            </StatusText>
          </CenterSection>
        )}

        {!mediaError && callState === 'connecting' && (
          <CenterSection>
            <Spinner>
              <FaSpinner />
            </Spinner>
            <StatusText>Establishing connection...</StatusText>
          </CenterSection>
        )}

        {!mediaError && callState === 'connected' && (
          <CallContent>
            {isVideoCall ? (
              <VideoGrid>
                {remoteStream && (
                  <RemoteVideo ref={remoteVideoRef} autoPlay playsInline />
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
