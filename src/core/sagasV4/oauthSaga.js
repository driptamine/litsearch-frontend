// sagas/oauthSaga.js
import { call, put, takeLatest } from 'redux-saga/effects';
import api from 'core/api/axios';

function* login({ payload }) {
  try {
    const response = yield call(api.login, payload); // payload contains credentials
    yield put({ type: 'LOGIN_SUCCESS', payload: response.data.token });
  } catch (error) {
    yield put({ type: 'LOGIN_FAILURE', payload: error.message });
  }
}

export function* oauthSaga() {
  yield takeLatest('LOGIN_REQUEST', login);
}
