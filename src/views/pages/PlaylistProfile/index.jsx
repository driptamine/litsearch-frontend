import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import styled from 'styled-components';

import { StyledTypography } from 'views/styledComponents';

import Profile from 'views/components/Profile';
import PlaylistIntroduction from 'views/pages/PlaylistProfile/PlaylistIntroduction';
// import PlaylistImageGridList from './PlaylistImageGridList';
import PlaylistTrackList from 'views/pages/PlaylistProfile/PlaylistTrackList';
// import PlaylistCastGridList from './PlaylistCastGridList';
// import SimilarPlaylists from './SimilarPlaylists';

import { selectors } from 'core/reducers/index';
import { fetchPlaylist, fetchPlaylistTracks } from 'core/actions';
import { verifyCachedData } from 'core/utils';

const REQUIRED_FIELDS = ["tagline"];


function PlaylistProfile({stopSong, pauseSong, resumeSong, audioControl}) {
  // const classes = useStyles();
  const dispatch = useDispatch();
  const { playlistId } = useParams();
  const isFetching = useSelector(state =>
    selectors.selectIsFetchingPlaylist(state, playlistId)
  );
  const playlist = useSelector(state => selectors.selectPlaylist(state, playlistId));
  // const tracks = useSelector(state => selectors.selectPlaylistTracks(state, playlistId));

  useEffect(() => {
    dispatch(fetchPlaylist(playlistId, REQUIRED_FIELDS));
    dispatch(fetchPlaylistTracks(playlistId, 0, 0));
  }, [playlistId, dispatch]);

  const loading = isFetching || !verifyCachedData(playlist, REQUIRED_FIELDS);

  // const trackIds = tracks.items.map(track, index => {

  // })
  return (
    <Profile
      // className={classes.flexType}
      loading={loading}
      introduction={<PlaylistIntroduction playlistId={playlistId} />}
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
            playlistId={playlistId}

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


const SongHeaderContainer = styled.div`
  margin-bottom: 16px;
  border-bottom: 1px solid #666;
  display: grid;
  /* grid-template-columns: 25px 40px 28fr 3fr minmax(120px,1fr); */

  grid-template-columns: [index] 16px [first] 6fr [var1] 4fr [var2] 3fr [last] minmax(120px,1fr);
  justify-content: space-between;

  p, i {
    color: ${props => props.theme.text};
  }
`;

export default PlaylistProfile;
