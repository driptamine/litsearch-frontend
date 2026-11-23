import React, { useState } from 'react';
import { styled } from '@linaria/react';
import { useLocation } from 'react-router-dom';
import { FaPlay, FaPause, FaTimes, FaStepForward, FaStepBackward } from 'react-icons/fa';
import { usePlayer } from 'core/context/PlayerContext';
import useDetectMobile from 'core/hooks/useDetectMobile';
import FullPlayer from 'views/components/FullPlayer';

export const PLAYER_ACCENT = '#686abb';

// Thin global mini player docked above the bottom navbar (mobile only).
// Stays mounted across route changes so playback never stops. Tapping the
// bar (outside the buttons) opens the FullPlayer sheet.
const MiniPlayer = () => {
  const isMobile = useDetectMobile();
  const { pathname } = useLocation();
  const player = usePlayer();
  const [fullOpen, setFullOpen] = useState(false);
  if (!isMobile || !player?.current) return null;

  const isAuthPage = pathname === '/' || pathname === '/login' || pathname === '/signup';
  const isConversation = /^\/chat\/(?:[1-9]\d*|saved|group\/[1-9]\d*)\/?$/.test(pathname);
  const aboveNav = isMobile && !isAuthPage && !isConversation;

  const { current, playing, currentTime, duration, queue } = player;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
    <Bar $aboveNav={aboveNav} onClick={() => setFullOpen(true)} title={`${current.title} — ${current.artist}`}>
      <ProgressTrack>
        <ProgressFill style={{ width: `${progress}%` }} />
      </ProgressTrack>
      <PlayBtn onClick={(e) => { e.stopPropagation(); player.toggle(); }} title={playing ? 'Pause' : 'Play'}>
        {playing ? <FaPause size={14} /> : <FaPlay size={14} />}
      </PlayBtn>
      <Meta>
        <TrackTitle>{current.title}</TrackTitle>
        {current.artist && <TrackArtist>{current.artist}</TrackArtist>}
      </Meta>
      {queue.length > 1 && (
        <>
          <StepBtn onClick={(e) => { e.stopPropagation(); player.prev(); }} title="Previous">
            <FaStepBackward size={12} />
          </StepBtn>
          <StepBtn onClick={(e) => { e.stopPropagation(); player.next(); }} title="Next">
            <FaStepForward size={12} />
          </StepBtn>
        </>
      )}
      <CloseBtn onClick={(e) => { e.stopPropagation(); player.close(); }} title="Close">
        <FaTimes size={13} />
      </CloseBtn>
    </Bar>
    <FullPlayer open={fullOpen} onClose={() => setFullOpen(false)} />
    </>
  );
};

const Bar = styled.div`
  position: fixed;
  left: 12px;
  right: 12px;
  bottom: ${({ $aboveNav }) => ($aboveNav ? '80px' : '12px')};
  height: 48px;
  z-index: 1001;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px 0 6px;
  border-radius: 24px;
  cursor: pointer;
  overflow: hidden;
  backdrop-filter: blur(17px);
  -webkit-backdrop-filter: blur(17px);
  background: rgba(20, 20, 25, 0.85);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.08),
    0 -4px 24px rgba(0, 0, 0, 0.35);
  padding-bottom: env(safe-area-inset-bottom);
`;

const ProgressTrack = styled.div`
  position: absolute;
  top: 0;
  left: 16px;
  right: 16px;
  height: 2px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 1px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${PLAYER_ACCENT};
  border-radius: 1px;
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

const StepBtn = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 8px 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
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

export default MiniPlayer;
