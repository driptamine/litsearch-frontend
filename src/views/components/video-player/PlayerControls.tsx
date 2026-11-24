import React, { useState } from 'react';
import { ReactPlayerProps } from 'react-player';
import screenfull from 'screenfull';
import { findDOMNode } from 'react-dom';
import { styled } from '@linaria/react';

import { StyledIconButton, StyledSlider, StyledTypography } from 'views/styledComponents';
import { StyledRail, StyledTrack, StyledThumb } from 'views/styledComponents/VideoPlayer';
import { StyledRail as StyledRailComponent } from 'views/styledComponents/VideoPlayer';

import { TbArrowsDiagonal } from 'react-icons/tb';
import { FiPlay } from 'react-icons/fi';
import { FiPause } from 'react-icons/fi';
import { FaVolumeUp } from 'react-icons/fa';
import { VideoPlayerState, VideoPlayerAction } from './reducer';

const StyledFullScreen = styled.div`
  display: flex;
`;

const DarkDivPlayToggle = styled.div`
  top: 0;
  position: absolute;
  color: red;
`;

const PlayAndSound = styled.div`
  display: flex;
  align-items: center;
`;

const StyledPlayerControlsBottom = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StyledPlayerControls = styled.div`
  position: absolute;
  padding: 10px;
  box-sizing: border-box;
  bottom: 0;
  left: 0;
  width: 100%;

  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;

  .video-player__slider {
    width: 100%;
    color: #fff;
    box-sizing: border-box;

    &--seek {
    }

    &--sound {
      width: 100px;
    }

    .MuiSlider-track {
      border: none;
    }

    .MuiSlider-thumb {
      background-color: #fff;

      &:before: {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
      }

      &:hover,
      &.Mui-focusVisible,
      &.Mui-active {
        box-shadow: none;
      }
    }
  }
`;

const ReStyledGrid = styled.div`
  display: flex;
  position: relative;
`;

const ProgressWrapper = styled.div`
  display: flex;
  position: relative;
`;

const WrapperDiv = styled.div`
  bottom: 58px;
  position: absolute;
  background: #ffffff40;
  border-radius: 10px;

  input[type=range]::range-track {
    width: 100%;
    height: 20px;
    border-radius: 10px;
    background-color: #eee;
    border: 2px solid #ccc;
  }

  input[type=range]::range-thumb {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    background-color: white;
    border: 2px solid #1976D2;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
  }

  input[type=range]::range-progress {
    height: 20px;
    border-radius: 10px 0 0 10px;
    background-color: #2196F3;
    border: 2px solid #1976D2;
  }
`;

const StyledInput = styled.input`
  -webkit-appearance: slider-vertical;
  appearance: slider-vertical;

  cursor: pointer;

  height: 80px;
  width: 20px;

  input[type="range"]::-moz-range-thumb {
    background-color: green;
  }

  ::-webkit-slider-thumb {
    background-color: green;
  }

  ::-moz-range-thumb {
    background-color: green;
  }
`;

const StyledGrid = styled.div`
  display: flex;
  align-items: center;
`;

const WrapperDivRail = styled.div`
  width: 100%;
  display: inline-block;
  cursor: pointer;
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

interface StyledSliderRailProps {
  value: number;
  max: number;
  propgressWidth: number;
  seek: (event: React.SyntheticEvent | React.ChangeEvent<HTMLInputElement>, value?: number) => void;
  onMouseDown?: (event: React.MouseEvent) => void;
  onMouseUp?: (event: React.MouseEvent) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  'aria-label'?: string;
  min?: number;
  step?: number;
}

const StyledSliderRail = ({
  value,
  max,
  propgressWidth,
  seek,
  onMouseDown,
  onMouseUp,
  onChange,
}: StyledSliderRailProps) => {
  return (
    <WrapperDivRail>
      <StyledRailComponent rail />
      <StyledTrack
        value={value}
        progress={propgressWidth}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = parseFloat((e.target as HTMLInputElement).value);
          seek(e, newValue);
        }}
      />

      <StyledThumb
        step='any'
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = parseFloat((e.target as HTMLInputElement).value);
          seek(e, newValue);
        }}
        min={0}
        max={max}
        value={value}
      />
    </WrapperDivRail>
  );
};

interface PlayerControlsProps {
  state: VideoPlayerState;
  dispatch: React.Dispatch<VideoPlayerAction>;
  wrapperRef: React.RefObject<HTMLDivElement>;
  playerRef: React.RefObject<any>;
  doubleClickToggleFullScreen?: (event: React.MouseEvent) => void;
  onMouseDown?: (event: React.MouseEvent) => void;
  onMouseUp?: (event: React.MouseEvent) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PlayerControls = ({
  state,
  dispatch,
  wrapperRef,
  playerRef,
  doubleClickToggleFullScreen,
  onMouseDown,
  onMouseUp,
  onChange,
}: PlayerControlsProps) => {
  const handleSound = (_event: React.SyntheticEvent, newValue: number) => {
    dispatch({ type: 'VOLUME', payload: newValue });
  };

  const handleFullscreen = () => {
    if (wrapperRef.current) {
      const element = findDOMNode(wrapperRef.current) as Element | null;
      if (element) {
        screenfull.toggle(element);
      }
    }
  };

  const handleSeek = (event: React.SyntheticEvent | React.ChangeEvent<HTMLInputElement>, newValue?: number) => {
    let value: number;
    if (newValue !== undefined) {
      value = newValue;
    } else {
      const target = event.target as HTMLInputElement;
      value = parseFloat(target.value);
    }
    playerRef.current?.seekTo(value);
  };

  const renderSeekSlider = () => {
    return (
      <div style={{ width: '100%', position: 'relative' }}>
        <StyledSlider
          aria-label="Time"
          className={'video-player__slider video-player__slider--seek'}
          onChange={handleSeek}
        />
      </div>
    );
  };

  const renderPlayButton = () => {
    return (
      <StyledIconButton onClick={() => dispatch({ type: 'TOGGLE_PLAY' })}>
        {state.playing ? (
          <FiPause style={{ fontSize: '2rem', color: 'white' }} />
        ) : (
          <FiPlay style={{ fontSize: '2rem', color: 'white' }} />
        )}
      </StyledIconButton>
    );
  };

  const [isShown, setIsShown] = useState(false);
  const [delayHandler, setDelayHandler] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    setDelayHandler(setTimeout(() => {
    }, 1500));
    setIsShown(true);
  };

  const handleMouseLeave = () => {
    if (delayHandler) {
      clearTimeout(delayHandler);
    }
    setDelayHandler(setTimeout(() => {
      setIsShown(false);
    }, 2500));
  };

  const renderSoundSlider = () => {
    return (
      <ReStyledGrid
        id="SLIDER-VOL"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <StyledIconButton>
          <FaVolumeUp style={{ fontSize: '1.5rem', color: 'white' }} />
        </StyledIconButton>
        {isShown && (
          <WrapperDiv>
            <StyledInput type="range" />
          </WrapperDiv>
        )}
      </ReStyledGrid>
    );
  };

  const renderProgressBar = () => {
    const percentage = (state.progress.playedSeconds / state.duration) * 100;
    return (
      <ProgressWrapper
        id="SLIDER-PROGRESS"
      >
        <StyledSliderRail
          aria-label="Time"
          className={'video-player__slider video-player__slider--seek'}
          min={0}
          max={state.duration}
          step={0.01}
          value={state.progress.playedSeconds}
          propgressWidth={percentage}
          seek={handleSeek}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onChange={onChange}
        />
      </ProgressWrapper>
    );
  };

  const renderDurationText = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <StyledTypography style={{ color: 'white' }}>
          {format(state.progress.playedSeconds)}
          {' / '}
          {format(state.duration)}
        </StyledTypography>
      </div>
    );
  };

  const renderFullscreenButton = () => {
    return (
      <StyledGrid>
        <StyledIconButton onClick={handleFullscreen}>
          <TbArrowsDiagonal fontSize="medium" />
        </StyledIconButton>
      </StyledGrid>
    );
  };

  return (
    <StyledPlayerControls className={'video-player__controls'}>
      {renderProgressBar()}

      <div>
        <DarkDivPlayToggle onClick={doubleClickToggleFullScreen} />
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {renderSeekSlider()}
        </div>
        <StyledPlayerControlsBottom>
          <PlayAndSound>
            {renderPlayButton()}
          </PlayAndSound>

          <StyledFullScreen>
            {renderDurationText()}
            {renderSoundSlider()}
            {renderFullscreenButton()}
          </StyledFullScreen>
        </StyledPlayerControlsBottom>
      </div>
    </StyledPlayerControls>
  );
};

export default PlayerControls;