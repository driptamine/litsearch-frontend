import { call, takeEvery, select } from "redux-saga/effects";
import * as actions from "core/actions";
import * as schemas from "core/schemas";
import { selectors } from "core/reducers/index";

import { fetcherSaga } from "./fetcherSaga";

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
function* fetchMovieSearchSaga(action) {
  const { query, page } = action.payload;
  yield call(fetcherSaga, {
    action,
    endpoint: `/search/movie`,
    params: { query, page },
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
export function* watchMovieSagas() {
  yield takeEvery(actions.fetchMovie, fetchMovieSaga);
  yield takeEvery(actions.fetchRecommendations, fetchRecommendationsSaga);
  yield takeEvery(actions.fetchPopularMovies, fetchPopularMoviesSaga);
  yield takeEvery(actions.fetchMovieSearch, fetchMovieSearchSaga);
}
