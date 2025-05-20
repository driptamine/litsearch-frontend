import { put, delay, fork, all, call, select, takeEvery, takeLatest, cancelled} from "redux-saga/effects";
import { normalize } from "normalizr";
import axios from "axios";

import { getFetchTypes, verifyCachedData, createUrl, createAPIUrl, createAuthUrl, bingAPIurl } from "core/utils";
import { setAccessToken } from "core/actions";
import * as schemas from "core/schemas";
import * as actions from "core/actions";

import { watchPlaySelectedTrack } from 'core/sagas/spotify/player';
import { selectors } from "core/reducers/index";
import { getHeaders, getState } from 'core/store';
import { postAxiosReq, getAxiosReq } from "core/api/rest-helper";
import history  from "core/services/history";
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
} from "core/sagasV2/util";

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
function* fetchPlaylistSagaOld(action) {
  const { playlistId, page } = action.payload;
  const playlist = yield select(selectors.selectPlaylist, playlistId);
  yield call(fetcherAPIwithHeaderSaga, {
    action,
    endpoint: `/playlist/${playlistId}/`,
    schema: schemas.playlistSchema,
    page: page,
    cachedData: playlist
  });

  // const { albumId } = action.payload;
  // const album = yield select(selectors.selectAlbum, albumId);
  // yield call(fetcherAPIwithHeaderSaga, {
  //   action,
  //   endpoint: `/album/${albumId}/upd`,
  //   schema: schemas.albumSchema,
  //   cachedData: album
  // });
}


/******************************* WATCHERS *************************************/
export function* watchFetchPlaylist() {
  yield takeEvery(actions.fetchPlaylist, fetchPlaylistSaga);
}
export function* watchFetchOffsetPlaylist() {
  yield takeEvery(actions.fetchPlaylistTracks, fetchPlaylistOffsetSaga);
}
