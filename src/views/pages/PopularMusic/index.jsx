import React, { useState } from 'react';
import { Link, useLocation, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { FiPlay } from 'react-icons/fi';
import { FiPause } from 'react-icons/fi';

import { StyledCardActionArea, StyledListItem, StyledListItemText, StyledListItemAvatar, StyledAvatar } from 'views/styledComponents';
import "views/components/track-card/track-card.css"

import tracks from './music.json'; // Import the JSON
import AudioPlayer from 'views/components/video-player/web/AudioPlayer';
import FormattedTime from 'views/components/formatted-time/FormattedTime';
import AudioProvider from 'views/pages/PopularMusic/AudioContext';
// import AudioProvider from 'views/pages/PopularMusic/AudioContextV2';
// import AudioProvider from 'views/pages/PopularMusic/AudioContextV3';
import CustomAudioPlayer from 'views/pages/PopularMusic/CustomAudioPlayer';
import CustomAudioPlayerV3 from 'views/pages/PopularMusic/CustomAudioPlayerV3';
import CustomAudioPlayerV4 from 'views/pages/PopularMusic/CustomAudioPlayerV4';
import CustomAudioPlayerV5 from 'views/pages/PopularMusic/CustomAudioPlayerV5';

// import { AudioProvider, useAudio } from 'views/pages/PopularMusic/AudioContext'; // adjust path
// import { useAudio } from 'views/pages/PopularMusic/AudioContextV2'; // adjust path



const TrackList = () => {
  const [isFlex, setIsFlex] = useState(false);

  const toggleDisplay = () => {
    setIsFlex(!isFlex);
  };

  return (
    <AudioProvider>
      {tracks.tracks.map((track, index) => (
        <HideIndexItem key={index}>
          <TrackNumber className="trackNumber">
            <span>
              {index+1}
            </span>
            <div
              className="play-song"
              // onClick={singleClickPlayTrack}
              // style={mini_style}
            >
              <i
                className={`fa fa-play play-btn`}
                // className={`fa ${buttonClass} play-btn`}
                aria-hidden="true"
              />
            </div>

          </TrackNumber>

          {/*<CustomAudioPlayerV3 src={track.url} title={track.title} artistName={track.artists[0].name}/>*/}
          {/*<CustomAudioPlayerV4 src={track.url} title={track.title} artistName={track.artists[0].name}/>*/}
          <CustomAudioPlayerV5 src={track.url} title={track.title} artistName={track.artists[0].name} />

          {/*<CustomAudioPlayer src={track.url} />*/}
          {/*<StyledListItemAvatar
            // style={album_cover}
          >
            <ReStyledAvatar
              // src={track.track.album.images[2] ? track.track.album.images[2].url : ""}
              variant={"rounded"}
            />

            <Flex isFlex={isFlex}>
              <LinkTrack
                track={track}
                // songId={songId}
              />
              <StyledDiv>
                <Explicit>E</Explicit>
                <ArtistsName
                  track={track}
                />
              </StyledDiv>

            </Flex>

          </StyledListItemAvatar>*/}

          <div className="Date"></div>

          {/*<StyledFormattedTime value={track.track.duration_ms} unit={'ms'} />*/}
        </HideIndexItem>
      ))}
    </AudioProvider>
  );
};

// const LinkTrack = (obj, id) => {
const LinkTrack = ({track, songId}) => {
  // const classes = useStyles();
  return (
    <span>
      <StyledLink
        to={`/track/${track.id}/`}
        underline="hover"

        >

        {track.title}

      </StyledLink>
    </span>
  )
}

const ArtistsName = ({track }) => {
  return (
    <>
      {track.artists.map((artist, i) =>
        <StyledSpan key={i}>
          {i > 0 && ", "}

          <StyledArtistLink
            to={`/artist/${artist.id}/`}
            // className={classes.linkHover}
            underline="hover"
          >

            {artist.name}
          </StyledArtistLink>
        </StyledSpan>
      )}
    </>
  )
}

export const Flex = styled.div`
  display: ${(props) => (props.isFlex ? 'flex' : 'block')};
  color: ${props => props.theme.text};
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 8px;
`;

const HiddenAudio = styled.audio`
  display: none;
`;
const PlayButton = styled.button`
  background-color: black;
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  cursor: pointer;
  font-family: Verdana;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5e6bb1;
  }
`;
const ProgressBar = styled.input`
  width: 100%;
  margin-top: 8px;
  appearance: none;
  height: 5px;
  background: #555;
  border-radius: 5px;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 10px;
    height: 10px;
    background: #1db954;
    border-radius: 50%;
    cursor: pointer;
  }
`;






const HideIndexItem = styled.div`
  padding: 0 16px;
  display: grid;
  /* grid-template-columns: 25px 40px 28fr 3fr minmax(531px,1fr); */


  /* grid-template-columns: [index] 16px [first] 0fr [var1] 4fr [var2] 3fr [var3] 0fr [last] minmax(120px,1fr); */
  grid-template-columns: [index] 16px [first] 6fr [var1] 4fr [var2] 3fr [last] minmax(120px,1fr);
  grid-gap: 16px;

  &:hover {
     background-color: ${props => props.theme.sideBarHoverColor};

  }

  /* playButton */

  &:hover .trackNumber span {
    display: none;
  }
  &:hover .trackNumber div {
    display: inline-block;
  }

  .trackNumber div {
    position: absolute;
    background: transparent;
    border: 0;
    padding: 0;
    color: #fff;
    display: none;
  }
  .trackNumber  {
    display: flex;
    align-items: center;
    /* justify-self: end; */
  }

  border-radius: 4px;
`;
const TrackNumber = styled.div`
  color: ${props => props.theme.text};
`;
const ReStyledAvatar = styled(StyledAvatar)`
  margin-right: 16px;
`;
const StyledLink = styled(Link)`
  color: ${props => props.theme.text};
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
  font-family: Verdana;
`;
const StyledArtistLink = styled(Link)`
  color: grey;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
  font-family: Verdana;
`;
const StyledSpan = styled.span`
  color: white;
  cursor: pointer;
`;
const StyledDiv = styled.div`
  display: table;
`;
const StyledFormattedTime = styled(FormattedTime)`
  span {
    color: white;
    font-family: Verdana;
  }
`;

const Explicit = styled.span`
  margin-right: 5px;
  color: black;
  padding: 3px 5px;
  font-size: 9px;
  font-family: Verdana;
  background-color: hsla(0,0%,100%,.6);
  border-radius: 3px;
`;
const StyledAudio = styled.audio`
  width: 100%;
  margin-top: 8px;
  outline: none;

  &::-webkit-media-controls-panel {
    background-color: #222; /* Change background */
    color: white;
  }

  /* You can customize more if needed */
`;
export default TrackList;
