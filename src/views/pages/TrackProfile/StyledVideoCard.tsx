import React, { useState, useRef, useEffect, useReducer } from 'react';
import { findDOMNode } from 'react-dom';
import ReactPlayer from 'react-player';
import screenful from 'screenfull';
import { styled } from '@linaria/react';

import {
  StyledPlayArrowIcon,
} from 'views/styledComponents/icons'

import PlayerControls from 'views/components/video-player/PlayerControls';
import PlayerOverlay from 'views/components/video-player/PlayerOverlay';
import { INITIAL_STATE, reducer } from 'views/components/video-player/reducer';

import { MdRemoveRedEye } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import { FiPlay } from 'react-icons/fi';
import { FcLike, FcLikePlaceholder } from 'react-icons/fc';

const StyledPlayer = styled.div<{ state: { light: boolean; playing: boolean } }>`
  position: relative;
  border-radius: 8px;
  height: 293px;
  width: 293px;

  video,
  .react-player__preview {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background-color: black;
  }

  .react-player__preview:before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.1), transparent);
  }

  &:hover {
    .video-player__controls {
      opacity: 1;
    }
  }

  .video-player__controls {
    opacity: ${({ state }) => (state.light ? '0' : state.playing ? '0' : '1')};
  }
`;

const DoubleClickFullScreenWrapper = styled.div`
  top: 0;
  position: absolute;
  width: 100%;
  height: 100%;
`;
const StyledContainer = styled.div`
  color: white;
`;
const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  height: 100px;
  background: black;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;
const ViewsCounter = styled.div`
  display: flex;
  height: 30px;
  align-items: center;
  margin-left: 6em;
`;
const StyledFaEye = styled(FaEye)`
  margin-right: 6px;
`;
const StyledSpan = styled.span`
`;
const LikesCounter = styled.div`
  display: flex;
  height: 30px;
  align-items: center;
  margin-left: 1em;
`;
const CommentsCounter = styled.div`
`;
const VideoPlayer = styled(ReactPlayer)`
  background-color: black;
`;
const ReStyledPlayArrowIcon = styled(StyledPlayArrowIcon)`
  font-size: 4.5rem;
  color: red;
`;

const format = (seconds: number): string => {
  if (isNaN(seconds)) {
    return `00:00`;
  }
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, '0');
  if (hh) {
    return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
  }
  return `${mm}:${ss}`;
};

let count = 0;

interface StyledVideoCardProps {
  url: string;
  light: string;
  viewsCount: string;
  likesCount: string;
}

function StyledVideoCard({ url, light, viewsCount, likesCount }: StyledVideoCardProps) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [played, setPlayed] = useState(0);

  const [seekedTime, setSeekedTime] = useState(0);
  const [seeking, setSeeking] = useState(false);

  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const seekBar = useRef<HTMLInputElement>(null);

  const handlePreview = () => {
    dispatch({ type: 'PLAY' });
    dispatch({ type: 'LIGHT', payload: false });
  };

  const doubleClickToggleFullScreen = (event: React.MouseEvent) => {
    if (event.detail === 2) {
      console.log('double click');
      if (playerContainerRef.current) {
        screenful.toggle(playerContainerRef.current);
      }
    } else {
    }
  };

  const handlePause = () => {
    dispatch({ type: 'PAUSE' });
  };

  const handlePlay = () => {
    dispatch({ type: 'PLAY' });
  };

  const handleEnded = () => {
    dispatch({ type: 'LIGHT', payload: true });
    if (playerRef && playerRef.current) {
      playerRef.current.showPreview();
    }
  };

  const handleProgress = (progress: { playedSeconds: number }) => {
    dispatch({ type: 'SEEK', payload: progress.playedSeconds });
  };

  const handleDuration = (duration: number) => {
    dispatch({ type: 'DURATION', payload: duration });
  };

  const seekHandler = (e: React.SyntheticEvent, value: number) => {
    setPlayed(value / 100);
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e: React.MouseEvent) => {
    setSeeking(false);
    playerRef.current?.seekTo(parseFloat((e.target as HTMLInputElement).value));
  };

  return (
    <StyledContainer>
      <StyledPlayer state={state} ref={wrapperRef}>
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"

          playIcon={
            <FiPlay
              style={{
                color: 'white',
                fontSize: '4.5rem',
              }}
            />
          }
          light={light}
          controls={state.controls}
          loop={false}
          muted={false}
          playing={state.playing}
          playbackRate={1}
          volume={state.volume}
          onPlay={handlePlay}
          onEnded={handlePause}
          onPause={handlePause}
          onDuration={handleDuration}
          onProgress={handleProgress}
          onClickPreview={handlePreview}
        />
        <PlayerOverlay state={state} />
        {!state.controls && !state.light && (
          <PlayerControls
            state={state}
            dispatch={dispatch}
            playerRef={playerRef}
            wrapperRef={wrapperRef}
            doubleClickToggleFullScreen={doubleClickToggleFullScreen}
            onMouseDown={handleSeekMouseDown}
            onMouseUp={handleSeekMouseUp}
            onChange={handleSeekChange}
          />
        )}
      </StyledPlayer>

      <Stats>
        <LikesCounter><FcLike /><StyledSpan>{likesCount}</StyledSpan></LikesCounter>
        <ViewsCounter><StyledFaEye /><StyledSpan>{viewsCount}</StyledSpan></ViewsCounter>
      </Stats>
    </StyledContainer>
  );
}

export default StyledVideoCard;