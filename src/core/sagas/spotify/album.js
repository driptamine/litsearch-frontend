import { put, delay, fork, all, call, select, takeEvery, takeLatest, cancelled } from "redux-saga/effects";
import { getFetchTypes, verifyCachedData, createUrl, createAPIUrl, createAuthUrl } from "core/utils";
import { setAccessToken } from "core/actions";
import * as schemas from "core/schemas";
import * as actions from "core/actions";
// import * as service from "core/services/UserService";
import { normalize } from "normalizr";
import { selectors } from "core/reducers/index";
import axios from "axios";
import history  from "core/services/history";

// refactor
import { fetcherAuthSaga, fetcherAPIwithHeaderSaga } from "core/sagas/index";
import { fetcherPostAuthSaga, fetcherGetSaga } from "core/sagas/utils";

/******************************************************************************/
/******************************* SAGAS *************************************/
/******************************************************************************/

export function* fetchAlbumSaga(action) {
  const { albumId } = action.payload;
  const album = yield select(selectors.selectAlbum, albumId);
  //   yield call(fetcherAPISaga, {
  yield call(fetcherGetSaga, {
    action,
    endpoint: `/album/${albumId}/`,
    schema: schemas.albumSchema,
    cachedData: album
  });
}

export function* fetchlikeAlbumSaga(action) {
  const { id, type } = action.payload;
  yield call(fetcherPostAuthSaga, {
    action: action,
    endpoint: `/album/${id}/fike/`,
    data: {
      id: id,
      type: type
    },
    schema: { results: [schemas.authSchema] }
  });
}


/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

export function* watchFetchAlbum() {
  yield takeEvery(actions.fetchAlbum, fetchAlbumSaga);
}

export function* watchFetchLikeAlbum() {
  yield takeEvery(actions.fetchLikeAlbum, fetchlikeAlbumSaga);
}

const albumSagas = [
  fork(watchFetchAlbum),
  fork(watchFetchLikeAlbum)
];

export default albumSagas;

// export const sagas = {
//   watchFetchAlbum: takeEvery(actions.fetchAlbum, fetchAlbumSaga);
//   watchFetchLikeAlbum: takeEvery(actions.fetchLikeAlbum, fetchlikeAlbumSaga);
//
// };

// import { sagas as albumsSagas } from "./authSaga";
// import { sagas as adminSagas } from "./adminSaga";
