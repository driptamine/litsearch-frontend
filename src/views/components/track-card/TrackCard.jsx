import React, { useState } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, withRouter } from 'react-router-dom';
import styled from 'styled-components';

// MATERIAL UNDONE
// import { CardActionArea, ListItem, ListItemText, ListItemAvatar, Avatar, makeStyles } from '@mui/material';
import { StyledCardActionArea, StyledListItem, StyledListItemText, StyledListItemAvatar, StyledAvatar } from 'views/styledComponents';
// import MuiListItem from '@mui/material/ListItem';



// VIEWS
import BaseImage from 'views/components/BaseImage';
import BaseCard from 'views/components/BaseCard';
import BaseCardHeader from 'views/components/BaseCardHeader';
import RouterLink from 'views/components/RouterLink';
import ModalLink from 'views/components/ModalLink';
import IconButton from 'views/components/icon-button/IconButton';
import FormattedTime from 'views/components/formatted-time/FormattedTime';
import { getAspectRatioString } from 'views/components/AspectRatio';
import "views/components/track-card/track-card.css"


// CORE
import { selectors } from 'core/reducers/index';

const HideIndexItem = styled.div`
  padding: 0 16px;
  display: grid;
  /* grid-template-columns: 25px 40px 28fr 3fr minmax(531px,1fr); */


  /* grid-template-columns: [index] 16px [first] 0fr [var1] 4fr [var2] 3fr [var3] 0fr [last] minmax(120px,1fr); */
  grid-template-columns: [index] 16px [first] 6fr [var1] 4fr [var2] 3fr [last] minmax(120px,1fr);
  grid-gap: 16px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
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
  color: white;
`;
const ReStyledAvatar = styled(StyledAvatar)`
  margin-right: 16px;
`;
const StyledLink = styled(Link)`
  color: white;
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
function LinkTrack(obj, id) {
  // const classes = useStyles();
  return (
    <span>
      <StyledLink
        // className={classes.linkHoverz}

        // className={
        //   obj.track.id === id
        //         ? `${classes.active}`
        //         : `${classes.linkHoverz}`
        // }
        to={`/track/${obj.track.id}/`}
        underline="hover"
        // style={{
        //   fontWeight: "bold",
        //   color: '#FFF',
        //   textDecoration: 'none',
        //   "&:hover": {
        //     textDecoration: "underline"
        //   }
        // }}
        >

        {obj.track.name}

      </StyledLink>
    </span>
  )
}

function LinkAlbum(obj, id) {
  // const classes = useStyles();
  return (
    <p>
      <StyledLink
        // className={classes.linkHoverz}

        // className={
        //   obj.track.id === id
        //         ? `${classes.active}`
        //         : `${classes.linkHoverz}`
        // }
        to={`/album/${obj.track.album.id}/`}
        underline="hover"
        // style={{
        //   fontWeight: "bold",
        //   color: '#FFF',
        //   textDecoration: 'none',
        //   "&:hover": {
        //     textDecoration: "underline"
        //   }
        // }}
        >

        {obj.track.album.name}

      </StyledLink>
    </p>
  )
}

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

function TrackItem({
  playlistTrackId,
  key,
  songId,
  songPlaying,
  songPaused,
  index,
  resumeSong,
  pauseSong,
  audioControl,


  isCompact, isPlaying, isSelected, pause, play,

  subheader,
  ...rest
}) {
  const { pathname } = useLocation();
  // const classes = useStyles();
  // const playlistTrack = useSelector(state => selectors.selectTrack(state, playlistTrackId));
  // const playlistTrack = useSelector(state => selectors.selectPlaylistTracks(state, playlistTrackId));
  const track = useSelector(state => selectors.selectPlaylistTrack(state, playlistTrackId));

  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleListItemClick = (event, songId) => {
    setSelectedIndex(songId);
  };

  const buttonClass = track.track.id === songId && !songPaused ? "fa-pause" : "fa-play";

  const doubleClickPlayTrack = (event) => {
    if (event.detail === 2) {
      console.log('double click');
      (track.track.id) === (songId && songPlaying && songPaused) ? resumeSong(): (songPlaying && !songPaused && track.track.id) === songId ? pauseSong(): audioControl(track);
    }
  }
  const singleClickPlayTrack = (event) => {
    console.log('single click');
    track.track.id === songId && songPlaying && songPaused ? resumeSong(): songPlaying && !songPaused && track.track.id === songId ? pauseSong(): audioControl(track);
  }

  const secondaryDAMN = track.track.artists.map((artist, i) =>

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

  )

  return (
    <HideIndexItem className="DRIPTA" onClick={doubleClickPlayTrack} key={key} dense {...rest} index={index}>

      {/*<CardActionArea className={classes.root}>*/}


        <TrackNumber className="trackNumber">
          <span
            // className={
            //   track.track.id === id ? `${classes.active}`: `${classes.linkHoverz}`
            // }

            >
            {index+1}
          </span>
          <div
            className="play-song"
            onClick={singleClickPlayTrack}
            // style={mini_style}
          >
            <i className={`fa ${buttonClass} play-btn`} aria-hidden="true"/>
          </div>

        </TrackNumber>



        <StyledListItemAvatar
          // style={album_cover}
        >
          <ReStyledAvatar src={track.track.album.images[2] ? track.track.album.images[2].url : ""}  variant={"rounded"} />
          <StyledListItemText>
            {LinkTrack(track, songId)}
            <StyledDiv>
              <Explicit>E</Explicit>
              {secondaryDAMN}
            </StyledDiv>
          </StyledListItemText>

        </StyledListItemAvatar>

        {/*<StyledListItemText primary={LinkTrack(track, songId)} secondary={secondaryDAMN} />*/}

        {LinkAlbum(track, songId)}
        <div className="Date"></div>

        <StyledFormattedTime value={track.track.duration_ms} unit={'ms'} />
      {/*</CardActionArea>*/}

    </HideIndexItem>

    // <SongItem>
    //
    // </SongItem>
  );
}


const mapStateToProps = (state) => {

  return {

    // songs:                     state.songsReducer.songs ? state.songsReducer.songs : '',

    // fetchSongsError:           state.songsReducer.fetchSongsError,
    // fetchSongsPending:         state.songsReducer.fetchSongsPending,
    // fetchPlaylistSongsPending: state.songsReducer.fetchPlaylistSongsPending,

    // songPlaying:               state.songsReducer.songPlaying,
    // songPaused:                state.songsReducer.songPaused,
    // songId:                    state.songsReducer.songId,

    songPlaying:               state.entities.playlistTracks.songPlaying,
    songPaused:                state.entities.playlistTracks.songPaused,
    songId:                    state.entities.playlistTracks.songId,

    // play: audio.play,

    // songAddedId: state.userReducer.songId || '',
    // viewType:                  state.songsReducer.viewType,
    //
  };

};

const mapPlaylistTrackListItemToProps = (dispatch) => {

  // return bindActionCreators({
  //   fetchSongs,
  //   addSongToLibrary
  // }, dispatch);

};

export default connect(mapStateToProps, {})(TrackItem);
