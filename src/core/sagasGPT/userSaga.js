import { call, put, takeEvery } from 'redux-saga/effects';
import * as actions from 'core/actions';
import * as api from 'core/api/user';
import { getFetchTypes } from 'core/utils';
import * as schemas from 'core/schemas';
import { callAPIWithHeader } from './apiSaga';

function* fetchUserSaga(action) {
  yield call(callAPIWithHeader, `/users/${action.payload.userId}/`, null, schemas.userSchema);
}

function* uploadAvatarSaga(action) {
  const { type, payload } = action;
  const { requestType, successType, errorType } = getFetchTypes(type);

  try {
    yield put({ type: requestType });
    const { response, error } = yield call(api.uploadAvatar, payload);

    if (response) {
      yield put({
        type: successType,
        payload: { response }
      });
      // Update the user profile in the state with the new avatar info
      yield put(actions.setUserProfile(response));
    } else {
      yield put({ type: errorType, payload: { error } });
    }
  } catch (error) {
    yield put({ type: errorType, payload: { error: error.message } });
  }
}

export function* watchUserSagas() {
  // yield takeEvery(actions.fetchUser, fetchUserSaga);
  yield takeEvery(actions.uploadAvatarAction.type, uploadAvatarSaga);
}
