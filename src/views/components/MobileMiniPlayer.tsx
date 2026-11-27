import React, { useRef, useState } from 'react';
import { styled } from '@linaria/react';
import { FaPlay, FaPause, FaTimes, FaMusic } from 'react-icons/fa';
import { usePlayer } from 'core/context/PlayerContext';
import FullPlayer from 'views/components/FullPlayer';

export const PLAYER_ACCENT = '#686abb';

const MobileMiniPlayer = () => {
  const player = usePlayer();
  const [fullOpen, setFullOpen] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubPercent, setScrubPercent] = useState<number | null>(null);
  if (!player?.current) return null;
  const { current, playing, currentTime, duration, queue } = player;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const albumCover = current?.album_cover || current?.artwork_url || current?.image_url || current?.cover_url || null;

  const shownProgress = scrubPercent ?? progress;
  const shownTime = scrubPercent !== null && duration > 0 ? (scrubPercent / 100) * duration : currentTime;

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const total = Math.floor(seconds);
    const minutes = Math.floor(total / 60);
    const secs = total % 60;
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  };

  const seekFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el || duration <= 0) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setScrubPercent(ratio * 100);
    player.seekTo(ratio * duration);
  };

  const handleSeekStart = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsScrubbing(true);
    seekFromClientX(e.clientX);
  };

  const handleSeekMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isScrubbing) return;
    e.stopPropagation();
    seekFromClientX(e.clientX);
  };

  const handleSeekEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsScrubbing(false);
    setScrubPercent(null);
  };

  const openFullPlayer = () => setFullOpen(true);

  return (
    <>
    <MobileMusicBar onClick={openFullPlayer} title={`${current.title} — ${current.artist}`}>
      <LeftGroup>
        <AlbumCover>
          {albumCover ? <AlbumCoverImg src={albumCover} alt="Album cover" /> : <FaMusic size={16} color="rgba(255,255,255,0.85)" />}
        </AlbumCover>
        <Meta>
          <TrackTitle>{current.title}</TrackTitle>
          {current.artist && <TrackArtist>{current.artist}</TrackArtist>}
        </Meta>
      </LeftGroup>
      <RightGroup>
        <PlayBtn onClick={(e) => { e.stopPropagation(); player.toggle(); }} title={playing ? 'Pause' : 'Play'}>
          {playing ? <FaPause size={14} /> : <FaPlay size={14} />}
        </PlayBtn>
        <CloseBtn onClick={(e) => { e.stopPropagation(); player.close(); }} title="Close">
          <FaTimes size={13} />
        </CloseBtn>
      </RightGroup>
      <ProgressRow onClick={(e) => e.stopPropagation()}>
        <SeekArea
          onPointerDown={handleSeekStart}
          onPointerMove={handleSeekMove}
          onPointerUp={handleSeekEnd}
          onPointerCancel={handleSeekEnd}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round((shownProgress / 100) * duration)}
        >
          <ProgressTrack ref={trackRef}>
            <ProgressFill style={{ width: `${shownProgress}%` }} />
            <ProgressKnob style={{ left: `${shownProgress}%` }} $dragging={isScrubbing} />
          </ProgressTrack>
        </SeekArea>
      </ProgressRow>
    </MobileMusicBar>
    <FullPlayer open={fullOpen} onClose={() => setFullOpen(false)} />
    </>
  );
};

const MobileMusicBar = styled.div`
  position: fixed;
  left: 12px;
  right: 12px;
  bottom: var(--litloop-mobile-player-bottom, 12px);
  z-index: 1001;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-rows: auto auto;
  align-items: center;
  column-gap: 12px;
  row-gap: 6px;
  padding: 8px 12px;
  min-height: 64px;
  border-radius: 24px;
  cursor: pointer;
  overflow: hidden;
  backdrop-filter: blur(17px);
  -webkit-backdrop-filter: blur(17px);
  background: rgba(20, 20, 25, 0.85);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.08),
    0 -4px 24px rgba(0, 0, 0, 0.35);
  padding-bottom: calc(8px + env(safe-area-inset-bottom));

  @media (min-width: 769px) {
    display: none;
  }
`;

const LeftGroup = styled.div`
  grid-column: 1;
  grid-row: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  justify-self: start;
`;

const RightGroup = styled.div`
  grid-column: 2;
  grid-row: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-self: end;
`;

const ProgressRow = styled.div`
  grid-column: 1 / -1;
  grid-row: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const SeekArea = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  padding: 8px 0;
  margin: -8px 0;
  cursor: pointer;
  touch-action: none;
`;

const ProgressTrack = styled.div`
  position: relative;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${PLAYER_ACCENT};
  border-radius: 2px;
  pointer-events: none;
`;

const ProgressKnob = styled.div<{ $dragging: boolean }>`
  position: absolute;
  top: 50%;
  width: ${({ $dragging }) => ($dragging ? '14px' : '11px')};
  height: ${({ $dragging }) => ($dragging ? '14px' : '11px')};
  border-radius: 50%;
  background: #fff;
  border: 2px solid ${PLAYER_ACCENT};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.45);
  transform: translate(-50%, -50%);
  transition: width 120ms ease, height 120ms ease;
  pointer-events: none;
`;

const PlayBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: ${PLAYER_ACCENT};
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
  &:active { transform: scale(0.94); }
`;

const Meta = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.25;
`;

const TrackTitle = styled.span`
  font-family: Verdana;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtist = styled.span`
  font-family: Verdana;
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const AlbumCover = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  flex-shrink: 0;
  overflow: hidden;
  background: linear-gradient(135deg, ${PLAYER_ACCENT} 0%, #484b8f 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AlbumCoverImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export default MobileMiniPlayer;
