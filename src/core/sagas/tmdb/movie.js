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
import { fetcherSaga, fetcherAuthSaga, fetcherAPIwithHeaderSaga } from "core/sagas/index";
import { fetcherGetSaga, fetcherPostAuthSaga } from "core/sagas/utils";

export function* fetchRecommendationsSaga(action) {
  const { movieId } = action.payload;
  const recommendations = yield select(
    selectors.selectMovieRecommendations,
    movieId
  );
  yield call(fetcherGetSaga, {
    action,
    endpoint: `/movie/${movieId}/recommendations`,
    processData: response => ({ ...response, movieId }),
    schema: schemas.movieRecommendationSchema,
    cachedData: recommendations
  });
}

export function* fetchMovieCreditsSaga(action) {
  const { movieId } = action.payload;
  const movieCredits = yield select(selectors.selectMovieCredits, movieId);
  yield call(fetcherGetSaga, {
    action,
    endpoint: `/movie/${movieId}/credits`,
    schema: schemas.movieCreditSchema,
    cachedData: movieCredits
  });
}

export function* fetchMovieVideosSaga(action) {
  const { movieId } = action.payload;
  const movieVideos = yield select(selectors.selectMovieVideos, movieId);
  yield call(fetcherGetSaga, {
    action,
    endpoint: `/movie/${movieId}/videos`,
    schema: schemas.movieVideoSchema,
    cachedData: movieVideos
  });
}

export function* fetchMovieImagesSaga(action) {
  const { movieId } = action.payload;
  const movieImages = yield select(selectors.selectMovieImages, movieId);
  yield call(fetcherGetSaga, {
    action,
    endpoint: `/movie/${movieId}/images`,
    schema: schemas.movieImageSchema,
    cachedData: movieImages
  });
}

export function* fetchPopularMoviesSaga(action) {
  const { page } = action.payload;
  yield call(fetcherGetSaga, {
    action: action,
    endpoint: "/movie/popular",
    params: { page },
    schema: { results: [schemas.movieSchema] }
  });
}

export function* fetchMovieSaga(action) {
  const { movieId } = action.payload;
  const movie = yield select(selectors.selectMovie, movieId);
  yield call(fetcherGetSaga, {
    action,
    endpoint: `/movie/${movieId}`,
    schema: schemas.movieSchema,
    cachedData: movie
  });
}


/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

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

export function* watchFetchMovie() {
  yield takeEvery(actions.fetchMovie, fetchMovieSaga);
}

const moviesSagas = [
  fork(watchFetchMovie),
  fork(watchFetchMovieVideos),
  fork(watchFetchMovieImages),
  fork(watchFetchMovieCredits),
  fork(watchFetchRecommendations)
];

export default moviesSagas;
