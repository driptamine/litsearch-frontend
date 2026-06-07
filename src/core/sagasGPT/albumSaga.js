import { call, put, takeEvery, select } from 'redux-saga/effects';
import * as actions from 'core/actions';
import * as schemas from 'core/schemas';
import { selectors } from 'core/reducers/index';
import { fetcherAPIwithHeaderSaga } from './fetcherAPIwithHeaderSaga';
import { fetcherAPISaga } from './fetcherAPISaga';
import { likeHeaderSaga } from './authSaga';

function* fetchAlbumSaga(action) {
  const { albumId } = action.payload;
  const album = yield select(selectors.selectAlbum, albumId);
  yield call(fetcherAPIwithHeaderSaga, {
    action,
    endpoint: `/album/${albumId}/upd`,
    schema: schemas.albumSchema,
    cachedData: album
  });
}

function* fetchLikeAlbumSaga(action) {
  const { id, type } = action.payload;
  yield call(likeHeaderSaga, {
    action: action,
    endpoint: `/album/${id}/fike/`,
    data: {
      id: id,
      type: type
    },
    schema: schemas.albumSchema,
  });
}

function* fetchNewReleasesSaga(action) {
  const { page } = action.payload;
  yield call(fetcherAPISaga, {
    action: action,
    endpoint: "/posts/feed/",
    params: { page },
    schema: { results: [schemas.albumzSchema] }
  });
}

export function* watchAlbumSagas() {
  yield takeEvery(actions.fetchAlbum, fetchAlbumSaga);
  yield takeEvery(actions.fetchLikeAlbum, fetchLikeAlbumSaga);
  yield takeEvery(actions.fetchUnLikeAlbum, fetchLikeAlbumSaga);
  yield takeEvery(actions.fetchNewReleases, fetchNewReleasesSaga);
  yield takeEvery(actions.fetchPopularAlbums, fetchNewReleasesSaga);
}
