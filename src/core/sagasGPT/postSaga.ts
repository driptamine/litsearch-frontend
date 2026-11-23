import { takeEvery, select, call } from 'redux-saga/effects';
import * as actions from 'core/actions';
import * as schemas from 'core/schemas';
import { selectors } from 'core/reducers/index';
import { fetcherSaga } from './fetcherSaga';
import { callTrackAPI } from './apiSaga';

function* fetchPostSaga(action) {
  const { postId } = action.payload;
  const post = yield select(selectors.selectPost, postId);
  yield call(fetcherSaga, {
    action,
    endpoint: `/posts/${postId}`,
    schema: schemas.postSchema,
    cachedData: post,
    apiCaller: callTrackAPI
  });
}

export function* watchPostSagas() {
  yield takeEvery(actions.fetchPost, fetchPostSaga);
}
