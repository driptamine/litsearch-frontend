import { put, delay, fork, all, call, select, takeEvery, takeLatest, cancelled} from 'redux-saga/effects';
import { normalize } from 'normalizr';
import axios from 'axios';

import { getFetchTypes, verifyCachedData, createUrl, createAPIUrl, createAuthUrl, bingAPIurl } from 'core/utils';
import { setAccessToken } from 'core/actions';
import * as schemas from 'core/schemas';
import * as actions from 'core/actions';

import { watchPlaySelectedTrack } from 'core/sagas/spotify/player';
import { selectors } from 'core/reducers/index';
import { getHeaders, getState } from 'core/store';
import { postAxiosReq, getAxiosReq } from 'core/api/rest-helper';
import history  from 'core/services/history';
import {
  callAPI,
  callTrackAPI,
  callAPIwithHeader,
  getAccessToken,
  likeAlbumHeader,
  likeAlbumSaga,
  requestWithHeader,
  fetcherSaga,
  fetcherAPISaga,
  fetcherAPIwithHeaderSaga,
  fetcherAuthSaga,
  likeHeaderSaga,
  requestWithHeaderSaga,
} from 'core/sagasV2/util';

function* fetchAuthUserSaga(action) {
  const { email, password } = action.payload;
  yield call(fetcherAuthSaga, {
    action: action,
    endpoint: "/users/signin/",
    params: {
      email: email,
      password: password
    },
    schema: { results: [schemas.authSchema] }
  });
}

function* fetchCurrentUserSaga(action) {
  yield call(fetcherAPIwithHeaderSaga, {
    action,
    endpoint: "/users/me/",
    schema: { results: [schemas.authSchema] }
    // schema: schemas.authSchema
  });
}

function* fetchLogout() {
    // yield call(service.logout)
    // yield put(actions.fetchLogout())
    yield put(actions.fetchUserLoggedOut())
    // history.push('/')
    // useHistory().push('/')

    // yield call(history.push, '/login');
}

/******************************* WATCHERS *************************************/
export function* watchLogoutUser() {
  yield takeEvery(actions.fetchLogout, fetchLogout)
}

export function* watchFetchCurrentUser() {
  yield takeEvery(actions.fetchCurrentUser, fetchCurrentUserSaga);
}

export function* watchFetchAuthUser() {
  yield takeEvery(actions.fetchAuthUser, fetchAuthUserSaga);
}
