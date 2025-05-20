import { put, delay, fork, all, call, select, take, takeEvery, takeLatest, cancelled } from "redux-saga/effects";
import { getFetchTypes, verifyCachedData, createUrl, createAPIUrl, createAuthUrl } from "core/utils";
import { setAccessToken } from "core/actions";
import * as schemas from "core/schemas";
import * as actions from "core/actions";
import * as service from "core/services/UserService";
import { normalize } from "normalizr";
import { selectors } from "core/reducers/index";
import history  from "core/services/history"
import { GET_ACCESS_TOKEN, LOGOUT, GE_USER_PROFILE, SET_ACCESS_TOKEN } from 'core/constants/action-types';
import { fetcherAuthSaga, fetcherAPIwithHeaderSaga } from "core/sagas/index"
import { fetcherPostAuthSaga, fetcherGetSaga } from "core/sagas/utils"



export function* fetchAuthUserSaga(action) {
  const { email, password } = action.payload;
  yield call(fetcherPostAuthSaga, {
    action: action,
    endpoint: "/users/signin/",
    params: {
      email: email,
      password: password
    },
    schema: { results: [schemas.authSchema] }
  });
}

export function* fetchOAuthUserSaga(action) {
  const { email, password } = action.payload;
  yield call(fetcherPostAuthSaga, {
    action: action,
    endpoint: "/users/signin/",
    params: {
      email: email,
      password: password
    },
    schema: { results: [schemas.authSchema] }
  });
}

export function* setAccessTokenSaga() {
  while (true) {
    const { access_token } = yield take(SET_ACCESS_TOKEN);
    // check code define or not
    if (!access_token) {
      yield put(history.push('/login'));
      return;
    }

    yield all([
      put(setAccessToken(access_token)),
      // put(getProfile()),
      put(history.push('/')),
    ]);

  }
}

// export function* fetchCurrentUserSaga(action) {
//   yield call(fetcherAuthSaga, {
//     action,
//     endpoint: "/me",
//     schema: { results: [schemas.authSchema] }
//   });
// }

// export function* fetchCurrentUserSaga(action) {
//   yield call(fetcherAPIwithHeaderSaga, {
//     action,
//     endpoint: "/users/me/",
//     schema: { results: [schemas.authSchema] }
//   });
// }

export function* fetchCurrentUserSaga(action) {
  yield call(fetcherGetSaga, {
    action,
    endpoint: "/users/me/",
    schema: { results: [schemas.authSchema] }
  });
}

// export function* fetchLogout() {
//     // yield call(service.logout)
//     // yield put(actions.fetchLogout())
//     yield put(actions.fetchUserLoggedOut())
//     // history.push('/')
//     // useHistory().push('/')
//     yield call(history.push, '/login');
// }
//
// export function* watchLogoutUser() {
//   yield takeEvery(actions.fetchLogout, fetchLogout)
// }

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

export function* watchFetchCurrentUser() {
  yield takeEvery(actions.fetchCurrentUser, fetchCurrentUserSaga);
}

export function* watchFetchAuthUser() {
  yield takeEvery(actions.fetchAuthUser, fetchAuthUserSaga);
}
export function* watchFetchOAuthUser() {
  yield takeEvery(actions.fetchOAuthUser, fetchOAuthUserSaga);
}

const userSagas = [
  fork(watchFetchCurrentUser),
  fork(watchFetchAuthUser),
  fork(setAccessTokenSaga),
  // fork()
];

export default userSagas;
