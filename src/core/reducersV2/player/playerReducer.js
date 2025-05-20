// import { Record } from 'immutable';
import { PLAYER_INITIAL_VOLUME, SESSION_TRACKLIST_ID } from "core/constants/spotify";
import { playerActions } from 'core/actions/player';


// export const PlayerState = new Record({
//   isPlaying: false,
//   trackId: null,
//   tracklistId: SESSION_TRACKLIST_ID,
//   volume: PLAYER_INITIAL_VOLUME
// });

export const initialState = {
  isPlaying: false,
  trackId: null,
  tracklistId: SESSION_TRACKLIST_ID,
  volume: PLAYER_INITIAL_VOLUME
}

// export default (state = initialState, {payload, type}) => {
export function playerReducer(state = initialState, {payload, type}) {
  switch (type) {
    case playerActions.AUDIO_ENDED:
    case playerActions.AUDIO_PAUSED:
      return {
        ...state,
        isPlaying: false
      }

    case playerActions.AUDIO_PLAYING:
      return {
        ...state,
        isPlaying: true
      }

    case playerActions.AUDIO_VOLUME_CHANGED:
      return {
        ...state,
        volume: payload.volume
      }

    case playerActions.PLAY_SELECTED_TRACK:
      return {
        ...state,
        trackId: payload.trackId,
        tracklistId: payload.tracklistId || state.tracklistId
      };

    default:
      return state;
  }
}

export const selectors = {
  // selectMovie,
  // token: createIsFetching(actions.fetchAuthUser),
  // selectMovies: (state, movieIds) =>
  //   movieIds.map(movieId => selectMovie(state, movieId)),

};
