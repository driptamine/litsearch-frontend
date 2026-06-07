import React, { useState, useRef } from 'react';
import { styled } from '@linaria/react';

const Row = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #333;

  &:hover {
    background-color: #1e1e1e;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const PlayBtn = styled.div`
  user-select: none;
  width: 40px;
  height: 40px;
  margin-right: 10px;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: #3d3d3d;
  border-radius: 5px;
  cursor: pointer;
  flex-shrink: 0;
`;

const Icon = styled.svg`
  width: 28px;
  height: 28px;
  fill: inherit;
`;

const PlayIcon = () => (
  <Icon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g>
      <circle cx="12" cy="12" r="10" />
      <path
        d="M10 8.5C10 8, 10.5 8, 11 8.3L15 11C15.5 11.3, 15.5 12.7, 15 13L11 15.7C10.5 16, 10 16, 10 15.5V8.5Z"
        fill="currentColor"
      />
    </g>
  </Icon>
);

const PauseIcon = () => (
  <Icon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g>
      <circle cx="12" cy="12" r="10" fill="#fff" />
      <rect x="9" y="8" width="2" height="8" rx="1" ry="1" fill="black" />
      <rect x="13" y="8" width="2" height="8" rx="1" ry="1" fill="black" />
    </g>
  </Icon>
);

const TrackNumber = styled.span`
  font-family: Verdana;
  color: #888;
  width: 30px;
  flex-shrink: 0;
`;

const infoStyles = props => `
  flex-direction: ${props.isPlaying ? 'row' : 'column'};
`;

const Info = styled.div`
  display: flex;
  ${infoStyles}
  flex: 1;
  min-width: 0;
`;

const Title = styled.span`
  font-family: Verdana;
  font-size: 16px;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const artistStyles = props => `
  font-size: ${props.isPlaying ? '14px' : '16px'};
`;

const Artist = styled.span`
  font-family: Verdana;
  ${artistStyles}
  color: gray;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

const ProgressArea = styled.div`
  position: relative;
  height: 20px;
`;

const ProgressWrapper = styled.div`
  width: 100%;
`;

const _ProgressBar = styled.input`
  width: 100%;
  height: 6px;
  appearance: none;
  border-radius: 5px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    height: 14px;
    width: 14px;
    background: white;
    border: 2px solid #8e5cf7;
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(142, 92, 247, 0.7);
    margin-top: -4px;
    transition: background 0.3s;
  }

  &::-moz-range-thumb {
    height: 14px;
    width: 14px;
    background: white;
    border: 2px solid #8e5cf7;
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(88, 101, 242, 0.7);
    transition: background 0.3s;
  }

  &::-webkit-slider-runnable-track {
    height: 6px;
    border-radius: 5px;
    background: transparent;
  }

  &::-moz-range-track {
    height: 6px;
    background: transparent;
    border-radius: 5px;
  }
`;

const ProgressBar = ({ progress, ...rest }) => (
  <_ProgressBar
    type="range"
    style={{
      background: `linear-gradient(to right, #5865f2 0%, #5865f2 ${progress}%, #333 ${progress}%, #333 100%)`
    }}
    {...rest}
  />
);

const TimeDisplay = styled.span`
  font-family: Verdana;
  font-size: 12px;
  color: #888;
  min-width: 35px;
  text-align: right;
  flex-shrink: 0;
  margin-left: 10px;
`;

function formatTime(seconds) {
  if (!seconds || !isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function TrackRow({ track, index }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  const src = track.gcs_url || track.url || track.preview_url;
  const title = track.title || track.name || `Track ${index + 1}`;
  const artist = track.artist || track.artists?.[0]?.name || '';

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const togglePlay = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const value = parseFloat(e.target.value);
    setIsSeeking(true);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const handleSeekEnd = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setIsSeeking(false);
  };

  return (
    <Row>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />
      <PlayBtn onClick={togglePlay}>
        {playing ? <PauseIcon /> : <PlayIcon />}
      </PlayBtn>
      <TrackNumber>{index + 1}</TrackNumber>
      <ContentColumn>
        <Info isPlaying={playing}>
          <Title>{title}</Title>
          {artist && <Artist isPlaying={playing}>{artist}</Artist>}
        </Info>
        {playing && (
          <ProgressArea>
            <ProgressWrapper>
              <ProgressBar
                value={currentTime}
                max={duration || 1}
                progress={progress}
                onMouseDown={(e) => { e.stopPropagation(); setIsSeeking(true); }}
                onTouchStart={(e) => { e.stopPropagation(); setIsSeeking(true); }}
                onChange={handleSeek}
                onMouseUp={handleSeekEnd}
                onTouchEnd={handleSeekEnd}
              />
            </ProgressWrapper>
          </ProgressArea>
        )}
      </ContentColumn>
      <TimeDisplay>
        {playing || isSeeking ? formatTime(currentTime) : formatTime(duration)}
      </TimeDisplay>
    </Row>
  );
}

export default TrackRow;
