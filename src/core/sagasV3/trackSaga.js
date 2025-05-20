// sagas/trackSaga.js
import { call, put, takeLatest } from 'redux-saga/effects';
import api from 'core/api/axios';

function* fetchTracks() {
  try {
    const response = yield call(api.fetchTracks);
    yield put({ type: 'FETCH_TRACKS_SUCCESS', payload: response.data });
  } catch (error) {
    yield put({ type: 'FETCH_TRACKS_FAILURE', payload: error.message });
  }
}

export function* trackSaga() {
  yield takeLatest('FETCH_TRACKS_REQUEST', fetchTracks);
}
