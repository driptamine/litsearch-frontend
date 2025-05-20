import { call, takeEvery } from "redux-saga/effects";
import * as actions from "core/actions";
import { callAPIWithHeader } from "./apiSaga";
import * as schemas from "core/schemas";

function* fetchTrackSaga(action) {
  yield call(callAPIWithHeader, `/track/${action.payload.trackId}/`, null, schemas.trackSchema);
}

export function* watchTrackSagas() {
  yield takeEvery(actions.fetchTrack, fetchTrackSaga);
}
