// sagas/movieSaga.js
import { call, put, takeLatest } from 'redux-saga/effects';
import api from 'core/api/axios';

function* fetchMovies(action) {
  try {
    const response = yield call(api.fetchMovies, action.payload);
    yield put({
      type: 'FETCH_MOVIES_SUCCESS',
      payload: response.data
    });
  } catch (error) {
    yield put({ type: 'FETCH_MOVIES_FAILURE', payload: error.message });
  }
}

export function* movieSaga() {
  yield takeLatest('FETCH_MOVIES_REQUEST', fetchMovies);
}
