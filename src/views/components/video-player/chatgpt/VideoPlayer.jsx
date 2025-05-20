import React, { useState, useRef, useReducer } from 'react';
import ReactPlayer from 'react-player';
import styled from 'styled-components';

import { FiPlay, FiPause } from 'react-icons/fi';
import { FaVolumeUp } from 'react-icons/fa';


import { INITIAL_STATE, reducer } from 'views/components/video-player/reducer';
import { StyledTypography, StyledIconButton } from 'views/styledComponents';

const StyledContainer = styled.div`
  color: white;
`;

const StyledPlayer = styled.div`
  position: relative;
  height: 293px;
  width: 293px;

  input[type="range"]::-webkit-slider-runnable-track {
    background: #053a5f;
    height: 0.5rem;
  }
`;
const StyledVolume = styled.input`
  -webkit-appearance: slider-vertical;
  appearance: slider-vertical;

  cursor: pointer;

  height: 80px;
  width: 20px;
  background: red;

  input[type="range"]::-webkit-slider-runnable-track {
    background: red;
    height: 0.5rem;
  }
`;
const Control = styled.div`
  display: grid;
`;
const Bottom = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const Button = styled.button`
  width: 32px;
  cursor: pointer;
`;

const height = "36px";
const thumbHeight = 18;
const trackHeight = "16px";

// colours
const upperColor = "#edf5f9";
// const lowerColor = "#0199ff";
const lowerColor = "red";
const thumbColor = "#ddd";
const thumbHoverColor = "#ccc";
const upperBackground = `linear-gradient(to bottom, ${upperColor}, ${upperColor}) 100% 50% / 100% ${trackHeight} no-repeat transparent`;
const lowerBackground = `linear-gradient(to bottom, ${lowerColor}, ${lowerColor}) 100% 50% / 100% ${trackHeight} no-repeat transparent`;

// Webkit cannot style progress so we fake it with a long shadow on the thumb element
const makeLongShadow = (color, size) => {
  let i = 18;
  let shadow = `${i}px 0 0 ${size} ${color}`;

  for (; i < 706; i++) {
    shadow = `${shadow}, ${i}px 0 0 ${size} ${color}`;
  }

  return shadow;
};


const Input = styled.input`
  overflow: hidden;
  display: block;
  appearance: none;
  max-width: 700px;
  width: 100%;
  margin: 0;
  height: ${height};
  cursor: pointer;
  background: green;
  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: ${height};

    background: red;
  }

  &::-webkit-slider-thumb {
    position: relative;
    appearance: none;
    height: ${thumbHeight}px;
    width: ${thumbHeight}px;
    background: ${thumbColor};
    border-radius: 100%;
    border: 0;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: ${makeLongShadow(upperColor, "-4px")};
    transition: background-color 150ms;
  }
  &::-webkit-progress-bar {
    background-color: orange;
  }
  &::-moz-range-track,
  &::-moz-range-progress {
    width: 100%;
    height: ${height};
    background: ${upperBackground};
  }

  &::-moz-range-progress {
    background: ${lowerBackground};
  }

  &::-moz-range-thumb {
    appearance: none;
    margin: 0;
    height: ${thumbHeight};
    width: ${thumbHeight};
    background: ${thumbColor};
    border-radius: 100%;
    border: 0;
    transition: background-color 150ms;
  }

  &::-ms-track {
    width: 100%;
    height: ${height};
    border: 0;
    /* color needed to hide track marks */
    color: transparent;
    background: transparent;
  }

  &::-ms-fill-lower {
    background: ${lowerBackground};
  }

  &::-ms-fill-upper {
    background: ${upperBackground};
  }

  &::-ms-thumb {
    appearance: none;
    height: ${thumbHeight};
    width: ${thumbHeight};
    background: ${thumbColor};
    border-radius: 100%;
    border: 0;
    transition: background-color 150ms;
    /* IE Edge thinks it can support -webkit prefixes */
    top: 0;
    margin: 0;
    box-shadow: none;
  }

  &:hover,
  &:focus {
    &::-webkit-slider-thumb {
      background-color: ${thumbHoverColor};
    }
    &::-moz-range-thumb {
      background-color: ${thumbHoverColor};
    }
    &::-ms-thumb {
      background-color: ${thumbHoverColor};
    }
  }
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


function VideoPlayer({ url, light, viewsCount, likesCount }, props) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);


  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const playerRef = useRef(null);

  const playerContainerRef = useRef(null);
  const wrapperRef = useRef(null);


  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = e => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = e => {
    setSeeking(false);
    playerRef.current.seekTo(parseFloat(e.target.value));
  };

  const handleProgress = state => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  const handlePause = () => {
    dispatch({ type: 'PAUSE' });
  };

  const handlePlay = () => {
    dispatch({ type: 'PLAY' });
  };

  const handleSound = (_event, newValue) => {
    dispatch({ type: 'VOLUME', payload: newValue });
  };

  const handlePreview = () => {
    dispatch({ type: 'PLAY' });
    dispatch({ type: 'LIGHT', payload: false });
  };


  // const handleProgress = (progress) => {
  //   dispatch({ type: 'SEEK', payload: progress.playedSeconds });
  // };

  const handleDuration = (duration) => {
    dispatch({ type: 'DURATION', payload: duration });
  };

  // Progress bar
  // const sliderEl = document.querySelector("#range")
  // const sliderValue = document.querySelector(".value")
  //
  // sliderEl.addEventListener("input", (event) => {
  //   const tempSliderValue = event.target.value;
  //
  //   sliderValue.textContent = tempSliderValue;
  //
  //   const progress = (tempSliderValue / sliderEl.max) * 100;
  //
  //   sliderEl.style.background = `linear-gradient(to right, #f50 ${progress}%, #ccc ${progress}%)`;
  // })

  const seek = e => {
    playerRef.current.seekTo(e.target.value, "seconds")
  }
  return (
    <StyledContainer>
      <StyledPlayer state={state} ref={wrapperRef}>
        <ReactPlayer
          playing={state.playing}
          ref={playerRef}
          url={url}
          controls={state.controls}
          // onProgress={handleProgress}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handlePause}

          playIcon={
            <FiPlay
              sx={{
                color: 'white',
                fontSize: '4.5rem',
              }}
            />
          }
          light={light}
          width="100%"
          height="100%"

          onClickPreview={handlePreview}

          onDuration={handleDuration}
          onProgress={handleProgress}

        />


        {!state.controls && !state.light && (
          <Control>
            <Input
              id="range"
              type="range"
              min={0}
              max={1}
              step="any"
              value={played}

              onMouseDown={handleSeekMouseDown}
              onMouseUp={handleSeekMouseUp}
              onChange={handleSeekChange}

              // onChange={seek} Weird
            />
            <Bottom>
              <Button onClick={() => dispatch({ type: 'TOGGLE_PLAY' })}>
                {state.playing ? (<FiPause sx={{ fontSize: '2rem', color: 'white' }} />) : (<FiPlay sx={{ fontSize: '2rem', color: 'white' }} /> )}
              </Button>

              <div spacing={2} direction="row" sx={{ mb: 1, px: 1 }} alignItems="center">
                <div variant="body2" color="white">
                  {format(new Date(state.progress.playedSeconds ), 'mm:ss')}
                  {' / '}
                  {format(new Date(state.duration ), 'mm:ss')}
                </div>
              </div>
              <StyledIconButton>
                <FaVolumeUp

                  sx={{ fontSize: '1.5rem', color: 'white' }}
                />
              </StyledIconButton>
              <StyledVolume
                type="range"
                orient="vertical"
                min={0}
                max={1}
                step="any"
                value={state.volume}
                onChange={handleSound}
              />
            </Bottom>
          </Control>
        )}
      </StyledPlayer>
    </StyledContainer>
  );
}

export default VideoPlayer;
