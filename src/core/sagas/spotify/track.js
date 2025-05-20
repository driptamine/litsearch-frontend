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

import { fetcherAPISaga, fetcherAPIwithHeaderSaga } from "core/sagas/index";
import { fetcherGetSaga, fetcherPostAuthSaga } from "core/sagas/utils";


export function* fetchTrackSaga(action) {
  const { trackId } = action.payload;
  const track = yield select(selectors.selectTrack, trackId);
  yield call(fetcherGetSaga, {
    action,
    endpoint: `/track/${trackId}/`,
    schema: schemas.trackSchema,
    cachedData: track
  });
}

export function* watchFetchTrack() {
  yield takeEvery(actions.fetchTrack, fetchTrackSaga);
}

const trackSagas = [
  fork(watchFetchTrack),
  // fork(),
  // fork()
];

export default trackSagas;
