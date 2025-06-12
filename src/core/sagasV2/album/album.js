import { put, delay, fork, all, call, select, takeEvery, takeLatest, cancelled} from 'redux-saga/effects';
import { normalize } from 'normalizr';
import axios from 'axios';

import { getFetchTypes, verifyCachedData, createUrl, createAPIUrl, createAuthUrl, bingAPIurl } from 'core/utils';

import { setAccessToken } from 'core/actions';
import * as schemas from 'core/schemas';
import * as actions from 'core/actions';

import { watchPlaySelectedTrack } from 'core/sagas/spotify/player';
import { selectors } from 'core/reducers/index';
import { getHeaders, getState } from 'core/store';
import { postAxiosReq, getAxiosReq } from 'core/api/rest-helper';
import history  from 'core/services/history';
import {
  callAPI,
  callTrackAPI,
  callAPIwithHeader,
  getAccessToken,
  likeAlbumHeader,
  likeAlbumSaga,
  requestWithHeader,
  fetcherSaga,
  fetcherAPISaga,
  fetcherAPIwithHeaderSaga,
  fetcherAuthSaga,
  likeHeaderSaga,
  requestWithHeaderSaga,
} from 'core/sagasV2/util';

function* fetchlikeAlbumSagaOld(action) {
  const { id, type } = action.payload;
  // yield call(fetcherAuthSaga, {
  const album = yield select(selectors.selectAlbum, id);
  yield call(likeHeaderSaga, {
    action: action,
    endpoint: `/album/${id}/fike/`,
    data: {
      id: id,
      type: type
    },
    // schema: { results: [schemas.authSchema] }
    // schema: { results: [schemas.albumzSchema] }
    // schema: schemas.albumSchema
    schema: schemas.albumzSchema,
    // cachedData: album
  });
}

function* fetchlikeAlbumSaga(action) {
  const { id, type } = action.payload;
  // yield call(fetcherAuthSaga, {
  const album = yield select(selectors.selectAlbum, id);
  yield call(likeHeaderSaga, {
    action: action,
    endpoint: `/album/${id}/fike/`,
    data: {
      id: id,
      type: type
    },
    // schema: { results: [schemas.authSchema] }
    // schema: { results: [schemas.albumzSchema] }
    schema: schemas.albumSchema,
    // schema: schemas.albumzSchema,
    // cachedData: album
  });
}

function* fetchAlbumSaga(action) {
  const { albumId } = action.payload;
  const album = yield select(selectors.selectAlbum, albumId);
  yield call(fetcherAPIwithHeaderSaga, {
    action,
    endpoint: `/album/${albumId}/upd`,
    schema: schemas.albumSchema,
    cachedData: album
  });
}

/******************************* WATCHERS *************************************/
export function* watchFetchAlbum() {
  yield takeEvery(actions.fetchAlbum, fetchAlbumSaga);
}

export function* watchFetchLikeAlbum() {
  yield takeEvery(actions.fetchLikeAlbum, fetchlikeAlbumSaga);
}

export function* watchFetchUnLikeAlbum() {
  yield takeEvery(actions.fetchUnLikeAlbum, fetchlikeAlbumSaga);
}

export function* watchFetchPopularAlbums() {
  yield takeEvery(actions.fetchPopularAlbums, fetchNewReleasesSaga);
}
