import { createAction } from "@reduxjs/toolkit";

export const fetchPopularMovies = createAction(
  "movie/fetchPopular",
  (page) => ({
    payload: {
      page
    }
  })
);

export const fetchMovie = createAction(
  "movie/fetch",
  (movieId, requiredFields) => ({
    payload: { movieId, requiredFields }
  })
);
export const fetchMovieImdb = createAction(
  "movie_imdb/fetch",
  (movieId, requiredFields) => ({
    payload: { movieId, requiredFields }
  })
);

export const fetchRecommendations = createAction(
  "movie/fetchRecommendations",
  movieId => ({
    payload: { movieId }
  })
);

export const fetchMovieCredits = createAction(
  "movies/fetchCredits",
  movieId => ({
    payload: { movieId }
  })
);
