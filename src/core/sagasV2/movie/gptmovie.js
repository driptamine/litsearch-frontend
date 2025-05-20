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

export function* watchFetchMovie() {
  yield takeEvery(actions.fetchMovie, fetchMovieSaga);
}

export default function* root() {
  yield all([
    fork(watchFetchMovie),
  ])
}
