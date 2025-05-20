import { put, delay, fork, all, call, select, takeEvery, takeLatest, cancelled} from "redux-saga/effects";
import { normalize } from "normalizr";
import axios from "axios";

import { getFetchTypes, verifyCachedData, createUrl, createAPIUrl, createAuthUrl, bingAPIurl } from "core/utils";
import { setAccessToken } from "core/actions";
import * as schemas from "core/schemas";
import * as actions from "core/actions";

import { watchPlaySelectedTrack } from 'core/sagas/spotify/player';
import { selectors } from "core/reducers/index";
import { getHeaders, getState } from 'core/store';
import { postAxiosReq, getAxiosReq } from "core/api/rest-helper";
import history  from "core/services/history";
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
} from "core/sagasV2/util";

function* fetchMovieSearchSaga(action) {
  const { query, page } = action.payload;
  yield call(fetcherSaga, {
    action,
    endpoint: `/search/movie`,
    params: { query, page },
    schema: { results: [schemas.movieSchema] }
  });
}

function* fetchQuerySaga(action) {
  const { query, page } = action.payload;
  yield call(requestWithHeaderSaga, {
    action,
    endpoint: `/queries/brave/search`,
    params: { q: query, page },
    schema: { results: [schemas.querySchema] }
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
      results: [schemas.imagesSchema]
    },

    // schema: {
    //
    //   results: [schemas.albumSchema]
    // }
  });
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

function* fetchPersonSearchSaga(action) {
  const { query, page } = action.payload;
  yield call(fetcherSaga, {
    action,
    endpoint: `/search/person`,
    params: { query, page },
    schema: { results: [schemas.personSchema] }
  });
}

function* fetchArtistSearchSaga(action) {
  const { query, page, offset } = action.payload;
  yield call(fetcherAPISaga, {
    action,
    endpoint: `/posts/search/artist`,
    params: { q: query, offset: offset },
    // params: { q: query, page: page, offset: offset, limit: limit },
    schema: {
      results: [schemas.artistSearchSchema]
    }
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

function* fetchAlbumSearchSaga(action) {
  const { query, page, offset } = action.payload;
  yield call(fetcherAPISaga, {
    action,
    endpoint: `/posts/search/album`,
    params: { q: query, offset: offset },
    // params: { q: query, page: page, offset: offset, limit: limit },
    schema: {
      // results: [schemas.albummSchema]
      // results: [schemas.albumziSchema]
      // results: [schemas.albumzSchema]
      results: [schemas.albumSchema]
    }
  });
}

function* fetchTrackSearchSaga(action) {
  const { query, page, offset } = action.payload;
  yield call(fetcherAPISaga, {
    action,
    endpoint: `/posts/search/track`,
    params: { q: query, offset: offset},
    // params: { q: query, page: page, offset: offset, limit: limit },
    schema: {
      results: [schemas.trackzSchema]
    }
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
        // call(fetchMovieSearchSaga, {
        //   ...action,
        //   type: actions.fetchMovieSearch
        // }),
        // call(fetchBingWebSearchSaga, {
        //   ...action,
        //   type: actions.fetchWebsiteSearch
        // }),
        // call(fetchBraveWebSearchSaga, {
        //   ...action,
        //   type: actions.fetchWebsiteSearch
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
        // call(fetchTrackSearchSaga, {
        //   ...action,
        //   type: actions.fetchTrackSearch
        // })
      ]);
      yield put({ type: successType });
    } catch (error) {
      yield put({ type: errorType, error });
    }
  } else {
    yield put({ type: cancelType });
  }
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

/******************************* WATCHERS *************************************/
export function* watchFetchMovieSearch() {
  yield takeEvery(actions.fetchMovieSearch, fetchMovieSearchSaga);
}

export function* watchFetchWebSearch() {
  yield takeEvery(actions.fetchWebsiteSearch, fetchBraveWebSearchSaga);
  // yield takeLatest(actions.fetchWebsiteSearch, fetchBraveWebSearchSaga);
}
export function* watchFetchImageSearch() {
  // yield takeEvery(actions.fetchImageSearch, fetchBraveImageSearchSaga);
  yield takeEvery(actions.fetchImageSearch, fetchBingImageSearchSaga);
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
export function* watchFetchQuerySearch() {
  yield takeLatest(actions.fetchQuerySearch, fetchQuerySearchWorker);
}
