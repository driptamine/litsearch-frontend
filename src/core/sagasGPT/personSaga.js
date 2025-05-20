import { call, takeEvery } from "redux-saga/effects";
import * as actions from "core/actions";
import { callAPIWithHeader } from "./apiSaga";
import * as schemas from "core/schemas";

function* fetchPersonSaga(action) {
  yield call(callAPIWithHeader, `/person/${action.payload.personId}/`, null, schemas.personSchema);
}

export function* watchPersonSagas() {
  yield takeEvery(actions.fetchPerson, fetchPersonSaga);
}
