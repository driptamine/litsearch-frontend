import { put, delay, fork, all, call, select, takeEvery, takeLatest, cancelled} from 'redux-saga/effects';
import { normalize } from 'normalizr';
import axios from 'axios';

import { getFetchTypes, verifyCachedData, createUrl, createAPIUrl, createAuthUrl, bingAPIurl } from 'core/utils';
import { setAccessToken } from 'core/actions';
import * as schemas from 'core/schemas';
import * as actions from 'core/actions';

import { watchPlaySelectedTrack } from 'core/sagas/spotify/player';
import { selectors } from 'core/reducers/index';
import { getHeaders, getState } from 'core/store';
import { postAxiosReq, getAxiosReq } from 'core/api/rest-helper';
import history  from 'core/services/history';
import {
  callAPI,
  callTrackAPI,
  callAPIwithHeader,
  getAccessToken,
  likeAlbumHeader,
  likeAlbumSaga,
  requestWithHeader,
  fetcherSaga,
  fetcherAPISaga,
  fetcherAPIwithHeaderSaga,
  fetcherAuthSaga,
  likeHeaderSaga,
  requestWithHeaderSaga,
} from 'core/sagasV2/util';
function* fetchNewReleasesSaga(action) {
  const { page } = action.payload;
  yield call(fetcherAPISaga, {
    action: action,
    endpoint: "/posts/feed/",
    params: { page },
    schema: { results: [schemas.albumzSchema] }
  });
}

function* fetchPlaySong(action) {
  const { song, page } = action.payload;
  yield call(fetcherAPISaga, {
    action: action,
    endpoint: "/posts/feed/",
    params: { page },
    schema: { results: [schemas.albumzSchema] }
  });
}

/******************************* WATCHERS *************************************/
export function* watchFetchNewReleases() {
  yield takeEvery(actions.fetchNewReleases, fetchNewReleasesSaga);
}
