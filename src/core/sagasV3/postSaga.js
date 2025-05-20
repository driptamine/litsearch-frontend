// sagas/postSaga.js
import { call, put, takeLatest } from 'redux-saga/effects';
import api from 'core/api/axios';

function* fetchPosts() {
  try {
    const response = yield call(api.fetchPosts);
    yield put({ type: 'FETCH_POSTS_SUCCESS', payload: response.data });
  } catch (error) {
    yield put({ type: 'FETCH_POSTS_FAILURE', payload: error.message });
  }
}

export function* postSaga() {
  yield takeLatest('FETCH_POSTS_REQUEST', fetchPosts);
}
