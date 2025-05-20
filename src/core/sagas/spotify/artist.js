import { put, delay, fork, all, call, select, takeEvery, takeLatest, cancelled } from "redux-saga/effects";
import { getFetchTypes, verifyCachedData, createUrl, createAPIUrl, createAuthUrl } from "core/utils";
import { setAccessToken } from "core/actions";
import * as schemas from "core/schemas";
import * as actions from "core/actions";
// import * as service from "core/services/UserService";
import { normalize } from "normalizr";
import { selectors } from "core/reducers/index";
import axios from "axios";
import history  from "core/services/history"
import { fetcherAPISaga , fetcherSaga} from "core/sagas/index"

/******************************************************************************/
/******************************* SAGAS *************************************/
/******************************************************************************/

export function* fetchArtistSaga(action) {
  const { artistId } = action.payload;
  const artist = yield select(selectors.selectArtist, artistId);
  yield call(fetcherAPISaga, {
    action,
    endpoint: `/artist/${artistId}/`,
    schema: schemas.artistSchema,
    cachedData: artist
  });
}

export function* fetchArtistAlbumsSaga(action) {
  const { artistId } = action.payload;
  const artistAlbums = yield select(
    selectors.selectArtistAlbums,
    artistId
  );
  yield call(fetcherAPISaga, {
    action,
    endpoint: `/artist/${artistId}/albums/`,
    processData: response => ({ ...response, artistId}),
    schema: schemas.artistAlbumSchema,
    cachedData: artistAlbums
  });
}

export function* fetchArtistImagesSaga(action) {
  const { artistId } = action.payload;
  const artistImages = yield select(selectors.selectArtistImages, artistId);
  yield call(fetcherSaga, {
    action,
    endpoint: `/artist/${artistId}/images/`,
    schema: schemas.personImageSchema,
    cachedData: artistImages
  });
}

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

export function* watchFetchArtist() {
  yield takeEvery(actions.fetchArtist, fetchArtistSaga);
}

export function* watchFetchArtistAlbums() {
  yield takeEvery(actions.fetchArtistAlbums, fetchArtistAlbumsSaga);
}

export function* watchFetchArtistImages() {
  yield takeEvery(actions.fetchArtistImages, fetchArtistImagesSaga);
}

const artistSagas = [
  fork(watchFetchArtist),
  fork(watchFetchArtistAlbums),
  fork(watchFetchArtistImages),
];

export default artistSagas;
