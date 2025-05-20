import React, { useState, useRef, useEffect, useReducer } from "react";
import { findDOMNode } from "react-dom";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import screenful from "screenfull";
import styled from "styled-components";

// MATERIAL
// import Typography from "@mui/material/Typography";
// import Slider from "@mui/material/Slider";
// import Tooltip from "@mui/material/Tooltip";
// import Grid from "@mui/material/Grid";
// import Paper from "@mui/material/Paper";
// import Popover from "@mui/material/Popover";

import {
  // StyledTypography,
  // StyledSlider,
  // StyledTooltip,
  // StyledGrid,
  // StyledPaper,
  // StyledPopover,
} from 'views/styledComponents';

// import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// import VolumeUp from "@mui/icons-material/VolumeUp";
// import VolumeDown from "@mui/icons-material/VolumeDown";
// import VolumeMute from "@mui/icons-material/VolumeOff";
// import FullScreen from "@mui/icons-material/Fullscreen";
// import { makeStyles, withStyles } from "@mui/material/styles";

import {
  StyledPlayArrowIcon,
  // StyledVolumeUp,
  // StyledVolumeDown,
  // StyledVolumeMute,
  // StyledFullScreen,
} from 'views/styledComponents/icons'

// VIEWS
// React-netflix-player
// import Controls from "./Controls";
import PlayerControls from 'views/components/video-player/PlayerControls';
import PlayerOverlay from 'views/components/video-player/PlayerOverlay';
import { INITIAL_STATE, reducer } from 'views/components/video-player/reducer';


// ICONS
import { MdRemoveRedEye } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import { FiPlay } from 'react-icons/fi';
import { FcLike, FcLikePlaceholder } from 'react-icons/fc';

const StyledPlayer = styled.div`

  position: relative;
  /* aspect-ratio: 16/9; */
  border-radius: 8px;
   height: 293px;
  width: 293px;
  /*height: 100%;
  width: 100%; */


  video,
  .react-player__preview {
    /* border-radius: 8px; */
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background-color: black;
  }


  // defined from script, if props light is true then is visible
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

let count = 0;

function StyledVideoCard({ url, light, viewsCount, likesCount }, props) {
  

  return (

    <StyledContainer maxWidth="sm">

      <StyledPlayer state={state} ref={wrapperRef}>

        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"

          playIcon={
            <FiPlay
              sx={{
                color: 'white',
                fontSize: '4.5rem',
              }}
            />
          }
          light={light}
          controls={state.controls}
          loop={state.loop}
          muted={state.muted}
          playing={state.playing}
          playbackRate={state.playbackRate}
          volume={state.volume}
          onPlay={handlePlay}
          onEnded={handleEnded}
          onPause={handlePause}
          onDuration={handleDuration}
          onProgress={handleProgress}
          onClickPreview={handlePreview}
        />
        {/*<DoubleClickFullScreenWrapper onClick={doubleClickToggleFullScreen} className="DoubleClick" />*/}
        <PlayerOverlay state={state} />
        {!state.controls && !state.light && (
          <PlayerControls
            state={state}
            dispatch={dispatch}
            playerRef={playerRef}
            wrapperRef={wrapperRef}
            doubleClickToggleFullScreen={doubleClickToggleFullScreen}
            />
        )}

      </StyledPlayer>


      <Stats>
        <LikesCounter><FcLike /><StyledSpan>{likesCount}</StyledSpan> </LikesCounter>
        <ViewsCounter><StyledFaEye /><StyledSpan>{viewsCount}</StyledSpan></ViewsCounter>

      </Stats>

    </StyledContainer>

  );
}

export default StyledVideoCard;
