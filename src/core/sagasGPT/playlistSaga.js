import { call, takeEvery, select } from 'redux-saga/effects';
import * as actions from 'core/actions';

import * as schemas from 'core/schemas';
import { selectors } from 'core/reducers/index';

import { callAPIWithHeader } from './apiSaga';
import { fetcherAPIwithHeaderSaga } from './fetcherAPIwithHeaderSaga';
import { fetcherAPISaga } from './fetcherAPISaga';

// function* fetchPlaylistSaga(action) {
//   yield call(callAPIWithHeader, `/playlist/${action.payload.playlistId}/`, null, schemas.playlistSchema);
// }
function* fetchPlaylistSaga(action) {
  const { playlistId, page, offset } = action.payload;
  const playlist = yield select(selectors.selectPlaylist, playlistId);
  yield call(fetcherAPIwithHeaderSaga, {
    action,
    // endpoint: `/playlist/${playlistId}/upd`,
    endpoint: `/playlist/${playlistId}/`,
    schema: schemas.playlistSchema,
    // params: {offset: offset},
    cachedData: playlist
  });
}
function* fetchPlaylistOffsetSaga(action) {
  const { playlistId, page, offset } = action.payload;
  const playlist = yield select(selectors.selectPlaylistTracks, playlistId);
  // yield call(fetcherAPIwithHeaderSaga, {
  yield call(fetcherAPISaga, {
    action,
    // endpoint: `/playlist/${playlistId}/upd`,
    endpoint: `/playlist/${playlistId}/tracks`,
    // processData: response => ({ ...response, playlistId }),
    // schema: schemas.playlistSchema,

    // schema: schemas.playlistTracksSchema,

    // schema: schemas.playlistTrackzSchema,
    // schema: { results: schemas.playlistTracksSchema},
    // schema: { results: schemas.playlistTrackzSchema},
    // schema: { results: [schemas.playlistTrackzSchema]},

    schema: { results: [schemas.playlistTracksSchema]},
    params: { offset: offset},
    // cachedData: playlist
  });
}

export function* watchPlaylistSagas() {
  yield takeEvery(actions.fetchPlaylist, fetchPlaylistSaga);
  yield takeEvery(actions.fetchPlaylistTracks, fetchPlaylistOffsetSaga);
}
