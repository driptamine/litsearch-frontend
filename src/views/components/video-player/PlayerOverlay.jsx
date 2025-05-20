import * as React from 'react';
import styled from 'styled-components';
import { ReactPlayerProps } from 'react-player';


// import { Box, Chip, Fade, styled, Typography } from '@mui/material';
import { StyledBox, StyledChip, StyledFade, StyledTypography } from 'views/styledComponents';



const StyledPlayerOverlay = styled.div`
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

const PlayerOverlay = (props) => {
  const { state } = props;

  return (
    <StyledPlayerOverlay state={state}>
      <StyledBox className={'video-player__overlay-inner'}>
        {/*<Fade in>
          <Chip label={'#1 in series'} color={'warning'} />
        </Fade>
        <Fade in>
          <Typography variant="h4" color={'white'} mt={2}>
            Lost in Japan
          </Typography>
        </Fade>
        <Fade in>
          <Typography variant="overline" color={'white'}>
            2022
          </Typography>
        </Fade>*/}

      </StyledBox>
      {/*<span>{state.duration}</span>*/}
    </StyledPlayerOverlay>
  );
};

export default PlayerOverlay;
