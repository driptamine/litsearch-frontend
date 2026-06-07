import { all, call, put, takeLatest, takeEvery, delay, select } from 'redux-saga/effects';
import { getFetchTypes, verifyCachedData, createUrl, createAPIUrl, createAuthUrl, bingAPIurl } from 'core/utils';

import * as actions from 'core/actions';
import { callAPIWithHeader } from './apiSaga';
import * as schemas from 'core/schemas';
import { selectors } from 'core/reducers/index';

import { fetcherAPISaga } from './fetcherAPISaga';
import { fetcherSaga } from './fetcherSaga';

function* fetchBraveWebSearchSaga(action) {
  const { query, page } = action.payload;
  const state = yield select();
  const cachedData = (page === 1 || page === undefined) ? state.pagination?.websiteSearchResultsByQuery?.[query]?.ids : null;
  yield call(
    // fetcherSaga, {
    // requestWithHeaderSaga, {
    fetcherAPISaga, {
    action,
    // endpoint: `/search?q=${query}`,
    endpoint: `/websites/brave/search`,
    params: { q: query, page },
    // schema: {
    //   webPages: {
    //     value: [schemas.webSchema]
    //   }
    // },
    schema: {
      results: [schemas.webSchema]
    },
    cachedData
    // schema: {
    //
    //   results: [schemas.albumSchema]
    // }
  });
}

function* fetchBingWebSearchSaga(action) {
  const { query, page } = action.payload;
  const state = yield select();
  const cachedData = (page === 1 || page === undefined) ? state.pagination?.websiteSearchResultsByQuery?.[query]?.ids : null;
  yield call(
    // fetcherSaga, {
    // requestWithHeaderSaga, {
    fetcherAPISaga, {
    action,
    // endpoint: `/search?q=${query}`,
    endpoint: `/websites/bing/search`,
    params: { q: query, page },
    // schema: {
    //   webPages: {
    //     value: [schemas.webSchema]
    //   }
    // },
    schema: {
      results: [schemas.webSchema]
    },
    cachedData
    // schema: {
    //
    //   results: [schemas.albumSchema]
    // }
  });
}

function* fetchQuerySearchSaga(action) {
  const { query, page, cursorPosition } = action.payload;
  const state = yield select();
  const cachedData = (page === 1 || page === undefined) ? state.pagination?.querySearchResultsByQuery?.[query]?.ids : null;
  yield call(fetcherAPISaga, {
    action,
    endpoint: `/queries/google/firefox/search`,
    params: { q: query, cp: cursorPosition },
    // params: { q: query, page: page, offset: offset, limit: limit },
    schema: {
      results: [schemas.querySchema]
    },
    cachedData
  });
}

function* fetchQuerySearchWorker(action) {
  const { type, payload } = action;
  const { requestType, successType, errorType, cancelType } = getFetchTypes(
    type
  );
  const { query } = payload;
  if (query) {

    yield put({ type: requestType });
    // yield delay(1200);
    try {
      yield all([
        call(fetchQuerySearchSaga, {
          ...action,
          type: actions.fetchQuerySearch
        }),
        // call(fetchWebSearchQuerySaga, {
        //   ...action,
        //   type: actions.fetchQuerySearch
        // }),
        // call(fetchPersonSearchSaga, {
        //   ...action,
        //   type: actions.fetchPersonSearch
        // }),

        // call(fetchArtistSearchSaga, {
        //   ...action,
        //   type: actions.fetchArtistSearch
        // }),
        //
        // call(fetchAlbumSearchSaga, {
        //   ...action,
        //   type: actions.fetchAlbumSearch
        // }),

      ]);
      yield put({ type: successType });
    } catch (error) {
      yield put({ type: errorType, error });
    }
  } else {
    yield put({ type: cancelType });
  }
}

function* fetchBingImageSearchSaga(action) {
  const { query, page } = action.payload;
  const state = yield select();
  const cachedData = (page === 1 || page === undefined) ? state.pagination?.imageSearchResultsByQuery?.[`bing_${query}`]?.ids : null;
  yield call(
    // fetcherSaga, {
    // requestWithHeaderSaga, {
    fetcherAPISaga, {
    action,
    // endpoint: `/search?q=${query}`,
    endpoint: `/websites/bing/images/search`,
    params: { q: query, page },
    // schema: {
    //   webPages: {
    //     value: [schemas.webSchema]
    //   }
    // },
    schema: {
      results: [schemas.imagesSchemaBing]
    },
    cachedData

  });
}
function* fetchBraveImageSearchSaga(action) {
  const { query, page } = action.payload;
  const state = yield select();
  const cachedData = (page === 1 || page === undefined) ? state.pagination?.imageSearchResultsByQuery?.[`brave_${query}`]?.ids : null;
  yield call(
    // fetcherSaga, {
    // requestWithHeaderSaga, {
    fetcherAPISaga, {
    action,
    // endpoint: `/search?q=${query}`,
    endpoint: `/websites/brave/images/search`,
    params: { q: query, page },
    // schema: {
    //   webPages: {
    //     value: [schemas.webSchema]
    //   }
    // },
    schema: {
      results: [schemas.imagesSchemaBrave]
    },
    cachedData

  });
}

function* fetchPersonSearchSaga(action) {
  const { query, page } = action.payload;
  const state = yield select();
  const cachedData = (page === 1 || page === undefined) ? state.pagination?.personSearchResultsByQuery?.[query]?.ids : null;
  yield call(fetcherSaga, {
    action,
    endpoint: `/search/person`,
    params: { query, page },
    schema: { results: [schemas.personSchema] },
    cachedData
  });
}

function* fetchArtistSearchSaga(action) {
  const { query, page, offset } = action.payload;
  const state = yield select();
  const cachedData = (offset === 0 || offset === undefined) ? state.pagination?.artistSearchResultsByQuery?.[query]?.ids : null;
  yield call(fetcherAPISaga, {
    action,
    endpoint: `/posts/search/artist`,
    params: { q: query, offset: offset },
    schema: {
      results: [schemas.artistSearchSchema]
    },
    cachedData
  });
}

function* fetchAlbumSearchSaga(action) {
  const { query, page, offset } = action.payload;
  const state = yield select();
  const cachedData = (offset === 0 || offset === undefined) ? state.pagination?.albumSearchResultsByQuery?.[query]?.ids : null;
  yield call(fetcherAPISaga, {
    action,
    endpoint: `/posts/search/album`,
    params: { q: query, offset: offset },
    schema: {
      results: [schemas.albumSchema]
    },
    cachedData
  });
}

function* fetchTrackSearchSaga(action) {
  const { query, page, offset } = action.payload;
  const state = yield select();
  const cachedData = (offset === 0 || offset === undefined) ? state.pagination?.trackSearchResultsByQuery?.[query]?.ids : null;
  yield call(fetcherAPISaga, {
    action,
    endpoint: `/posts/search/track`,
    params: { q: query, offset: offset},
    schema: {
      results: [schemas.trackzSchema]
    },
    cachedData
  });
}

// IMPORTANT
function* fetchSearchSaga(action) {
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
        put(actions.fetchMovieSearch(query, 1)),
        put(actions.fetchPersonSearch(query, 1)),
      ]);
      yield put({ type: successType });
    } catch (error) {
      yield put({ type: errorType, error });
    }
  } else {
    yield put({ type: cancelType });
  }
}

function* fetchMovieSearchSaga(action) {
  const { query, page } = action.payload;
  const state = yield select();
  const cachedData = (page === 1 || page === undefined) ? state.pagination?.movieSearchResultsByQuery?.[query]?.ids : null;
  yield call(fetcherSaga, {
    action,
    endpoint: `/search/movie`,
    params: { query, page },
    schema: { results: [schemas.movieSchema] },
    cachedData
  });
}

export function* watchSearchSagas() {
  yield takeLatest(actions.fetchQuerySearch, fetchQuerySearchWorker);
  yield takeLatest(actions.fetchWebsiteSearch, fetchBraveWebSearchSaga);
  yield takeLatest(actions.fetchImageSearch, fetchBingImageSearchSaga);
  yield takeLatest(actions.fetchBingImageSearch, fetchBingImageSearchSaga);
  yield takeLatest(actions.fetchBraveImageSearch, fetchBraveImageSearchSaga);

  yield takeLatest(actions.fetchMovieSearch, fetchMovieSearchSaga);
  yield takeLatest(actions.fetchArtistSearch, fetchArtistSearchSaga);
  yield takeLatest(actions.fetchAlbumSearch, fetchAlbumSearchSaga);
  yield takeLatest(actions.fetchTrackSearch, fetchTrackSearchSaga);
  yield takeLatest(actions.fetchPersonSearch, fetchPersonSearchSaga);
  yield takeLatest(actions.fetchSearch, fetchSearchSaga);
}
