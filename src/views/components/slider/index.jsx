import styled from 'styled-components'
// import Slider, { Tracks } from 'react-compound-slider'

const StyledSlider = styled.span`

`;
const StyledRail = styled.span`

`;

const StyledTrack = styled.span`

`;

const StyledInput = styled.input`

`;

const StyledThumb = styled.span`
  border-radius: 50%;
  width: 12px;
  height: 12px;
`;
const StyledSeek = styled.span`
  border-radius: 50%;
  width: 12px;
  height: 12px;
`;


  <StyledSlider

  >

    <StyledTrack left={false} right={false}>  // you can toggle the left and right tracks
      {({ tracks, getTrackProps }) => (
        <div className="slider-tracks">
          {tracks.map(({ id, source, target }) => (
            return (
              <div
                {...props}
                {...getTrackProps()}
              />
            )
          ))}
        </div>
      )}
    </StyledTrack>
  </StyledSlider>
