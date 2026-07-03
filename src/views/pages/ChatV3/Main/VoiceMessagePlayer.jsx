import React, { useState, useRef, useCallback, useEffect } from 'react';
import { styled } from '@linaria/react';
import { FaPlay, FaPause, FaLanguage } from 'react-icons/fa';
import { triggerTranscription, getTranscriptionStatus } from 'core/api/rest-helper';

const TranscriptionText = ({ voiceMsgId, transcription, status, language }) => {
  const [localStatus, setLocalStatus] = useState(status || 'not_requested');
  const [localText, setLocalText] = useState(transcription || '');
  const [localLang, setLocalLang] = useState(language || '');
  const intervalRef = useRef(null);

  useEffect(() => {
    setLocalStatus(status || 'not_requested');
    setLocalText(transcription || '');
    setLocalLang(language || '');
  }, [status, transcription, language]);

  useEffect(() => {
    if (localStatus === 'pending' || localStatus === 'processing') {
      intervalRef.current = setInterval(async () => {
        try {
          const data = await getTranscriptionStatus(voiceMsgId);
          setLocalStatus(data.status);
          if (data.transcription) setLocalText(data.transcription);
          if (data.language) setLocalLang(data.language);
          if (data.status === 'completed' || data.status === 'failed') {
            clearInterval(intervalRef.current);
          }
        } catch {
          clearInterval(intervalRef.current);
        }
      }, 2000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [localStatus, voiceMsgId]);

  if (localStatus === 'completed' && localText) {
    return (
      <TranscriptionBox>
        {localLang && <LangBadge>{localLang}</LangBadge>}
        {localText}
      </TranscriptionBox>
    );
  }

  if (localStatus === 'pending' || localStatus === 'processing') {
    return <TranscribingHint>Transcribing...</TranscribingHint>;
  }

  if (localStatus === 'failed') {
    return (
      <RetryRow>
        <span style={{ fontSize: 11, opacity: 0.6 }}>Transcription failed</span>
        <TranscribeBtn
          small
          onClick={async () => {
            setLocalStatus('pending');
            try {
              await triggerTranscription(voiceMsgId);
            } catch {
              setLocalStatus('failed');
            }
          }}
        >
          Retry
        </TranscribeBtn>
      </RetryRow>
    );
  }

  return null;
};

const VoiceMessagePlayer = ({
  url,
  duration: propDuration,
  voiceMsgId,
  transcription,
  transcriptionStatus,
  transcriptionLanguage,
}) => {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(propDuration || 0);
  const audioRef = useRef(null);
  const animRef = useRef(null);
  const [transcribing, setTranscribing] = useState(false);

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const onLoaded = () => setDuration(audio.duration || propDuration || 0);
    const onEnded = () => {
      setPlaying(false);
      setCurrentTime(0);
    };
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnded);
    };
  }, [propDuration]);

  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      animRef.current = requestAnimationFrame(updateProgress);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      cancelAnimationFrame(animRef.current);
      setPlaying(false);
    } else {
      audioRef.current.play();
      animRef.current = requestAnimationFrame(updateProgress);
      setPlaying(true);
    }
  }, [playing, updateProgress]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const remain = duration - currentTime;
  const displayTime = playing ? remain : (propDuration || duration);

  const fmt = (sec) => {
    const s = Math.max(0, Math.floor(sec));
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const handleTranscribe = async () => {
    if (!voiceMsgId || transcribing) return;
    setTranscribing(true);
    try {
      await triggerTranscription(voiceMsgId);
    } catch {
      // error will be reflected via polling
    }
  };

  const showTranscribeBtn =
    !transcriptionStatus ||
    transcriptionStatus === 'not_requested' ||
    transcriptionStatus === 'failed';

  return (
    <div>
      <Wrapper>
        <PlayBtn onClick={togglePlay}>
          {playing ? <FaPause size={12} /> : <FaPlay size={12} />}
        </PlayBtn>
        <BarWrapper>
          <BarFill style={{ width: `${progress}%` }} />
        </BarWrapper>
        <Time>{fmt(displayTime)}</Time>
        {showTranscribeBtn && (
          <TranscribeBtn onClick={handleTranscribe} disabled={transcribing}>
            <FaLanguage size={10} />
          </TranscribeBtn>
        )}
        <audio ref={audioRef} src={url} preload="metadata" />
      </Wrapper>
      <TranscriptionText
        voiceMsgId={voiceMsgId}
        transcription={transcription}
        status={transcriptionStatus}
        language={transcriptionLanguage}
      />
    </div>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: #2a2a2a;
  border-radius: 20px;
  max-width: 260px;
`;

const PlayBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: #009688;
  color: white;
  cursor: pointer;
  flex-shrink: 0;
  &:hover { background: #00796b; }
`;

const BarWrapper = styled.div`
  flex: 1;
  height: 4px;
  background: #444;
  border-radius: 2px;
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  background: #009688;
  border-radius: 2px;
  transition: width 0.1s linear;
`;

const Time = styled.span`
  font-size: 11px;
  color: #aaa;
  font-variant-numeric: tabular-nums;
  min-width: 28px;
  text-align: right;
`;

const TranscribeBtn = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: ${({ small }) => (small ? 'auto' : '24px')};
  height: ${({ small }) => (small ? 'auto' : '24px')};
  border: none;
  border-radius: ${({ small }) => (small ? '4px' : '50%')};
  background: ${({ small }) => (small ? 'transparent' : '#555')};
  color: #ccc;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  flex-shrink: 0;
  font-size: ${({ small }) => (small ? '11px' : 'inherit')};
  padding: ${({ small }) => (small ? '2px 6px' : '0')};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 0.8)};
  &:hover { background: ${({ small }) => (small ? 'transparent' : '#666')}; color: white; }
`;

const TranscriptionBox = styled.div`
  font-size: 0.8rem;
  color: #ccc;
  margin-top: 4px;
  padding: 6px 10px;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  line-height: 1.4;
  max-width: 260px;
  word-wrap: break-word;
`;

const LangBadge = styled.span`
  font-size: 0.65rem;
  background: #009688;
  color: white;
  padding: 1px 5px;
  border-radius: 4px;
  margin-right: 4px;
  text-transform: uppercase;
`;

const TranscribingHint = styled.div`
  font-size: 0.7rem;
  color: #888;
  margin-top: 4px;
  padding: 2px 10px;
  font-style: italic;
`;

const RetryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  padding: 2px 10px;
`;

export default VoiceMessagePlayer;
