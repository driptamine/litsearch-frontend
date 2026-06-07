import { call, takeEvery, select, takeLatest } from 'redux-saga/effects';
import * as actions from 'core/actions';
import * as schemas from 'core/schemas';
import { selectors } from 'core/reducers/index';

import { fetcherSaga } from './fetcherSaga';

function* fetchMovieSaga(action) {
  yield call(fetcherSaga, {
    action,
    endpoint: `/movie/${action.payload.movieId}`,
    schema: schemas.movieSchema,
    cachedData: null, // Replace with caching logic if needed
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

export function* watchMovieSagas() {
  yield takeEvery(actions.fetchMovie, fetchMovieSaga);
  yield takeEvery(actions.fetchRecommendations, fetchRecommendationsSaga);
  yield takeLatest(actions.fetchPopularMovies, fetchPopularMoviesSaga);
  yield takeEvery(actions.fetchMovieCredits, fetchMovieCreditsSaga);
  yield takeEvery(actions.fetchMovieVideos, fetchMovieVideosSaga);
  yield takeEvery(actions.fetchMovieImages, fetchMovieImagesSaga);
  yield takeEvery(actions.fetchMovieImdb, fetchMovieExternalIdsSaga);
}
