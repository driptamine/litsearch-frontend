import { put, delay, fork, all, call, select, takeEvery, takeLatest, cancelled } from "redux-saga/effects";
import { getFetchTypes, verifyCachedData, createUrl, createAPIUrl, createAuthUrl } from "core/utils";
import { setAccessToken } from "core/actions";
import * as schemas from "core/schemas";
import * as actions from "core/actions";

import * as service from "core/services/UserService";

import { normalize } from "normalizr";
import { selectors } from "core/reducers/index";
import axios from "axios";
import history  from "core/services/history"

import { fetcherPostAuthSaga, fetcherGetSaga } from "core/sagas/utils";



export function* fetchPopularPeopleSaga(action) {
  const { page } = action.payload;
  yield call(fetcherGetSaga, {
    action,
    endpoint: "/person/popular",
    params: { page },
    schema: { results: [schemas.personSchema] }
  });
}

export function* fetchPersonSaga(action) {
  const { personId } = action.payload;
  const person = yield select(selectors.selectPerson, personId);
  yield call(fetcherGetSaga, {
    action,
    endpoint: `/person/${personId}`,
    schema: schemas.personSchema,
    cachedData: person
  });
}

export function* fetchPersonCreditsSaga(action) {
  const { personId } = action.payload;
  const personCredits = yield select(selectors.selectPersonCredits, personId);
  yield call(fetcherGetSaga, {
    action,
    endpoint: `/person/${personId}/movie_credits`,
    schema: schemas.personCreditSchema,
    cachedData: personCredits
  });
}

export function* fetchPersonImagesSaga(action) {
  const { personId } = action.payload;
  const personImages = yield select(selectors.selectPersonImages, personId);
  yield call(fetcherGetSaga, {
    action,
    endpoint: `/person/${personId}/images`,
    schema: schemas.personImageSchema,
    cachedData: personImages
  });
}


export function* watchFetchPopularPeople() {
  yield takeEvery(actions.fetchPopularPeople, fetchPopularPeopleSaga);
}

export function* watchFetchPerson() {
  yield takeEvery(actions.fetchPerson, fetchPersonSaga);
}

export function* watchFetchPersonCredits() {
  yield takeEvery(actions.fetchPersonCredits, fetchPersonCreditsSaga);
}

export function* watchFetchPersonImages() {
  yield takeEvery(actions.fetchPersonImages, fetchPersonImagesSaga);
}


const personsSagas = [
  fork(watchFetchPerson),
  fork(watchFetchPersonImages),
  fork(watchFetchPersonCredits),
  fork(watchFetchPopularPeople)
];

export default personsSagas;
