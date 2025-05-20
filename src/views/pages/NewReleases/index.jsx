import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPopularMovies } from "core/actions";
import { selectors } from "core/reducers/index";
import MovieCard from "views/components/MovieCard";
import InfiniteGridList from "views/components/InfiniteGridList";

function renderItem(movieId) {
  return (
    <li>
      <MovieCard movieId={movieId} />
    </li>
  );
}

function NewReleases() {
  const dispatch = useDispatch();
  const isFetching = useSelector(state =>
    selectors.selectIsFetchingPopularMovies(state)
  );
  const nextPage = useSelector(state =>
    selectors.selectPopularMoviesNextPage(state)
  );
  const movieIds = useSelector(state => selectors.selectPopularMovieIds(state));

  function handleLoadMore() {
    dispatch(fetchPopularMovies(nextPage));
  }

  return (
    <InfiniteGridList
      items={movieIds}
      loading={isFetching}
      hasNextPage={!!nextPage}
      onLoadMore={handleLoadMore}
      renderItem={renderItem}
    />
  );
}

export default NewReleases;
