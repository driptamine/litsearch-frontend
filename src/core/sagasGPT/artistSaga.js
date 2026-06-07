import { call, takeEvery, select } from 'redux-saga/effects';
import * as actions from 'core/actions';
import * as schemas from 'core/schemas';
import { selectors } from 'core/reducers/index';
import { fetcherAPISaga } from './fetcherAPISaga';
import { fetcherSaga } from './fetcherSaga';

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
  const artistAlbums = yield select(
    selectors.selectArtistAlbums,
    artistId
  );
  yield call(fetcherAPISaga, {
    action,
    endpoint: `/artist/${artistId}/albums/old`,
    processData: response => ({ ...response, artistId}),
    schema: {results: [schemas.artistAlbumSchema]},
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

export function* watchArtistSagas() {
  yield takeEvery(actions.fetchArtist, fetchArtistSaga);
  yield takeEvery(actions.fetchArtistAlbums, fetchArtistAlbumsSaga);
  yield takeEvery(actions.fetchArtistImages, fetchArtistImagesSaga);
}
