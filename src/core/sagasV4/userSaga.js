// sagas/userSaga.js
import { call, put, takeLatest } from 'redux-saga/effects';
import api from 'core/api/axios'; // Assume a common API handler

function* fetchUser() {
  try {
    const response = yield call(api.fetchUser);
    yield put({ type: 'FETCH_USER_SUCCESS', payload: response.data });
  } catch (error) {
    yield put({ type: 'FETCH_USER_FAILURE', payload: error.message });
  }
}

export function* userSaga() {
  yield takeLatest('FETCH_USER_REQUEST', fetchUser);
}
