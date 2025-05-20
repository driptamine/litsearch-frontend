import { call, put, takeEvery } from "redux-saga/effects";
import * as actions from "core/actions";
import { callAPIWithHeader } from "./apiSaga";
import * as schemas from "core/schemas";

function* fetchAlbumSaga(action) {
  yield call(callAPIWithHeader, `/album/${action.payload.albumId}/upd`, null, schemas.albumSchema);
}

function* fetchLikeAlbumSaga(action) {
  yield call(callAPIWithHeader, `/album/${action.payload.id}/like/`, { id: action.payload.id });
}

export function* watchAlbumSagas() {
  yield takeEvery(actions.fetchAlbum, fetchAlbumSaga);
  yield takeEvery(actions.fetchLikeAlbum, fetchLikeAlbumSaga);
}
