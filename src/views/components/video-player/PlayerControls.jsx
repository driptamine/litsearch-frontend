import React, { useState } from 'react';
import { ReactPlayerProps } from 'react-player';
// import { format } from 'date-fns';
import screenfull from 'screenfull';
import { findDOMNode } from 'react-dom';
import  styled  from 'styled-components';

import { StyledIconButton, StyledSlider, StyledStack, StyledTypography } from 'views/styledComponents';
import { StyledPauseIcon, StyledPlayArrowIcon, StyledVolumeUpIcon } from 'views/styledComponents/icons';
import { StyledRail, StyledTrack, StyledThumb, StyledThumbMUI, StyledThumbWrapper } from 'views/styledComponents/VideoPlayer';


import { TbArrowsDiagonal } from 'react-icons/tb';
import { FiPlay } from 'react-icons/fi';
import { FiPause } from 'react-icons/fi';
import { FaVolumeUp } from 'react-icons/fa';

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

  /* background-color: rgba(0, 0, 0, 0.6); */

  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;

  .video-player__slider {
    width: 100%;
    color: #fff;
    box-sizing: border-box;

    &--seek {
      /* margin-left: 12px; */
      /* margin-right: 12px; */
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

const ReStyledSlider = styled(StyledSlider)`
  transform: rotate(-90deg);
  position: relative;
  background-color: #ffffff1c;
  border-radius: 18px;
`;

const StyledGrid = styled.div`
  display: flex;
  align-items: center;

`;

const format = (seconds) => {
  if (isNaN(seconds)) {
    return `00:00`;
  }
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");
  if (hh) {
    return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
  }
  return `${mm}:${ss}`;
};



// const StyledSliderzUpd = styled(StyledSliderz)`
//
//
// `;

const WrapperDivRail = styled.div`
  width: 100%;
  display: inline-block;
  cursor: pointer;
`;
const WrapperDiv = styled.div`


  bottom: 58px;
  /* left: 14em; */
  /* left: 77%; */
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

const StyledInputHorizontal = styled.input`

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

const ReStyledGrid = styled.div`
  display: flex;
  position: relative;
`;
const ProgressWrapper = styled.div`
  display: flex;
  position: relative;
`;

const StyledSliderz = () => {

  return (
    <WrapperDiv>
      <span rail></span>
      <span track></span>
      <StyledInput
        type="range"
        orient="vertical"
      />
    </WrapperDiv>
  )
}

const StyledSliderRail = ({
  value,
  max,
  propgressWidth,
  seek,
  onMouseDown,
  onMouseUp,
  onChange,
}) => {

  const progressValue = (value / max)*100;
  return (
    <WrapperDivRail>
      <StyledRail rail />
      <StyledTrack
        value={value}
        progress={propgressWidth}
        onChange={seek}

        // onMouseDown={onMouseDown}
        //
        // onMouseUp={onMouseUp}
        // onChange={onChange}

      />

      {/*<StyledThumbWrapper>*/}


        <StyledThumb
        // <StyledThumbMUI
        // <StyledInputHorizontal
          // type="range"
          orient="horizontal"
          // type='range'
          step='any'
          onChange={seek}
          // onMouseUp={handleSeekMouseUp}

          // onMouseUp={seek}

          min={0}
          // max={0.999999}
          max={max}
          // value={propgressWidth}
          value={value}


          // IMPORTANT
          // onMouseDown={handleSeekMouseDown}
          // onChange={handleSeekChange}
          // onMouseUp={handleSeekMouseUp}
        />

        {/*<input
          type="range"
          min={0}
          max={1}
          step="any"
          value={played}
          onMouseDown={handleSeekMouseDown}
          onChange={handleSeekChange}
          onMouseUp={handleSeekMouseUp}
        />*/}
      {/*</StyledThumbWrapper>*/}
    </WrapperDivRail>
  )
}

const PlayerControls = (props, {doubleClickToggleFullScreen}) => {
  const { state, dispatch, wrapperRef, playerRef } = props;

  const handleSound = (_event, newValue) => {
    dispatch({ type: 'VOLUME', payload: newValue });
  };

  const handleFullscreen = () => {
    screenfull.toggle(findDOMNode(wrapperRef.current));
  };

  const handleSeek = (_event, newValue) => {
    playerRef.current.seekTo(newValue);
  };

  const renderSeekSlider = () => {
    return (
      <StyledSlider
        aria-label="Time"
        className={'video-player__slider video-player__slider--seek'}
        min={0}
        max={state.duration}
        step={0.01}
        value={state.progress.playedSeconds}
        onChange={handleSeek}
      />
    );
  };

  const renderPlayButton = () => {
    return (
      <StyledIconButton onClick={() => dispatch({ type: 'TOGGLE_PLAY' })}>
        {state.playing ? (
          <FiPause sx={{ fontSize: '2rem', color: 'white' }} />
        ) : (
          <FiPlay sx={{ fontSize: '2rem', color: 'white' }} />
        )}
      </StyledIconButton>
    );
  };
  const [isShown, setIsShown] = useState(false);

  // const [data, setData] = useState(null)
  const [delayHandler, setDelayHandler] = useState(null)

  const handleMouseEnter = event => {
    setDelayHandler(setTimeout(() => {
      // const yourData = // whatever your data is


    }, 1500))
    setIsShown(true)
  };

  const handleMouseLeave = () => {
    setDelayHandler(setTimeout(() => {
      // const yourData = // whatever your data is
      setIsShown(false)

    }, 2500))

    clearTimeout(delayHandler)
  };


  const renderSoundSlider = () => {
    return (
      <ReStyledGrid
        id="SLIDER-VOL"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        // spacing={2}
        // direction="row"
        // sx={{ mb: 1, px: 1 }}
        // alignItems="center"
        >
        <StyledIconButton

        >
          <FaVolumeUp

            sx={{ fontSize: '1.5rem', color: 'white' }}
          />

        </StyledIconButton>
        {isShown && (
          <StyledSliderz
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label="Volume"
            className={'video-player__slider video-player__slider--sound'}
            max={1}
            step={0.01}
            value={state.volume}
            onChange={handleSound}
          />
        )}

      </ReStyledGrid>
    );
  };

  const renderProgressBar = () => {
    const percentage = (state.progress.playedSeconds / state.duration) * 100
    return (
      <ProgressWrapper
        id="SLIDER-PROGRESS"
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
        // spacing={2}
        // direction="row"
        // sx={{ mb: 1, px: 1 }}
        // alignItems="center"
        >

        {/*{isShown && (*/}
          <StyledSliderRail
            // onMouseEnter={handleMouseEnter}
            // onMouseLeave={handleMouseLeave}
            aria-label="Time"
            className={'video-player__slider video-player__slider--seek'}
            min={0}
            max={state.duration}
            step={0.01}
            value={state.progress.playedSeconds}


            propgressWidth={percentage}
            // onChange={handleSeek}
            seek={handleSeek}

            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
            onChange={props.onChange}
          />
        {/*)}*/}

      </ProgressWrapper>
    );
  };

  const renderDurationText = () => {
    return (
      <div spacing={2} direction="row" sx={{ mb: 1, px: 1 }} alignItems="center">
        <StyledTypography variant="body2" color="white">
          {format(new Date(state.progress.playedSeconds ), 'mm:ss')}
          {' / '}
          {format(new Date(state.duration ), 'mm:ss')}
        </StyledTypography>
      </div>
    );
  };

  // const renderFullscreenButton = () => {
  //   return (
  //     <IconButton onClick={handleFullscreen}>
  //       <FullScreen sx={{ fontSize: '2rem', color: 'white' }} />
  //     </IconButton>
  //   );
  // };

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
        <div direction="row" alignItems="center">
          {renderSeekSlider()}
        </div>
        <StyledPlayerControlsBottom>
          <PlayAndSound >
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
