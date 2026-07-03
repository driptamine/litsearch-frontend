import React, { useState, useRef, useEffect } from 'react';
import { styled } from '@linaria/react';
import TrackEditModal from 'views/components/TrackEditModal';

const Row = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid var(--darkGrey);

  &:hover {
    background-color: var(--cardColor);
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
  color: var(--text);
  background-color: var(--darkGrey);
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
      <circle cx="12" cy="12" r="10" fill="var(--text)" />
      <rect x="9" y="8" width="2" height="8" rx="1" ry="1" fill="black" />
      <rect x="13" y="8" width="2" height="8" rx="1" ry="1" fill="black" />
    </g>
  </Icon>
);

const TrackNumber = styled.span`
  font-family: Verdana;
  color: var(--secondaryColor);
  width: 30px;
  flex-shrink: 0;
`;

const TrackInfoCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

const TrackInfoRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
  flex: 1;
  min-width: 0;
`;

const Title = styled.span`
  font-family: Verdana;
  font-size: 16px;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Artist = styled.span`
  font-family: Verdana;
  color: var(--grey);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
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
      background: `linear-gradient(to right, #5865f2 0%, #5865f2 ${progress}%, var(--darkGrey) ${progress}%, var(--darkGrey) 100%)`
    }}
    {...rest}
  />
);

const TimeDisplay = styled.span`
  font-family: Verdana;
  font-size: 12px;
  color: var(--secondaryColor);
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

const EditBtn = styled.button`
  background: none;
  border: none;
  color: var(--grey);
  cursor: pointer;
  padding: 4px 8px;
  font-size: 14px;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.15s;

  ${Row}:hover & {
    opacity: 1;
  }

  &:hover {
    color: var(--text);
  }
`;

function TrackRow({ track, index, showEdit = false, onTrackUpdated, onTrackDeleted }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const src = track.r2_url || track.gcs_url || track.url || track.preview_url;
  const title = track.title || track.name || `Track ${index + 1}`;
  const artist = track.artist || (Array.isArray(track.artists) ? track.artists.map(a => a.name || a).join(', ') : '') || '';

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    const handleOtherTrackPlay = (e) => {
      if (e.detail !== src && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setPlaying(false);
        setHasPlayed(false);
        setCurrentTime(0);
      }
    };
    document.addEventListener('track-started', handleOtherTrackPlay);
    return () => document.removeEventListener('track-started', handleOtherTrackPlay);
  }, [src]);

  const togglePlay = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      document.dispatchEvent(new CustomEvent('track-started', { detail: src }));
      audio.play().catch(() => {});
      setPlaying(true);
      setHasPlayed(true);
    }
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
    setHasPlayed(false);
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
                onPlay={() => {
                  setHasPlayed(true);
                  document.dispatchEvent(new CustomEvent('track-started', { detail: src }));
                }}
        preload="metadata"
      />
      <PlayBtn onClick={togglePlay}>
        {playing ? <PauseIcon /> : <PlayIcon />}
      </PlayBtn>
      <TrackNumber>{index + 1}</TrackNumber>
      <ContentColumn>
        {hasPlayed ? (
          <TrackInfoRow>
            <Title>{title}</Title>
            {artist && <Artist>{artist}</Artist>}
          </TrackInfoRow>
        ) : (
          <TrackInfoCol>
            <Title>{title}</Title>
            {artist && <Artist>{artist}</Artist>}
          </TrackInfoCol>
        )}
        {hasPlayed && (
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
      {showEdit && (
        <EditBtn onClick={(e) => { e.stopPropagation(); e.preventDefault(); setShowEditModal(true); }}>
          &#8285;
        </EditBtn>
      )}
      {showEditModal && (
        <TrackEditModal
          track={track}
          onClose={() => setShowEditModal(false)}
          onUpdated={onTrackUpdated}
          onDeleted={onTrackDeleted}
        />
      )}
    </Row>
  );
}

export default TrackRow;
