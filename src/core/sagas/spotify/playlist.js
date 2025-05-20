import { put, delay, fork, all, call, select, takeEvery, takeLatest, cancelled } from "redux-saga/effects";
import { getFetchTypes, verifyCachedData, createUrl, createAPIUrl, createAuthUrl } from "core/utils";
import { setAccessToken } from "core/actions";
import * as schemas from "core/schemas";
import * as actions from "core/actions";
import * as service from "core/services/UserService";
import { normalize } from "normalizr";
import { selectors } from "core/reducers/index";
import history  from "core/services/history";

import { fetcherAuthSaga, fetcherAPIwithHeaderSaga } from "core/sagas/index";
import { fetcherPostAuthSaga, fetcherGetSaga, fetcherAPISaga } from "core/sagas/utils";

export function* fetchlikePlaylistSaga(action) {
  const { id, type } = action.payload;
  yield call(fetcherPostAuthSaga, {
    action: action,
    endpoint: `/playlist/${id}/fike/`,
    data: {
      id: id,
      type: type
    },
    schema: { results: [schemas.authSchema] }
  });
}

export function* fetchPlaylistSaga(action) {
  const { playlistId } = action.payload;
  const playlist = yield select(selectors.selectPlaylist, playlistId);
  yield call(fetcherGetSaga, {
    action,
    endpoint: `/playlist/${playlistId}/`,
    schema: schemas.playlistSchema,
    cachedData: playlist
  });
}

// export function* fetchPlaylistSaga(action) {
//   const { playlistId } = action.payload;
//   const playlist = yield select(selectors.selectPlaylist, playlistId);
//   yield call(fetcherAPISaga, {
//     action,
//     endpoint: `/playlist/${playlistId}/`,
//     schema: schemas.playlistSchema,
//     cachedData: playlist
//   });
// }

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

export function* watchFetchPlaylist() {
  yield takeEvery(actions.fetchPlaylist, fetchPlaylistSaga);
}

export function* watchFetchLikePlaylist() {
  yield takeEvery(actions.fetchLikePlaylist, fetchlikePlaylistSaga);
}

export function* watchFetchOffsetPlaylist() {
  yield takeEvery(actions.fetchPlaylistTracks, fetchPlaylistOffsetSaga);
}

const playlistSagas = [
  fork(watchFetchPlaylist),
  fork(watchFetchLikePlaylist),
  fork(watchFetchOffsetPlaylist),
  // fork(),
  // fork()
];

export default playlistSagas;
