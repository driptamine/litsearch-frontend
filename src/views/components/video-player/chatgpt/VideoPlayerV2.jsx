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

  input[type="range"]::-webkit-slider-runnable-track {
    background: #053a5f;
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
`;
const Input = styled.input`
  cursor: pointer;
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

  const videoRef = useRef(null)

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

  const handlePlayPauseClick = () => {
    if (videoRef.current) {
      if (state.playing) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  const handleSound = (_event, newValue) => {
    dispatch({ type: 'VOLUME', payload: newValue });
  };

  const handlePreview = () => {
    dispatch({ type: 'PLAY' });
    dispatch({ type: 'LIGHT', payload: false });
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
        <video
          playing={state.playing}
          // ref={playerRef}
          ref={videoRef}
          src={url}
          // autoplay={true}
          controls={true}
          onProgress={handleProgress}
          // onPlay={handlePlay}
          // onPause={handlePause}
          onEnded={handlePause}
          onClick={handlePlayPauseClick}

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
        >
        <source src={url} type="application/x-mpegURL" />
        </video>

        {!state.controls && !state.light && (
          <Control>
            <Input
              id="range"
              type="range"
              min={0}
              max={1}
              step="any"
              // step="0.001"
              value={played}

              onMouseDown={handleSeekMouseDown}
              onChange={handleSeekChange}
              onMouseUp={handleSeekMouseUp}


              // onChange={seek} Weird
            />
            <Bottom>
              <Button onClick={() => dispatch({ type: 'TOGGLE_PLAY' })}>
                {state.playing ? (<FiPause sx={{ fontSize: '2rem', color: 'white' }} />) : (<FiPlay sx={{ fontSize: '2rem', color: 'white' }} /> )}
              </Button>

              <div spacing={2} direction="row" sx={{ mb: 1, px: 1 }} alignItems="center">
                <StyledTypography variant="body2" color="white">
                  {format(new Date(state.progress.playedSeconds ), 'mm:ss')}
                  {' / '}
                  {format(new Date(state.duration ), 'mm:ss')}
                </StyledTypography>
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
