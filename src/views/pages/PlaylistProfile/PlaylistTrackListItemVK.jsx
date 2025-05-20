import React, { useState } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { Link, useLocation, withRouter } from "react-router-dom";
import styled from "styled-components";

// MATERIAL UNDONE
// import { CardActionArea, ListItem, ListItemText, ListItemAvatar, Avatar, makeStyles } from "@mui/material";
import { StyledCardActionArea, StyledListItem, StyledListItemText, StyledListItemAvatar, StyledAvatar } from 'views/styledComponents';
// import MuiListItem from "@mui/material/ListItem";



// VIEWS
import BaseImage from "views/components/BaseImage";
import BaseCard from "views/components/BaseCard";
import BaseCardHeader from "views/components/BaseCardHeader";
import RouterLink from "views/components/RouterLink";
import ModalLink from "views/components/ModalLink";
import IconButton from "views/components/icon-button/IconButton";

import { PlayIcon } from "views/components/Sidebar/Icons";
import FormattedTime from "views/components/formatted-time/FormattedTime";
import { getAspectRatioString } from "views/components/AspectRatio";
import "views/components/track-card/track-card.css"


// CORE
import { selectors } from "core/reducers/index";

const HideIndexItem = styled.div`
  padding: 10px 16px;
  height: 22px;
  display: grid;

  /* grid-template-columns: 25px 40px 28fr 3fr minmax(531px,1fr); */
  /* grid-template-columns: [index] 16px [first] 0fr [var1] 1fr [var2] 28px [var3] 1fr [var4] 1fr [var5] 0fr [last] minmax(120px,1fr); */
  /* grid-template-columns: [index] 16px [first] 0fr [var1] 1fr [var2] 2fr [var3] 28px [var4] 1fr [var5] 0fr [last] minmax(120px,1fr); */
  grid-template-columns: [index] 16px [first] 1fr [var1] 1fr [var2] 0fr [var3] 0fr [var4] 0fr [var5] 0fr [last] minmax(120px,1fr);
  grid-gap: 16px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    cursor: pointer;
  }

  /* playButton */

  &:hover .trackNumber span {
    display: none;
  }
  &:hover .trackNumber div {
    display: inline-block;
  }

  .trackNumber div { /* PlayIcon */
    position: absolute;
    background: transparent;
    border: 0;
    padding: 0;
    color: #404b8c;
    /* display: none; */
    cursor: pointer;
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
  width: 16px;
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
  align-items: center;
  color: #404b8c;
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

const StyledArtists = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
`;
const StyledAlbum = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
`;
const StyledDuration = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
`;

const StyledTrackItem = styled.div`

  display: flex;

  align-items: center;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
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
    <StyledAlbum>
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
    </StyledAlbum>
  )
}

function ExplicitSignature(obj){
  if (obj.track.explicit) {
    return (
      <Explicit>E</Explicit>
    )
  }
}

function PlaylistTrackListItemVK({
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

  const artists = track.track.artists.map((artist, i) =>

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




        <TrackNumber className="trackNumber">
          {/*<span>
            {index+1}
          </span>*/}
          <div
            className="play-song"
            onClick={singleClickPlayTrack}
            // style={mini_style}
          >
            {/*<i className={`fa ${buttonClass} play-btn`} />*/}
            <PlayIcon />
          </div>

        </TrackNumber>




        {/*<ReStyledAvatar src={track.track.album.images[2] ? track.track.album.images[2].url : ""}  variant={"rounded"} />*/}
        <StyledTrackItem>{artists}</StyledTrackItem>
        <StyledTrackItem>
          {LinkTrack(track, songId)}
          <StyledDiv>


          </StyledDiv>
        </StyledTrackItem>

        <StyledTrackItem>


          {ExplicitSignature(track)}
        </StyledTrackItem>


        {/*<StyledListItemText primary={LinkTrack(track, songId)} secondary={secondaryDAMN} />*/}

        {/*<StyledTrackItem>{LinkAlbum(track, songId)}</StyledTrackItem>*/}
        <div className="Date"></div>

        <StyledFormattedTime value={track.track.duration_ms} unit={'ms'} />
        {/*<StyledDuration value={track.track.duration_ms} unit={'ms'} />*/}


    </HideIndexItem>
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

export default connect(mapStateToProps, {})(PlaylistTrackListItemVK);
