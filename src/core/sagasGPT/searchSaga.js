import { all, call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import { getFetchTypes, verifyCachedData, createUrl, createAPIUrl, createAuthUrl, bingAPIurl } from 'core/utils';

import * as actions from 'core/actions';
import { callAPIWithHeader } from './apiSaga';
import * as schemas from 'core/schemas';

import { fetcherAPISaga } from './fetcherAPISaga';

function* fetchSearchSaga(action) {
  yield put({ type: actions.fetchSearch.request });
  try {
    yield call(callAPIWithHeader, `/search/movie?q=${action.payload.query}`, null, { results: [schemas.movieSchema] });
    yield put({ type: actions.fetchSearch.success });
  } catch (error) {
    yield put({ type: actions.fetchSearch.failure, error });
  }
}
function* fetchBraveWebSearchSaga(action) {
  const { query, page } = action.payload;
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

    // schema: {
    //
    //   results: [schemas.albumSchema]
    // }
  });
}

function* fetchBingWebSearchSaga(action) {
  const { query, page } = action.payload;
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

    // schema: {
    //
    //   results: [schemas.albumSchema]
    // }
  });
}

function* fetchQuerySearchSaga(action) {
  const { query, page, cursorPosition } = action.payload;
  yield call(fetcherAPISaga, {
    action,
    endpoint: `/queries/google/firefox/search`,
    params: { q: query, cp: cursorPosition },
    // params: { q: query, page: page, offset: offset, limit: limit },
    schema: {
      results: [schemas.querySchema]
    }
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


  });
}
function* fetchBraveImageSearchSaga(action) {
  const { query, page } = action.payload;
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


  });
}

export function* watchSearchSagas() {
  // yield takeLatest(actions.fetchSearch, fetchSearchSaga);
  // yield takeLatest(actions.fetchQuerySearch, fetchQuerySearchWorker);
  yield takeLatest(actions.fetchQuerySearch, fetchQuerySearchWorker);
  yield takeEvery(actions.fetchWebsiteSearch, fetchBraveWebSearchSaga);
  // yield takeEvery(actions.fetchWebsiteSearch, fetchBingWebSearchSaga);
  yield takeEvery(actions.fetchImageSearch, fetchBingImageSearchSaga);
  yield takeEvery(actions.fetchBingImageSearch, fetchBingImageSearchSaga);
  yield takeEvery(actions.fetchBraveImageSearch, fetchBraveImageSearchSaga);
}
