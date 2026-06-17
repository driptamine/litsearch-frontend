import React, { useState, useRef, useCallback, useEffect } from 'react';
import { styled } from '@linaria/react';
import { FaPlay, FaPause } from 'react-icons/fa';

const VoiceMessagePlayer = ({ url, duration: propDuration }) => {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(propDuration || 0);
  const audioRef = useRef(null);
  const animRef = useRef(null);

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

  return (
    <Wrapper>
      <PlayBtn onClick={togglePlay}>
        {playing ? <FaPause size={12} /> : <FaPlay size={12} />}
      </PlayBtn>
      <BarWrapper>
        <BarFill style={{ width: `${progress}%` }} />
      </BarWrapper>
      <Time>{fmt(displayTime)}</Time>
      <audio ref={audioRef} src={url} preload="metadata" />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: #2a2a2a;
  border-radius: 20px;
  max-width: 220px;
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

export default VoiceMessagePlayer;
