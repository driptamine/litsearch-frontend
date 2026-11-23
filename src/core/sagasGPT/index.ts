import { all, fork } from 'redux-saga/effects';
import { watchAuthSagas } from './authSaga';
import { watchAlbumSagas } from './albumSaga';
import { watchArtistSagas } from './artistSaga';
import { watchMovieSagas } from './movieSaga';
import { watchPersonSagas } from './personSaga';
import { watchFeedSagas } from './feedSaga';
import { watchPostSagas } from './postSaga';
import { watchPlaylistSagas } from './playlistSaga';
import { watchSearchSagas } from './searchSaga';
import { watchTrackSagas } from './trackSaga';
import { watchUserSagas } from './userSaga';
import { watchPlaySelectedTrack } from './spotify/player';

export default function* rootSaga() {
  yield all([
    fork(watchAuthSagas),
    fork(watchAlbumSagas),
    fork(watchArtistSagas),
    fork(watchMovieSagas),
    fork(watchPersonSagas),
    fork(watchFeedSagas),
    fork(watchPostSagas),
    fork(watchPlaylistSagas),
    fork(watchSearchSagas),
    fork(watchTrackSagas),
    fork(watchUserSagas),
    fork(watchPlaySelectedTrack),
  ]);
}
