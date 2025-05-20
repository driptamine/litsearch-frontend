// sagas/rootSaga.js
import { all } from 'redux-saga/effects';

import { oauthSaga } from 'core/sagasV3/oauthSaga';
import { userSaga } from 'core/sagasV3/userSaga';
import { postSaga } from 'core/sagasV3/postSaga';

import { movieSaga } from 'core/sagasV3/movieSaga';
import { trackSaga } from 'core/sagasV3/trackSaga';
import { playlistSaga } from 'core/sagasV3/playlistSaga';
import { albumSaga } from 'core/sagasV3/albumSaga';

// Add others similarly

export default function* rootSaga() {
  yield all([
    oauthSaga(),
    userSaga(),
    postSaga(),

    movieSaga(),
    trackSaga(),
    playlistSaga(),
    albumSaga(),
    // Add other sagas
  ]);
}
