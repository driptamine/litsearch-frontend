import { put, delay, fork, all, call, select, takeEvery, takeLatest, cancelled } from "redux-saga/effects";
import { getFetchTypes, verifyCachedData, createUrl, createAPIUrl, createAuthUrl } from "core/utils";
import { setAccessToken } from "core/actions";
import * as schemas from "core/schemas";
import * as actions from "core/actions";
import * as service from "core/services/UserService";
import { normalize } from "normalizr";
import { selectors } from "core/reducers/index";
import history  from "core/services/history"

import { fetcherSaga } from "./index"


export function* fetchGenresSaga(action) {
  yield call(fetcherSaga, {
    action,
    endpoint: "/genre/movie/list",
    schema: { genres: [schemas.genreSchema] }
  });
}

export function* watchFetchGenres() {
  yield takeEvery(actions.fetchGenres, fetchGenresSaga);
}

const genresSagas = [
  fork(),
  fork(),
  fork(),
  fork()
];

export default genresSagas;
