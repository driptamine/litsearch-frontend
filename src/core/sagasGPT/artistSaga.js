import { call, takeEvery } from 'redux-saga/effects';
import * as actions from 'core/actions';
import { callAPIWithHeader } from './apiSaga';
import * as schemas from 'core/schemas';

function* fetchArtistSaga(action) {
  yield call(callAPIWithHeader, `/artist/${action.payload.artistId}/`, null, schemas.artistSchema);
}

function* fetchArtistAlbumsSaga(action) {
  yield call(callAPIWithHeader, `/artist/${action.payload.artistId}/albums/`, null, { results: [schemas.artistAlbumSchema] });
}

export function* watchArtistSagas() {
  yield takeEvery(actions.fetchArtist, fetchArtistSaga);
  yield takeEvery(actions.fetchArtistAlbums, fetchArtistAlbumsSaga);
}
