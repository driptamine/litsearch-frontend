// https://github.com/r-park/soundcloud-redux/blob/be6b55a346de6d877120dec53009ef44cd57904b/src/core/player/index.js

export { playerActions } from './actions';
export { audio } from './audio-service';
export { playerReducer } from './player-reducer';
// export { playerReducer } from './playerReducer';
export { playerTimesReducer, PlayerTimesState } from './player-times-reducer';
export { playerSagas } from './sagas';

export {
  getPlayer,
  getPlayerIsPlaying,
  getPlayerTimes,
  getPlayerTrack,
  getPlayerTrackId,
  // getPlayerTracklistCursor
} from './selectors';
