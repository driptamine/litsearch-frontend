import React, { useEffect } from 'react';
import { useDispatch, useSelector, connect } from 'react-redux';

import { createSelector } from 'reselect';

import { fetchPlaylistTracks } from 'core/actions';
import { selectors } from 'core/reducers/index';
import BaseList from 'views/components/BaseList';
import TrackCard from 'views/components/TrackCard';
import InfiniteList from 'views/components/InfiniteList';
import InfiniteGridList from 'views/components/InfiniteGridList';
import LoadingIndicator from 'views/components/LoadingIndicator';

import PlaylistTrackListItem from './PlaylistTrackListItem';
import PlaylistTrackListItemVK from './PlaylistTrackListItemVK';
import PlaylistTrackListItemMinified from './PlaylistTrackListItemMinified';

// import { audio, getPlayerIsPlaying, getPlayerTrackId, playerActions } from 'core/player';
// import { getCurrentTracklist, getTracksForCurrentTracklist, tracklistActions } from 'core/tracklists';

// import MovieVideoPlayerModal from './MovieVideoPlayerModal';

// function renderItem(playlistTrackId) {
//   return (
//
//       <PlaylistTrackListItem
//         playlistTrackId={playlistTrackId}
//         // {...props}
//       />
//
//   );
// }

function PlaylistTrackList({
  playlistId, stopSong, pauseSong, resumeSong, audioControl,

  selectedTrackId,
  isPlaying,
  selectTrack,
  play,
  pause,
  tracklistId,
 }) {
  const dispatch = useDispatch();
  const playlistTracksIds = useSelector(state => selectors.selectPlaylistTrackIds(state, playlistId)) || [];
  const isFetching = useSelector(state => selectors.selectIsFetchingPlaylistTracks(state, playlistId));
  const nextPage = useSelector(state => selectors.selectPlaylistTracksNextPage(state, playlistId));
  const nextOffset = useSelector(state => selectors.selectPlaylistTracksNextPage(state, playlistId));

  // const trackk = useSelector(state => selectors.selectPlaylistTrack(state, playlistTrackId));

  function handleLoadMore() {
    dispatch(fetchPlaylistTracks(playlistId, nextPage, nextOffset));
  }

  function renderItem(playlistTrackId, index) {
    // const trackk = useSelector(state => selectors.selectPlaylistTrack(state, playlistTrackId));
    // const trackk = selectors.selectPlaylistTrack
    // const trackk = state.playlistTracks[playlistId]
    // let isSelected = playlistTrackId.track.id === selectedTrackId;
    return (

        // <PlaylistTrackListItem
        // <PlaylistTrackListItemVK
        <PlaylistTrackListItemMinified
          playlistTrackId={playlistTrackId}
          resumeSong={resumeSong}
          pauseSong={pauseSong}
          audioControl={audioControl}
          index={index}
          key={playlistTrackId}
          // isCompact={compactLayout || !isMediaLarge}
          // isPlaying={isSelected && isPlaying}
          // isSelected={isSelected}
          // pause={pause}
          // play={isSelected ? play : selectTrack.bind(null, playlistTrackId.track.id, tracklistId)}
          // trackk={trackk}
          // {...props}
        />

    );
  }

  return (
    <InfiniteList
      items={playlistTracksIds}
      loading={isFetching}
      hasNextPage={!!nextPage}
      onLoadMore={handleLoadMore}
      renderItem={renderItem}
    />
  );
}

// export default PlaylistTrackList;


// const mapStateToProps = createSelector(
//   // getBrowserMedia,
//   getPlayerIsPlaying,
//   getPlayerTrackId,
//   getCurrentTracklist,
//   getTracksForCurrentTracklist,
//   (
//     // media,
//     isPlaying,
//     playerTrackId,
//     tracklist,
//     tracks
//   ) => ({
//     displayLoadingIndicator: tracklist.isPending || tracklist.hasNextPage,
//     // isMediaLarge: !!media.large,
//     isPlaying,
//     pause: audio.pause,
//     pauseInfiniteScroll: tracklist.isPending || !tracklist.hasNextPage,
//     play: audio.play,
//     selectedTrackId: playerTrackId,
//     tracklistId: tracklist.id,
//     tracks
//   })
// );
//
// const mapDispatchToProps = {
//   loadNextTracks: tracklistActions.loadNextTracks,
//   selectTrack: playerActions.playSelectedTrack
// };

export default connect(
  // mapStateToProps,
  // mapDispatchToProps
)(PlaylistTrackList);
