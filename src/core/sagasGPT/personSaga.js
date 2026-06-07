import { call, takeEvery, select } from 'redux-saga/effects';
import * as actions from 'core/actions';
import * as schemas from 'core/schemas';
import { selectors } from 'core/reducers/index';
import { fetcherSaga } from './fetcherSaga';

function* fetchPopularPeopleSaga(action) {
  const { page } = action.payload;
  yield call(fetcherSaga, {
    action,
    endpoint: "/person/popular",
    params: { page },
    schema: { results: [schemas.personSchema] }
  });
}

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

export function* watchPersonSagas() {
  yield takeEvery(actions.fetchPopularPeople, fetchPopularPeopleSaga);
  yield takeEvery(actions.fetchPerson, fetchPersonSaga);
  yield takeEvery(actions.fetchPersonCredits, fetchPersonCreditsSaga);
  yield takeEvery(actions.fetchPersonImages, fetchPersonImagesSaga);
}
