import { call, takeEvery, select } from 'redux-saga/effects';
import * as actions from 'core/actions';
import * as schemas from 'core/schemas';
import { selectors } from 'core/reducers/index';
import { fetcherAPISaga } from './fetcherAPISaga';

function* fetchTrackSaga(action) {
  const { trackId } = action.payload;
  const track = yield select(selectors.selectTrack, trackId);
  yield call(fetcherAPISaga, {
    action,
    endpoint: `/track/${trackId}/`,
    schema: schemas.trackSchema,
    cachedData: track
  });
}

export function* watchTrackSagas() {
  yield takeEvery(actions.fetchTrack, fetchTrackSaga);
}
