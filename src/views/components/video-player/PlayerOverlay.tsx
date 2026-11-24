import * as React from 'react';
import { styled } from '@linaria/react';
import { StyledBox } from 'views/styledComponents';
import { VideoPlayerState } from './reducer';

interface PlayerOverlayProps {
  state: VideoPlayerState;
}

const StyledPlayerOverlay = styled.div<{ state: VideoPlayerState }>`
  position: absolute;
  width: 100%;
  box-sizing: border-box;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: end;
  left: 0;
  top: 0;
  bottom: ${({ state }) => (state.light ? '0' : '94px')};
  background-color: ${({ state }) => (state.light || state.playing ? 'transparent' : 'rgba(0, 0, 0, 0.4)')};
  opacity: ${({ state }) => (state.playing ? '0' : '1')};
  transition: opacity 0.2s ease-in-out;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;

  .video-player__overlay-inner {
    padding-left: ${({ state }) => (state.light ? '50px' : '25px')};
    padding-bottom: ${({ state }) => (state.light ? '50px' : '38px')};
    width: ${({ state }) => (state.light ? 'auto' : '100%')};
  }
`;

const PlayerOverlay = ({ state }: PlayerOverlayProps) => {
  return (
    <StyledPlayerOverlay state={state}>
      <StyledBox className={'video-player__overlay-inner'}>
      </StyledBox>
    </StyledPlayerOverlay>
  );
};

export default PlayerOverlay;