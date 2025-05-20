// sagas/albumSaga.js
import { call, put, takeLatest } from 'redux-saga/effects';
import api from 'core/api/axios';

function* fetchAlbums() {
  try {
    const response = yield call(api.fetchAlbums);
    yield put({ type: 'FETCH_ALBUMS_SUCCESS', payload: response.data });
  } catch (error) {
    yield put({ type: 'FETCH_ALBUMS_FAILURE', payload: error.message });
  }
}

export function* albumSaga() {
  yield takeLatest('FETCH_ALBUMS_REQUEST', fetchAlbums);
}
