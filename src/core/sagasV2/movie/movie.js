import axios from "axios";
import { put, delay, fork, all, call, select, takeEvery, takeLatest, cancelled} from "redux-saga/effects";
import { normalize } from "normalizr";

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


function* fetchMovieSaga(action) {
  const { movieId } = action.payload;
  const movie = yield select(selectors.selectMovie, movieId);
  yield call(fetcherSaga, {
    action,
    endpoint: `/movie/${movieId}`,
    schema: schemas.movieSchema,
    cachedData: movie
  });
}
function* fetchMovieExternalIdsSaga(action) {
  const { movieId } = action.payload;
  const movie = yield select(selectors.selectMovie, movieId);
  yield call(fetcherSaga, {
    action,
    endpoint: `/movie/${movieId}/external_ids`,
    schema: schemas.movieSchema,
    cachedData: movie
  });
}

function* fetchMovieCreditsSaga(action) {
  const { movieId } = action.payload;
  const movieCredits = yield select(selectors.selectMovieCredits, movieId);
  yield call(fetcherSaga, {
    action,
    endpoint: `/movie/${movieId}/credits`,
    schema: schemas.movieCreditSchema,
    cachedData: movieCredits
  });
}
function* fetchRecommendationsSaga(action) {
  const { movieId } = action.payload;
  const recommendations = yield select(selectors.selectMovieRecommendations, movieId);
  yield call(fetcherSaga, {
    action,
    endpoint: `/movie/${movieId}/recommendations`,
    processData: response => ({ ...response, movieId }),
    schema: schemas.movieRecommendationSchema,
    cachedData: recommendations
  });
}
function* fetchMovieVideosSaga(action) {
  const { movieId } = action.payload;
  const movieVideos = yield select(selectors.selectMovieVideos, movieId);
  yield call(fetcherSaga, {
    action,
    endpoint: `/movie/${movieId}/videos`,
    schema: schemas.movieVideoSchema,
    cachedData: movieVideos
  });
}
function* fetchMovieImagesSaga(action) {
  const { movieId } = action.payload;
  const movieImages = yield select(selectors.selectMovieImages, movieId);
  yield call(fetcherSaga, {
    action,
    endpoint: `/movie/${movieId}/images`,
    schema: schemas.movieImageSchema,
    cachedData: movieImages
  });
}
function* fetchPopularMoviesSaga(action) {
  const { page } = action.payload;
  yield call(fetcherSaga, {
    action: action,
    endpoint: "/movie/popular",
    params: { page },
    schema: { results: [schemas.movieSchema] }
  });
}


/******************************* WATCHERS *************************************/
export function* watchFetchMovie() {
  yield takeEvery(actions.fetchMovie, fetchMovieSaga);
}

export function* watchFetchRecommendations() {
  yield takeEvery(actions.fetchRecommendations, fetchRecommendationsSaga);
}

export function* watchFetchMovieCredits() {
  yield takeEvery(actions.fetchMovieCredits, fetchMovieCreditsSaga);
}

export function* watchFetchMovieVideos() {
  yield takeEvery(actions.fetchMovieVideos, fetchMovieVideosSaga);
}

export function* watchFetchMovieImages() {
  yield takeEvery(actions.fetchMovieImages, fetchMovieImagesSaga);
}

export function* watchFetchPopularMovies() {
  yield takeEvery(actions.fetchPopularMovies, fetchPopularMoviesSaga);
}

export function* watchFetchMovieExternalIds() {
  yield takeEvery(actions.fetchMovieImdb, fetchMovieExternalIdsSaga);
}
