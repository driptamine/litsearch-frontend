import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import styled from 'styled-components';

// MATERIAL DONE
// import { Typography, makeStyles } from "@mui/material";
import { StyledTypography } from 'views/styledComponents';

import Profile from "views/components/Profile";
// import PlaylistIntroduction from "./PlaylistIntroduction";
// import PlaylistImageGridList from "./PlaylistImageGridList";
import PlaylistTrackList from "./PlaylistTrackList";
// import PlaylistCastGridList from "./PlaylistCastGridList";
// import SimilarPlaylists from "./SimilarPlaylists";

import { selectors } from "core/reducers/index";
import { fetchPlaylist, fetchPlaylistTracks } from "core/actions";
import { verifyCachedData } from "core/utils";

const REQUIRED_FIELDS = ["tagline"];

const SongHeaderContainer = styled.div`
  margin-bottom: 16px;
  border-bottom: 1px solid #666;
  display: grid;
  /* grid-template-columns: 25px 40px 28fr 3fr minmax(120px,1fr); */

  grid-template-columns: [index] 16px [first] 6fr [var1] 4fr [var2] 3fr [last] minmax(120px,1fr);
  justify-content: space-between;

  p, i {
    color: white;
  }
`;

function LinksProfile({stopSong, pauseSong, resumeSong, audioControl}) {
  // const classes = useStyles();
  const dispatch = useDispatch();
  const { linkId } = useParams();
  const isFetching = useSelector(state =>
    selectors.selectIsFetchingPlaylist(state, linkId)
  );
  const link = useSelector(state => selectors.selectPlaylist(state, linkId));
  // const tracks = useSelector(state => selectors.selectPlaylistTracks(state, playlistId));

  useEffect(() => {
    dispatch(fetchPlaylist(linkId, REQUIRED_FIELDS));
    dispatch(fetchPlaylistTracks(linkId, 0, 0));
  }, [linkId, dispatch]);

  const loading = isFetching || !verifyCachedData(link, REQUIRED_FIELDS);

  // const trackIds = tracks.items.map(track, index => {

  // })
  return (
    <Profile
      // className={classes.flexType}
      loading={loading}
      // introduction={<PlaylistIntroduction linkId={linkId} />}
      main={
        <>
          {/*<Typography variant="h6" gutterBottom>
            Tracks
          </Typography>*/}
          <SongHeaderContainer
            // className={classes.songHeaderContainer}

            >
            {/*<div className="song-title-header">*/}
            <div>
              <p>#</p>
            </div>
            <div
              // className={classes.songTitle}
              >
              <p>Title</p>
            </div>
            {/*<div className="song-album-header">*/}
            <div
              // className={classes.songAlbum}
              >
              <p>Album</p>
            </div>
            {/*<div className="song-added-header">*/}
            <div
              // className={classes.songAlbum}
              >
              <p>
                <i className="fa fa-calendar-plus-o" aria-hidden="true" />
              </p>
            </div>
            {/*<div className="song-length-header">*/}
            <div
              // className={classes.songAlbum}
              >
              <p>
                <i className="fa fa-clock-o" aria-hidden="true" />
              </p>
            </div>
          </SongHeaderContainer>
          <PlaylistTrackList
            playlistId={linkId}

            resumeSong={resumeSong}
            pauseSong={pauseSong}
            audioControl={audioControl}
          />

        </>
      }

    >
      {/*<PlaylistTrackList playlistId={playlistId}/>*/}
    </Profile>
  );
}

export default LinksProfile;
