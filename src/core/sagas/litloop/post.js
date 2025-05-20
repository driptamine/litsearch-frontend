import { put, delay, fork, all, call, select, takeEvery, takeLatest, cancelled } from "redux-saga/effects";
import { getFetchTypes, verifyCachedData, createUrl, createAPIUrl, createAuthUrl } from "core/utils";
import { setAccessToken } from "core/actions";
import * as schemas from "core/schemas";
import * as actions from "core/actions";
import * as service from "core/services/UserService";
import { normalize } from "normalizr";
import { selectors } from "core/reducers/index";
import history  from "core/services/history"

import { fetcherAPISaga } from "core/sagas/index"
import { fetcherGetSaga } from "core/sagas/utils"

export function* fetchNewReleasesSaga(action) {
  const { page } = action.payload;
  yield call(fetcherGetSaga, {
    action: action,
    endpoint: "/posts/feed/",
    params: { page },
    schema: { results: [schemas.albumzSchema] }
  });
}

export function* watchFetchNewReleases() {
  yield takeEvery(actions.fetchNewReleases, fetchNewReleasesSaga);
}

const postSagas = [
  fork(watchFetchNewReleases),
  // fork(),
  // fork()
];

export default postSagas;
