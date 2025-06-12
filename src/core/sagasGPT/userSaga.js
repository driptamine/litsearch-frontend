import { call, takeEvery } from 'redux-saga/effects';
import * as actions from 'core/actions';
import { callAPIWithHeader } from './apiSaga';
import * as schemas from 'core/schemas';

function* fetchUserSaga(action) {
  yield call(callAPIWithHeader, `/users/${action.payload.userId}/`, null, schemas.userSchema);
}

export function* watchUserSagas() {
  // yield takeEvery(actions.fetchUser, fetchUserSaga);
}
