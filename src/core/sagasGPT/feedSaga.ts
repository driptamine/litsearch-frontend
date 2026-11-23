import { takeLatest, call } from 'redux-saga/effects';
import * as actions from 'core/actions';
import * as schemas from 'core/schemas';
import { fetcherSaga } from './fetcherSaga';
import { callTrackAPI } from './apiSaga';

function processFeedResponse(data) {
  const posts = data.posts || [];
  return {
    results: posts,
    total_pages: data.has_next ? Infinity : 0,
    total_results: posts.length,
  };
}

function* fetchFeedPostsSaga(action) {
  const { page } = action.payload;
  yield call(fetcherSaga, {
    action,
    endpoint: '/posts/feed/',
    params: { page },
    schema: { results: [schemas.postSchema] },
    processData: processFeedResponse,
    apiCaller: callTrackAPI,
  });
}

export function* watchFeedSagas() {
  yield takeLatest(actions.fetchPopularPosts, fetchFeedPostsSaga);
}
