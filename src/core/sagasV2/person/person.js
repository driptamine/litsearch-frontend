import { put, delay, fork, all, call, select, takeEvery, takeLatest, cancelled} from "redux-saga/effects";
import { normalize } from "normalizr";
import axios from "axios";

import { getFetchTypes, verifyCachedData, createUrl, createAPIUrl, createAuthUrl, bingAPIurl } from "core/utils";
import { setAccessToken } from "core/actions";
import * as schemas from "core/schemas";
import * as actions from "core/actions";

import { watchPlaySelectedTrack } from 'core/sagas/spotify/player';
import { selectors } from "core/reducers/index";
import { getHeaders, getState } from 'core/store';
import { postAxiosReq, getAxiosReq } from "core/api/rest-helper";
import history  from "core/services/history";
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
} from "core/sagasV2/util";

function* fetchPersonSaga(action) {
  const { personId } = action.payload;
  const person = yield select(selectors.selectPerson, personId);
  yield call(fetcherSaga, {
    action,
    endpoint: `/person/${personId}`,
    schema: schemas.personSchema,
    cachedData: person
  });
}
function* fetchPopularPeopleSaga(action) {
  const { page } = action.payload;
  yield call(fetcherSaga, {
    action,
    endpoint: "/person/popular",
    params: { page },
    schema: { results: [schemas.personSchema] }
  });
}
function* fetchPersonCreditsSaga(action) {
  const { personId } = action.payload;
  const personCredits = yield select(selectors.selectPersonCredits, personId);
  yield call(fetcherSaga, {
    action,
    endpoint: `/person/${personId}/movie_credits`,
    schema: schemas.personCreditSchema,
    cachedData: personCredits
  });
}
function* fetchPersonImagesSaga(action) {
  const { personId } = action.payload;
  const personImages = yield select(selectors.selectPersonImages, personId);
  yield call(fetcherSaga, {
    action,
    endpoint: `/person/${personId}/images`,
    schema: schemas.personImageSchema,
    cachedData: personImages
  });
}

/******************************* WATCHERS *************************************/
export function* watchFetchPerson() {
  yield takeEvery(actions.fetchPerson, fetchPersonSaga);
}

export function* watchFetchPopularPeople() {
  yield takeEvery(actions.fetchPopularPeople, fetchPopularPeopleSaga);
}

export function* watchFetchPersonCredits() {
  yield takeEvery(actions.fetchPersonCredits, fetchPersonCreditsSaga);
}

export function* watchFetchPersonImages() {
  yield takeEvery(actions.fetchPersonImages, fetchPersonImagesSaga);
}
