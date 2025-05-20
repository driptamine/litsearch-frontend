// sagas/playlistSaga.js
import { call, put, takeLatest } from 'redux-saga/effects';
import api from 'core/api/axios';

function* fetchPlaylists() {
  try {
    const response = yield call(api.fetchPlaylists);
    yield put({ type: 'FETCH_PLAYLISTS_SUCCESS', payload: response.data });
  } catch (error) {
    yield put({ type: 'FETCH_PLAYLISTS_FAILURE', payload: error.message });
  }
}

export function* playlistSaga() {
  yield takeLatest('FETCH_PLAYLISTS_REQUEST', fetchPlaylists);
}
