import React, { useState, useEffect } from 'react';
import { styled } from '@linaria/react';
import { Link } from 'react-router-dom';
import {
  FaPlay, FaPause, FaStepForward, FaStepBackward,
  FaTimes, FaHeart, FaRegHeart, FaMusic, FaListUl, FaChevronDown,
} from 'react-icons/fa';
import { usePlayer } from 'core/context/PlayerContext';

const PLAYER_ACCENT = '#686abb';

const formatTime = (seconds) => {
  if (!seconds || !isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// Full-screen player sheet: cover art, seekable track bar, transport
// controls, queue list (Q) and the library like button.
const FullPlayer = ({ open, onClose }) => {
  const player = usePlayer();
  const [showQueue, setShowQueue] = useState(false);
  const [seekValue, setSeekValue] = useState(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open ]);

  useEffect(() => {
    if (open) setShowQueue(false);
  }, [open, player?.current?.key]);

  if (!open || !player?.current) return null;
  const { current, playing, currentTime, duration, queue, liked } = player;
  const shownTime = seekValue ?? currentTime;

  // Get album cover from track data
  const albumCover = current?.album_cover || current?.artwork_url || current?.image_url || current?.cover_url || null;

  return (
    <Sheet onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        <TopBar>
          <IconBtn onClick={onClose} title="Close player">
            <FaChevronDown size={18} />
          </IconBtn>
          <TopTitle>Now Playing</TopTitle>
          <IconBtn as={Link} to="/music/liked" title="Open library">
            <FaMusic size={15} />
          </IconBtn>
        </TopBar>

        <Cover>
          {albumCover ? (
            <CoverImg src={albumCover} alt="Album cover" />
          ) : (
            <FaMusic size={72} color="rgba(255,255,255,0.85)" />
          )}
        </Cover>

        <TrackName>{current.title}</TrackName>
        {current.artist && <TrackArtist>{current.artist}</TrackArtist>}

        <LikeRow>
          <LikeBtn
            onClick={player.toggleLike}
            disabled={!current.trackId}
            liked={liked}
            title={liked ? 'Remove from library' : 'Add to library'}
          >
            {liked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
          </LikeBtn>
          <LikeHint>{liked ? 'In your library' : 'Add to library'}</LikeHint>
        </LikeRow>

        <ProgressRow>
          <TimeLabel>{formatTime(shownTime)}</TimeLabel>
          <SeekBar
            type="range"
            min={0}
            max={duration || 0}
            step={1}
            value={Math.min(shownTime, duration || 0)}
            onChange={(e) => setSeekValue(Number(e.target.value))}
            onMouseUp={() => { if (seekValue != null) { player.seekTo(seekValue); setSeekValue(null); } }}
            onTouchEnd={() => { if (seekValue != null) { player.seekTo(seekValue); setSeekValue(null); } }}
            aria-label="Seek"
          />
          <TimeLabel>{formatTime(duration)}</TimeLabel>
        </ProgressRow>

        <Controls>
          <TransportBtn onClick={player.prev} disabled={queue.length < 2} title="Previous">
            <FaStepBackward size={22} />
          </TransportBtn>
          <PlayPauseBtn onClick={player.toggle} title={playing ? 'Pause' : 'Play'}>
            {playing ? <FaPause size={24} /> : <FaPlay size={24} style={{ marginLeft: 3 }} />}
          </PlayPauseBtn>
          <TransportBtn onClick={player.next} disabled={queue.length < 2} title="Next">
            <FaStepForward size={22} />
          </TransportBtn>
        </Controls>

        <QueueToggle onClick={() => setShowQueue(v => !v)} title="Queue">
          <FaListUl size={15} />
          <span>Q · {queue.length}</span>
        </QueueToggle>

        {showQueue && (
          <QueueList>
            {queue.map((item, i) => (
              <QueueItem
                key={item.key || i}
                active={player.current?.key === item.key}
                onClick={() => player.playQueue(queue, i)}
              >
                <QueueIndex>{i + 1}</QueueIndex>
                <QueueMeta>
                  <QueueTitle>{item.title}</QueueTitle>
                  {item.artist && <QueueArtist>{item.artist}</QueueArtist>}
                </QueueMeta>
              </QueueItem>
            ))}
          </QueueList>
        )}
      </Panel>
    </Sheet>
  );
};

const Sheet = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const Panel = styled.div`
  width: 100%;
  max-width: 480px;
  max-height: 92dvh;
  overflow-y: auto;
  background: linear-gradient(180deg, #1c1c22 0%, #101014 70%);
  border-radius: 20px 20px 0 0;
  padding: 10px 22px calc(20px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TopBar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0 2px;
`;

const TopTitle = styled.span`
  color: rgba(255, 255, 255, 0.55);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const IconBtn = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.75);
  cursor: pointer;
  padding: 8px;
  display: flex;
  text-decoration: none;
`;

const Cover = styled.div`
  width: min(64vw, 260px);
  aspect-ratio: 1;
  border-radius: 18px;
  margin: 14px 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${PLAYER_ACCENT} 0%, #484b8f 100%);
  box-shadow: 0 12px 40px rgba(104, 106, 187, 0.35);
  overflow: hidden;
`;

const CoverImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
`;

const TrackName = styled.div`
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TrackArtist = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin-top: 4px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LikeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
`;

const LikeBtn = styled.button`
  background: none;
  border: none;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  color: ${({ liked }) => (liked ? PLAYER_ACCENT : 'rgba(255, 255, 255, 0.6)')};
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
  padding: 6px;
  display: flex;
  &:active { transform: scale(0.9); }
`;

const LikeHint = styled.span`
  color: rgba(255, 255, 255, 0.45);
  font-size: 12px;
`;

const ProgressRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
`;

const TimeLabel = styled.span`
  color: rgba(255, 255, 255, 0.55);
  font-size: 11px;
  min-width: 34px;
  text-align: center;
  font-variant-numeric: tabular-nums;
`;

const SeekBar = styled.input`
  flex: 1;
  height: 4px;
  appearance: none;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.18);
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    height: 14px;
    width: 14px;
    border-radius: 50%;
    background: ${PLAYER_ACCENT};
    border: none;
    box-shadow: 0 0 10px rgba(104, 106, 187, 0.6);
  }
  &::-moz-range-thumb {
    height: 14px;
    width: 14px;
    border-radius: 50%;
    background: ${PLAYER_ACCENT};
    border: none;
  }
  &::-moz-range-track {
    height: 4px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.18);
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 26px;
  margin-top: 16px;
`;

const TransportBtn = styled.button`
  background: none;
  border: none;
  color: ${({ disabled }) => (disabled ? 'rgba(255,255,255,0.25)' : 'rgba(255, 255, 255, 0.85)')};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  padding: 10px;
  display: flex;
  &:active { transform: scale(0.92); }
`;

const PlayPauseBtn = styled.button`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  background: ${PLAYER_ACCENT};
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 24px rgba(104, 106, 187, 0.5);
  &:active { transform: scale(0.94); }
`;

const QueueToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-weight: 700;
  padding: 7px 14px;
  border-radius: 16px;
  cursor: pointer;
`;

const QueueList = styled.div`
  width: 100%;
  margin-top: 10px;
  max-height: 30vh;
  overflow-y: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 6px;
`;

const QueueItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  background: ${({ active }) => (active ? 'rgba(104, 106, 187, 0.14)' : 'transparent')};
  border: none;
  border-radius: 8px;
  padding: 8px 10px;
  cursor: pointer;
  text-align: left;
  color: #fff;
`;

const QueueIndex = styled.span`
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
  min-width: 18px;
  text-align: right;
  font-variant-numeric: tabular-nums;
`;

const QueueMeta = styled.span`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

const QueueTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const QueueArtist = styled.span`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default FullPlayer;
