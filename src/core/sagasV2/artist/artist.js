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

function* fetchArtistSaga(action) {
  const { artistId } = action.payload;
  const artist = yield select(selectors.selectArtist, artistId);
  yield call(fetcherAPISaga, {
    action,
    endpoint: `/artist/${artistId}/`,
    schema: schemas.artistSchema,
    cachedData: artist
  });
}
function* fetchArtistAlbumsSaga(action) {
  const { artistId } = action.payload;
  const artistAlbums = yield select(selectors.selectArtistAlbums, artistId);
  yield call(fetcherAPISaga, {
    action,
    endpoint: `/artist/${artistId}/albums/old`,
    processData: response => ({ ...response, artistId}),
    // schema: schemas.artistAlbumSchema,
    schema: {results: [schemas.artistAlbumSchema]},
    // schema: {results: schemas.artistAlbumSchema},
    cachedData: artistAlbums
  });
}
function* fetchArtistImagesSaga(action) {
  const { artistId } = action.payload;
  const artistImages = yield select(selectors.selectArtistImages, artistId);
  yield call(fetcherSaga, {
    action,
    endpoint: `/artist/${artistId}/images/`,
    schema: schemas.personImageSchema,
    cachedData: artistImages
  });
}

/******************************* WATCHERS *************************************/
export function* watchFetchArtist() {
  yield takeEvery(actions.fetchArtist, fetchArtistSaga);
}
export function* watchFetchArtistAlbums() {
  yield takeEvery(actions.fetchArtistAlbums, fetchArtistAlbumsSaga);
}
export function* watchFetchArtistImages() {
  yield takeEvery(actions.fetchArtistImages, fetchArtistImagesSaga);
}
