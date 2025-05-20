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

import { fetcherAPISaga, fetcherSaga } from "core/sagas/index"


export function* fetchMovieSearchSaga(action) {
  const { query, page } = action.payload;
  yield call(fetcherSaga, {
    action,
    endpoint: `/search/movie`,
    params: { query, page },
    schema: { results: [schemas.movieSchema] }
  });
}

export function* fetchPersonSearchSaga(action) {
  const { query, page } = action.payload;
  yield call(fetcherSaga, {
    action,
    endpoint: `/search/person`,
    params: { query, page },
    schema: { results: [schemas.personSchema] }
  });
}

export function* fetchArtistSearchSaga(action) {
  const { query, page } = action.payload;
  yield call(fetcherAPISaga, {
    action,
    endpoint: `/posts/search/artist`,
    params: { q: query },
    schema: {
      results: [schemas.artistSchema]
    }
  });
}

export function* fetchAlbumSearchSaga(action) {
  const { query, page } = action.payload;
  yield call(fetcherAPISaga, {
    action,
    endpoint: `/posts/search/album`,
    params: { q: query },
    schema: {
      results: [schemas.albumzSchema]
    }
  });
}

export function* fetchTrackSearchSaga(action) {
  const { query, page } = action.payload;
  yield call(fetcherAPISaga, {
    action,
    endpoint: `/posts/search/track`,
    params: { q: query },
    schema: {
      results: [schemas.trackzSchema]
    }
  });
}

export function* fetchSearchSaga(action) {
  const { type, payload } = action;
  const { requestType, successType, errorType, cancelType } = getFetchTypes(
    type
  );
  const { query } = payload;
  if (query) {

    yield put({ type: requestType });
    yield delay(800);
    try {
      yield all([
        call(fetchMovieSearchSaga, {
          ...action,
          type: actions.fetchMovieSearch
        }),
        call(fetchPersonSearchSaga, {
          ...action,
          type: actions.fetchPersonSearch
        }),
        call(fetchArtistSearchSaga, {
          ...action,
          type: actions.fetchArtistSearch
        }),
        call(fetchAlbumSearchSaga, {
          ...action,
          type: actions.fetchAlbumSearch
        }),
        call(fetchTrackSearchSaga, {
          ...action,
          type: actions.fetchTrackSearch
        })
      ]);
      yield put({ type: successType });
    } catch (error) {
      yield put({ type: errorType, error });
    }
  } else {
    yield put({ type: cancelType });
  }
}

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

export function* watchFetchMovieSearch() {
  yield takeEvery(actions.fetchMovieSearch, fetchMovieSearchSaga);
}

export function* watchFetchArtistSearch() {
  yield takeEvery(actions.fetchArtistSearch, fetchArtistSearchSaga);
}

export function* watchFetchAlbumSearch() {
  yield takeEvery(actions.fetchAlbumSearch, fetchAlbumSearchSaga);
}

export function* watchFetchTrackSearch() {
  yield takeEvery(actions.fetchTrackSearch, fetchTrackSearchSaga);
}

export function* watchFetchPersonSearch() {
  yield takeEvery(actions.fetchPersonSearch, fetchPersonSearchSaga);
}

export function* watchFetchSearch() {
  yield takeLatest(actions.fetchSearch, fetchSearchSaga);
}

// const searchesSagas = [
const searchSagas = [
  fork(watchFetchMovieSearch),
  fork(watchFetchPersonSearch),
  fork(watchFetchArtistSearch),
  fork(watchFetchAlbumSearch),
  fork(watchFetchTrackSearch),
  fork(watchFetchSearch)
];

export default searchSagas;
