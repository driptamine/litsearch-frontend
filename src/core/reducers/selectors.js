import { createSelector } from 'reselect';
import { TRACKS_PER_PAGE } from "core/constants/spotify";

export function getTracklists(state) {
  return state.tracklists;
}

export function getTracklistById(state, tracklistId) {
  return getTracklists(state).get(tracklistId);
}

export function getCurrentTracklist(state) {
  let tracklists = getTracklists(state);
  return tracklists.get(tracklists.get('currentTracklistId'));
}

export function getTracklistCursor(selectedTrackId, trackIds) {
  let index = trackIds.indexOf(selectedTrackId);
  let nextTrackId = null;
  let previousTrackId = null;

  if (index !== -1) {
    if (index < trackIds.size - 1) nextTrackId = trackIds.get(index + 1);
    if (index > 0) previousTrackId = trackIds.get(index - 1);
  }

  return {
    nextTrackId,
    previousTrackId,
    selectedTrackId
  };
}


//=====================================
//  MEMOIZED SELECTORS
//-------------------------------------

export const getCurrentPage = createSelector(
  getCurrentTracklist,
  tracklist => tracklist.currentPage
);

export const getCurrentTrackIds = createSelector(
  getCurrentTracklist,
  tracklist => tracklist.trackIds
);

export const getTracksForCurrentTracklist = createSelector(
  getCurrentPage,
  getCurrentTrackIds,
  getTracks,
  (currentPage, trackIds, tracks) => {
    return trackIds
      .slice(0, currentPage * TRACKS_PER_PAGE)
      .map(id => tracks.get(id));
  }
);


export function getTracks(state) {
  return state.tracks;
}

export function getTrackById(state, trackId) {
  return getTracks(state).get(trackId);
}

export function getPlayer(state) {
  return state.playerReducer;
}

export function getPlayerIsPlaying(state) {
  return state.playerReducer.isPlaying;
}

export function getPlayerTimes(state) {
  return state.playerTimes;
}

export function getPlayerTrackId(state) {
  return state.playerReducer.trackId;
}

export function getPlayerTracklistId(state) {
  return state.playerReducer.tracklistId;
}

export function getPlayerTrack(state) {
  const trackId = getPlayerTrackId(state);
  return getTrackById(state, trackId);
}

export function getPlayerTracklist(state) {
  const tracklistId = getPlayerTracklistId(state);
  return getTracklistById(state, tracklistId);
}

export function getPlayerTracklistCursor(state) {
  const trackId = getPlayerTrackId(state);
  const tracklist = getPlayerTracklist(state);
  return getTracklistCursor(trackId, tracklist.trackIds);
}
